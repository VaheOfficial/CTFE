'use client';

import * as React from 'react';

interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

interface DialogContentProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogHeaderProps {
  children: React.ReactNode;
}

interface DialogTitleProps {
  children: React.ReactNode;
}

interface DialogDescriptionProps {
  className?: string;
  children: React.ReactNode;
}

interface DialogFooterProps {
  className?: string;
  children: React.ReactNode;
}

export function Dialog({
  open,
  onOpenChange,
  children,
}: DialogProps) {
  // If dialog is not open, don't render anything
  if (!open) return null;
  
  // Backdrop click handler
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && onOpenChange) {
      onOpenChange(false);
    }
  };
  
  return (
    <div 
      className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
    >
      {children}
    </div>
  );
}

export function DialogContent({
  className = '',
  children,
}: DialogContentProps) {
  // Prevent clicks inside the dialog from closing it
  const handleContentClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };
  
  return (
    <div 
      className={`w-full max-w-md mx-auto rounded-lg shadow-lg p-6 bg-white ${className}`}
      onClick={handleContentClick}
    >
      {children}
    </div>
  );
}

export function DialogHeader({
  children,
}: DialogHeaderProps) {
  return (
    <div className="mb-4">
      {children}
    </div>
  );
}

export function DialogTitle({
  children,
}: DialogTitleProps) {
  return (
    <h2 className="text-xl font-semibold">
      {children}
    </h2>
  );
}

export function DialogDescription({
  className = '',
  children,
}: DialogDescriptionProps) {
  return (
    <p className={`text-sm mt-1 ${className}`}>
      {children}
    </p>
  );
}

export function DialogFooter({
  className = '',
  children,
}: DialogFooterProps) {
  return (
    <div className={`mt-6 flex justify-end gap-3 ${className}`}>
      {children}
    </div>
  );
} 