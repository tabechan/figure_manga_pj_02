import React from 'react';
import { cn } from './ui/utils';

interface FigureBadgeProps {
  children: React.ReactNode;
  variant?: 'new' | 'popular' | 'recommended' | 'owned' | 'status';
  className?: string;
}

export function FigureBadge({ children, variant = 'new', className }: FigureBadgeProps) {
  const variants = {
    new: "bg-[#22C55E] text-white",
    popular: "bg-[#F59E0B] text-white", 
    recommended: "bg-[#7A5AF8] text-white",
    owned: "bg-[#EEEFFE] text-[#7A5AF8]",
    status: "bg-[#F6F7FB] text-[#555555]"
  };
  
  return (
    <span className={cn(
      "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
}