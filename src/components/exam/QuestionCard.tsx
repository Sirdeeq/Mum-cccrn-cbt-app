import React from 'react';
import { Question } from '../../types';
import { Bookmark, BookmarkCheck } from 'lucide-react';

interface QuestionCardProps {
  question: Question;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
  onSelectAnswer: (optionKey: 'A' | 'B' | 'C' | 'D') => void;
  isBookmarked?: boolean;
  onToggleBookmark?: () => void;
  isStudyMode?: boolean;
  showFeedback?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onSelectAnswer,
  isBookmarked,
  onToggleBookmark,
  isStudyMode = false,
  showFeedback = false
}) => {
  const options: ('A' | 'B' | 'C' | 'D')[] = ['A', 'B', 'C', 'D'];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
      {/* Question Header: Topic & Bookmark */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs uppercase tracking-wider font-bold px-3 py-1 bg-primary-100 text-primary-900 rounded-full">
            Question {question.questionNumber}
          </span>
          {question.topic && (
            <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
              Topic: {question.topic}
            </span>
          )}
        </div>

        {onToggleBookmark && (
          <button
            type="button"
            onClick={onToggleBookmark}
            className={`p-2 rounded-xl transition-colors border ${
              isBookmarked
                ? 'bg-amber-50 text-amber-600 border-amber-300'
                : 'text-slate-400 hover:text-slate-600 border-transparent hover:bg-slate-100'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
          >
            {isBookmarked ? <BookmarkCheck className="w-5 h-5 fill-amber-500" /> : <Bookmark className="w-5 h-5" />}
          </button>
        )}
      </div>

      {/* Question Text */}
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-relaxed mb-6">
        {question.questionText}
      </h2>

      {/* Options List */}
      <div className="space-y-3.5" role="radiogroup" aria-label="Answer options">
        {options.map((key) => {
          const optionText = question.options[key];
          if (!optionText) return null;

          const isSelected = selectedAnswer === key;
          const isCorrect = question.correctAnswer === key;

          // In Study Mode feedback
          let optionStyle = 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/70 text-slate-800';
          let badgeStyle = 'bg-slate-100 text-slate-700 border-slate-300';

          if (showFeedback && isStudyMode) {
            if (isCorrect) {
              optionStyle = 'border-emerald-500 bg-emerald-50/60 text-emerald-950 font-medium ring-2 ring-emerald-500/30';
              badgeStyle = 'bg-emerald-600 text-white border-emerald-600';
            } else if (isSelected && !isCorrect) {
              optionStyle = 'border-rose-400 bg-rose-50/60 text-rose-950 ring-2 ring-rose-400/30';
              badgeStyle = 'bg-rose-600 text-white border-rose-600';
            } else {
              optionStyle = 'border-slate-200 text-slate-500 opacity-70';
            }
          } else if (isSelected) {
            optionStyle = 'border-secondary-500 bg-secondary-50/50 text-primary-950 font-medium ring-2 ring-secondary-500/40 shadow-sm';
            badgeStyle = 'bg-secondary-500 text-white border-secondary-500';
          }

          return (
            <button
              key={key}
              type="button"
              onClick={() => onSelectAnswer(key)}
              role="radio"
              aria-checked={isSelected}
              className={`w-full text-left p-4 sm:p-5 rounded-xl border-2 transition-all flex items-start gap-4 min-h-[56px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-secondary-500 ${optionStyle}`}
            >
              <span
                className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm shrink-0 border transition-colors ${badgeStyle}`}
              >
                {key}
              </span>
              <span className="text-base sm:text-lg leading-relaxed pt-0.5 select-none">
                {optionText}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
