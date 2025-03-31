import React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';

export function Hero() {
  return (
    <div className="relative bg-gradient-to-r from-blue-900 via-indigo-800 to-purple-800 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 z-0 opacity-20">
        <div className="absolute top-0 left-1/4 w-48 h-48 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-xl"></div>
      </div>
      
      <div className="container mx-auto px-4 py-24 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Real-Time Rocket Launch Monitoring
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Access high-frequency radio audio, live video feeds, and real-time 
            weather data from rocket launch facilities around the world.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button variant="primary" size="lg" className="w-full sm:w-auto bg-white text-blue-900 hover:bg-blue-50">
                Get Started
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white text-white hover:bg-white/10">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="w-full h-20 bg-gradient-to-b from-transparent to-white dark:to-gray-900 absolute bottom-0 left-0"></div>
    </div>
  );
} 