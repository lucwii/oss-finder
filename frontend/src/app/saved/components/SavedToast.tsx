'use client';

import { X } from 'lucide-react';
import type { Toast } from '../hooks/useSaved';

interface SavedToastContainerProps {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export function SavedToastContainer({ toasts, onRemove }: SavedToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col gap-2 z-50"
      style={{ pointerEvents: 'none' }}
    >
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            background: '#111111',
            border: '1px solid #27272a',
            borderLeft: `4px solid ${toast.type === 'success' ? '#22c55e' : '#ef4444'}`,
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
            animation: 'toastIn 0.3s ease forwards',
            pointerEvents: 'all',
            minWidth: '240px',
            maxWidth: '320px',
          }}
        >
          <span className="text-sm flex-1" style={{ color: '#ffffff' }}>
            {toast.message}
          </span>
          <button
            onClick={() => onRemove(toast.id)}
            className="cursor-pointer transition-colors duration-100 flex-shrink-0"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#a1a1aa'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; }}
          >
            <X size={13} />
          </button>
        </div>
      ))}
    </div>
  );
}
