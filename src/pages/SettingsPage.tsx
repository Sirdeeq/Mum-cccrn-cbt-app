import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCandidate } from '../contexts/CandidateContext';
import { usePreferences } from '../contexts/PreferencesContext';
import { exportUserData, importUserData, resetCandidateProgress } from '../db/backup';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import {
  Settings,
  Download,
  Upload,
  RotateCcw,
  Shield,
  ArrowLeft,
  AlertTriangle,
  Type,
  Shuffle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { candidate, logoutCandidate } = useCandidate();
  const { fontSize, setFontSize, shuffleOptions, setShuffleOptions } = usePreferences();
  const navigate = useNavigate();

  const [showResetModal, setShowResetModal] = useState<boolean>(false);
  const [importStatus, setImportStatus] = useState<{ message: string; isError: boolean } | null>(null);

  const handleExportBackup = async () => {
    if (!candidate?.id) return;
    const jsonString = await exportUserData(candidate.id);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CCCRN_BRIDGE_N_Backup_${candidate.fullName.replace(/\s+/g, '_')}_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await importUserData(content);
      if (res.success) {
        setImportStatus({ message: res.message, isError: false });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus({ message: res.message, isError: true });
      }
    };
    reader.readAsText(file);
  };

  const handleConfirmReset = async () => {
    if (!candidate?.id) return;
    await resetCandidateProgress(candidate.id);
    setShowResetModal(false);
    navigate('/dashboard');
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
          Preferences & Data Management
        </h1>
        <p className="text-sm text-slate-600">
          Adjust text size, export backups, or manage your locally saved practice records.
        </p>
      </div>

      {/* Interface Settings */}
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Type className="w-5 h-5 text-primary-600" />
          Display & Text Size
        </h2>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <div className="font-semibold text-slate-800 text-base">Reading Font Size</div>
            <div className="text-xs text-slate-500">
              Increases the size of questions and answer buttons for comfortable reading.
            </div>
          </div>

          <div className="flex items-center gap-2">
            {[
              { id: 'normal', label: 'Normal (16px)' },
              { id: 'large', label: 'Large (18px)' },
              { id: 'xlarge', label: 'Extra Large (20px)' }
            ].map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setFontSize(s.id as any)}
                className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                  fontSize === s.id
                    ? 'bg-secondary-500 text-white border-secondary-500 shadow-sm'
                    : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Shuffling Options */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
          <div>
            <div className="font-semibold text-slate-800 text-base flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-slate-500" />
              Randomize Answer Choices
            </div>
            <div className="text-xs text-slate-500">
              Shuffles choices (A, B, C, D) so you memorize concepts rather than option positions.
            </div>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={shuffleOptions}
              onChange={(e) => setShuffleOptions(e.target.checked)}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-secondary-500"></div>
          </label>
        </div>
      </Card>

      {/* Backup and Restore */}
      <Card className="p-6 space-y-6">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <Download className="w-5 h-5 text-secondary-600" />
          Backup & Restore Practice Progress
        </h2>

        <p className="text-xs text-slate-600 leading-relaxed">
          Because this application works completely offline, all your examination history is stored inside this browser. You can export a backup file to keep your records safe or transfer them to another device.
        </p>

        {importStatus && (
          <div
            className={`p-3 rounded-xl text-sm font-semibold border ${
              importStatus.isError
                ? 'bg-rose-50 text-rose-800 border-rose-300'
                : 'bg-emerald-50 text-emerald-800 border-emerald-300'
            }`}
          >
            {importStatus.message}
          </div>
        )}

        <div className="flex flex-wrap items-center gap-4">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportBackup}
            icon={<Download className="w-4 h-4" />}
          >
            Export Backup (.json)
          </Button>

          <label className="cursor-pointer">
            <span className="inline-flex items-center justify-center font-semibold rounded-xl transition-all border-2 border-slate-300 bg-white text-slate-800 hover:bg-slate-50 px-5 py-3 text-base min-h-[48px] shadow-sm">
              <Upload className="w-4 h-4 mr-2" />
              Import Backup File
            </span>
            <input
              type="file"
              accept=".json"
              onChange={handleImportFile}
              className="hidden"
            />
          </label>
        </div>
      </Card>

      {/* Danger Zone: Reset Progress */}
      <Card className="p-6 border-rose-200 bg-rose-50/20 space-y-4">
        <h2 className="text-lg font-bold text-rose-950 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-rose-600" />
          Reset Practice History
        </h2>
        <p className="text-xs text-rose-800 leading-relaxed">
          This will permanently delete all completed practice sessions and bookmarked questions for{' '}
          <strong>{candidate?.fullName}</strong>. The 500 preparation questions will remain intact.
        </p>
        <Button
          variant="danger"
          size="sm"
          onClick={() => setShowResetModal(true)}
          icon={<RotateCcw className="w-4 h-4" />}
        >
          Reset All My Progress
        </Button>
      </Card>

      {/* Privacy Notice */}
      <div className="p-4 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-2">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <Shield className="w-4 h-4 text-emerald-600" />
          Candidate Privacy & Offline Integrity
        </div>
        <p>
          This application operates 100% locally on your phone or computer. No candidates' personal data, exam scores, or answers are ever sent to remote servers or third-party trackers.
        </p>
        <p>
          Clearing browser cookies and site data, or opening in a private/incognito window, may reset locally saved progress. Keep regular JSON backups if practicing over multiple weeks.
        </p>
      </div>

      {/* Reset Confirmation Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Confirm Reset Progress"
        footer={
          <>
            <Button variant="outline" onClick={() => setShowResetModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmReset}>
              Yes, Delete Progress
            </Button>
          </>
        }
      >
        <div className="space-y-3 text-sm text-slate-700">
          <p>
            Are you sure you want to clear all your examination attempts and scores? This action cannot be undone.
          </p>
        </div>
      </Modal>
    </div>
  );
};
