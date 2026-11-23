import { describe, it, expect } from 'vitest';
import { calculateScore, getCategoryBadgeClass } from '../src/utils/scoring';

describe('Scoring Logic & Performance Categories', () => {
  const correctMap: Record<string, string> = {
    q1: 'A',
    q2: 'B',
    q3: 'C',
    q4: 'D',
    q5: 'A',
    q6: 'B',
    q7: 'C',
    q8: 'D',
    q9: 'A',
    q10: 'B'
  };

  it('should calculate 100% and assign Excellent category', () => {
    const answers = { ...correctMap };
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(10);
    expect(score.incorrect).toBe(0);
    expect(score.unanswered).toBe(0);
    expect(score.percentage).toBe(100);
    expect(score.category).toBe('Excellent');
  });

  it('should calculate 90% and assign Excellent category', () => {
    const answers = { ...correctMap, q10: 'A' }; // 9 correct, 1 wrong
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(9);
    expect(score.percentage).toBe(90);
    expect(score.category).toBe('Excellent');
  });

  it('should calculate 80% to 89% and assign Very Good category', () => {
    const answers = { ...correctMap, q9: 'B', q10: 'A' }; // 8 correct
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(8);
    expect(score.percentage).toBe(80);
    expect(score.category).toBe('Very Good');
  });

  it('should calculate 70% to 79% and assign Good — Review Weaker Topics category', () => {
    const answers = { ...correctMap, q8: 'A', q9: 'B', q10: 'A' }; // 7 correct
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(7);
    expect(score.percentage).toBe(70);
    expect(score.category).toBe('Good — Review Weaker Topics');
  });

  it('should calculate below 70% and assign More Practice Recommended category', () => {
    const answers = { q1: 'A', q2: 'B', q3: 'C' }; // 3 correct out of 10 = 30%
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(3);
    expect(score.unanswered).toBe(7);
    expect(score.percentage).toBe(30);
    expect(score.category).toBe('More Practice Recommended');
  });

  it('should accurately count unanswered questions', () => {
    const answers = { q1: 'A', q2: 'D' }; // 1 correct, 1 wrong, 8 unanswered
    const score = calculateScore(10, answers, correctMap);

    expect(score.correct).toBe(1);
    expect(score.incorrect).toBe(1);
    expect(score.unanswered).toBe(8);
    expect(score.total).toBe(10);
  });

  it('should return appropriate badge class for each category', () => {
    expect(getCategoryBadgeClass('Excellent')).toContain('emerald');
    expect(getCategoryBadgeClass('Very Good')).toContain('teal');
    expect(getCategoryBadgeClass('Good — Review Weaker Topics')).toContain('amber');
    expect(getCategoryBadgeClass('More Practice Recommended')).toContain('rose');
  });
});
