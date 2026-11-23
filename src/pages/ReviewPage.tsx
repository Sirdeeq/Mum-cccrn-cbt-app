import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../db';
import { ExamAttempt, Question } from '../types';
import { useCandidate } from '../contexts/CandidateContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import {
  CheckCircle2,
  XCircle,
  HelpCircle,
  Bookmark,
  BookmarkCheck,
  ArrowLeft,
  Filter
} from 'lucide-react';

type FilterType = 'all' | 'correct' | 'incorrect' | 'unanswered' | 'marked';

export const ReviewPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const { candidate } = useCandidate();

  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [bookmarkedIds, setBookmarkedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    const loadAttemptAndQuestions = async () => {
      if (!attemptId) return;
      const att = await db.examAttempts.get(attemptId);
      if (!att) {
        navigate('/dashboard');
        return;
      }
      setAttempt(att);

      const loadedQuestions = await db.questions
        .where('id')
        .anyOf(att.questionIds)
        .toArray();

      const qMap = new Map(loadedQuestions.map((q) => [q.id, q]));
      const ordered = att.questionIds.map((id) => qMap.get(id)).filter((q): q is Question => !!q);
      setQuestions(ordered);

      if (candidate?.id) {
        const bms = await db.bookmarks.where('candidateId').equals(candidate.id).toArray();
        setBookmarkedIds(new Set(bms.map((b) => b.questionId)));
      }
    };

    loadAttemptAndQuestions();
  }, [attemptId, candidate, navigate]);

  const toggleBookmark = async (questionId: string) => {
    if (!candidate?.id) return;
    const isBookmarked = bookmarkedIds.has(questionId);

    if (isBookmarked) {
      await db.bookmarks
        .where('[candidateId+questionId]')
        .equals([candidate.id, questionId])
        .delete();
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        next.delete(questionId);
        return next;
      });
    } else {
      await db.bookmarks.add({
        candidateId: candidate.id,
        questionId,
        createdAt: Date.now()
      });
      setBookmarkedIds((prev) => new Set(prev).add(questionId));
    }
  };

  if (!attempt) return null;

  const filteredQuestions = questions.filter((q) => {
    const candidateAns = attempt.answers[q.id];
    const isCorrect = candidateAns === q.correctAnswer;
    const isUnanswered = !candidateAns;
    const isMarked = attempt.markedQuestions.includes(q.id);

    if (filter === 'correct') return isCorrect;
    if (filter === 'incorrect') return !isUnanswered && !isCorrect;
    if (filter === 'unanswered') return isUnanswered;
    if (filter === 'marked') return isMarked;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to={`/results/${attempt.id}`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Results
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
            Examination Answer Review
          </h1>
          <p className="text-sm text-slate-600">
            Review your answers, correct answers, and topics for every question.
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {(
            [
              { key: 'all', label: 'All' },
              { key: 'correct', label: 'Correct' },
              { key: 'incorrect', label: 'Incorrect' },
              { key: 'unanswered', label: 'Unanswered' },
              { key: 'marked', label: 'Marked' }
            ] as const
          ).map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setFilter(item.key)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                filter === item.key
                  ? 'bg-secondary-500 text-white border-secondary-500 shadow-sm'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questions Review List */}
      <div className="space-y-6">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, idx) => {
            const candidateAns = attempt.answers[q.id];
            const isCorrect = candidateAns === q.correctAnswer;
            const isUnanswered = !candidateAns;
            const isBookmarked = bookmarkedIds.has(q.id);
            const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

            return (
              <Card
                key={q.id}
                className={`p-6 sm:p-7 border-2 ${
                  isCorrect
                    ? 'border-emerald-200 bg-emerald-50/10'
                    : isUnanswered
                    ? 'border-slate-200'
                    : 'border-rose-200 bg-rose-50/10'
                }`}
              >
                {/* Question Header */}
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 mb-4">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-800">
                      Question {q.questionNumber}
                    </span>
                    {q.topic && (
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {q.topic}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {isCorrect ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Correct
                      </span>
                    ) : isUnanswered ? (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                        <HelpCircle className="w-3.5 h-3.5" /> Skipped
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-rose-700 bg-rose-100 px-2.5 py-1 rounded-full">
                        <XCircle className="w-3.5 h-3.5" /> Incorrect
                      </span>
                    )}

                    <button
                      type="button"
                      onClick={() => toggleBookmark(q.id)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        isBookmarked
                          ? 'bg-amber-100 text-amber-700 border-amber-300'
                          : 'text-slate-400 hover:text-slate-600 border-slate-200 hover:bg-slate-50'
                      }`}
                      title={isBookmarked ? 'Remove bookmark' : 'Bookmark question'}
                    >
                      {isBookmarked ? (
                        <BookmarkCheck className="w-4 h-4 fill-amber-500" />
                      ) : (
                        <Bookmark className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Question Text */}
                <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-4 leading-relaxed">
                  {q.questionText}
                </h3>

                {/* Options List with Status */}
                <div className="space-y-2.5">
                  {options.map((optKey) => {
                    const optText = q.options[optKey];
                    if (!optText) return null;

                    const isSelected = candidateAns === optKey;
                    const isCorrectOpt = q.correctAnswer === optKey;

                    let optClass = 'border-slate-200 bg-white text-slate-700';
                    let badgeClass = 'bg-slate-100 text-slate-600 border-slate-200';

                    if (isCorrectOpt) {
                      optClass = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-medium ring-1 ring-emerald-500/30';
                      badgeClass = 'bg-emerald-600 text-white border-emerald-600';
                    } else if (isSelected && !isCorrectOpt) {
                      optClass = 'border-rose-400 bg-rose-50 text-rose-950 ring-1 ring-rose-400/30';
                      badgeClass = 'bg-rose-600 text-white border-rose-600';
                    }

                    return (
                      <div
                        key={optKey}
                        className={`p-3.5 rounded-xl border flex items-start gap-3 text-sm leading-relaxed ${optClass}`}
                      >
                        <span
                          className={`w-6 h-6 rounded flex items-center justify-center font-bold text-xs shrink-0 border ${badgeClass}`}
                        >
                          {optKey}
                        </span>
                        <div className="flex-1">
                          <span>{optText}</span>
                          {isSelected && (
                            <span className="ml-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                              (Your Choice)
                            </span>
                          )}
                          {isCorrectOpt && (
                            <span className="ml-2 text-xs font-bold uppercase tracking-wider text-emerald-700">
                              ✓ Correct Answer
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Explanation if exists */}
                {q.explanation && (
                  <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed">
                    <strong className="font-semibold text-slate-900">Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </Card>
            );
          })
        ) : (
          <div className="text-center py-12 text-slate-500">
            <p className="text-base font-semibold">No questions match the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
};
