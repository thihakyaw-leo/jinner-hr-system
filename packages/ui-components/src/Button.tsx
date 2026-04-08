import React, { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className = '',
      variant = 'primary',
      size = 'md',
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-[24px] font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97]';

    const variants = {
      primary: 'bg-gradient-to-r from-sky-500 via-sky-600 to-indigo-600 text-white shadow-[0_12px_30px_rgba(14,165,233,0.3)] hover:shadow-[0_16px_40px_rgba(14,165,233,0.4)] hover:brightness-110',
      secondary: 'bg-white/5 text-slate-100 backdrop-blur-xl border border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.15)] hover:bg-white/10 hover:border-white/20',
      ghost: 'bg-transparent text-slate-300 hover:text-white hover:bg-white/10',
      danger: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-[0_12px_30px_rgba(244,63,94,0.3)] hover:shadow-[0_16px_40px_rgba(244,63,94,0.4)]'
    };

    const sizes = {
      sm: 'px-4 py-2 text-xs uppercase tracking-wider',
      md: 'px-6 py-3 text-sm font-medium',
      lg: 'px-8 py-3.5 text-base font-semibold tracking-wide'
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
