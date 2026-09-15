import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'projects' | 'documents' | 'hr' | 'success' | 'warning' | 'outline';
}

export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const base = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase border transition-colors';

  const variants = {
    default: 'bg-slate-800 text-slate-300 border-slate-700',
    projects: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    documents: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    hr: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    outline: 'border-slate-700 text-slate-300',
  };

  return (
    <div className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}
