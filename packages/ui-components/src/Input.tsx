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
          <label htmlFor={inputId} className="block text-sm font-medium tracking-wide text-slate-300 mb-2 pl-1">
            {label}
          </label>
        )}
        <div className="relative group">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pt-0 pointer-events-none text-slate-400 group-focus-within:text-blue-400 transition-colors">
              {icon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={`
              block w-full rounded-2xl bg-white/5 border border-white/10 
              text-white placeholder-slate-400 backdrop-blur-xl
              transition-all duration-300 ease-out
              focus:ring-2 focus:ring-blue-500/50 focus:border-blue-400 focus:bg-white/10
              hover:bg-white/10 hover:border-white/20
              ${icon ? 'pl-11' : 'pl-4'}
              ${error ? 'border-red-500/50 focus:border-red-500 focus:ring-red-500/50' : ''}
              py-3
            `}
            {...props}
          />
        </div>
        {error && (
          <p className="mt-2 text-sm text-red-400 font-medium pl-1 animate-pulse">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
