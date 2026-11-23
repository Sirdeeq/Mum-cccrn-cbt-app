import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { db } from '../db';
import { Role } from '../types';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import {
  Database,
  FlaskConical,
  Activity,
  TrendingUp,
  HeartHandshake,
  ArrowRight,
  BookOpen,
  Award
} from 'lucide-react';

export const RoleSelectionPage: React.FC = () => {
  const { candidate } = useCandidate();
  const navigate = useNavigate();
  const [roles, setRoles] = useState<Role[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>('');
  const [pastAttemptsByRole, setPastAttemptsByRole] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!candidate) {
      navigate('/');
      return;
    }

    const loadData = async () => {
      const allRoles = await db.roles.toArray();
      setRoles(allRoles);

      // Load past scores for each role
      const attempts = await db.examAttempts
        .where('candidateId')
        .equals(candidate.id!)
        .toArray();

      const scores: Record<string, number> = {};
      attempts.forEach((a) => {
        if (a.status === 'completed' && a.score) {
          if (!scores[a.roleId] || a.score.percentage > scores[a.roleId]) {
            scores[a.roleId] = a.score.percentage;
          }
        }
      });
      setPastAttemptsByRole(scores);

      if (allRoles.length > 0) {
        setSelectedRoleId(allRoles[0].id);
      }
    };

    loadData();
  }, [candidate, navigate]);

  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Database':
        return <Database className="w-7 h-7 text-primary-700" />;
      case 'FlaskConical':
        return <FlaskConical className="w-7 h-7 text-emerald-700" />;
      case 'Activity':
        return <Activity className="w-7 h-7 text-sky-700" />;
      case 'TrendingUp':
        return <TrendingUp className="w-7 h-7 text-indigo-700" />;
      case 'HeartHandshake':
      default:
        return <HeartHandshake className="w-7 h-7 text-rose-700" />;
    }
  };

  const handleStartPracticing = () => {
    if (!selectedRoleId) return;
    localStorage.setItem('cccrn_selected_role', selectedRoleId);
    navigate(`/practice?role=${selectedRoleId}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-primary-900">
          Which position are you preparing for?
        </h1>
        <p className="text-base text-slate-600 max-w-xl mx-auto">
          Select your target role below to load its dedicated question bank and practice questions tailored to that job description.
        </p>
      </div>

      {/* 5 Position Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {roles.map((role) => {
          const isSelected = selectedRoleId === role.id;
          const bestScore = pastAttemptsByRole[role.id];

          return (
            <Card
              key={role.id}
              hoverable
              selected={isSelected}
              onClick={() => setSelectedRoleId(role.id)}
              className="flex flex-col justify-between h-full p-6"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="p-3 rounded-2xl bg-slate-100/80 border border-slate-200">
                    {getRoleIcon(role.iconName)}
                  </div>
                  {bestScore !== undefined && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                      <Award className="w-3.5 h-3.5" />
                      Best: {bestScore}%
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-900">
                    {role.title}
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {role.focus}
                  </p>
                </div>
              </div>

              <div className="pt-5 mt-5 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-slate-400" />
                  {role.questionCount} Questions ({role.topicsCount} Topics)
                </span>
                {role.supplementaryCount ? (
                  <span className="text-secondary-700 font-bold bg-secondary-50 px-2 py-0.5 rounded">
                    +{role.supplementaryCount} Supp.
                  </span>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Start Button */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Button
          variant="secondary"
          size="lg"
          onClick={handleStartPracticing}
          disabled={!selectedRoleId}
          icon={<ArrowRight className="w-5 h-5 ml-2" />}
          className="w-full sm:w-auto px-10 flex-row-reverse"
        >
          Start Practicing
        </Button>
      </div>
    </div>
  );
};
