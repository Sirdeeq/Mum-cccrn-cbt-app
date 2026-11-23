import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { db } from '../db';
import { ExamAttempt, Role } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { getCategoryBadgeClass } from '../utils/scoring';
import { formatDate, formatSeconds } from '../utils/formatters';
import confetti from 'canvas-confetti';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  RotateCcw,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';

export const ResultsPage: React.FC = () => {
  const { attemptId } = useParams<{ attemptId: string }>();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState<ExamAttempt | null>(null);
  const [role, setRole] = useState<Role | null>(null);
  const [candidateName, setCandidateName] = useState<string>('');

  useEffect(() => {
    const loadResults = async () => {
      if (!attemptId) return;
      const att = await db.examAttempts.get(attemptId);
      if (!att) {
        navigate('/dashboard');
        return;
      }
      setAttempt(att);

      const r = await db.roles.get(att.roleId);
      if (r) setRole(r);

      const cand = await db.candidates.get(att.candidateId);
      if (cand) setCandidateName(cand.fullName);

      // Trigger celebratory confetti if score is >= 80%
      if (att.score && att.score.percentage >= 80) {
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 }
          });
        } catch (e) {
          // graceful fallback
        }
      }
    };

    loadResults();
  }, [attemptId, navigate]);

  if (!attempt || !attempt.score) return null;

  const { correct, incorrect, unanswered, total, percentage, category } = attempt.score;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Result Card Hero */}
      <Card className="p-6 sm:p-10 text-center shadow-lg border-2 border-slate-200">
        <div className="space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-secondary-100 text-secondary-600 flex items-center justify-center mx-auto shadow-inner">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Examination Completed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900">
              Practice Assessment Results
            </h1>
            <p className="text-sm sm:text-base text-slate-600">
              Candidate: <strong className="text-slate-900">{candidateName}</strong> • Target Role:{' '}
              <strong className="text-slate-900">{role?.title}</strong>
            </p>
          </div>

          {/* Score Badge */}
          <div className="pt-2">
            <div className="text-5xl sm:text-6xl font-black text-primary-900 tracking-tight">
              {percentage}%
            </div>
            <div className="mt-2 inline-block">
              <span
                className={`text-sm sm:text-base font-extrabold px-4 py-1.5 rounded-full border ${getCategoryBadgeClass(
                  category
                )}`}
              >
                {category}
              </span>
            </div>
          </div>

          {/* Official disclaimer */}
          <p className="text-xs text-slate-500 max-w-md mx-auto pt-2">
            * These are practice feedback categories designed to guide your revision, not official CCCRN BRIDGE-N examination scores.
          </p>
        </div>

        {/* 4 Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-8 border-t border-slate-100 mt-8">
          <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-emerald-800 text-xs font-bold mb-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Correct
            </div>
            <div className="text-2xl font-black text-emerald-900">{correct}</div>
            <div className="text-xs text-emerald-700">out of {total}</div>
          </div>

          <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-rose-800 text-xs font-bold mb-1">
              <XCircle className="w-4 h-4 text-rose-600" />
              Incorrect
            </div>
            <div className="text-2xl font-black text-rose-900">{incorrect}</div>
            <div className="text-xs text-rose-700">need revision</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-bold mb-1">
              <HelpCircle className="w-4 h-4 text-slate-500" />
              Unanswered
            </div>
            <div className="text-2xl font-black text-slate-900">{unanswered}</div>
            <div className="text-xs text-slate-500">skipped</div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
            <div className="flex items-center justify-center gap-1.5 text-slate-700 text-xs font-bold mb-1">
              <Clock className="w-4 h-4 text-primary-600" />
              Time Spent
            </div>
            <div className="text-2xl font-black text-slate-900">
              {formatSeconds(attempt.timeSpentSeconds)}
            </div>
            <div className="text-xs text-slate-500">duration</div>
          </div>
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <Link to={`/review/${attempt.id}`} className="block">
          <Button variant="secondary" size="lg" fullWidth icon={<BookOpen className="w-5 h-5" />}>
            Review Answers
          </Button>
        </Link>

        <Link to={`/practice?role=${attempt.roleId}`} className="block">
          <Button variant="primary" size="lg" fullWidth icon={<RotateCcw className="w-5 h-5" />}>
            Retry Examination
          </Button>
        </Link>

        {incorrect > 0 && (
          <Link to="/wrong-answers" className="block">
            <Button variant="outline" size="lg" fullWidth icon={<XCircle className="w-5 h-5 text-rose-600" />}>
              Practice Mistakes
            </Button>
          </Link>
        )}

        <Link to="/dashboard" className="block">
          <Button variant="ghost" size="lg" fullWidth icon={<ArrowRight className="w-5 h-5" />}>
            Candidate Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};
