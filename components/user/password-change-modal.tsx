'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { AlertCircle, Eye, EyeOff } from 'lucide-react';
import { ApiService } from '../../lib/api.service';
import { toast } from 'sonner';

// Calculate password strength in bits of entropy
const calculatePasswordStrength = (password: string): { bits: number; label: string; color: string } => {
  if (!password) return { bits: 0, label: 'None', color: 'bg-gray-300' };
  
  // Character set sizes
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasDigit = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9]/.test(password);
  
  // Calculate pool size based on character types used
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasDigit) poolSize += 10;
  if (hasSymbol) poolSize += 33; // Approximate for common symbols
  
  // Shannon entropy formula: bits = log2(poolSize^length)
  // Simplified to: bits = length * log2(poolSize)
  const bits = Math.round(password.length * (Math.log(poolSize) / Math.log(2)));
  
  // Determine strength label and color
  let label: string;
  let color: string;
  if (bits < 40) {
    label = 'Very Weak';
    color = 'bg-red-500';
  } else if (bits < 60) {
    label = 'Weak';
    color = 'bg-orange-500';
  } else if (bits < 80) {
    label = 'Moderate';
    color = 'bg-yellow-500';
  } else if (bits < 100) {
    label = 'Strong';
    color = 'bg-green-500';
  } else {
    label = 'Very Strong';
    color = 'bg-green-600';
  }
  
  return { bits, label, color };
};

interface PasswordChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PasswordChangeModal({ isOpen, onClose }: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiService = React.useMemo(() => new ApiService(), []);
  // Calculate password strength
  const passwordStrength = calculatePasswordStrength(newPassword);
  
  // Track when component is mounted to avoid hydration issues with portals
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);
  
  // Check if passwords match when confirmation changes
  useEffect(() => {
    setPasswordsMatch(confirmPassword === newPassword || confirmPassword === '');
  }, [confirmPassword, newPassword]);
  
  if (!isOpen || !mounted) return null;
  
  const handleCurrentPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentPassword(e.target.value);
    setError(null);
  };
  
  const handleNewPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewPassword(e.target.value);
    setError(null);
  };
  
  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
  };
  
  const handleChangePassword = async () => {
    // Validate inputs
    if (!currentPassword) {
      toast.error('Current password is required', {
        richColors: true,
        position: "top-center",
        description: 'Please enter your current password'
      });
      return;
    }
    
    if (!newPassword) {
      toast.error('New password is required', {
        richColors: true,
        position: "top-center",
        description: 'Please enter a new password'
      });
      return;
    }
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match', {
        richColors: true,
        position: "top-center",
        description: 'Please ensure your passwords match'
      });
      return;
    }
    
    if (currentPassword === newPassword) {
      toast.error('New password must be different from current password', {
        richColors: true,
        position: "top-center",
        description: 'Please use a different password'
      });
      return;
    }
    
    // Check password strength
    if (passwordStrength.bits < 60) {
      toast.error('Password is too weak', {
        richColors: true,
        position: "top-center",
        description: 'Please use a stronger password'
      });
      return;
    }
    
    try {
      // Here you would typically make an API call to change the user's password
      const response = await apiService.changePassword(currentPassword, newPassword);
      
      if(response.success) {
        // Show success toast instead of component state
        toast.success('Password changed successfully', {
          position: "top-center",
          description: 'Your password has been updated.'
        });
        
        handleClose();
      } else {
        // Show error toast for API errors
        toast.error('Password change failed', {
          position: "top-center",
          description: response.message || 'Please ensure your current password is correct.'
        });
        setError(response.message);
      }
    } catch {
      // Handle unexpected errors with toast
      toast.error('Failed to change password', {
        position: "top-center",
        description: 'Please ensure your current password is correct.'
      });
      setError('Failed to change password. Please ensure your current password is correct.');
    }
  };
  
  // Close handler that ensures state is properly reset
  const handleClose = () => {
    onClose();
    // Reset state after modal closes
    setTimeout(() => {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError(null);
    }, 300);
  };
  
  const backdropClickHandler = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  const toggleCurrentPasswordVisibility = () => {
    setShowCurrentPassword((prev) => !prev);
  };
  
  const toggleNewPasswordVisibility = () => {
    setShowNewPassword((prev) => !prev);
  };
  
  const modalContent = (
    <>
      {/* Semi-transparent backdrop */}
      <div className="fixed inset-0 z-[999] bg-black/50 backdrop-blur-md w-screen h-screen" 
        onClick={backdropClickHandler}
        onKeyDown={(e) => {
          if (e.key === 'Escape') handleClose();
        }}
        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
      />
      
      {/* Modal dialog - positioned to avoid footer */}
      <div 
        className="fixed z-[999] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md mx-auto rounded-lg shadow-lg p-6 bg-[#1a1a1a] text-[#f5f5f5] border border-[#2a2a2a]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => {
          e.stopPropagation();
          if (e.key === 'Escape') handleClose();
        }}
        aria-modal="true"
        aria-labelledby="password-change-title"
        style={{ maxHeight: 'calc(100vh - 80px)', overflowY: 'auto' }}
      >
        <div className="mb-4">
          <h2 id="password-change-title" className="text-xl font-semibold">Change Password</h2>
          <p className="text-sm mt-1 text-[#a3a3a3]">
            Update your account password
          </p>
        </div>
        
        {error && (
          <div className="p-4 mb-4 bg-red-500/10 border border-red-500/30 rounded-md text-red-400 flex items-start gap-2">
            <AlertCircle className="h-5 w-5" />
            <div>
              <p className="font-medium">Error</p>
              <p className="text-sm opacity-80">{error}</p>
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          {/* Current password field */}
          <div>
            <Label htmlFor="current-password" className="text-[#e0e0e0] text-sm">
              Current Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="current-password"
                type={showCurrentPassword ? "text" : "password"}
                value={currentPassword}
                onChange={handleCurrentPasswordChange}
                className="font-mono bg-[#121212] border-[#2a2a2a] pr-10"
              />
              <button
                type="button"
                onClick={toggleCurrentPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3]"
                aria-label={showCurrentPassword ? "Hide password" : "Show password"}
              >
                {showCurrentPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          
          {/* New password field */}
          <div>
            <Label htmlFor="new-password" className="text-[#e0e0e0] text-sm">
              New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="new-password"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={handleNewPasswordChange}
                className="font-mono bg-[#121212] border-[#2a2a2a] pr-10"
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3]"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            
            {/* Password strength meter */}
            {newPassword && (
              <div className="mt-2">
                <div className="flex justify-between text-xs">
                  <span>Password strength: {passwordStrength.label}</span>
                  <span>{passwordStrength.bits} bits</span>
                </div>
                <div className="h-1.5 w-full bg-[#2a2a2a] rounded-full mt-1 overflow-hidden">
                  <div
                    className={`h-full ${passwordStrength.color} transition-all`}
                    style={{ width: `${Math.min(100, (passwordStrength.bits / 128) * 100)}%` }}
                  />
                </div>
              </div>
            )}
            
            <div className="mt-2 text-xs text-[#a3a3a3]">
              Password must be at least 12 characters and include uppercase, lowercase, 
              numbers, and special characters.
            </div>
          </div>
          
          {/* Confirm new password field */}
          <div>
            <Label htmlFor="confirm-password" className="text-[#e0e0e0] text-sm">
              Confirm New Password
            </Label>
            <div className="relative mt-1">
              <Input
                id="confirm-password"
                type={showNewPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={handleConfirmPasswordChange}
                className={`font-mono bg-[#121212] border-[#2a2a2a] pr-10 ${
                  !passwordsMatch && confirmPassword !== '' ? "border-red-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={toggleNewPasswordVisibility}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-[#a3a3a3]"
                aria-label={showNewPassword ? "Hide password" : "Show password"}
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {!passwordsMatch && confirmPassword !== '' && (
              <p className="mt-1 text-xs text-red-500">Passwords do not match</p>
            )}
          </div>
          
          <div className="p-3 bg-[#121212] rounded text-sm text-[#a3a3a3]">
            <p>• For security reasons, you&apos;ll need to log in again after changing your password</p>
            <p>• Make sure to use a strong, unique password that you don&apos;t use elsewhere</p>
            <p>• This action will be logged in the system security audit</p>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleClose}
            className="bg-[#121212] border-[#2a2a2a] hover:bg-[#252525] text-[#e0e0e0]"
          >
            Cancel
          </Button>
          <Button 
            type="button"
            onClick={handleChangePassword}
            className="bg-[#ff6b00] hover:bg-[#ff6b00]/80 text-white"
            disabled={!currentPassword || !newPassword || !confirmPassword || !passwordsMatch}
          >
            Change Password
          </Button>
        </div>
      </div>
    </>
  );
  
  // Use createPortal to render the modal at the document root
  return createPortal(
    modalContent,
    document.body
  );
} 