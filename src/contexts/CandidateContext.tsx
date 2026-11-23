import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../db';
import { Candidate } from '../types';

interface CandidateContextType {
  candidate: Candidate | null;
  isLoading: boolean;
  setCandidateProfile: (fullName: string) => Promise<Candidate>;
  logoutCandidate: () => void;
  allCandidates: Candidate[];
  selectCandidate: (candidate: Candidate) => void;
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined);

const CURRENT_CANDIDATE_ID_KEY = 'cccrn_current_candidate_id';

export const CandidateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [allCandidates, setAllCandidates] = useState<Candidate[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshCandidates = async () => {
    try {
      const candidates = await db.candidates.toArray();
      setAllCandidates(candidates);

      const savedId = localStorage.getItem(CURRENT_CANDIDATE_ID_KEY);
      if (savedId) {
        const found = candidates.find((c) => c.id === parseInt(savedId, 10));
        if (found) {
          setCandidate(found);
        } else if (candidates.length > 0) {
          setCandidate(candidates[0]);
          localStorage.setItem(CURRENT_CANDIDATE_ID_KEY, candidates[0].id!.toString());
        }
      } else if (candidates.length > 0) {
        setCandidate(candidates[candidates.length - 1]);
        localStorage.setItem(CURRENT_CANDIDATE_ID_KEY, candidates[candidates.length - 1].id!.toString());
      }
    } catch (err) {
      console.error('Failed to load candidate profiles from IndexedDB:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCandidates();
  }, []);

  const setCandidateProfile = async (fullName: string): Promise<Candidate> => {
    const trimmed = fullName.trim();
    if (!trimmed) throw new Error('Please enter your full name.');

    // Check if a candidate with this name already exists
    const existing = await db.candidates.where('fullName').equalsIgnoreCase(trimmed).first();
    let currentCandidate: Candidate;

    if (existing && existing.id) {
      existing.updatedAt = Date.now();
      await db.candidates.put(existing);
      currentCandidate = existing;
    } else {
      const newCand: Candidate = {
        fullName: trimmed,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const newId = await db.candidates.add(newCand);
      currentCandidate = { ...newCand, id: newId };
    }

    localStorage.setItem(CURRENT_CANDIDATE_ID_KEY, currentCandidate.id!.toString());
    setCandidate(currentCandidate);
    await refreshCandidates();
    return currentCandidate;
  };

  const selectCandidate = (cand: Candidate) => {
    if (cand.id) {
      localStorage.setItem(CURRENT_CANDIDATE_ID_KEY, cand.id.toString());
      setCandidate(cand);
    }
  };

  const logoutCandidate = () => {
    localStorage.removeItem(CURRENT_CANDIDATE_ID_KEY);
    setCandidate(null);
  };

  return (
    <CandidateContext.Provider
      value={{
        candidate,
        isLoading,
        setCandidateProfile,
        logoutCandidate,
        allCandidates,
        selectCandidate
      }}
    >
      {children}
    </CandidateContext.Provider>
  );
};

export const useCandidate = (): CandidateContextType => {
  const context = useContext(CandidateContext);
  if (!context) {
    throw new Error('useCandidate must be used within a CandidateProvider');
  }
  return context;
};
