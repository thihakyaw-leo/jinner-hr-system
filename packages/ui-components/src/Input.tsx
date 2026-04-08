import React, { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, icon, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    return (
      <div className={`w-full ${className}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="mb-2.5 block pl-1 text-[11px] font-medium uppercase tracking-[0.25em] text-slate-400 group-focus-within:text-sky-300 transition-colors"
          >
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 pt-0 text-slate-400 transition-colors group-focus-within:text-sky-400">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              block w-full rounded-[22px] bg-slate-900/40 border border-white/10 
              text-white placeholder-slate-500 backdrop-blur-xl
              transition-all duration-300 ease-out
              focus:ring-2 focus:ring-sky-500/25 focus:border-sky-400/50 focus:bg-slate-900/60
              hover:bg-slate-950/60 hover:border-white/20
              ${icon ? 'pl-12' : 'pl-5'}
              ${error ? 'border-red-500/30 focus:border-red-500/50 focus:ring-red-500/20' : ''}
              py-3.5 text-sm
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2.5 pl-1 text-xs font-medium tracking-wide text-red-400">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
