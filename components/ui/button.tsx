import React from 'react';
import { cn } from '../../utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    children, 
    variant = 'default', 
    size = 'md', 
    isLoading = false,
    disabled,
    ...props 
  }, ref) => {
    const variantStyles = {
      default: 'bg-gray-100 text-gray-900 hover:bg-gray-200 border border-gray-300',
      primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm',
      secondary: 'bg-purple-600 text-white hover:bg-purple-700 shadow-sm',
      outline: 'bg-transparent border border-gray-300 hover:bg-gray-100 text-gray-900',
      ghost: 'bg-transparent hover:bg-gray-100 text-gray-900',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
    };
    
    const sizeStyles = {
      sm: 'text-xs px-2.5 py-1.5 rounded-md',
      md: 'text-sm px-4 py-2 rounded-md',
      lg: 'text-base px-6 py-3 rounded-md',
    };
    
    return (
      <button
        className={cn(
          'font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        disabled={isLoading || disabled}
        ref={ref}
        {...props}
      >
        {isLoading ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            {children}
          </div>
        ) : (
          children
        )}
      </button>
    );
  }
); 