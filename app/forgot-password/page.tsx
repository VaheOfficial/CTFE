import { ClassificationBanner } from '../../components/classification-banner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-[#f5f5f5] flex flex-col">
      <ClassificationBanner level="confidential" />
      
      <main className="flex-grow flex items-center justify-center p-4">
        <Card variant="bordered" className="max-w-md w-full">
          <CardHeader className="pb-4 text-center">
            <div className="w-20 h-20 mx-auto mb-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="#ff6b00" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="w-full h-full"
                aria-labelledby="lock-icon-title"
              >
                <title id="lock-icon-title">Lock Icon</title>
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </div>
            <CardTitle className="text-2xl">Password Reset</CardTitle>
            <CardDescription className="text-[#a3a3a3]">
              Security protocols require in-person verification
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6">
            <div className="space-y-4 mb-6">
              <p className="text-[#e0e0e0]">
                For security reasons, password resets cannot be performed online. Please visit the Security Operations Center to reset your credentials.
              </p>
              
              <div className="p-4 bg-[#121212] rounded border border-[#2a2a2a]">
                <h3 className="font-medium text-sm mb-2">Security Operations Center</h3>
                <ul className="text-sm text-[#a3a3a3] space-y-2">
                  <li className="flex items-start">
                    <span className="text-[#ff6b00] mr-2">•</span>
                    <span>Building 1337, Sector C, Room 451</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff6b00] mr-2">•</span>
                    <span>Hours: 0600-2000 hrs, Monday-Friday</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-[#ff6b00] mr-2">•</span>
                    <span>Bring government-issued ID and mission badge</span>
                  </li>
                </ul>
              </div>
              
              <p className="text-sm text-[#a3a3a3]">
                For urgent after-hours assistance, contact the duty officer at extension 42-6173.
              </p>
            </div>
            
            <div className="flex flex-col space-y-3">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Return to Login
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </main>
      
      <footer className="mt-auto fixed bottom-0 w-full">
        <ClassificationBanner level="confidential" />
      </footer>
    </div>
  );
} 