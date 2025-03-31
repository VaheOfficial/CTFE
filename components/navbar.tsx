'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { UserDropdown } from './user-dropdown';

interface NavbarProps {
  isLoggedIn?: boolean;
}

export function Navbar({ isLoggedIn = false }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <header className="bg-[#0a0a0a] border-b border-[#1a1a1a]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-md bg-[#ff6b00] flex items-center justify-center transition-all group-hover:bg-[#ff8533]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
                aria-labelledby="rocket-icon"
              >
                <title id="rocket-icon">Rocket icon</title>
                <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
              </svg>
            </div>
            <span className="font-medium text-[#f5f5f5] tracking-tight">Mission Control</span>
          </Link>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-5">
            <Link 
              href="/admin" 
              className="text-sm text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
            >
              Admin Panel
            </Link>
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="w-9 h-9 rounded-full bg-[#1a1a1a] border border-[#252525] hover:border-[#333333] transition-all flex items-center justify-center text-[#a3a3a3] hover:text-[#f5f5f5]"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                  aria-labelledby="user-icon"
                >
                  <title id="user-icon">User profile</title>
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>
              <UserDropdown isOpen={isDropdownOpen} onClose={closeDropdown} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 