import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { ShieldCheck, BookOpen, ArrowRight, User, CheckCircle2 } from 'lucide-react';

export const WelcomePage: React.FC = () => {
  const { candidate, setCandidateProfile, allCandidates, selectCandidate } = useCandidate();
  const [nameInput, setNameInput] = useState<string>('');
  const [isChangingName, setIsChangingName] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleStart = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nameInput.trim()) {
      setError('Please enter your full name to proceed.');
      return;
    }

    try {
      await setCandidateProfile(nameInput);
      navigate('/roles');
    } catch (err: any) {
      setError(err.message || 'Failed to save candidate name.');
    }
  };

  const handleContinueReturning = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-xl space-y-6">
        {/* Welcome Hero Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary-100 text-secondary-800 text-xs sm:text-sm font-semibold mb-2">
            <ShieldCheck className="w-4 h-4 text-secondary-600" />
            CCCRN BRIDGE-N Project Assessment Preparation
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary-900 tracking-tight">
            Welcome to BRIDGE-N CBT Practice
          </h1>
          <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-lg mx-auto">
            Prepare confidently for your examination. Choose your position, practice questions, and improve your performance.
          </p>
        </div>

        {/* Form Card */}
        <Card className="p-6 sm:p-8 shadow-md">
          {candidate && !isChangingName ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-secondary-100 text-secondary-700 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold uppercase tracking-wider text-slate-500">Welcome Back</p>
                <h2 className="text-2xl font-bold text-slate-900">{candidate.fullName}</h2>
                <p className="text-sm text-slate-600">
                  Ready to continue your recruitment examination practice?
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <Button
                  variant="secondary"
                  size="lg"
                  fullWidth
                  onClick={handleContinueReturning}
                  icon={<ArrowRight className="w-5 h-5 ml-2" />}
                  className="flex-row-reverse"
                >
                  Continue to Practice
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsChangingName(true)}
                  className="text-slate-500 hover:text-slate-800 text-sm"
                >
                  Use a different candidate name
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleStart} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="candidate-name" className="block text-base font-bold text-slate-800">
                  Enter Your Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <User className="w-5 h-5" />
                  </div>
                  <input
                    id="candidate-name"
                    type="text"
                    value={nameInput}
                    onChange={(e) => {
                      setNameInput(e.target.value);
                      if (error) setError('');
                    }}
                    placeholder="e.g. Maryam Abubakar"
                    className="block w-full pl-11 pr-4 py-3.5 text-base sm:text-lg border-2 border-slate-300 rounded-xl focus:border-secondary-500 focus:ring-2 focus:ring-secondary-500/20 text-slate-900 placeholder:text-slate-400 bg-white"
                    autoFocus
                  />
                </div>
                {error && <p className="text-sm font-medium text-rose-600 mt-1">{error}</p>}
                <p className="text-xs text-slate-500 mt-1">
                  No password or registration required. Your name is stored securely only on this device.
                </p>
              </div>

              {allCandidates.length > 0 && isChangingName && (
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="text-xs font-semibold text-slate-500 uppercase">Or select existing candidate:</span>
                  <div className="flex flex-wrap gap-2">
                    {allCandidates.map((c) => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => {
                          selectCandidate(c);
                          setIsChangingName(false);
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                      >
                        {c.fullName}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <Button
                type="submit"
                variant="secondary"
                size="lg"
                fullWidth
                icon={<ArrowRight className="w-5 h-5 ml-2" />}
                className="flex-row-reverse"
              >
                Continue
              </Button>
            </form>
          )}
        </Card>

        {/* Assurance Box */}
        <div className="bg-slate-100/80 rounded-xl p-4 text-center text-xs text-slate-600 border border-slate-200">
          <p className="font-semibold text-slate-700 mb-0.5">Offline-Ready Practice Material</p>
          <p>
            Includes 500 comprehensive role-specific practice questions across 5 positions plus CCCRN BRIDGE-N project preparation questions.
          </p>
        </div>
      </div>
    </div>
  );
};
