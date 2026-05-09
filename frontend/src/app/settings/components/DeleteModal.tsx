'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ isDeleting, onClose, onConfirm }: Props) {
  const [text, setText] = useState('');

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9998,
        background: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        animation: 'fadeIn 200ms ease',
      }}
    >
      <div
        style={{
          background: '#111111',
          border: '1px solid #27272a',
          borderRadius: 16,
          padding: 32,
          maxWidth: 440,
          width: '100%',
          animation: 'modalIn 200ms ease',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
          alignItems: 'center',
          textAlign: 'center',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AlertTriangle size={28} color="#ef4444" />
        </div>

        <div>
          <h2 style={{ fontSize: 20, fontWeight: 700, color: '#ffffff', marginBottom: 8 }}>Delete your account?</h2>
          <p style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.6 }}>This will permanently delete:</p>
          <ul style={{ color: '#a1a1aa', fontSize: 14, lineHeight: 1.8, textAlign: 'left', paddingLeft: 20, marginTop: 8 }}>
            <li>Your profile and preferences</li>
            <li>Your contribution history</li>
            <li>All your saved repositories</li>
          </ul>
          <p style={{ color: '#ef4444', fontSize: 13, marginTop: 8 }}>This action cannot be undone.</p>
        </div>

        <div style={{ width: '100%' }}>
          <label style={{ color: '#a1a1aa', fontSize: 13, display: 'block', marginBottom: 6, textAlign: 'left' }}>
            Type <span style={{ color: '#ef4444', fontWeight: 600 }}>DELETE</span> to confirm
          </label>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type DELETE here"
            style={{
              width: '100%',
              background: '#0a0a0a',
              border: `1px solid ${text === 'DELETE' ? '#ef4444' : '#27272a'}`,
              borderRadius: 8,
              padding: '10px 14px',
              color: '#ffffff',
              fontSize: 14,
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 200ms ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '10px 0',
              background: 'transparent',
              border: '1px solid #27272a',
              borderRadius: 8,
              color: '#a1a1aa',
              fontSize: 14,
              cursor: 'pointer',
              transition: 'background 200ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#1a1a1a'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={text !== 'DELETE' || isDeleting}
            style={{
              width: '100%',
              padding: '10px 0',
              background: text === 'DELETE' ? '#ef4444' : '#27272a',
              border: 'none',
              borderRadius: 8,
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 600,
              cursor: text === 'DELETE' && !isDeleting ? 'pointer' : 'not-allowed',
              opacity: text !== 'DELETE' ? 0.5 : 1,
              transition: 'all 200ms',
            }}
          >
            {isDeleting ? 'Deleting...' : 'Delete My Account'}
          </button>
        </div>
      </div>
    </div>
  );
}
