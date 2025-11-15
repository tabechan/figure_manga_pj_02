import React from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from './ui/utils';

interface FigureListItemProps {
  title: string;
  meta?: string;
  image?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function FigureListItem({ title, meta, image, icon, onClick, className }: FigureListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center p-4 bg-white rounded-[16px] shadow-low cursor-pointer hover:shadow-mid transition-shadow",
        className
      )}
    >
      {image && (
        <div className="w-12 h-12 rounded-[12px] bg-[#F6F7FB] mr-4 flex-shrink-0 overflow-hidden">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      {icon && !image && (
        <div className="w-12 h-12 rounded-[12px] bg-[#F6F7FB] mr-4 flex-shrink-0 flex items-center justify-center text-[#7A5AF8]">
          {icon}
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-[#111111] truncate">{title}</h3>
        {meta && (
          <p className="text-sm text-[#555555] truncate">{meta}</p>
        )}
      </div>
      <ChevronRight className="w-5 h-5 text-[#555555] flex-shrink-0 ml-2" />
    </div>
  );
}