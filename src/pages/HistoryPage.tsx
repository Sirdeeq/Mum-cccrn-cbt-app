import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { ExamAttempt, Role } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { formatDate, formatSeconds } from '../utils/formatters';
import { getCategoryBadgeClass } from '../utils/scoring';
import { ArrowLeft, Clock, BookOpen, Trash2 } from 'lucide-react';

export const HistoryPage: React.FC = () => {
  const { candidate } = useCandidate();
  const navigate = useNavigate();
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);
  const [rolesMap, setRolesMap] = useState<Record<string, Role>>({});

  useEffect(() => {
    if (!candidate?.id) {
      navigate('/');
      return;
    }

    const loadHistory = async () => {
      const allRoles = await db.roles.toArray();
      const rMap: Record<string, Role> = {};
      allRoles.forEach((r) => {
        rMap[r.id] = r;
      });
      setRolesMap(rMap);

      const allAttempts = await db.examAttempts
        .where('candidateId')
        .equals(candidate.id!)
        .filter((a) => a.status === 'completed')
        .reverse()
        .sortBy('submittedAt');

      setAttempts(allAttempts);
    };

    loadHistory();
  }, [candidate, navigate]);

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
          Examination History
        </h1>
        <p className="text-sm text-slate-600">
          Complete log of all practice tests, scores, and timestamps.
        </p>
      </div>

      {attempts.length > 0 ? (
        <div className="space-y-3">
          {attempts.map((att) => {
            const role = rolesMap[att.roleId];
            return (
              <Card
                key={att.id}
                className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-extrabold tracking-wider px-2 py-0.5 rounded bg-primary-100 text-primary-900">
                      {att.mode.toUpperCase()}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {role?.title || att.roleId}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {att.submittedAt ? formatDate(att.submittedAt) : ''} • Duration:{' '}
                    {formatSeconds(att.timeSpentSeconds)}
                  </div>
                  <div className="text-sm font-semibold text-slate-800 pt-1">
                    {att.score?.correct} correct / {att.score?.total} questions
                  </div>
                </div>

                <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                  <div className="text-right">
                    <div className="text-2xl font-black text-slate-900">
                      {att.score?.percentage}%
                    </div>
                    {att.score && (
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                          att.score.category
                        )}`}
                      >
                        {att.score.category}
                      </span>
                    )}
                  </div>

                  <Link to={`/review/${att.id}`}>
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card className="p-12 text-center text-slate-500 space-y-3">
          <Clock className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-lg font-bold text-slate-800">No Exam Records Found</h3>
          <p className="text-xs text-slate-500">
            Complete your first examination to record results in your permanent local practice history.
          </p>
        </Card>
      )}
    </div>
  );
};
