import { db } from './index';
import { Role, Question } from '../types';

import rolesData from '../data/roles.json';
import dataAssistantQuestions from '../data/questions_data_assistant.json';
import labOptimizerQuestions from '../data/questions_lab_optimizer.json';
import testingAssistantQuestions from '../data/questions_testing_assistant.json';
import healthQiQuestions from '../data/questions_health_qi_optimizer.json';
import clientNavigatorQuestions from '../data/questions_client_navigator.json';
import supplementaryQuestions from '../data/questions_bridge_supplementary.json';

export async function seedDatabase(): Promise<void> {
  const existingQuestionsCount = await db.questions.count();
  const existingRolesCount = await db.roles.count();

  if (existingRolesCount === 0) {
    await db.roles.bulkPut(rolesData as Role[]);
  }

  // Idempotently seed question banks if not already populated
  if (existingQuestionsCount === 0) {
    const allQuestions: Question[] = [
      ...(dataAssistantQuestions as Question[]),
      ...(labOptimizerQuestions as Question[]),
      ...(testingAssistantQuestions as Question[]),
      ...(healthQiQuestions as Question[]),
      ...(clientNavigatorQuestions as Question[]),
      ...(supplementaryQuestions as Question[])
    ];

    await db.questions.bulkPut(allQuestions);
    console.log(`Successfully seeded ${allQuestions.length} questions into IndexedDB.`);
  }
}
