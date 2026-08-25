'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DropdownContextValue {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DropdownContext = React.createContext<DropdownContextValue | null>(null);

export function DropdownMenu({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [open]);

  return (
    <DropdownContext.Provider value={{ open, setOpen }}>
      <div ref={containerRef} className="relative inline-block text-left">
        {children}
      </div>
    </DropdownContext.Provider>
  );
}

export function DropdownMenuTrigger({
  asChild,
  children,
  className,
}: {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuTrigger must be used within DropdownMenu');

  return (
    <div
      onClick={() => context.setOpen((prev) => !prev)}
      className={cn('cursor-pointer inline-flex items-center', className)}
    >
      {children}
    </div>
  );
}

export function DropdownMenuContent({
  align = 'end',
  children,
  className,
}: {
  align?: 'start' | 'end' | 'center';
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DropdownContext);
  if (!context) throw new Error('DropdownMenuContent must be used within DropdownMenu');

  if (!context.open) return null;

  const alignmentClass =
    align === 'end'
      ? 'right-0'
      : align === 'start'
      ? 'left-0'
      : 'left-1/2 -translate-x-1/2';

  return (
    <div
      className={cn(
        'absolute z-50 mt-2 min-w-[200px] rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl animate-in fade-in-80 zoom-in-95',
        alignmentClass,
        className
      )}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({
  onClick,
  children,
  className,
  destructive = false,
}: {
  onClick?: () => void;
  children: React.ReactNode;
  className?: string;
  destructive?: boolean;
}) {
  const context = React.useContext(DropdownContext);

  const handleClick = () => {
    onClick?.();
    context?.setOpen(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={cn(
        'w-full flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors text-left select-none cursor-pointer',
        destructive
          ? 'text-rose-600 hover:bg-rose-50 hover:text-rose-700'
          : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900',
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownMenuSeparator({ className }: { className?: string }) {
  return <div className={cn('-mx-1 my-1 h-px bg-slate-100', className)} />;
}
