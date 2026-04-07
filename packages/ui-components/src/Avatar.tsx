import React, { HTMLAttributes } from 'react';

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ className = '', src, fallback, size = 'md', status, ...props }, ref) => {
    const sizeClasses = {
      sm: 'h-8 w-8 text-xs',
      md: 'h-12 w-12 text-sm',
      lg: 'h-16 w-16 text-lg',
      xl: 'h-24 w-24 text-2xl',
    };

    const statusColors = {
      online: 'bg-emerald-500',
      offline: 'bg-slate-500',
      busy: 'bg-rose-500',
      away: 'bg-amber-500',
    };

    const statusSizes = {
      sm: 'h-2.5 w-2.5 border-2',
      md: 'h-3.5 w-3.5 border-2',
      lg: 'h-4 w-4 border-[3px]',
      xl: 'h-5 w-5 border-[3px]',
    };

    return (
      <div className={`relative inline-block ${className}`} ref={ref} {...props}>
        <div
          className={`
            relative flex shrink-0 overflow-hidden rounded-full 
            bg-gradient-to-br from-indigo-500/20 to-blue-500/20 
            border border-white/10 backdrop-blur-md shadow-inner
            ${sizeClasses[size]}
          `}
        >
          {src ? (
            <img
              src={src}
              alt="Avatar"
              className="aspect-square h-full w-full object-cover transition-transform duration-500 hover:scale-110"
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center font-medium tracking-widest text-indigo-200">
              {fallback?.substring(0, 2).toUpperCase() || 'NA'}
            </span>
          )}
        </div>
        {status && (
          <span
            className={`
              absolute bottom-0 right-0 block rounded-full ring-2 ring-transparent
              border-[#0a1128] /* Matches default dark background */
              ${statusColors[status]} 
              ${statusSizes[size]}
            `}
          />
        )}
      </div>
    );
  }
);
Avatar.displayName = 'Avatar';
