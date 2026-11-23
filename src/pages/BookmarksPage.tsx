import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { Question } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Bookmark, BookmarkCheck, ArrowLeft, Trash2 } from 'lucide-react';

export const BookmarksPage: React.FC = () => {
  const { candidate } = useCandidate();
  const navigate = useNavigate();
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!candidate?.id) {
      navigate('/');
      return;
    }

    const loadBookmarks = async () => {
      try {
        const bookmarks = await db.bookmarks
          .where('candidateId')
          .equals(candidate.id!)
          .toArray();

        const qIds = bookmarks.map((b) => b.questionId);
        const questions = await db.questions.where('id').anyOf(qIds).toArray();
        setBookmarkedQuestions(questions);
      } catch (err) {
        console.error('Error loading bookmarks:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadBookmarks();
  }, [candidate, navigate]);

  const removeBookmark = async (questionId: string) => {
    if (!candidate?.id) return;
    await db.bookmarks
      .where('[candidateId+questionId]')
      .equals([candidate.id, questionId])
      .delete();
    setBookmarkedQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="pb-4 border-b border-slate-200">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
          Bookmarked Questions
        </h1>
        <p className="text-sm text-slate-600">
          Important questions you saved for rapid revision before your CBT test.
        </p>
      </div>

      {bookmarkedQuestions.length > 0 ? (
        <div className="space-y-4">
          {bookmarkedQuestions.map((q) => (
            <Card key={q.id} className="p-5">
              <div className="flex items-start justify-between gap-3 pb-2 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    Question {q.questionNumber}
                  </span>
                  {q.topic && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                      {q.topic}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeBookmark(q.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                  title="Remove bookmark"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-3 leading-relaxed">
                {q.questionText}
              </h3>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                <span className="font-bold text-emerald-800">Correct Answer ({q.correctAnswer}): </span>
                {q.options[q.correctAnswer]}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-500 space-y-4">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-800">No Bookmarked Questions Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              While practicing, tap the bookmark icon on any difficult question to save it here for fast revision.
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};
