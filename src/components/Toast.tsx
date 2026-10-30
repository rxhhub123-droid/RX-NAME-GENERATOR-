import React from 'react';
import { Check } from 'lucide-react';
import { BRAND_NAME } from '../data/styles';

interface ToastProps {
  message: string | null;
  submessage?: string;
}

export const Toast: React.FC<ToastProps> = ({ message, submessage = BRAND_NAME }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
      <div className="bg-[#141419]/95 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3.5 shadow-2xl shadow-black flex items-center gap-3.5 min-w-[280px] max-w-[90vw]">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white bg-gradient-to-br from-[#ff5a6a] via-[#e11d2e] to-[#8f0d1c] shadow-lg shadow-red-600/40 shrink-0">
          <Check className="w-5 h-5 stroke-[2.5]" />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-white tracking-wide truncate">{message}</p>
          <p className="text-xs text-[#9494a0] font-medium truncate">{submessage}</p>
        </div>
      </div>
    </div>
  );
};
