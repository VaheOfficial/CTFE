'use client';

import { useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ClassificationBanner } from './classification-banner';

interface ConsentScreenProps {
  onAccept: () => void;
  onDecline: () => void;
}

export function ConsentScreen({ onAccept, onDecline }: ConsentScreenProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onAccept();
    }, 500);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050505] text-[#f5f5f5]">
      <ClassificationBanner level="confidential" />
      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full overflow-hidden" variant="bordered">
          <CardHeader className="border-b border-[#1a1a1a] p-7">
            <CardTitle className="text-xl text-center text-[#f5f5f5] font-mono tracking-wide">
              RESTRICTED ACCESS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-7 space-y-5">
            <div className="flex justify-center mb-5">
              <div className="w-16 h-16 bg-[#0a0a0a] rounded-full border-2 border-[#ff2d55] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-8 h-8 text-[#ff2d55]"
                  aria-labelledby="security-shield-icon"
                >
                  <title id="security-shield-icon">Security Shield</title>
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </div>
            
            <div className="text-center font-mono mb-5">
              <p className="text-lg font-bold text-[#ff2d55]">WARNING</p>
              <p className="text-sm text-[#e0e0e0] mt-1.5">U.S. GOVERNMENT SYSTEM</p>
            </div>
            
            <div className="bg-[#0a0a0a] border border-[#1a1a1a] p-5 rounded-lg text-xs text-[#e0e0e0] leading-relaxed">
              <p>You are accessing a U.S. Government information system, which includes:</p>
              <ol className="list-decimal list-inside mt-2.5 mb-2.5 space-y-1.5">
                <li>This computer and all connected devices</li>
                <li>All related communication networks</li>
                <li>All hardware, software, and data contained within</li>
              </ol>
              <p className="mb-2.5">This information system is provided for U.S. Government-authorized use only. Unauthorized access or use of this system may subject you to criminal prosecution and penalties under Federal Law, including the Computer Fraud and Abuse Act of 1986.</p>
              <p className="mb-2.5">Information on this system is monitored, recorded, and subject to audit. Unauthorized use of this system is prohibited and may be subject to criminal and civil penalties. By using this system, you consent to monitoring and recording of all activity.</p>
              <p>Any information placed or sent through this system may be accessed by authorized U.S. Government personnel for official purposes, including administrative or criminal investigative purposes.</p>
            </div>
            
            <div className="text-center text-xs text-[#a3a3a3] mt-2.5">
              By selecting "ACCEPT" you acknowledge understanding of these terms and provide consent to monitoring.
            </div>
          </CardContent>
          <CardFooter className="border-t border-[#1a1a1a] p-7 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <Button 
              onClick={onDecline}
              variant="outline" 
              className="sm:flex-1 bg-[#1a1a1a] border-[#252525] text-[#e0e0e0] hover:bg-[#ff2d55]/90 hover:text-white uppercase font-medium tracking-wide"
            >
              Decline
            </Button>
            <Button 
              onClick={handleAccept}
              variant="default" 
              className="sm:flex-1 bg-[#00e586] hover:bg-[#00cc55] text-[#050505] border-none uppercase font-medium tracking-wide"
              isLoading={isLoading}
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      </div>
      <ClassificationBanner level="confidential" />
    </div>
  );
} 