import React from 'react';
import { X, BookOpen, User, Shield, FileText } from 'lucide-react';
import { cn } from './ui/utils';

interface DrawerMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (screen: 'works' | 'account' | 'privacy-policy' | 'terms-of-service') => void;
}

export function DrawerMenu({ isOpen, onClose, onNavigate }: DrawerMenuProps) {
  const menuItems = [
    { id: 'works' as const, label: '作品一覧', icon: BookOpen },
    { id: 'account' as const, label: 'アカウント', icon: User },
    { id: 'privacy-policy' as const, label: 'プライバシーポリシー', icon: Shield },
    { id: 'terms-of-service' as const, label: '利用規約', icon: FileText }
  ];

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={cn(
        "fixed top-0 right-0 h-full w-80 bg-white/95 backdrop-blur-md z-50 transform transition-transform duration-300",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-medium text-[#111111]">メニュー</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-[12px] hover:bg-[#F6F7FB] transition-colors"
            >
              <X className="w-6 h-6 text-[#111111]" />
            </button>
          </div>
          
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onNavigate(item.id);
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 p-4 rounded-[16px] hover:bg-[#EEEFFE] transition-colors text-left"
                >
                  <Icon className="w-5 h-5 text-[#7A5AF8]" />
                  <span className="text-[#111111]">{item.label}</span>
                </button>
              );
            })}
          </nav>
          
          <div className="mt-8 pt-6 border-t border-[#7A5AF8]/20">
            <p className="text-sm text-[#555555] text-center">
              Figure-Linked Comics
            </p>
          </div>
        </div>
      </div>
    </>
  );
}