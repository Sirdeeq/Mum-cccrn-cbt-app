import { Question } from '../types';

export function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Optionally shuffles options (A, B, C, D) while maintaining accurate mapping
 * to the correct answer.
 */
export function shuffleQuestionOptions(question: Question): Question {
  const keys: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];
  const textOptions = keys.map((key) => ({
    key,
    text: question.options[key],
    isCorrect: key === question.correctAnswer
  }));

  const shuffled = shuffleArray(textOptions);
  const newOptions: any = {};
  let newCorrectAnswer: 'A' | 'B' | 'C' | 'D' = 'A';

  keys.forEach((key, index) => {
    newOptions[key] = shuffled[index].text;
    if (shuffled[index].isCorrect) {
      newCorrectAnswer = key;
    }
  });

  return {
    ...question,
    options: newOptions,
    correctAnswer: newCorrectAnswer
  };
}
