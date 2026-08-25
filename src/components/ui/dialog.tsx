'use client';

import * as React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

interface DialogContextValue {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}) {
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </DialogContext.Provider>
  );
}

export function DialogContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const context = React.useContext(DialogContext);
  if (!context) throw new Error("DialogContent must be used within Dialog");

  if (!context.open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
        onClick={() => context.onOpenChange(false)}
      />

      {/* Modal Card */}
      <div
        className={cn(
          "relative z-50 w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl transition-all max-h-[90vh] overflow-y-auto",
          className
        )}
      >
        <button
          type="button"
          onClick={() => context.onOpenChange(false)}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>
        {children}
      </div>
    </div>
  );
}

export function DialogHeader({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col space-y-1.5 text-left mb-4", className)}>
      {children}
    </div>
  );
}

export function DialogTitle({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <h2 className={cn("text-xl font-bold tracking-tight text-slate-900", className)}>
      {children}
    </h2>
  );
}

export function DialogDescription({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <p className={cn("text-sm text-slate-500", className)}>
      {children}
    </p>
  );
}

export function DialogFooter({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-6", className)}>
      {children}
    </div>
  );
}
