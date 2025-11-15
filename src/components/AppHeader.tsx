import React from 'react';
import { Menu, ArrowLeft } from 'lucide-react';

interface AppHeaderProps {
  title?: string;
  avatar?: string;
  onMenuClick?: () => void;
  showBackButton?: boolean;
  onBackClick?: () => void;
}

export function AppHeader({ title, avatar, onMenuClick, showBackButton, onBackClick }: AppHeaderProps) {
  return (
    <header className="flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-b border-[#E6E8EF]">
      <div className="flex items-center space-x-3">
        {showBackButton && onBackClick && (
          <button
            onClick={onBackClick}
            className="p-2 rounded-[12px] hover:bg-[#F6F7FB] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#111111]" />
          </button>
        )}
        {avatar && (
          <div className="w-8 h-8 rounded-full bg-[#F6F7FB] overflow-hidden">
            <img src={avatar} alt="" className="w-full h-full object-cover" />
          </div>
        )}
        {title && (
          <h1 className="font-medium text-[#111111]">{title}</h1>
        )}
      </div>
      
      <button
        onClick={onMenuClick}
        className="p-2 rounded-[12px] hover:bg-[#F6F7FB] transition-colors"
      >
        <Menu className="w-6 h-6 text-[#111111]" />
      </button>
    </header>
  );
}