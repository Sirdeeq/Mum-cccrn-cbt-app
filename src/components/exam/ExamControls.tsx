import React from 'react';
import { ArrowLeft, ArrowRight, Flag, CheckCircle2 } from 'lucide-react';
import { Button } from '../common/Button';

interface ExamControlsProps {
  currentIndex: number;
  totalQuestions: number;
  isMarked: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onToggleMark: () => void;
  onSubmit: () => void;
  isLastQuestion: boolean;
}

export const ExamControls: React.FC<ExamControlsProps> = ({
  currentIndex,
  totalQuestions,
  isMarked,
  onPrevious,
  onNext,
  onToggleMark,
  onSubmit,
  isLastQuestion
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
      {/* Previous Button */}
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentIndex === 0}
        icon={<ArrowLeft className="w-4 h-4" />}
      >
        Previous
      </Button>

      {/* Middle: Mark for Review */}
      <Button
        variant={isMarked ? 'secondary' : 'outline'}
        onClick={onToggleMark}
        icon={<Flag className={`w-4 h-4 ${isMarked ? 'fill-white' : ''}`} />}
        className={isMarked ? 'bg-amber-600 hover:bg-amber-700 text-white border-amber-600' : ''}
      >
        {isMarked ? 'Marked for Review' : 'Mark for Review'}
      </Button>

      {/* Right Controls: Next or Submit */}
      <div className="flex items-center gap-2">
        {!isLastQuestion ? (
          <Button
            variant="primary"
            onClick={onNext}
            className="flex-row-reverse"
            icon={<ArrowRight className="w-4 h-4 ml-2" />}
          >
            Next Question
          </Button>
        ) : (
          <Button
            variant="secondary"
            onClick={onSubmit}
            icon={<CheckCircle2 className="w-5 h-5" />}
          >
            Submit Examination
          </Button>
        )}
      </div>
    </div>
  );
};
