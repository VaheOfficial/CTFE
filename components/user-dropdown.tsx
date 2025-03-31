import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserDropdown({ isOpen, onClose }: UserDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={dropdownRef}
      className="absolute top-14 right-4 w-56 rounded-md border border-[#1a1a1a] bg-[#0a0a0a] shadow-lg z-50"
    >
      <div className="py-3 px-4 border-b border-[#1a1a1a]">
        <div className="text-sm font-medium text-[#f5f5f5]">John Doe</div>
        <div className="text-xs text-[#a3a3a3]">john.doe@agency.gov</div>
        <div className="mt-1.5 text-[0.65rem] px-1.5 py-0.5 bg-[#ff6b00]/20 text-[#ff6b00] rounded-sm inline-block">
          OPERATOR
        </div>
      </div>
      
      <div className="py-1">
        <Link 
          href="/profile" 
          className="block px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1a1a1a] transition-colors"
        >
          User Profile
        </Link>
        <Link 
          href="/settings" 
          className="block px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1a1a1a] transition-colors"
        >
          Settings
        </Link>
        <Link 
          href="/admin" 
          className="block px-4 py-2 text-sm text-[#e0e0e0] hover:bg-[#1a1a1a] transition-colors"
        >
          Admin Panel
        </Link>
      </div>
      
      <div className="border-t border-[#1a1a1a] py-1">
        <Link 
          href="/login" 
          className="block px-4 py-2 text-sm text-[#ff2d55] hover:bg-[#1a1a1a] transition-colors"
        >
          Sign out
        </Link>
      </div>
    </div>
  );
} 