import React from 'react';
import { Question } from '../../types';
import { CheckCircle2, XCircle, Info } from 'lucide-react';

interface StudyFeedbackProps {
  question: Question;
  selectedAnswer?: 'A' | 'B' | 'C' | 'D';
}

export const StudyFeedback: React.FC<StudyFeedbackProps> = ({ question, selectedAnswer }) => {
  if (!selectedAnswer) return null;

  const isCorrect = selectedAnswer === question.correctAnswer;
  const correctText = question.options[question.correctAnswer];

  return (
    <div
      className={`mt-4 p-5 rounded-2xl border-2 transition-all ${
        isCorrect
          ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
          : 'bg-rose-50 border-rose-300 text-rose-950'
      }`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
        ) : (
          <XCircle className="w-6 h-6 text-rose-600 shrink-0 mt-0.5" />
        )}
        <div className="space-y-1">
          <div className="font-bold text-base">
            {isCorrect ? 'Correct Answer!' : 'Incorrect Answer'}
          </div>
          <div className="text-sm">
            The correct choice is <strong>Option {question.correctAnswer}:</strong> {correctText}
          </div>
          {question.explanation ? (
            <div className="text-xs text-slate-600 mt-2 bg-white/70 p-2.5 rounded-lg border border-slate-200">
              <strong className="font-semibold text-slate-800">Explanation:</strong> {question.explanation}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
