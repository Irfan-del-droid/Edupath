import React from 'react';
import { clsx } from 'clsx';

interface EditorialCardProps {
  children: React.ReactNode;
  className?: string;
  noPadding?: boolean;
}

export const EditorialCard: React.FC<EditorialCardProps> = ({ children, className, noPadding }) => {
  return (
    <div className={clsx('bg-white rule-all rounded-none', !noPadding && 'p-5', className)}>
      {children}
    </div>
  );
};

interface MetricCardProps {
  figure?: string;
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  figure,
  label,
  value,
  subtitle,
  accent,
  className,
}) => {
  return (
    <div className={clsx('bg-white rule-all p-5 rounded-none', className)}>
      {figure && <span className="label-figure text-ink-muted block mb-3">{figure}</span>}
      <div
        className={clsx(
          'font-display font-bold leading-none mb-1 tabular-nums',
          accent ? 'text-accent-blue' : 'text-ink',
          typeof value === 'number' && value > 99 ? 'text-4xl' : 'text-5xl'
        )}
      >
        {value}{typeof value === 'number' ? '%' : ''}
      </div>
      <div className="label-figure text-ink mt-2">{label}</div>
      {subtitle && <div className="label-figure text-ink-muted mt-1">{subtitle}</div>}
    </div>
  );
};
