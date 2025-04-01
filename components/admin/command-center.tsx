import { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { ApiService } from '../../lib/api.service';
import type { GlobalState } from '../../types/global.types';
import type { RootState } from '../../redux/store';
import { useSelector } from 'react-redux';
import { fetchGlobalStates } from '../../utils/global-state-service';

// List of authorized IPs that can perform destructive actions - restricting to local machine only
const AUTHORIZED_IPS = ["192.168.1.10"];

interface CommandCenterProps {
  clientIP: string;
}

export function CommandCenter({ clientIP }: CommandCenterProps) {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [isArmed, setIsArmed] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCheckingGlobalState, setIsCheckingGlobalState] = useState(false);
  const hasCheckedGlobalState = useRef(false);
  const user = useSelector((state: RootState) => state.user.user);

  const isAuthorized = AUTHORIZED_IPS.includes(clientIP);
  const correctCode = 'DESTRUCT-9875';

  useEffect(() => {
    // Only check global state once when access is denied and we haven't checked yet
    if (!isAuthorized && !hasCheckedGlobalState.current && !isCheckingGlobalState) {
      setIsCheckingGlobalState(true);
      hasCheckedGlobalState.current = true;
      
      const apiService = new ApiService();
      const checkAndCreateGlobalState = async () => {
        try {
          // Check if global state exists
          const response = await apiService.getGlobalState();
          let responseContains = false;
          if(response){
            // Check if response.data exists and is an array before using .some()
            responseContains = Array.isArray(response.data) && 
              response.data.some((item: GlobalState) => 
                item.reason && typeof item.reason === 'string' && 
                item.reason.includes('Unauthorized access to command destruct detected')
              );
          }
          // If global state doesn't exist or an error occurred, create a critical state
          if (!response.success || !response.data || !responseContains) {
            const criticalState: GlobalState = {
              _id: null,
              state: "critical",
              reason: `Unauthorized access to command destruct detected from IP: ${clientIP} - on Date: ${new Date().toLocaleString()} - by User: ${user?.name ?? 'Unknown'}`,
              createdAt: null,
              updatedAt: null,
              timeout: null,
              timeoutStop: null,
              associatedUser: user?._id ?? null,
              createdUser: user?._id ?? null
            };
            
            const result = await apiService.createGlobalState(criticalState);
            console.log('Global critical state created due to unauthorized access');
            
            // Force refresh the global state in the warning system
            if (result.success) {
              await fetchGlobalStates();
            }
          } else {
            console.log('Global state already exists, no new state created');
          }
        } catch (err) {
          console.error('Error handling global state:', err);
        } finally {
          setIsCheckingGlobalState(false);
        }
      };
      
      checkAndCreateGlobalState();
    }
  // Remove the dependencies that might cause unnecessary re-renders
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, clientIP, isCheckingGlobalState, user?._id, user?.name]);

  const handleArm = () => {
    if (confirmationCode !== correctCode) {
      setError('Invalid confirmation code');
      return;
    }
    
    setError(null);
    setIsArmed(true);
  };

  const handleAbort = () => {
    setIsArmed(false);
    setCountdown(null);
    setError(null);
    setConfirmationCode('');
  };

  const handleDestruct = () => {
    if (!isArmed) return;
    
    setCountdown(5);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          clearInterval(timer);
          setSuccess(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  if (!isAuthorized) {
    return (
      <div className="p-6">
        <Card variant="bordered" className="border-[#ff2d55]/30 bg-[#ff2d55]/5">
          <CardHeader>
            <CardTitle className="text-[#ff2d55]">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#e0e0e0]">
              Your current terminal (IP: {clientIP}) is not authorized to access the Command Center.
            </p>
            <p className="text-[#a3a3a3] mt-2 text-sm">
              This action has been logged and reported to security personnel.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6">
        <Card variant="bordered" className="border-[#ff2d55] bg-[#ff2d55]/10">
          <CardHeader>
            <CardTitle className="text-[#ff2d55]">Command Executed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-[#ff2d55]" aria-labelledby="warning-icon">
                  <title id="warning-icon">Warning</title>
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
              </div>
              <p className="text-center text-lg font-bold text-[#f5f5f5]">
                Destruct sequence initiated and completed successfully.
              </p>
              <div className="bg-black/50 p-4 font-mono text-sm text-[#e0e0e0] rounded overflow-auto max-h-32">
                <p>[{new Date().toISOString()}] Command executed by {clientIP}</p>
                <p>[{new Date().toISOString()}] Signal sent to flight control</p>
                <p>[{new Date().toISOString()}] Payload separation confirmed</p>
                <p>[{new Date().toISOString()}] Target neutralized</p>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="button"
              className="w-full bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#e0e0e0]"
              onClick={() => {
                setSuccess(false);
                setIsArmed(false);
                setCountdown(null);
                setConfirmationCode('');
              }}
            >
              Return to Command Center
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        <div className="flex items-start space-x-4">
          <div className="bg-[#ff2d55]/20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-[#ff2d55]" aria-labelledby="destruct-icon">
              <title id="destruct-icon">Destruct</title>
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#f5f5f5]">Emergency Destruct Console</h2>
            <p className="text-[#a3a3a3]">
              Authorized terminal: {clientIP}
            </p>
          </div>
        </div>

        <Card variant="bordered" className={`${isArmed ? 'border-[#ff2d55] bg-[#ff2d55]/5' : 'border-[#2a2a2a] bg-[#121212]'}`}>
          <CardHeader>
            <CardTitle className={isArmed ? 'text-[#ff2d55]' : 'text-[#f5f5f5]'}>
              {isArmed ? 'SYSTEM ARMED - CONFIRM DESTRUCT SEQUENCE' : 'Emergency Destruct Authorization'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isArmed ? (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {countdown !== null ? (
                    <div className="text-6xl font-mono font-bold text-[#ff2d55]">
                      {countdown}
                    </div>
                  ) : (
                    <p className="text-center text-[#ff2d55] font-bold">
                      WARNING: This action cannot be undone once initiated
                    </p>
                  )}
                </div>
                
                <div className="bg-black/50 p-3 rounded text-sm text-[#e0e0e0]">
                  <p>• Destructive action will terminate the current mission</p>
                  <p>• All systems on payload will cease operation</p>
                  <p>• This action is logged and audited at the highest levels</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="bg-[#1a1a1a] p-4 rounded-lg">
                  <p className="text-sm text-[#e0e0e0] mb-4">Enter authorization code to arm destruct system:</p>
                  <div className="space-y-2">
                    <Label htmlFor="confirmation-code" className="sr-only">Confirmation Code</Label>
                    <Input 
                      id="confirmation-code"
                      type="text"
                      placeholder="DESTRUCT-XXXX"
                      value={confirmationCode}
                      onChange={(e) => setConfirmationCode(e.target.value.toUpperCase())}
                      className="font-mono bg-[#0a0a0a] border-[#2a2a2a]"
                    />
                    {error && <p className="text-sm text-[#ff2d55]">{error}</p>}
                  </div>
                </div>
                
                <div className="bg-black/50 p-3 rounded text-sm text-[#a3a3a3]">
                  <p>Notice: All actions are logged and attributed to your credentials.</p>
                  <p>Emergency destruct is only to be used in critical situations.</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            {isArmed ? (
              <>
                <Button 
                  type="button"
                  onClick={handleAbort}
                  className="bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#e0e0e0]"
                  disabled={countdown !== null && countdown <= 3}
                >
                  ABORT
                </Button>
                <Button 
                  type="button"
                  onClick={handleDestruct}
                  className="bg-[#ff2d55] hover:bg-[#ff2d55]/80 text-white"
                  disabled={countdown !== null}
                >
                  CONFIRM DESTRUCT
                </Button>
              </>
            ) : (
              <Button 
                type="button"
                onClick={handleArm}
                className="w-full bg-[#ff2d55]/80 hover:bg-[#ff2d55] text-white"
              >
                ARM SYSTEM
              </Button>
            )}
          </CardFooter>
        </Card>

        <div className="mt-6">
          <h3 className="text-md font-medium mb-3">Active Missions</h3>
          <div className="bg-[#121212] p-4 rounded border border-[#2a2a2a]">
            <div className="flex justify-between items-center mb-3 pb-2 border-b border-[#1a1a1a]">
              <div>
                <span className="text-xs bg-green-500/20 text-green-500 px-2 py-1 rounded-full">ACTIVE</span>
                <span className="ml-2 font-medium">FALCON-9 SES-28</span>
              </div>
              <span className="text-xs text-[#a3a3a3]">Launch: 6 hours ago</span>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <span className="text-xs bg-[#ff6b00]/20 text-[#ff6b00] px-2 py-1 rounded-full">PRE-LAUNCH</span>
                <span className="ml-2 font-medium">ATLAS-V NROL-107</span>
              </div>
              <span className="text-xs text-[#a3a3a3]">Launch: T-3 days</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 