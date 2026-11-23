import Dexie, { Table } from 'dexie';
import { Candidate, Role, Question, ExamAttempt, Bookmark, Preference } from '../types';

export class CBTDatabase extends Dexie {
  candidates!: Table<Candidate, number>;
  roles!: Table<Role, string>;
  questions!: Table<Question, string>;
  examAttempts!: Table<ExamAttempt, string>;
  bookmarks!: Table<Bookmark, number>;
  preferences!: Table<Preference, number>;

  constructor() {
    super('CCCRNBridgeNDB');
    this.version(1).stores({
      candidates: '++id, fullName, createdAt, updatedAt',
      roles: 'id, title',
      questions: 'id, roleId, questionNumber, topic, source',
      examAttempts: 'id, candidateId, roleId, mode, startedAt, submittedAt, status',
      bookmarks: '++id, [candidateId+questionId], candidateId, questionId',
      preferences: 'candidateId'
    });
  }
}

export const db = new CBTDatabase();
