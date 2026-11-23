import { useState, useEffect, useCallback } from 'react';
import { db } from '../db';
import { ExamAttempt, Question } from '../types';
import { calculateScore } from '../utils/scoring';

export function useExamSession(attemptId: string) {
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showWarning5Min, setShowWarning5Min] = useState<boolean>(false);
  const [showWarning1Min, setShowWarning1Min] = useState<boolean>(false);

  // Load exam attempt and question objects
  useEffect(() => {
    let isMounted = true;

    const loadAttempt = async () => {
      try {
        const foundAttempt = await db.examAttempts.get(attemptId);
        if (!foundAttempt) {
          setIsLoading(false);
          return;
        }

        // Fetch ordered questions
        const loadedQuestions = await db.questions
          .where('id')
          .anyOf(foundAttempt.questionIds)
          .toArray();

        // Sort loadedQuestions according to foundAttempt.questionIds order
        const qMap = new Map(loadedQuestions.map((q) => [q.id, q]));
        const orderedQuestions = foundAttempt.questionIds
          .map((id) => qMap.get(id))
          .filter((q): q is Question => !!q);

        if (isMounted) {
          setAttempt(foundAttempt);
          setQuestions(orderedQuestions);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('Failed to load exam attempt:', err);
        if (isMounted) setIsLoading(false);
      }
    };

    loadAttempt();
    return () => {
      isMounted = false;
    };
  }, [attemptId]);

  // Submit and finalize examination attempt
  const submitExam = useCallback(async () => {
    if (!attempt || attempt.status === 'completed' || isSubmitting) return;

    setIsSubmitting(true);
    try {
      // Build correct answers map
      const correctAnswersMap: Record<string, string> = {};
      questions.forEach((q) => {
        correctAnswersMap[q.id] = q.correctAnswer;
      });

      const score = calculateScore(questions.length, attempt.answers, correctAnswersMap);
      const submittedAt = Date.now();
      const timeSpentSeconds = Math.round((submittedAt - attempt.startedAt) / 1000);

      const updatedAttempt: ExamAttempt = {
        ...attempt,
        status: 'completed',
        submittedAt,
        timeSpentSeconds,
        score
      };

      await db.examAttempts.put(updatedAttempt);
      setAttempt(updatedAttempt);
    } catch (err) {
      console.error('Failed to submit exam attempt:', err);
    } finally {
      setIsSubmitting(false);
    }
  }, [attempt, questions, isSubmitting]);

  // Resilient Countdown Timer based on persisted deadlineAt
  useEffect(() => {
    if (!attempt || attempt.status !== 'completed' && !attempt.deadlineAt) return;
    if (attempt.status === 'completed') return;

    const updateTimer = () => {
      if (!attempt.deadlineAt) return;
      const now = Date.now();
      const remainingMs = attempt.deadlineAt - now;
      const secondsLeft = Math.max(0, Math.floor(remainingMs / 1000));

      setTimeRemaining(secondsLeft);

      if (secondsLeft <= 300 && secondsLeft > 60) {
        setShowWarning5Min(true);
      } else if (secondsLeft <= 60 && secondsLeft > 0) {
        setShowWarning1Min(true);
      }

      if (secondsLeft <= 0) {
        // Auto-finalize on expiration
        submitExam();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [attempt, submitExam]);

  // Select an option for current question
  const selectAnswer = async (questionId: string, answer: 'A' | 'B' | 'C' | 'D') => {
    if (!attempt || attempt.status === 'completed') return;

    const newAnswers = { ...attempt.answers, [questionId]: answer };
    const updatedAttempt = { ...attempt, answers: newAnswers };

    setAttempt(updatedAttempt);
    await db.examAttempts.update(attempt.id, { answers: newAnswers });
  };

  // Toggle Mark for Review
  const toggleMarkForReview = async (questionId: string) => {
    if (!attempt) return;

    const isMarked = attempt.markedQuestions.includes(questionId);
    const newMarked = isMarked
      ? attempt.markedQuestions.filter((id) => id !== questionId)
      : [...attempt.markedQuestions, questionId];

    const updatedAttempt = { ...attempt, markedQuestions: newMarked };
    setAttempt(updatedAttempt);
    await db.examAttempts.update(attempt.id, { markedQuestions: newMarked });
  };

  const goToNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
    }
  };

  return {
    attempt,
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    totalQuestions: questions.length,
    timeRemaining,
    isLoading,
    isSubmitting,
    showWarning5Min,
    showWarning1Min,
    selectAnswer,
    toggleMarkForReview,
    goToNext,
    goToPrevious,
    goToQuestion,
    submitExam
  };
}
