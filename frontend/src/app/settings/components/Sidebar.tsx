'use client';

import { SlidersHorizontal, Lock, AlertTriangle, ChevronRight } from 'lucide-react';

export type TabKey = 'preferences' | 'security' | 'danger';

const TABS: { key: TabKey; label: string; icon: React.ElementType }[] = [
  { key: 'preferences', label: 'Preferences', icon: SlidersHorizontal },
  { key: 'security',    label: 'Security',     icon: Lock },
  { key: 'danger',      label: 'Danger Zone',  icon: AlertTriangle },
];

interface Props {
  activeTab: TabKey;
  onChange: (tab: TabKey) => void;
}

export function Sidebar({ activeTab, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4, width: '100%' }}>
      {TABS.map(({ key, label, icon: Icon }) => {
        const isActive = activeTab === key;
        const isDanger = key === 'danger';
        const activeColor = isDanger ? '#ef4444' : '#22c55e';

        return (
          <button
            key={key}
            onClick={() => onChange(key)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 14px',
              borderRadius: 8,
              border: 'none',
              borderLeft: `3px solid ${isActive ? activeColor : 'transparent'}`,
              background: isActive ? '#1a1a1a' : 'transparent',
              color: isDanger ? '#ef4444' : isActive ? '#ffffff' : '#a1a1aa',
              fontSize: 14,
              fontWeight: isActive ? 600 : 400,
              cursor: 'pointer',
              transition: 'all 150ms',
              textAlign: 'left',
              width: '100%',
            }}
            onMouseEnter={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = '#111111';
            }}
            onMouseLeave={(e) => {
              if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = 'transparent';
            }}
          >
            <Icon size={16} />
            {label}
            {isActive && <ChevronRight size={14} style={{ marginLeft: 'auto' }} />}
          </button>
        );
      })}
    </div>
  );
}
