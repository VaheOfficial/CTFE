import { ClassificationBanner } from '../../components/classification-banner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import Link from 'next/link';

export default function MaintenancePage() {
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
                aria-labelledby="maintenance-icon-title"
              >
                <title id="maintenance-icon-title">Maintenance Tool Icon</title>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
              </svg>
            </div>
            <CardTitle className="text-2xl">System Maintenance</CardTitle>
            <CardDescription className="text-[#a3a3a3]">
              The system is currently undergoing scheduled maintenance
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-6 text-center">
            <p className="mb-6 text-[#e0e0e0]">
              We are performing critical updates to improve system stability and security. 
              The system will be back online shortly.
            </p>
            <div className="flex flex-col space-y-3">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Try Again Later
                </Button>
              </Link>
              <Link href="mailto:support@mission-control.gov">
                <Button variant="ghost" className="w-full text-[#a3a3a3]">
                  Contact Support
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