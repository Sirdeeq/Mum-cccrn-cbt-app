import React from 'react';
import { Clock, AlertTriangle } from 'lucide-react';
import { formatSeconds } from '../../utils/formatters';

interface ExamTimerProps {
  secondsLeft: number | null;
  warning5Min?: boolean;
  warning1Min?: boolean;
}

export const ExamTimer: React.FC<ExamTimerProps> = ({
  secondsLeft,
  warning5Min,
  warning1Min
}) => {
  if (secondsLeft === null) return null;

  const isUrgent = warning1Min || (secondsLeft <= 60);
  const isWarning = warning5Min || (secondsLeft <= 300);

  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-lg sm:text-xl font-bold tracking-wider border transition-colors shadow-sm ${
          isUrgent
            ? 'bg-rose-100 text-rose-900 border-rose-300 animate-pulse'
            : isWarning
            ? 'bg-amber-100 text-amber-900 border-amber-300'
            : 'bg-slate-100 text-slate-800 border-slate-300'
        }`}
        aria-live="polite"
        role="timer"
        aria-label={`Time remaining: ${formatSeconds(secondsLeft)}`}
      >
        {isUrgent ? (
          <AlertTriangle className="w-5 h-5 text-rose-600 animate-bounce" />
        ) : (
          <Clock className={`w-5 h-5 ${isWarning ? 'text-amber-600' : 'text-slate-600'}`} />
        )}
        <span>{formatSeconds(secondsLeft)}</span>
      </div>
    </div>
  );
};
