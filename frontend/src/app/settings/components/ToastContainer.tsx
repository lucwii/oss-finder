'use client';

import { CheckCircle, XCircle } from 'lucide-react';
import type { Toast } from '../types';

interface Props {
  toasts: Toast[];
  onRemove: (id: number) => void;
}

export function ToastContainer({ toasts, onRemove }: Props) {
  return (
    <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999, display: 'flex', flexDirection: 'column', gap: 8 }}>
      {toasts.map((t) => (
        <div
          key={t.id}
          onClick={() => onRemove(t.id)}
          style={{
            background: '#111111',
            border: '1px solid #27272a',
            borderLeft: `4px solid ${t.type === 'success' ? '#22c55e' : '#ef4444'}`,
            borderRadius: 8,
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            cursor: 'pointer',
            animation: 'toastIn 300ms ease forwards',
            minWidth: 280,
            maxWidth: 360,
          }}
        >
          {t.type === 'success'
            ? <CheckCircle size={18} color="#22c55e" />
            : <XCircle size={18} color="#ef4444" />}
          <span style={{ color: '#ffffff', fontSize: 14 }}>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
