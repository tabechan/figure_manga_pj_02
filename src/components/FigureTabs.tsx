import React, { useState } from 'react';
import { cn } from './ui/utils';

interface FigureTabsProps {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

export function FigureTabs({ tabs, activeTab, onTabChange, className }: FigureTabsProps) {
  return (
    <div className={cn("flex border-b border-[#E6E8EF]", className)}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "px-6 py-3 relative transition-colors duration-200",
            activeTab === tab.id
              ? "text-[#7A5AF8]"
              : "text-[#555555] hover:text-[#111111]"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7A5AF8] rounded-full" />
          )}
        </button>
      ))}
    </div>
  );
}