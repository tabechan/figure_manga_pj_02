import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';

// Use local worker from node_modules
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
  } catch {
    pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
  }
}

interface PdfCanvasViewerProps {
  pdfUrl: string;
  currentPage: number;
  onPageChange: (page: number) => void;
  onLoadComplete?: (totalPages: number) => void;
}

export const PdfCanvasViewer = ({ 
  pdfUrl, 
  currentPage, 
  onPageChange,
  onLoadComplete 
}: PdfCanvasViewerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const touchStartX = useRef<number>(0);
  const touchEndX = useRef<number>(0);

  useEffect(() => {
    const loadPdf = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const loadingTask = pdfjsLib.getDocument(pdfUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDoc(pdf);
        setTotalPages(pdf.numPages);
        onLoadComplete?.(pdf.numPages);
        setIsLoading(false);
      } catch (err: any) {
        console.error('PDF loading error:', err);
        const errorMessage = err?.message || 'PDFの読み込みに失敗しました';
        setError(`PDFの読み込みに失敗: ${errorMessage}`);
        setIsLoading(false);
      }
    };

    loadPdf();

    return () => {
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [pdfUrl]);

  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return;

    const renderPage = async () => {
      try {
        const page = await pdfDoc.getPage(currentPage);
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!;

        const containerWidth = containerRef.current?.clientWidth || window.innerWidth;
        const containerHeight = containerRef.current?.clientHeight || window.innerHeight;

        const viewport = page.getViewport({ scale: 1 });
        const scale = Math.min(
          containerWidth / viewport.width,
          containerHeight / viewport.height
        );

        const scaledViewport = page.getViewport({ scale });

        canvas.height = scaledViewport.height;
        canvas.width = scaledViewport.width;

        const renderContext = {
          canvasContext: context,
          viewport: scaledViewport,
        };

        await page.render(renderContext as any).promise;
      } catch (err) {
        console.error('Page rendering error:', err);
        setError('ページの描画に失敗しました');
      }
    };

    renderPage();
  }, [pdfDoc, currentPage]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const swipeThreshold = 50;
    const swipeDistance = touchStartX.current - touchEndX.current;

    if (Math.abs(swipeDistance) > swipeThreshold) {
      if (swipeDistance < 0 && currentPage < totalPages) {
        // Left to right swipe = next page (manga reading direction)
        onPageChange(currentPage + 1);
      } else if (swipeDistance > 0 && currentPage > 1) {
        // Right to left swipe = previous page
        onPageChange(currentPage - 1);
      }
    }

    touchStartX.current = 0;
    touchEndX.current = 0;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#1a1a1a]">
        <p className="text-white">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-[#1a1a1a]">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="flex items-center justify-center h-full w-full bg-[#1a1a1a] overflow-hidden"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <canvas 
        ref={canvasRef}
        className="max-w-full max-h-full"
      />
    </div>
  );
};
