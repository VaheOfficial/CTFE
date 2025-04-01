'use client';

import { useState } from 'react';
import Link from 'next/link';
import { UserDropdown } from './user-dropdown';
import { Avatar } from './ui/avatar';

interface NavbarProps {
  isLoggedIn?: boolean;
  isAdmin?: boolean;
}

export function Navbar({ isLoggedIn = false, isAdmin = false }: NavbarProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  // User data - in a real app would come from authentication context
  const user = {
    name: "John Doe",
    email: "john.doe@agency.gov",
    role: isAdmin ? "Administrator" : "Operator"
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
            {isAdmin && (
              <Link 
                href="/admin" 
              className="text-sm text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors"
            >
                Admin Panel
              </Link>
            )}
            <div className="relative">
              <button
                type="button"
                onClick={toggleDropdown}
                className="hover:border-[#333333] transition-all flex items-center justify-center text-[#a3a3a3] hover:text-[#f5f5f5]"
                aria-expanded={isDropdownOpen}
                aria-haspopup="true"
              >
                <Avatar name={user.name} size="sm" />
              </button>
              <UserDropdown isOpen={isDropdownOpen} onClose={closeDropdown} isAdmin={isAdmin} />
            </div>
          </div>
        )}
      </div>
    </header>
  );
} 