import React from 'react';
import { cn } from './ui/utils';

interface FigureCardProps {
  className?: string;
  children: React.ReactNode;
  elevation?: 'low' | 'mid';
}

export function FigureCard({ className, children, elevation = 'low' }: FigureCardProps) {
  const shadowClass = elevation === 'mid' ? 'shadow-mid' : 'shadow-low';
  
  return (
    <div className={cn(
      "bg-white rounded-[20px] p-6",
      shadowClass,
      className
    )}>
      {children}
    </div>
  );
}

interface FigureCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function FigureCardHeader({ children, className }: FigureCardHeaderProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface FigureCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function FigureCardContent({ children, className }: FigureCardContentProps) {
  return (
    <div className={cn("mb-4", className)}>
      {children}
    </div>
  );
}

interface FigureCardActionsProps {
  children: React.ReactNode;
  className?: string;
}

export function FigureCardActions({ children, className }: FigureCardActionsProps) {
  return (
    <div className={cn("flex gap-3", className)}>
      {children}
    </div>
  );
}