import React, { useState } from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
  textClassName?: string;
  imgClassName?: string;
}

export const Logo: React.FC<LogoProps> = ({ className, iconOnly = false, textClassName, imgClassName }) => {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-10 h-10">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-2 border-zinc-200 border-t-zinc-900 animate-spin" />
          </div>
        )}
        <img 
          src="/logo.png" 
          alt="TOMO BUSINESS Logo" 
          className={cn("w-10 h-10 object-contain transition-opacity duration-300", imgClassName, isLoading ? "opacity-0" : "opacity-100")}
          onLoad={() => setIsLoading(false)}
        />
      </div>
      
      {!iconOnly && (
        <span className={cn("font-serif font-bold text-lg tracking-tight text-zinc-900", textClassName)}>
          TOMO BUSINESS
        </span>
      )}
    </div>
  );
};