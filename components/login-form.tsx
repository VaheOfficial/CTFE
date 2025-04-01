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
import { useRouter } from 'next/navigation';
import { mcToken } from '../utils/constants';
import Cookies from 'js-cookie';

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const apiService = new ApiService();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    console.log(email, password);
    try {
      setIsLoading(true);
      const response = await apiService.login(email, password);
      
      // Check if the login was successful
      if(response.success === false) {
        toast.error(response.message, {
          position: "top-center",
        });
        return;
      }
      console.log(response.data);
      // Set the token in the Redux store
      Cookies.set(mcToken, response.data.accessToken);
      dispatch(setToken(response.data.accessToken));
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
      router.push('/dashboard');
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