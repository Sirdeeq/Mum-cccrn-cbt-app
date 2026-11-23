export interface Role {
  id: string; // 'data_assistant' | 'lab_optimizer' | 'testing_assistant' | 'health_qi_optimizer' | 'client_navigator'
  title: string;
  focus: string;
  iconName: string;
  questionCount: number;
  supplementaryCount?: number;
  topicsCount: number;
}

export interface Question {
  id: string;
  roleId: string;
  questionNumber: number;
  questionText: string;
  options: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
  topic: string;
  source: '500_bank' | 'bridge_supplementary';
  explanation?: string;
}

export interface Candidate {
  id?: number;
  fullName: string;
  createdAt: number;
  updatedAt: number;
}

export type PracticeMode = 'study' | 'mock' | 'quick' | 'wrong_answers';

export type PerformanceCategory = 
  | 'Excellent' 
  | 'Very Good' 
  | 'Good — Review Weaker Topics' 
  | 'More Practice Recommended';

export interface ScoreSummary {
  correct: number;
  incorrect: number;
  unanswered: number;
  total: number;
  percentage: number;
  category: PerformanceCategory;
}

export interface ExamAttempt {
  id: string;
  candidateId: number;
  roleId: string;
  mode: PracticeMode;
  questionIds: string[];
  answers: Record<string, 'A' | 'B' | 'C' | 'D'>;
  markedQuestions: string[];
  startedAt: number;
  deadlineAt?: number;
  submittedAt?: number;
  status: 'in_progress' | 'completed' | 'abandoned';
  timeSpentSeconds: number;
  score?: ScoreSummary;
}

export interface Bookmark {
  id?: number;
  candidateId: number;
  questionId: string;
  createdAt: number;
}

export interface Preference {
  candidateId: number;
  fontSize: 'normal' | 'large' | 'xlarge';
  theme: 'light' | 'dark';
  preferredRoleId?: string;
  shuffleOptions?: boolean;
}
