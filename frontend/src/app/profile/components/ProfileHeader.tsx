'use client';

import Link from 'next/link';
import { SlidersHorizontal } from 'lucide-react';
import type { FullProfile } from '../types';

function formatMemberSince(dateStr: string): string {
  const date = new Date(dateStr);
  return `Member since ${date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`;
}

function formatGoal(goal: string): string {
  const map: Record<string, string> = {
    learn:     'Learn New Tech',
    resume:    'Boost Resume',
    community: 'Give Back',
    all:       'All of the Above',
  };
  return map[goal] ?? goal;
}

export function ProfileHeader({ profile }: { profile: FullProfile }) {
  const initials = profile.email
    ? profile.email.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        borderRadius: 16,
        padding: 32,
        animation: 'fadeUp 400ms ease both',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>

        {/* Left — avatar + info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {/* Avatar */}
          <div
            style={{
              width: 96,
              height: 96,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #22c55e, #16a34a)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 36,
              fontWeight: 700,
              color: '#ffffff',
              boxShadow: '0 0 24px rgba(34,197,94,0.3)',
              flexShrink: 0,
            }}
          >
            {initials}
          </div>

          {/* Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <p style={{ fontSize: 20, fontWeight: 700, color: '#ffffff' }}>{profile.email ?? 'Unknown'}</p>
            <p style={{ fontSize: 13, color: '#a1a1aa' }}>{formatMemberSince(profile.created_at)}</p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {profile.experience_years && (
                <span style={{ fontSize: 12, color: '#a1a1aa', background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 20, padding: '4px 12px' }}>
                  {profile.experience_years}
                </span>
              )}
              {profile.goal && (
                <span style={{ fontSize: 12, color: '#a1a1aa', background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 20, padding: '4px 12px' }}>
                  {formatGoal(profile.goal)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right — edit button */}
        <Link
          href="/settings"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '9px 18px',
            background: 'transparent',
            border: '1px solid #27272a',
            borderRadius: 8,
            color: '#a1a1aa',
            fontSize: 13,
            fontWeight: 500,
            textDecoration: 'none',
            transition: 'all 200ms',
            flexShrink: 0,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#22c55e';
            e.currentTarget.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#27272a';
            e.currentTarget.style.color = '#a1a1aa';
          }}
        >
          <SlidersHorizontal size={14} />
          Edit Preferences
        </Link>
      </div>
    </div>
  );
}
