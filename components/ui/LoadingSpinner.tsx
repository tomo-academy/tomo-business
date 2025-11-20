import React from 'react';
import { Logo } from './Logo';
import { cn } from '../../lib/utils';

interface LoadingSpinnerProps {
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className, text }) => {
  // If no text, render just the spinner to avoid layout shifts in small containers (like buttons)
  if (!text) {
    return (
      <div className={cn("animate-spin duration-[2000ms] relative", className)}>
        {/* Pass w-full h-full to ensure image fills the container defined by className */}
        <Logo iconOnly imgClassName="w-full h-full object-contain" className="w-full h-full gap-0" />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={cn("animate-spin duration-[2000ms] relative", className)}>
        <Logo iconOnly imgClassName="w-full h-full object-contain" className="w-full h-full gap-0" />
      </div>
      <p className="text-sm text-zinc-500 font-medium animate-pulse">{text}</p>
    </div>
  );
};