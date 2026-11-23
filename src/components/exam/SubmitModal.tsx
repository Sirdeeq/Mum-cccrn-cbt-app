import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AlertCircle, CheckCircle, Flag } from 'lucide-react';

interface SubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmSubmit: () => void;
  totalQuestions: number;
  answeredCount: number;
  markedCount: number;
  isSubmitting?: boolean;
}

export const SubmitModal: React.FC<SubmitModalProps> = ({
  isOpen,
  onClose,
  onConfirmSubmit,
  totalQuestions,
  answeredCount,
  markedCount,
  isSubmitting = false
}) => {
  const unansweredCount = totalQuestions - answeredCount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Your Examination"
      footer={
        <>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Return to Questions
          </Button>
          <Button
            variant="secondary"
            onClick={onConfirmSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Calculating Result...' : 'Yes, Submit Now'}
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        {unansweredCount > 0 ? (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
            <div className="text-sm text-amber-900">
              <strong className="font-bold">Attention:</strong> You have{' '}
              <strong className="underline font-bold">{unansweredCount} unanswered questions</strong> out of {totalQuestions}. Once submitted, answers cannot be changed.
            </div>
          </div>
        ) : (
          <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-sm text-emerald-900">
              <strong className="font-bold">Great job!</strong> You have answered all {totalQuestions} questions. Are you ready to see your results?
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3 text-center pt-2">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-2xl font-bold text-emerald-600">{answeredCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Answered</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-2xl font-bold text-amber-600">{unansweredCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Unanswered</div>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="text-2xl font-bold text-slate-700">{markedCount}</div>
            <div className="text-xs font-semibold text-slate-500 uppercase">Marked</div>
          </div>
        </div>
      </div>
    </Modal>
  );
};
