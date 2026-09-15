import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'default', size = 'md', ...props }, ref) => {
    const base = 'inline-flex items-center justify-center font-medium transition focus:outline-none disabled:opacity-50 disabled:pointer-events-none rounded-xl';
    
    const sizes = {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-4 py-2 text-xs',
      lg: 'px-5 py-2.5 text-sm',
    };

    const variants = {
      default: 'bg-blue-600 text-white hover:bg-blue-500 shadow-md shadow-blue-500/20',
      outline: 'border border-slate-700 bg-transparent text-slate-200 hover:bg-slate-800',
      secondary: 'bg-slate-800 text-slate-200 hover:bg-slate-700',
      ghost: 'bg-transparent text-slate-300 hover:bg-slate-800 hover:text-white',
      danger: 'bg-red-600 text-white hover:bg-red-500',
    };

    return (
      <button
        ref={ref}
        className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';
