import { db } from './index';

export interface BackupData {
  version: number;
  exportedAt: string;
  candidates: any[];
  examAttempts: any[];
  bookmarks: any[];
  preferences: any[];
}

export async function exportUserData(candidateId: number): Promise<string> {
  const candidate = await db.candidates.get(candidateId);
  const examAttempts = await db.examAttempts.where('candidateId').equals(candidateId).toArray();
  const bookmarks = await db.bookmarks.where('candidateId').equals(candidateId).toArray();
  const preferences = await db.preferences.where('candidateId').equals(candidateId).toArray();

  const backup: BackupData = {
    version: 1,
    exportedAt: new Date().toISOString(),
    candidates: candidate ? [candidate] : [],
    examAttempts,
    bookmarks,
    preferences
  };

  return JSON.stringify(backup, null, 2);
}

export async function importUserData(jsonString: string): Promise<{ success: boolean; message: string; candidateId?: number }> {
  try {
    const data: BackupData = JSON.parse(jsonString);

    if (!data.version || !data.candidates || !data.examAttempts) {
      return { success: false, message: 'Invalid backup file structure.' };
    }

    await db.transaction('rw', [db.candidates, db.examAttempts, db.bookmarks, db.preferences], async () => {
      let importedCandidateId: number | undefined;

      for (const cand of data.candidates) {
        const id = await db.candidates.put(cand);
        importedCandidateId = id;
      }

      if (data.examAttempts.length > 0) {
        await db.examAttempts.bulkPut(data.examAttempts);
      }

      if (data.bookmarks && data.bookmarks.length > 0) {
        await db.bookmarks.bulkPut(data.bookmarks);
      }

      if (data.preferences && data.preferences.length > 0) {
        await db.preferences.bulkPut(data.preferences);
      }

      return importedCandidateId;
    });

    const activeCandidate = data.candidates[0];
    return {
      success: true,
      message: `Successfully restored practice history (${data.examAttempts.length} sessions).`,
      candidateId: activeCandidate?.id
    };
  } catch (err: any) {
    return { success: false, message: `Import error: ${err.message || 'Unknown error'}` };
  }
}

export async function resetCandidateProgress(candidateId: number): Promise<void> {
  await db.transaction('rw', [db.examAttempts, db.bookmarks], async () => {
    await db.examAttempts.where('candidateId').equals(candidateId).delete();
    await db.bookmarks.where('candidateId').equals(candidateId).delete();
  });
}
