import { describe, it, expect } from 'vitest';
import rolesData from '../src/data/roles.json';
import dataAssistantQuestions from '../src/data/questions_data_assistant.json';
import labOptimizerQuestions from '../src/data/questions_lab_optimizer.json';
import testingAssistantQuestions from '../src/data/questions_testing_assistant.json';
import healthQiQuestions from '../src/data/questions_health_qi_optimizer.json';
import clientNavigatorQuestions from '../src/data/questions_client_navigator.json';
import supplementaryQuestions from '../src/data/questions_bridge_supplementary.json';

describe('Question Banks Extraction & Integrity Verification', () => {
  it('should verify 5 defined role profiles', () => {
    expect(rolesData).toHaveLength(5);
    const roleIds = rolesData.map((r) => r.id);
    expect(roleIds).toEqual([
      'data_assistant',
      'lab_optimizer',
      'testing_assistant',
      'health_qi_optimizer',
      'client_navigator'
    ]);
  });

  const mainBanks = [
    { name: 'Integrated Data Assistant', data: dataAssistantQuestions, expectedCount: 100 },
    { name: 'Integrated Laboratory Service Optimizer', data: labOptimizerQuestions, expectedCount: 100 },
    { name: 'Integrated Testing Assistant', data: testingAssistantQuestions, expectedCount: 100 },
    { name: 'Integrated Health / QI Service Optimizer', data: healthQiQuestions, expectedCount: 100 },
    { name: 'Client Navigator', data: clientNavigatorQuestions, expectedCount: 100 }
  ];

  mainBanks.forEach(({ name, data, expectedCount }) => {
    describe(`Bank: ${name}`, () => {
      it(`should contain exactly ${expectedCount} questions`, () => {
        expect(data).toHaveLength(expectedCount);
      });

      it('should have complete A, B, C, D options and valid answers for every question', () => {
        const validAnswers = new Set(['A', 'B', 'C', 'D']);
        const seenIds = new Set<string>();

        data.forEach((q: any, idx: number) => {
          // Question ID uniqueness
          expect(seenIds.has(q.id)).toBe(false);
          seenIds.add(q.id);

          // Question numbering sequence
          expect(q.questionNumber).toBe(idx + 1);

          // Non-empty question text
          expect(q.questionText).toBeTruthy();
          expect(typeof q.questionText).toBe('string');
          expect(q.questionText.length).toBeGreaterThan(5);

          // 4 options present
          expect(q.options).toBeDefined();
          expect(q.options.A).toBeTruthy();
          expect(q.options.B).toBeTruthy();
          expect(q.options.C).toBeTruthy();
          expect(q.options.D).toBeTruthy();

          // Correct answer key in A-D
          expect(validAnswers.has(q.correctAnswer)).toBe(true);

          // Source attribution
          expect(q.source).toBe('500_bank');

          // Topic assigned
          expect(q.topic).toBeTruthy();
        });
      });
    });
  });

  describe('Bank: Client Navigator Supplementary (CCCRN BRIDGE-N)', () => {
    it('should contain exactly 62 supplementary questions', () => {
      expect(supplementaryQuestions).toHaveLength(62);
    });

    it('should have valid A-D options and valid keys for all supplementary questions', () => {
      const validAnswers = new Set(['A', 'B', 'C', 'D']);
      supplementaryQuestions.forEach((q: any) => {
        expect(q.options.A).toBeTruthy();
        expect(q.options.B).toBeTruthy();
        expect(q.options.C).toBeTruthy();
        expect(q.options.D).toBeTruthy();
        expect(validAnswers.has(q.correctAnswer)).toBe(true);
        expect(q.source).toBe('bridge_supplementary');
      });
    });
  });

  it('should verify total question count is 562 (500 main + 62 supplementary)', () => {
    const totalCount =
      dataAssistantQuestions.length +
      labOptimizerQuestions.length +
      testingAssistantQuestions.length +
      healthQiQuestions.length +
      clientNavigatorQuestions.length +
      supplementaryQuestions.length;

    expect(totalCount).toBe(562);
  });
});
