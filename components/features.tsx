import React from 'react';
import { Card, CardContent } from './ui/card';

const features = [
  {
    title: 'High-Frequency Radio Audio',
    description: 'Listen to real-time radio communications between mission control and rocket systems during launches.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-600">
        <path d="M12 2v20M2 12h20M7 12a5 5 0 0 1 5-5M12 17a5 5 0 0 0 5-5"></path>
      </svg>
    ),
  },
  {
    title: 'Live Video Feeds',
    description: 'Watch high-definition video streams of launch pads from multiple angles with real-time updates.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-indigo-600">
        <rect x="2" y="4" width="20" height="16" rx="2" ry="2"></rect>
        <polygon points="10 10 15 12 10 14"></polygon>
      </svg>
    ),
  },
  {
    title: 'Weather Monitoring',
    description: 'Access comprehensive weather data including wind speed, temperature, precipitation, and atmospheric conditions.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-purple-600">
        <path d="M20 16.2A4.5 4.5 0 0017.5 8h-1.8A7 7 0 104 14.9"></path>
        <path d="M16 14v6"></path>
        <path d="M8 14v6"></path>
        <path d="M12 16v6"></path>
      </svg>
    ),
  },
  {
    title: 'Data Analysis',
    description: 'Powerful tools to analyze telemetry data, compare launches, and generate custom reports.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-blue-600">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>
    ),
  },
  {
    title: 'Secure Access',
    description: 'Enterprise-grade security with role-based access control, data encryption, and secure authentication.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-indigo-600">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0110 0v4"></path>
      </svg>
    ),
  },
  {
    title: 'Historical Archives',
    description: 'Browse a comprehensive archive of past launches with complete data sets for research and analysis.',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-12 h-12 text-purple-600">
        <polyline points="9 11 12 14 22 4"></polyline>
        <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"></path>
      </svg>
    ),
  },
];

export function Features() {
  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Comprehensive Launch Monitoring
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Our platform provides partners with advanced tools to monitor and analyze rocket launches in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} variant="elevated" className="border border-gray-100 dark:border-gray-800 transition-all duration-200 hover:shadow-xl">
              <CardContent className="p-8 flex flex-col items-center text-center">
                <div className="mb-5 p-2 rounded-full bg-blue-50 dark:bg-blue-900/20">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
} 