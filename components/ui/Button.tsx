import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  children, 
  ...props 
}) => {
  const variants = {
    // Primary: Deep Black background, White text (Premium/Apple style)
    primary: 'bg-zinc-900 text-white hover:bg-black shadow-sm hover:shadow-md font-medium',
    // Secondary: White background, simple border
    secondary: 'bg-white text-zinc-700 hover:bg-gray-50 border border-zinc-200 shadow-sm',
    // Outline: Transparent with dark border
    outline: 'border border-zinc-300 text-zinc-700 hover:bg-zinc-50',
    // Ghost: Simple text hover
    ghost: 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100',
    // Danger: Subtle red
    danger: 'bg-red-50 text-red-600 border border-red-100 hover:bg-red-100'
  };

  const sizes = {
    sm: 'h-8 px-3 text-xs rounded-md',
    md: 'h-10 px-4 py-2 text-sm rounded-lg',
    lg: 'h-12 px-6 text-base rounded-lg'
  };

  return (
    <button
      className={cn(
        'inline-flex items-center justify-center transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};