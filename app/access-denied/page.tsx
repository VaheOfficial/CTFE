'use client';

import React from 'react';
import Link from 'next/link';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { ClassificationBanner } from '../../components/classification-banner';
import { toast } from 'sonner';

export default function AccessDeniedPage() {
  toast.error('You have been reported.', { 
    richColors: true, 
    position: 'top-center',
    duration: 6000,
    icon: '⚠️'
  });
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <ClassificationBanner level="confidential" />
      <div className="flex-1 flex items-center justify-center">
        <Card className="max-w-md w-full overflow-hidden" variant="bordered">
          <CardHeader className="text-center border-b border-[#1a1a1a] p-6">
            <CardTitle className="text-xl text-[#f5f5f5] font-mono tracking-wide">ACCESS DENIED</CardTitle>
          </CardHeader>
          <CardContent className="p-7 text-center">
            <div className="flex justify-center mb-7">
              <div className="w-16 h-16 bg-[#0a0a0a] rounded-full border-2 border-[#ff2d55] flex items-center justify-center">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="1.5" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-[#ff2d55] w-8 h-8"
                  aria-labelledby="access-denied-icon"
                >
                  <title id="access-denied-icon">Access Denied</title>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
              </div>
            </div>
            <p className="text-[#e0e0e0] mb-5 font-mono tracking-wide text-lg">
              ACCESS TO RESTRICTED SYSTEM DENIED
            </p>
            <p className="text-[#a3a3a3] text-sm mb-3">
              You have declined access to the restricted system. Access to this application requires acceptance of the terms.
            </p>
            <p className="text-[#666666] text-xs">
              If you believe you should have access to this system, please contact your system administrator.
            </p>
          </CardContent>
          <CardFooter className="border-t border-[#1a1a1a] p-6 flex justify-center">
            <Link href="/login">
              <Button className="bg-[#1a1a1a] hover:bg-[#252525] text-[#e0e0e0] border border-[#252525] font-medium tracking-wide uppercase" variant="outline">
                Return to Login
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
      <ClassificationBanner level="confidential" />
    </div>
  );
} 