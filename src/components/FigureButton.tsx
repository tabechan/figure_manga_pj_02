import React from 'react';
import { cn } from './ui/utils';

interface FigureButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'line';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function FigureButton({ 
  variant = 'primary', 
  size = 'md', 
  className, 
  children, 
  ...props 
}: FigureButtonProps) {
  const baseClasses = "btn-3d rounded-[20px] transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-[#7A5AF8] text-white hover:bg-[#6B4EF2]",
    secondary: "bg-white text-[#111111] border border-[#E6E8EF] hover:bg-[#F6F7FB]",
    line: "bg-[#00C300] text-white hover:bg-[#00AA00]"
  };
  
  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3",
    lg: "px-8 py-4 text-lg"
  };
  
  return (
    <button
      className={cn(
        baseClasses,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}