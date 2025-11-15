import React from 'react';
import { ChevronLeft, ChevronRight, ZoomIn, Maximize, Book, Minimize } from 'lucide-react';

interface ViewerControlsProps {
  currentPage: number;
  totalPages: number;
  isFullscreen: boolean;
  isSpread: boolean;
  onPrevPage: () => void;
  onNextPage: () => void;
  onPageJump: (page: number) => void;
  onZoom: () => void;
  onToggleFullscreen: () => void;
  onToggleSpread: () => void;
  visible: boolean;
}

export function ViewerControls({
  currentPage,
  totalPages,
  isFullscreen,
  isSpread,
  onPrevPage,
  onNextPage,
  onPageJump,
  onZoom,
  onToggleFullscreen,
  onToggleSpread,
  visible
}: ViewerControlsProps) {
  if (!visible) return null;

  return (
    <>
      {/* Top Controls */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-[16px] px-4 py-2">
          <span className="text-white text-sm font-medium">
            {currentPage} / {totalPages}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleSpread();
            }}
            className="p-3 bg-black/80 backdrop-blur-sm rounded-[16px] text-white hover:bg-black/90 transition-colors"
          >
            <Book className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onZoom();
            }}
            className="p-3 bg-black/80 backdrop-blur-sm rounded-[16px] text-white hover:bg-black/90 transition-colors"
          >
            <ZoomIn className="w-5 h-5" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFullscreen();
            }}
            className="p-3 bg-black/80 backdrop-blur-sm rounded-[16px] text-white hover:bg-black/90 transition-colors"
          >
            {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Side Navigation - Manga reading direction: left button = next, right button = prev */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNextPage();
        }}
        disabled={currentPage >= totalPages}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 backdrop-blur-sm rounded-[20px] text-white hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onPrevPage();
        }}
        disabled={currentPage <= 1}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-4 bg-black/80 backdrop-blur-sm rounded-[20px] text-white hover:bg-black/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed z-10"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      {/* Bottom Scrub Bar */}
      <div className="absolute bottom-4 left-4 right-4 z-10" onClick={(e) => e.stopPropagation()}>
        <div className="bg-black/80 backdrop-blur-sm rounded-[20px] px-6 py-4">
          <input
            type="range"
            min={1}
            max={totalPages}
            value={currentPage}
            onChange={(e) => onPageJump(parseInt(e.target.value))}
            className="w-full h-2 bg-white/20 rounded-full appearance-none cursor-pointer slider"
          />
        </div>
      </div>
    </>
  );
}