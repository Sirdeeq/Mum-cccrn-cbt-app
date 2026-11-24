import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCandidate } from '../../contexts/CandidateContext';
import { usePreferences } from '../../contexts/PreferencesContext';
import { useOffline } from '../../contexts/OfflineContext';
import { Wifi, WifiOff, Type, UserCheck, BookOpen, Settings, LogOut } from 'lucide-react';

export const Header: React.FC = () => {
  const { candidate, logoutCandidate } = useCandidate();
  const { fontSize, setFontSize } = usePreferences();
  const { isOnline } = useOffline();
  const location = useLocation();

  // Hide extensive header during full CBT exam to avoid distraction
  const isExamPage = location.pathname.startsWith('/exam/');

  return (
    <header className="sticky top-0 z-30 bg-primary-900 text-white shadow-md border-b border-primary-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Title */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-secondary-500 text-white flex items-center justify-center font-bold text-xl shadow-inner tracking-wider">
              BN
            </div>
            <div>
              <div className="text-base sm:text-lg font-bold tracking-tight text-white group-hover:text-secondary-300 transition-colors">
                CCCRN BRIDGE-N
              </div>
              <div className="text-xs sm:text-sm text-slate-300 font-medium">
                CBT Practice System
              </div>
            </div>
          </Link>

          {/* Candidate Status & Global Controls */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Font Size Adjuster */}
            <div className="flex items-center bg-primary-800/80 rounded-lg p-1 border border-primary-700" title="Adjust text size">
              <span className="sr-only">Font size</span>
              <button
                type="button"
                onClick={() => setFontSize('normal')}
                className={`px-2 py-1 text-xs font-semibold rounded ${
                  fontSize === 'normal' ? 'bg-secondary-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Normal text size"
                aria-label="Normal text size"
              >
                A
              </button>
              <button
                type="button"
                onClick={() => setFontSize('large')}
                className={`px-2 py-1 text-sm font-semibold rounded ${
                  fontSize === 'large' ? 'bg-secondary-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Large text size"
                aria-label="Large text size"
              >
                A+
              </button>
              <button
                type="button"
                onClick={() => setFontSize('xlarge')}
                className={`px-2 py-1 text-base font-bold rounded ${
                  fontSize === 'xlarge' ? 'bg-secondary-500 text-white' : 'text-slate-300 hover:text-white'
                }`}
                title="Extra large text size"
                aria-label="Extra large text size"
              >
                A++
              </button>
            </div>

            {/* Offline Status Pill */}
            <div
              className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border ${
                isOnline
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-600/40'
                  : 'bg-amber-950/40 text-amber-300 border-amber-600/40'
              }`}
            >
              {isOnline ? <Wifi className="w-3.5 h-3.5" /> : <WifiOff className="w-3.5 h-3.5" />}
              <span>{isOnline ? 'Online' : 'Offline Ready'}</span>
            </div>

            {/* Candidate Info / Navigation */}
            {candidate && !isExamPage && (
              <div className="flex items-center gap-2">
                <Link
                  to="/resources"
                  className="flex items-center gap-1.5 bg-secondary-600/90 hover:bg-secondary-500 px-3 py-2 rounded-lg text-sm font-semibold text-white transition-colors border border-secondary-400/40 shadow-sm"
                  title="CCCRN BRIDGE-N Study Resources & Role Guides"
                >
                  <BookOpen className="w-4 h-4 text-white" />
                  <span className="hidden sm:inline">Study Hub</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 bg-primary-800 hover:bg-primary-700 px-3 py-2 rounded-lg text-sm font-medium text-white transition-colors border border-primary-700"
                >
                  <UserCheck className="w-4 h-4 text-secondary-400" />
                  <span className="hidden md:inline max-w-[140px] truncate">{candidate.fullName}</span>
                </Link>

                <Link
                  to="/settings"
                  className="p-2 rounded-lg bg-primary-800 hover:bg-primary-700 text-slate-300 hover:text-white transition-colors border border-primary-700"
                  title="Settings & Backup"
                  aria-label="Settings and Backup"
                >
                  <Settings className="w-5 h-5" />
                </Link>
              </div>
            )}
            {!candidate && !isExamPage && (
              <Link
                to="/resources"
                className="flex items-center gap-1.5 bg-secondary-600/90 hover:bg-secondary-500 px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold text-white transition-colors border border-secondary-400/40"
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span>Study Hub</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
