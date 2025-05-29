import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => {
    // Generate a unique ID if none provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    return (
      <div className="w-full">
        {label && (
          <label 
            htmlFor={inputId} 
            className="block text-sm font-normal text-[#e0e0e0] mb-2"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          type={type}
          className={cn(
            "w-full h-11 rounded-lg border bg-[#0f0f0f] border-[#1a1a1a] px-4 py-2.5 text-sm text-[#f5f5f5] placeholder:text-[#666666]",
            "focus:outline-none focus:ring-1 focus:ring-[#ff6b00] focus:border-[#ff6b00]",
            "transition-all duration-200 ease-in-out",
            "hover:border-[#252525]",
            "disabled:opacity-50 disabled:cursor-not-allowed",
            error && "border-[#ff4d4f] focus:ring-[#ff4d4f] focus:border-[#ff4d4f]",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-2 text-sm text-[#ff4d4f]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 