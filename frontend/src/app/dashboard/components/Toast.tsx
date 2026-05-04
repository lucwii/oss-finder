'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  onClose: () => void;
}

export function Toast({ message, onClose }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
      style={{
        top: '80px',
        right: '24px',
        background: 'linear-gradient(135deg, #ca8a04, #eab308)',
        color: '#000000',
        boxShadow: '0 8px 32px rgba(234,179,8,0.35)',
        animation: 'toast-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        maxWidth: '320px',
      }}
      onClick={onClose}
    >
      {message}
    </div>
  );
}
