import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  selected?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hoverable = false,
  selected = false
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border p-5 sm:p-6 transition-all ${
        selected
          ? 'border-secondary-500 ring-2 ring-secondary-500/20 shadow-md bg-secondary-50/20'
          : 'border-slate-200/90 shadow-sm'
      } ${
        hoverable
          ? 'hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
          : ''
      } ${className}`}
    >
      {children}
    </div>
  );
};
