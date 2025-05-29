'use client';

import type React from 'react'; 
import { useState } from 'react';
import Link from 'next/link';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter } from './ui/card';
import { setToken, setRefreshToken, setIsAuthenticated, setError, setSession } from '../redux/authSlice';
import { setUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import { ApiService } from '../lib/api.service';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { mcToken } from '../utils/constants';
import Cookies from 'js-cookie';
import { getCallbackUrl, setAuthCookie } from '../lib/auth-utils';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const searchParams = useSearchParams();
  const apiService = new ApiService();
  
  // Get the callback URL from search params if it exists
  const callbackUrl = searchParams ? getCallbackUrl(searchParams.toString()) : '/dashboard';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const rememberMe = formData.get('remember-me') === 'on';
    
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);
      
      // Check if the login was successful
      if(response.success === false) {
        toast.error(response.message, {
          position: "top-center",
          richColors: true,
        });
        return;
      }
      
      // Set the token in both cookies and Redux store
      const token = response.data.accessToken;
      
      // Set cookie with appropriate expiration (7 days if remember me, session otherwise)
      setAuthCookie(token, rememberMe ? 7 : undefined);
      
      // Set cookies with the JS-cookie library as well for compatibility
      Cookies.set(mcToken, token, { expires: rememberMe ? 7 : undefined });
      
      // Update Redux state
      dispatch(setToken(token));
      dispatch(setSession(response.data.sessionId));
      if (response.data.refreshToken) {
        dispatch(setRefreshToken(response.data.refreshToken));
      }
      dispatch(setIsAuthenticated(true));
      dispatch(setUser(response.data.user));
      
      // Show a success toast
      toast.success('Login successful!', {
        position: "top-center",
        richColors: true,
      });
      
      // Use a delay to ensure state is properly updated before navigation
      setTimeout(() => {
        // Redirect to the callback URL or dashboard
        router.push(callbackUrl);
      }, 100);
    } catch (error) {
      console.error('Login failed:', error);
      dispatch(setError('Invalid email or password'));
      toast.error('Invalid email or password', {
        position: "top-center",
        richColors: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card variant="bordered" className="w-full overflow-hidden">
      <CardContent className="p-7">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-normal text-[#e0e0e0]">
              Employee ID / Email
            </label>
            <Input 
              id="email"
              name="email"
              type="email" 
              placeholder="employee@spaceforce.gov" 
              required 
              className="placeholder:text-[#666666]"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-normal text-[#e0e0e0]">
              Password
            </label>
            <Input 
              id="password"
              name="password"
              type="password" 
              placeholder="••••••••" 
              required 
              className="placeholder:text-[#666666]"
            />
          </div>
          
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-[#1a1a1a] bg-[#0a0a0a] text-[#00e5c7] focus:ring-[#00e5c7] focus:ring-offset-[#0a0a0a]"
              />
              <label 
                htmlFor="remember-me" 
                className="ml-2 block text-sm text-[#a3a3a3] hover:text-[#f5f5f5]"
              >
                Remember me
              </label>
            </div>
            <Link href="/forgot-password" className="text-sm font-medium text-[#a3a3a3] hover:text-[#f5f5f5] transition-colors">
              Forgot password?
            </Link>
          </div>
          
          <Button
            type="submit"
            isLoading={isLoading}
            variant="default"
            className="w-full bg-[#ff6b00] hover:bg-[#ff8533] text-[#050505] border-none font-medium tracking-wide uppercase mt-3"
          >
            Sign In
          </Button>
        </form>
      </CardContent>
      <CardFooter className="p-7 pt-3 border-t border-[#1a1a1a] mt-4">
        <p className="text-center text-xs text-[#666666]">
          This is a secure system for authorized personnel only. Unauthorized access is prohibited.
        </p>
      </CardFooter>
    </Card>
  );
} 