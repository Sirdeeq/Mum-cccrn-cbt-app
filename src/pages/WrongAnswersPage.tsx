import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { Question, ExamAttempt } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  PlayCircle,
  ArrowLeft,
  Sparkles
} from 'lucide-react';

export const WrongAnswersPage: React.FC = () => {
  const { candidate } = useCandidate();
  const navigate = useNavigate();
  const [missedQuestions, setMissedQuestions] = useState<{ question: Question; missCount: number }[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!candidate?.id) {
      navigate('/');
      return;
    }

    const loadWrongAnswers = async () => {
      try {
        const attempts = await db.examAttempts
          .where('candidateId')
          .equals(candidate.id!)
          .filter((a) => a.status === 'completed')
          .toArray();

        const allQ = await db.questions.toArray();
        const qMap = new Map(allQ.map((q) => [q.id, q]));

        const missFrequency: Record<string, number> = {};

        attempts.forEach((att) => {
          Object.entries(att.answers).forEach(([qid, ans]) => {
            const q = qMap.get(qid);
            if (q && ans !== q.correctAnswer) {
              missFrequency[qid] = (missFrequency[qid] || 0) + 1;
            }
          });
        });

        const list = Object.entries(missFrequency)
          .map(([qid, count]) => ({
            question: qMap.get(qid)!,
            missCount: count
          }))
          .filter((item) => !!item.question)
          .sort((a, b) => b.missCount - a.missCount);

        setMissedQuestions(list);
      } catch (err) {
        console.error('Error loading wrong answers:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadWrongAnswers();
  }, [candidate, navigate]);

  const handleStartRevisionExam = async () => {
    if (!candidate || missedQuestions.length === 0) return;

    const questionIds = missedQuestions.map((m) => m.question.id).slice(0, 30);
    const attemptId = `attempt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const newAttempt: ExamAttempt = {
      id: attemptId,
      candidateId: candidate.id!,
      roleId: missedQuestions[0].question.roleId,
      mode: 'wrong_answers',
      questionIds,
      answers: {},
      markedQuestions: [],
      startedAt: Date.now(),
      status: 'in_progress',
      timeSpentSeconds: 0
    };

    await db.examAttempts.add(newAttempt);
    navigate(`/exam/${attemptId}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-slate-800 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
            Mistakes Revision Portal
          </h1>
          <p className="text-sm text-slate-600">
            Targeted review of questions you previously missed. Prioritized by error frequency.
          </p>
        </div>

        {missedQuestions.length > 0 && (
          <Button
            variant="secondary"
            size="md"
            onClick={handleStartRevisionExam}
            icon={<PlayCircle className="w-5 h-5" />}
          >
            Practice All Mistakes
          </Button>
        )}
      </div>

      {missedQuestions.length > 0 ? (
        <div className="space-y-4">
          {missedQuestions.map(({ question: q, missCount }) => (
            <Card key={q.id} className="p-5 border-rose-200 bg-rose-50/10">
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
                <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                  Missed {missCount} {missCount === 1 ? 'time' : 'times'}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 mb-3 leading-relaxed">
                {q.questionText}
              </h3>

              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 font-medium">
                <span className="font-bold text-emerald-800">Correct Answer (Option {q.correctAnswer}): </span>
                {q.options[q.correctAnswer]}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-500 space-y-4">
          <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-slate-900">No Mistakes Saved!</h3>
            <p className="text-sm text-slate-600 max-w-sm mx-auto">
              You currently have no recorded incorrect answers. Take a Mock Examination to track questions needing revision.
            </p>
          </div>
          <Link to="/roles" className="inline-block pt-2">
            <Button variant="secondary" size="md">
              Start Practice Now
            </Button>
          </Link>
        </Card>
      )}
    </div>
  );
};
