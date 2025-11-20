import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  textClassName?: string;
  imgClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false, textClassName, imgClassName }) => (
  <div className={cn("flex items-center gap-3", className)}>
    <img 
      src="/logo.png" 
      alt="TOMO BUSINESS Logo" 
      className={cn("w-10 h-10 object-contain", imgClassName)}
    />
    
    {!iconOnly && (
      <span className={cn("font-serif font-bold text-lg tracking-tight text-zinc-900", textClassName)}>
        TOMO BUSINESS
      </span>
    )}
  </div>
);