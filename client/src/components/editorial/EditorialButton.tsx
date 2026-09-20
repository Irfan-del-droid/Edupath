import React from 'react';
import { clsx } from 'clsx';

interface EditorialButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export const EditorialButton: React.FC<EditorialButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled,
  ...props
}) => {
  const base = 'inline-flex items-center justify-center font-mono font-semibold tracking-wider text-[11px] uppercase transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed rounded-none';

  const variants = {
    primary: 'bg-ink text-white hover:bg-accent-blue border border-ink hover:border-accent-blue',
    secondary: 'bg-white text-ink border border-ink hover:bg-paper-subtle',
    ghost: 'bg-transparent text-ink border border-rule hover:border-ink',
  };

  const sizes = {
    sm: 'px-3 py-1.5',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3',
  };

  return (
    <button
      className={clsx(base, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
