import { useState, useEffect } from 'react';
import { db } from '../db';
import { ExamAttempt } from '../types';

export interface PerformanceStats {
  totalAttempts: number;
  averageScore: number;
  bestScore: number;
  latestScore: number;
  totalQuestionsAttempted: number;
  topicAccuracy: Record<string, { correct: number; total: number; percentage: number }>;
  weakTopics: string[];
  recentAttempts: ExamAttempt[];
  hasUnfinishedExam: boolean;
  unfinishedAttemptId?: string;
}

export function usePerformanceStats(candidateId?: number, roleId?: string) {
  const [stats, setStats] = useState<PerformanceStats>({
    totalAttempts: 0,
    averageScore: 0,
    bestScore: 0,
    latestScore: 0,
    totalQuestionsAttempted: 0,
    topicAccuracy: {},
    weakTopics: [],
    recentAttempts: [],
    hasUnfinishedExam: false
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!candidateId) {
      setIsLoading(false);
      return;
    }

    const loadStats = async () => {
      try {
        let attemptsQuery = db.examAttempts.where('candidateId').equals(candidateId);
        let allAttempts = await attemptsQuery.toArray();

        // Filter by role if roleId provided
        if (roleId) {
          allAttempts = allAttempts.filter((a) => a.roleId === roleId);
        }

        // Check for unfinished exam
        const unfinished = allAttempts.find((a) => a.status === 'in_progress');

        const completedAttempts = allAttempts
          .filter((a) => a.status === 'completed' && a.score)
          .sort((a, b) => (b.submittedAt || 0) - (a.submittedAt || 0));

        if (completedAttempts.length === 0) {
          setStats({
            totalAttempts: 0,
            averageScore: 0,
            bestScore: 0,
            latestScore: 0,
            totalQuestionsAttempted: 0,
            topicAccuracy: {},
            weakTopics: [],
            recentAttempts: [],
            hasUnfinishedExam: !!unfinished,
            unfinishedAttemptId: unfinished?.id
          });
          setIsLoading(false);
          return;
        }

        let totalScoreSum = 0;
        let bestScore = 0;
        let totalQAttempted = 0;

        completedAttempts.forEach((att) => {
          if (att.score) {
            totalScoreSum += att.score.percentage;
            if (att.score.percentage > bestScore) {
              bestScore = att.score.percentage;
            }
            totalQAttempted += (att.score.correct + att.score.incorrect);
          }
        });

        const averageScore = Math.round(totalScoreSum / completedAttempts.length);
        const latestScore = completedAttempts[0].score?.percentage || 0;

        // Calculate Topic Accuracy across completed attempts
        // Fetch questions involved to determine their topics
        const questionIdSet = new Set<string>();
        completedAttempts.forEach((att) => {
          att.questionIds.forEach((qid) => questionIdSet.add(qid));
        });

        const questions = await db.questions.where('id').anyOf(Array.from(questionIdSet)).toArray();
        const questionMap = new Map(questions.map((q) => [q.id, q]));

        const topicStats: Record<string, { correct: number; total: number; percentage: number }> = {};

        completedAttempts.forEach((att) => {
          att.questionIds.forEach((qid) => {
            const q = questionMap.get(qid);
            if (!q || !q.topic) return;

            if (!topicStats[q.topic]) {
              topicStats[q.topic] = { correct: 0, total: 0, percentage: 0 };
            }

            topicStats[q.topic].total += 1;
            if (att.answers[qid] === q.correctAnswer) {
              topicStats[q.topic].correct += 1;
            }
          });
        });

        const weakTopics: string[] = [];
        Object.keys(topicStats).forEach((topic) => {
          const item = topicStats[topic];
          item.percentage = item.total > 0 ? Math.round((item.correct / item.total) * 100) : 0;
          if (item.percentage < 70 && item.total >= 3) {
            weakTopics.push(topic);
          }
        });

        setStats({
          totalAttempts: completedAttempts.length,
          averageScore,
          bestScore,
          latestScore,
          totalQuestionsAttempted: totalQAttempted,
          topicAccuracy: topicStats,
          weakTopics,
          recentAttempts: completedAttempts.slice(0, 5),
          hasUnfinishedExam: !!unfinished,
          unfinishedAttemptId: unfinished?.id
        });
      } catch (err) {
        console.error('Error computing performance stats:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, [candidateId, roleId]);

  return { stats, isLoading };
}
