import { describe, it, expect, beforeEach } from 'vitest';
import { db } from '../src/db';
import { seedDatabase } from '../src/db/seed';
import { exportUserData, importUserData, resetCandidateProgress } from '../src/db/backup';
import { ExamAttempt } from '../src/types';

describe('Local Database & Persistence Layer', () => {
  beforeEach(async () => {
    await db.candidates.clear();
    await db.examAttempts.clear();
    await db.bookmarks.clear();
    await db.preferences.clear();
  });

  it('should seed database idempotently without duplicating questions', async () => {
    await seedDatabase();
    const count1 = await db.questions.count();
    expect(count1).toBe(562);

    // Call second time to ensure idempotency
    await seedDatabase();
    const count2 = await db.questions.count();
    expect(count2).toBe(562);
  });

  it('should filter questions correctly by role', async () => {
    await seedDatabase();

    const daQuestions = await db.questions.where('roleId').equals('data_assistant').toArray();
    expect(daQuestions).toHaveLength(100);

    const labQuestions = await db.questions.where('roleId').equals('lab_optimizer').toArray();
    expect(labQuestions).toHaveLength(100);

    const cnQuestions = await db.questions.where('roleId').equals('client_navigator').toArray();
    // 100 main + 62 supplementary = 162 total for Client Navigator
    expect(cnQuestions).toHaveLength(162);
  });

  it('should create candidate profile and retrieve it', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Amina Mohammed',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const retrieved = await db.candidates.get(candidateId);
    expect(retrieved).toBeDefined();
    expect(retrieved?.fullName).toBe('Amina Mohammed');
  });

  it('should record an exam attempt and persist answer selections', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Fatima Bello',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    const attempt: ExamAttempt = {
      id: 'attempt_test_1',
      candidateId,
      roleId: 'client_navigator',
      mode: 'mock',
      questionIds: ['client_navigator_q1', 'client_navigator_q2'],
      answers: { client_navigator_q1: 'D' },
      markedQuestions: ['client_navigator_q1'],
      startedAt: Date.now(),
      status: 'in_progress',
      timeSpentSeconds: 0
    };

    await db.examAttempts.add(attempt);

    // Update answer
    await db.examAttempts.update('attempt_test_1', {
      answers: { client_navigator_q1: 'D', client_navigator_q2: 'B' }
    });

    const updated = await db.examAttempts.get('attempt_test_1');
    expect(updated?.answers.client_navigator_q2).toBe('B');
    expect(updated?.markedQuestions).toContain('client_navigator_q1');
  });

  it('should export and import candidate practice backup accurately', async () => {
    const candidateId = await db.candidates.add({
      fullName: 'Zainab Garba',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await db.examAttempts.add({
      id: 'attempt_backup_1',
      candidateId,
      roleId: 'data_assistant',
      mode: 'quick',
      questionIds: ['data_assistant_q1'],
      answers: { data_assistant_q1: 'D' },
      markedQuestions: [],
      startedAt: Date.now(),
      submittedAt: Date.now(),
      status: 'completed',
      timeSpentSeconds: 45,
      score: {
        correct: 1,
        incorrect: 0,
        unanswered: 0,
        total: 1,
        percentage: 100,
        category: 'Excellent'
      }
    });

    await db.bookmarks.add({
      candidateId,
      questionId: 'data_assistant_q1',
      createdAt: Date.now()
    });

    // Export
    const backupJson = await exportUserData(candidateId);
    expect(backupJson).toContain('Zainab Garba');
    expect(backupJson).toContain('attempt_backup_1');

    // Clear and restore
    await db.candidates.clear();
    await db.examAttempts.clear();
    await db.bookmarks.clear();

    const result = await importUserData(backupJson);
    expect(result.success).toBe(true);

    const restoredAttempts = await db.examAttempts.toArray();
    expect(restoredAttempts).toHaveLength(1);
    expect(restoredAttempts[0].score?.percentage).toBe(100);

    const restoredBookmarks = await db.bookmarks.toArray();
    expect(restoredBookmarks).toHaveLength(1);
  });

  it('should reset candidate progress while preserving question banks', async () => {
    await seedDatabase();

    const candidateId = await db.candidates.add({
      fullName: 'Halima Sani',
      createdAt: Date.now(),
      updatedAt: Date.now()
    });

    await db.examAttempts.add({
      id: 'att_to_reset',
      candidateId,
      roleId: 'lab_optimizer',
      mode: 'study',
      questionIds: ['lab_optimizer_q1'],
      answers: {},
      markedQuestions: [],
      startedAt: Date.now(),
      status: 'completed',
      timeSpentSeconds: 10
    });

    await resetCandidateProgress(candidateId);

    const remainingAttempts = await db.examAttempts.where('candidateId').equals(candidateId).toArray();
    expect(remainingAttempts).toHaveLength(0);

    // Questions should remain untouched
    const questionCount = await db.questions.count();
    expect(questionCount).toBe(562);
  });
});
