import React from 'react';
import { clsx } from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  showLabel?: boolean;
  color?: 'blue' | 'ink' | 'muted';
  size?: 'sm' | 'md';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  showLabel = false,
  color = 'blue',
  size = 'sm',
  className,
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));
  const trackColor = color === 'blue' ? 'bg-paper-muted' : color === 'ink' ? 'bg-paper-muted' : 'bg-paper-muted';
  const fillColor =
    color === 'blue' ? 'bg-accent-blue' : color === 'ink' ? 'bg-ink' : 'bg-ink-muted';
  const height = size === 'md' ? 'h-1.5' : 'h-0.5';

  return (
    <div className={clsx('flex items-center gap-3', className)}>
      <div className={clsx('flex-1 rounded-none', height, trackColor)}>
        <div
          className={clsx('h-full rounded-none transition-all duration-500', fillColor)}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
      {showLabel && (
        <span className="label-figure text-ink tabular-nums w-8 text-right">{clampedValue}%</span>
      )}
    </div>
  );
};
