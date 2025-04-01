'use client';

import * as React from 'react';

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Checkbox({
  id,
  checked = false,
  onCheckedChange,
  disabled = false,
  className = '',
}: CheckboxProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      onCheckedChange(e.target.checked);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (onCheckedChange && !disabled) {
        onCheckedChange(!checked);
      }
    }
  };

  return (
    <label htmlFor={id} className={`relative inline-flex items-center cursor-pointer ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={`w-4 h-4 border rounded flex items-center justify-center ${
          checked 
            ? 'bg-[#ff6b00] border-[#ff6b00]' 
            : 'bg-transparent border-[#2a2a2a]'
        } ${className}`}
      >
        {checked && (
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2"
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="w-3 h-3 text-white"
            aria-hidden="true"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </div>
    </label>
  );
} 