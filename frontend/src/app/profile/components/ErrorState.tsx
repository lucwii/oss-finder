'use client';

import { AlertCircle } from 'lucide-react';

export function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 24px', gap: 16, textAlign: 'center' }}>
      <AlertCircle size={48} color="#ef4444" />
      <div>
        <p style={{ color: '#ffffff', fontSize: 18, fontWeight: 600, marginBottom: 6 }}>Failed to load profile</p>
        <p style={{ color: '#a1a1aa', fontSize: 14 }}>Please try again</p>
      </div>
      <button
        onClick={onRetry}
        style={{
          marginTop: 8,
          padding: '10px 24px',
          background: '#22c55e',
          border: 'none',
          borderRadius: 8,
          color: '#000000',
          fontSize: 14,
          fontWeight: 700,
          cursor: 'pointer',
        }}
      >
        Retry
      </button>
    </div>
  );
}
