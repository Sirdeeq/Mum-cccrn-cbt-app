import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { usePerformanceStats } from '../hooks/usePerformanceStats';
import { db } from '../db';
import { Role } from '../types';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { formatDate } from '../utils/formatters';
import {
  Trophy,
  Target,
  Clock,
  BookOpen,
  ArrowRight,
  RotateCcw,
  AlertCircle,
  PlayCircle,
  TrendingUp,
  Bookmark,
  CheckCircle2
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { candidate } = useCandidate();
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const selectedRoleId = localStorage.getItem('cccrn_selected_role') || 'client_navigator';
  const { stats, isLoading } = usePerformanceStats(candidate?.id, selectedRoleId);

  useEffect(() => {
    if (!candidate) {
      navigate('/');
      return;
    }

    const loadRole = async () => {
      const r = await db.roles.get(selectedRoleId);
      if (r) setSelectedRole(r);
    };

    loadRole();
  }, [candidate, selectedRoleId, navigate]);

  if (!candidate || !selectedRole) return null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* Top Greeting & Role Switcher */}
      <div className="bg-gradient-to-r from-primary-900 to-primary-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-secondary-300 bg-primary-800/80 px-3 py-1 rounded-full border border-primary-700">
            Candidate Practice Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            Welcome, {candidate.fullName}!
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-xl">
            Currently preparing for:{' '}
            <strong className="text-white font-semibold underline decoration-secondary-400">
              {selectedRole.title}
            </strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <Link to="/roles">
            <Button variant="outline" size="sm" className="bg-white/10 text-white border-white/20 hover:bg-white/20">
              Change Position
            </Button>
          </Link>
          <Link to={`/practice?role=${selectedRole.id}`}>
            <Button variant="secondary" size="md" icon={<PlayCircle className="w-5 h-5" />}>
              Start New Practice
            </Button>
          </Link>
        </div>
      </div>

      {/* Unfinished Session Alert if any */}
      {stats.hasUnfinishedExam && stats.unfinishedAttemptId && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-4 shadow-sm animate-pulse">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-6 h-6 text-amber-700 shrink-0" />
            <div>
              <div className="font-bold text-amber-950">You have an unfinished examination!</div>
              <div className="text-xs text-amber-800">
                Your previous practice session is paused and waiting for you.
              </div>
            </div>
          </div>
          <Link to={`/exam/${stats.unfinishedAttemptId}`}>
            <Button variant="secondary" size="sm">
              Resume Test
            </Button>
          </Link>
        </div>
      )}

      {/* Performance Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Target className="w-5 h-5 text-primary-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Practice Tests</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalAttempts}</div>
          <div className="text-xs text-slate-500 mt-1">Completed sessions</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <TrendingUp className="w-5 h-5 text-secondary-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Average Score</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.averageScore}%</div>
          <div className="text-xs text-slate-500 mt-1">Across all attempts</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold uppercase tracking-wider">Best Score</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.bestScore}%</div>
          <div className="text-xs text-slate-500 mt-1">Highest result so far</div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-2 text-slate-500">
            <BookOpen className="w-5 h-5 text-indigo-600" />
            <span className="text-xs font-bold uppercase tracking-wider">Questions Answered</span>
          </div>
          <div className="text-3xl font-black text-slate-900">{stats.totalQuestionsAttempted}</div>
          <div className="text-xs text-slate-500 mt-1">Total items practiced</div>
        </Card>
      </div>

      {/* Two Column Layout: Weak Areas + Recent Attempts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Topic Mastery / Weak Topics */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-base">Areas for Improvement</h3>
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </div>

            {stats.weakTopics.length > 0 ? (
              <div className="space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  Focus extra revision on these topics where practice accuracy is below 70%:
                </p>
                <div className="space-y-2">
                  {stats.weakTopics.map((topic) => {
                    const info = stats.topicAccuracy[topic];
                    return (
                      <div key={topic} className="p-3 bg-rose-50/60 rounded-xl border border-rose-200">
                        <div className="flex justify-between text-xs font-bold text-rose-950 mb-1">
                          <span>{topic}</span>
                          <span>{info?.percentage || 0}%</span>
                        </div>
                        <ProgressBar current={info?.correct || 0} total={info?.total || 1} showPercent={false} />
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-slate-500 space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
                <p className="text-sm font-semibold text-slate-800">No weak topics identified yet!</p>
                <p className="text-xs text-slate-500">
                  Complete more practice tests to generate automated topic accuracy insights.
                </p>
              </div>
            )}

            <div className="mt-6 pt-4 border-t border-slate-100">
              <Link to="/wrong-answers" className="block">
                <Button variant="outline" size="sm" fullWidth icon={<RotateCcw className="w-4 h-4" />}>
                  Revise Past Mistakes
                </Button>
              </Link>
            </div>
          </Card>

          {/* Quick Links Card */}
          <Card className="p-6">
            <h3 className="font-bold text-slate-900 text-base mb-4">Quick Resources</h3>
            <div className="space-y-2">
              <Link
                to="/bookmarks"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-slate-700 font-semibold text-sm"
              >
                <span className="flex items-center gap-2">
                  <Bookmark className="w-4 h-4 text-amber-500" />
                  Bookmarked Questions
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
              <Link
                to="/history"
                className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors border border-slate-100 text-slate-700 font-semibold text-sm"
              >
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary-600" />
                  Full Exam History
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>
          </Card>
        </div>

        {/* Right Column: Recent Attempts History */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Recent Examination Results</h3>
                <p className="text-xs text-slate-500">Your latest practice performance records</p>
              </div>
              <Link to="/history">
                <Button variant="ghost" size="sm" className="text-xs text-secondary-600 font-bold">
                  View All History
                </Button>
              </Link>
            </div>

            {stats.recentAttempts.length > 0 ? (
              <div className="space-y-3">
                {stats.recentAttempts.map((att) => {
                  return (
                    <div
                      key={att.id}
                      className="p-4 rounded-xl border border-slate-200/90 hover:border-slate-300 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded bg-primary-100 text-primary-900">
                            {att.mode.toUpperCase()}
                          </span>
                          <span className="text-xs text-slate-500">
                            {att.submittedAt ? formatDate(att.submittedAt) : ''}
                          </span>
                        </div>
                        <div className="text-sm font-semibold text-slate-800">
                          {att.score?.correct} correct out of {att.score?.total} questions
                        </div>
                      </div>

                      <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                        <div className="text-right">
                          <div className="text-xl font-black text-slate-900">
                            {att.score?.percentage}%
                          </div>
                          <div className="text-xs text-slate-500 font-medium">
                            {att.score?.category}
                          </div>
                        </div>

                        <Link to={`/review/${att.id}`}>
                          <Button variant="outline" size="sm">
                            Review
                          </Button>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12 text-slate-500 space-y-3">
                <BookOpen className="w-12 h-12 text-slate-300 mx-auto" />
                <p className="text-base font-semibold text-slate-800">No practice tests completed yet</p>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Start your first test to see your score, timing breakdown, and progress tracking here.
                </p>
                <Link to={`/practice?role=${selectedRole.id}`}>
                  <Button variant="secondary" size="md" className="mt-2">
                    Take Your First Practice Test
                  </Button>
                </Link>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
