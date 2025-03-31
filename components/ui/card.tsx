import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../utils/cn';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'elevated' | 'bordered';
}

export function Card({ 
  className, 
  children, 
  variant = 'default', 
  ...props 
}: CardProps) {
  
  const variantStyles = {
    default: 'bg-[#0a0a0a]',
    elevated: 'bg-gradient-to-b from-[#0f0f0f] to-[#080808] shadow-xl',
    bordered: 'bg-[#0a0a0a] border border-[#1a1a1a] hover:border-[#252525]'
  };

  return (
    <div 
      className={cn(
        'rounded-xl backdrop-blur-sm',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  className, 
  children, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'px-7 py-5 border-b border-[#1a1a1a]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({ 
  className, 
  children, 
  ...props 
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 
      className={cn(
        'text-lg font-medium tracking-tight text-[#f5f5f5]',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function CardDescription({ 
  className, 
  children, 
  ...props 
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p 
      className={cn(
        'text-sm font-light text-[#a3a3a3] mt-1',
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({ 
  className, 
  children, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'px-7 py-5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardFooter({ 
  className, 
  children, 
  ...props 
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn(
        'px-7 py-5 border-t border-[#1a1a1a]',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
} 