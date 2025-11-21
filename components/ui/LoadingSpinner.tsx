import React from 'react';
import { Logo } from './Logo';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
  fullScreen?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, text, fullScreen = false }) => {
  // Full screen loading (like OAuth processing)
  if (fullScreen) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-bounce mb-6">
            <Logo className="scale-150" />
          </div>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
          <p className="mt-6 text-zinc-600 font-medium">{text || 'Loading...'}</p>
        </div>
      </div>
    );
  }

  // If no text, render just the spinner to avoid layout shifts in small containers (like buttons)
  if (!text) {
    return (
      <div className={cn("animate-spin duration-[2000ms] relative", className)}>
        {/* Pass w-full h-full to ensure image fills the container defined by className */}
        <Logo iconOnly imgClassName="w-full h-full object-contain" className="w-full h-full gap-0" />
      </div>
    );
  }

  // Default loading with bouncing logo and dots
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="animate-bounce">
        <Logo className={className || "scale-125"} />
      </div>
      <div className="flex items-center justify-center gap-2">
        <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse"></div>
        <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-zinc-900 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
      </div>
      <p className="text-sm text-zinc-600 font-medium">{text}</p>
    </div>
  );
};