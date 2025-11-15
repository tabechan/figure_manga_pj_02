import React from 'react';
import { X, Copy, Check } from 'lucide-react';
import { FigureButton } from './FigureButton';
import { useState } from 'react';

interface QRModalProps {
  isOpen: boolean;
  onClose: () => void;
  qrUrl?: string;
  shareUrl?: string;
}

export function QRModal({ isOpen, onClose, qrUrl, shareUrl }: QRModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyUrl = async () => {
    if (shareUrl) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white rounded-[24px] p-6 w-full max-w-sm shadow-mid"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-medium text-[#111111]">貸出用QRコード</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-[12px] hover:bg-[#F6F7FB] transition-colors"
            >
              <X className="w-5 h-5 text-[#555555]" />
            </button>
          </div>
          
          {/* QR Code */}
          <div className="bg-[#F6F7FB] rounded-[20px] p-8 flex items-center justify-center mb-6">
            {qrUrl ? (
              <img src={qrUrl} alt="QR Code" className="w-48 h-48" />
            ) : (
              <div className="w-48 h-48 bg-white rounded-[16px] flex items-center justify-center border-2 border-dashed border-[#E6E8EF]">
                <div className="text-center">
                  <div className="w-16 h-16 bg-[#7A5AF8] rounded-[12px] mx-auto mb-3 flex items-center justify-center">
                    <div className="w-8 h-8 bg-white rounded-[4px]"></div>
                  </div>
                  <p className="text-sm text-[#555555]">QRコード</p>
                </div>
              </div>
            )}
          </div>
          
          {/* Actions */}
          <div className="space-y-3">
            <FigureButton
              onClick={handleCopyUrl}
              className="w-full"
              variant="secondary"
            >
              {copied ? (
                <><Check className="w-4 h-4 mr-2" /> コピーしました</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> URLをコピー</>
              )}
            </FigureButton>
            
            <p className="text-sm text-[#555555] text-center">
              このQRコードを相手に読み取ってもらうことで、作品を貸し出せます
            </p>
          </div>
        </div>
      </div>
    </>
  );
}