import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Avatar({
  src,
  alt,
  fallback,
  size = 'md',
  className = '',
}: {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}) {
  const [error, setError] = React.useState(false);

  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const getInitials = (name?: string) => {
    if (!name) return 'SS';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden shrink-0 border border-slate-200/80 bg-slate-100 flex items-center justify-center font-bold text-slate-700 select-none',
        sizeClasses[size],
        className
      )}
    >
      {src && !error ? (
        <Image
          src={src}
          alt={alt || 'Avatar'}
          fill
          className="object-cover"
          onError={() => setError(true)}
        />
      ) : (
        <span>{getInitials(fallback || alt)}</span>
      )}
    </div>
  );
}
