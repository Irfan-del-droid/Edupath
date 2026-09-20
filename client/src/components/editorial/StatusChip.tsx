import React from 'react';
import { clsx } from 'clsx';

type Priority = 'Critical' | 'High' | 'Medium' | 'Low' | 'verified' | 'in_progress' | 'unassessed' | string;

interface StatusChipProps {
  label: string;
  priority?: Priority;
  className?: string;
}

const priorityStyles: Record<string, string> = {
  Critical: 'bg-red-50 text-red-700 border border-red-200',
  High: 'bg-orange-50 text-orange-700 border border-orange-200',
  Medium: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
  Low: 'bg-paper-subtle text-ink-muted border border-rule',
  verified: 'bg-accent-blueLight text-accent-blue border border-blue-200',
  in_progress: 'bg-paper-subtle text-ink border border-rule',
  unassessed: 'bg-paper-subtle text-ink-muted border border-rule',
  completed: 'bg-accent-blueLight text-accent-blue border border-blue-200',
  submitted: 'bg-paper-subtle text-ink border border-rule',
  evaluated: 'bg-accent-blueLight text-accent-blue border border-blue-200',
};

export const StatusChip: React.FC<StatusChipProps> = ({ label, priority, className }) => {
  const style = priority ? priorityStyles[priority] || priorityStyles.Low : 'bg-paper-subtle text-ink border border-rule';

  return (
    <span className={clsx('label-figure px-2 py-0.5 text-[10px] tracking-widest', style, className)}>
      {label}
    </span>
  );
};
