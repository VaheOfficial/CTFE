import type { ReactNode } from 'react';

interface ClassificationBannerProps {
  level: 'unclassified' | 'confidential' | 'secret' | 'top-secret';
}

export function ClassificationBanner({ level = 'confidential' }: ClassificationBannerProps) {
  const getBannerColor = (): string => {
    switch (level) {
      case 'unclassified':
        return 'bg-[#1a1a1a] border-[#252525] text-[#00e5c7]';
      case 'confidential':
        return 'bg-[#1a1a1a] border-[#252525] text-[#ff6b00]';
      case 'secret':
        return 'bg-[#1a1a1a] border-[#252525] text-[#ff2d55]';
      case 'top-secret':
        return 'bg-[#1a1a1a] border-[#252525] text-[#ffcc00]';
      default:
        return 'bg-[#1a1a1a] border-[#252525] text-[#a3a3a3]';
    }
  };

  const getBannerText = (): string => {
    return level.toUpperCase();
  };
  
  const getSecurityIcon = (): ReactNode => {
    switch (level) {
      case 'unclassified':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-labelledby={`${level}-icon-title`}>
            <title id={`${level}-icon-title`}>Unclassified security level</title>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        );
      case 'confidential':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-labelledby={`${level}-icon-title`}>
            <title id={`${level}-icon-title`}>Confidential security level</title>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        );
      case 'secret':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-labelledby={`${level}-icon-title`}>
            <title id={`${level}-icon-title`}>Secret security level</title>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M12 8v4" />
            <path d="M12 16h.01" />
          </svg>
        );
      case 'top-secret':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" aria-labelledby={`${level}-icon-title`}>
            <title id={`${level}-icon-title`}>Top secret security level</title>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M8 15l2-2 4 4 4-4-2-2" />
            <path d="M8 9l2 2 4-4 4 4-2 2" />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`${getBannerColor()} py-1.5 px-4 text-center font-mono text-xs tracking-wider border-y border-y-2 sticky top-0 z-[1000] font-medium flex items-center justify-center`}>
      <div className="flex justify-center items-center space-x-8">
        <div className="flex items-center space-x-1.5">
          {getSecurityIcon()}
          <span>{getBannerText()}</span>
        </div>
        <span className="text-[#a3a3a3]">{"// AUTHORIZED PERSONNEL ONLY //"}</span>
        <div className="flex items-center space-x-1.5">
          {getSecurityIcon()}
          <span>{getBannerText()}</span>
        </div>
      </div>
    </div>
  );
} 