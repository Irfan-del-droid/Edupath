import React from 'react';

interface SectionLabelProps {
  figure?: string;
  title?: string;
  label?: string;
  sub?: string;
  status?: string;
  className?: string;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({
  figure,
  title,
  label,
  sub,
  status,
  className = '',
}) => {
  const displayTitle = title || label || '';
  return (
    <div className={`pb-2 mb-3 rule-b ${className}`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {figure && <span className="label-figure text-accent-blue">{figure}</span>}
          {figure && <span className="text-ink-faint">/</span>}
          <span className="label-figure text-ink">{displayTitle}</span>
        </div>
        {status && (
          <span className="label-figure text-ink-muted text-[10px] tracking-widest bg-paper-subtle px-2 py-0.5 rule-all">
            {status}
          </span>
        )}
      </div>
      {sub && <p className="text-xs text-neutral-500 font-sans mt-1">{sub}</p>}
    </div>
  );
};
