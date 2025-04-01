'use client';

import { getInitials, getAvatarColor } from '../../lib/avatar-utils';
import { cn } from '../../lib/utils';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  className?: string;
}

export function Avatar({
  name,
  src,
  size = 'md',
  status,
  className,
}: AvatarProps) {
  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);
  
  // Define size classes
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };
  
  return (
    <div className="relative inline-block">
      <div
        className={cn(
          'flex items-center justify-center rounded-full overflow-hidden',
          sizeClasses[size],
          className
        )}
      >
        {src ? (
          <img
            src={src}
            alt={`${name}'s avatar`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-semibold text-white"
            style={{ backgroundColor: bgColor }}
          >
            {initials}
          </div>
        )}
      </div>
      
      {status && (
        <span
          className={cn(
            'absolute bottom-0 right-0 block rounded-full border-2 border-[#050505]',
            {
              'bg-green-500': status === 'online',
              'bg-red-500': status === 'busy',
              'bg-yellow-500': status === 'away',
              'bg-gray-500': status === 'offline',
            },
            size === 'sm' ? 'w-2.5 h-2.5' : 'w-3 h-3'
          )}
        />
      )}
    </div>
  );
} 