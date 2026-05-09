'use client';

interface Props {
  onDeleteClick: () => void;
}

export function DangerTab({ onDeleteClick }: Props) {
  return (
    <div style={{ animation: 'tabFadeIn 150ms ease' }}>
      <div
        style={{
          border: '1px solid rgba(239,68,68,0.3)',
          background: 'rgba(239,68,68,0.03)',
          borderRadius: 12,
          padding: 24,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#ffffff', marginBottom: 6 }}>Delete Account</h2>
          <p style={{ color: '#a1a1aa', fontSize: 14, maxWidth: 420, lineHeight: 1.6 }}>
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
        </div>
        <button
          onClick={onDeleteClick}
          style={{
            padding: '10px 20px',
            borderRadius: 8,
            border: '1px solid #ef4444',
            background: 'transparent',
            color: '#ef4444',
            fontSize: 14,
            fontWeight: 600,
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'rgba(239,68,68,0.1)'; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'transparent'; }}
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
