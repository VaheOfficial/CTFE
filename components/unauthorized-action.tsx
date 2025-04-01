import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';

interface UnauthorizedActionProps {
  message?: string;
  description?: string;
  actionText?: string;
  actionLink?: string;
}

export function UnauthorizedAction({
  message = "UNAUTHORIZED ACTION",
  description = "You do not have permission to perform this action. This activity requires elevated privileges. This incident will be reported.",
  actionText = "Back to Dashboard",
  actionLink = "/dashboard"
}: UnauthorizedActionProps) {
  return (
    <Card className="max-w-md w-full overflow-hidden mx-auto my-8" variant="bordered">
      <CardHeader className="text-center border-b border-[#1a1a1a] p-6">
        <CardTitle className="text-xl text-[#f5f5f5] font-mono tracking-wide">{message}</CardTitle>
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
              aria-labelledby="unauthorized-icon"
            >
              <title id="unauthorized-icon">Unauthorized</title>
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          </div>
        </div>
        <p className="text-[#e0e0e0] mb-5 font-mono tracking-wide text-lg">
          ACCESS DENIED
        </p>
        <p className="text-[#a3a3a3] text-sm mb-3">
          {description}
        </p>
        <p className="text-[#666666] text-xs">
          If you believe you should have access to this action, please contact your system administrator.
        </p>
      </CardContent>
      <CardFooter className="border-t border-[#1a1a1a] p-6 flex justify-center">
        <Link href={actionLink}>
          <Button className="bg-[#1a1a1a] hover:bg-[#252525] text-[#e0e0e0] border border-[#252525] font-medium tracking-wide uppercase" variant="outline">
            {actionText}
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
} 