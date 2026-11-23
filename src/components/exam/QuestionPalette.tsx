import React from 'react';
import { Check, Flag } from 'lucide-react';

interface QuestionPaletteProps {
  totalQuestions: number;
  currentIndex: number;
  answers: Record<string, string>;
  markedQuestions: string[];
  questionIds: string[];
  onSelectQuestion: (index: number) => void;
}

export const QuestionPalette: React.FC<QuestionPaletteProps> = ({
  totalQuestions,
  currentIndex,
  answers,
  markedQuestions,
  questionIds,
  onSelectQuestion
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-4 sm:p-5 flex flex-col h-full">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
        <h3 className="font-bold text-slate-800 text-base">Question Navigator</h3>
        <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-md">
          {Object.keys(answers).length} / {totalQuestions} answered
        </span>
      </div>

      {/* Grid of question buttons */}
      <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-5 lg:grid-cols-5 gap-2 max-h-[360px] overflow-y-auto pr-1">
        {questionIds.map((qid, index) => {
          const isAnswered = !!answers[qid];
          const isMarked = markedQuestions.includes(qid);
          const isCurrent = index === currentIndex;

          let btnClass = 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200';

          if (isCurrent) {
            btnClass = 'ring-2 ring-primary-900 border-primary-900 font-bold z-10';
          }

          if (isMarked) {
            btnClass += ' bg-amber-100 text-amber-900 border-amber-300';
          } else if (isAnswered) {
            btnClass += ' bg-emerald-100 text-emerald-900 border-emerald-300 font-semibold';
          }

          return (
            <button
              key={qid}
              type="button"
              onClick={() => onSelectQuestion(index)}
              className={`relative h-11 rounded-xl border flex items-center justify-center text-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 ${btnClass}`}
              aria-label={`Go to question ${index + 1}${isAnswered ? ', Answered' : ''}${isMarked ? ', Marked for review' : ''}`}
            >
              <span>{index + 1}</span>
              {isAnswered && (
                <Check className="w-3 h-3 absolute top-1 right-1 text-emerald-700" />
              )}
              {isMarked && (
                <Flag className="w-3 h-3 absolute top-1 left-1 text-amber-700 fill-amber-500" />
              )}
            </button>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-emerald-100 border border-emerald-300 inline-block" />
          <span>Answered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-slate-100 border border-slate-300 inline-block" />
          <span>Unanswered</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-amber-100 border border-amber-300 inline-block" />
          <span>Marked Review</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded ring-2 ring-primary-900 bg-white border border-primary-900 inline-block" />
          <span>Current</span>
        </div>
      </div>
    </div>
  );
};
