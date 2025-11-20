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
      src="https://z-cdn-media.chatglm.cn/files/260a0018-3a87-4538-a35e-b13bbbe36ec5_cropped_circle_image%20%281%29.png?auth_key=1763566646-dd40c9a9e5b54783b61cb19c9118a90b-0-dc3eeeaa86116f5130e15472cfc679b5" 
      alt="TOMO BUSINESS Logo" 
      className={cn("w-10 h-10 object-contain rounded-full", imgClassName)}
    />
    
    {!iconOnly && (
      <span className={cn("font-serif font-bold text-lg tracking-tight text-zinc-900", textClassName)}>
        TOMO BUSINESS
      </span>
    )}
  </div>
);