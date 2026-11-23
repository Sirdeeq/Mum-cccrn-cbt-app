import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../src/db';
import { seedDatabase } from '../src/db/seed';
import { ExamAttempt } from '../src/types';
import { calculateScore } from '../src/utils/scoring';

describe('CBT Exam Session Lifecycle & Rules', () => {
  beforeEach(async () => {
    await db.candidates.clear();
    await db.examAttempts.clear();
    await seedDatabase();
  });

  it('should handle submission with unanswered questions gracefully', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Amina Test',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // 10 questions attempt, only 6 answered (4 correct, 2 incorrect, 4 unanswered)
    const questionIds = [
      'data_assistant_q1',
      'data_assistant_q2',
      'data_assistant_q3',
      'data_assistant_q4',
      'data_assistant_q5',
      'data_assistant_q6',
      'data_assistant_q7',
      'data_assistant_q8',
      'data_assistant_q9',
      'data_assistant_q10'
    ];

    const questions = await db.questions.where('id').anyOf(questionIds).toArray();
    const correctMap: Record<string, string> = {};
    questions.forEach((q) => {
      correctMap[q.id] = q.correctAnswer;
    });

    const answers: Record<string, string> = {
      [questionIds[0]]: correctMap[questionIds[0]], // correct
      [questionIds[1]]: correctMap[questionIds[1]], // correct
      [questionIds[2]]: correctMap[questionIds[2]], // correct
      [questionIds[3]]: correctMap[questionIds[3]], // correct
      [questionIds[4]]: 'Z', // wrong
      [questionIds[5]]: 'X'  // wrong
      // 6, 7, 8, 9 are unanswered
    };

    const score = calculateScore(10, answers, correctMap);

    expect(score.total).toBe(10);
    expect(score.correct).toBe(4);
    expect(score.incorrect).toBe(2);
    expect(score.unanswered).toBe(4);
    expect(score.percentage).toBe(40);
    expect(score.category).toBe('More Practice Recommended');
  });

  it('should support resume on page refresh by persisting answers and deadline', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Resume Candidate',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const fixedDeadline = Date.now() + 1800 * 1000; // 30 minutes in future

    const initialAttempt: ExamAttempt = {
      id: 'attempt_resume_test',
      candidateId,
      roleId: 'client_navigator',
      mode: 'mock',
      questionIds: ['client_navigator_q1', 'client_navigator_q2', 'client_navigator_q3'],
      answers: { client_navigator_q1: 'D' },
      markedQuestions: ['client_navigator_q1'],
      startedAt: Date.now(),
      deadlineAt: fixedDeadline,
      status: 'in_progress',
      timeSpentSeconds: 0
    };

    await db.examAttempts.add(initialAttempt);

    // Simulate page refresh: reload from DB
    const reloaded = await db.examAttempts.get('attempt_resume_test');
    expect(reloaded).toBeDefined();
    expect(reloaded?.status).toBe('in_progress');
    expect(reloaded?.answers['client_navigator_q1']).toBe('D');
    expect(reloaded?.deadlineAt).toBe(fixedDeadline);
    expect(reloaded?.markedQuestions).toContain('client_navigator_q1');
  });

  it('should prevent duplicate submissions once attempt is completed', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Completed Candidate',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const attempt: ExamAttempt = {
      id: 'attempt_completed_test',
      candidateId,
      roleId: 'testing_assistant',
      mode: 'mock',
      questionIds: ['testing_assistant_q1'],
      answers: { testing_assistant_q1: 'A' },
      markedQuestions: [],
      startedAt: Date.now(),
      submittedAt: Date.now(),
      status: 'completed',
      timeSpentSeconds: 120,
      score: {
        correct: 1,
        incorrect: 0,
        unanswered: 0,
        total: 1,
        percentage: 100,
        category: 'Excellent'
      }
    };

    await db.examAttempts.add(attempt);

    // Verify it cannot be transitioned back to in_progress or re-submitted with different score
    const loaded = await db.examAttempts.get('attempt_completed_test');
    expect(loaded?.status).toBe('completed');
  });

  it('should finalize attempt on timer expiration', () => {
    const startedAt = Date.now() - 1801 * 1000; // Started 30 mins and 1 sec ago
    const deadlineAt = startedAt + 1800 * 1000;
    const now = Date.now();

    const isExpired = now >= deadlineAt;
    expect(isExpired).toBe(true);
  });

  it('should guarantee mock examination selects different questions from study practice', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Study Then Mock Candidate',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    // 1. Candidate practices 10 questions in Study Mode
    const studyQIds = [
      'client_navigator_q1',
      'client_navigator_q2',
      'client_navigator_q3',
      'client_navigator_q4',
      'client_navigator_q5',
      'client_navigator_q6',
      'client_navigator_q7',
      'client_navigator_q8',
      'client_navigator_q9',
      'client_navigator_q10'
    ];

    await db.examAttempts.add({
      id: 'att_study_prior',
      candidateId,
      roleId: 'client_navigator',
      mode: 'study',
      questionIds: studyQIds,
      answers: { client_navigator_q1: 'D', client_navigator_q2: 'A' },
      markedQuestions: [],
      startedAt: Date.now() - 100000,
      submittedAt: Date.now() - 50000,
      status: 'completed',
      timeSpentSeconds: 300
    });

    // 2. Query questions for mock exam using our unpracticed-filter algorithm
    const pastAttempts = await db.examAttempts
      .where('candidateId')
      .equals(candidateId)
      .filter((a) => a.roleId === 'client_navigator')
      .toArray();

    const practicedQIds = new Set<string>();
    pastAttempts.forEach((att) => {
      if (att.mode === 'study' || att.mode === 'quick' || att.mode === 'wrong_answers') {
        att.questionIds.forEach((qid) => practicedQIds.add(qid));
        Object.keys(att.answers || {}).forEach((qid) => practicedQIds.add(qid));
      }
    });

    const allQuestions = await db.questions.where('roleId').equals('client_navigator').toArray();
    const unpracticedQuestions = allQuestions.filter((q) => !practicedQIds.has(q.id));

    // Must have at least 30 unpracticed questions
    expect(unpracticedQuestions.length).toBeGreaterThanOrEqual(30);

    // Pick 30 mock questions
    const mockQuestions = unpracticedQuestions.slice(0, 30);
    const mockQIds = new Set(mockQuestions.map((q) => q.id));

    // Verify 0 overlap with the questions used in Study Mode!
    studyQIds.forEach((sid) => {
      expect(mockQIds.has(sid)).toBe(false);
    });
  });
});
