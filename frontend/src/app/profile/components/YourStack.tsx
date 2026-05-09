'use client';

import Link from 'next/link';
import { Code } from 'lucide-react';
import { LANGUAGE_COLORS } from '../types';
import type { FullProfile } from '../types';

const INTEREST_EMOJIS: Record<string, string> = {
  'Web Development': '🌐',
  'AI & ML':         '🤖',
  'Developer Tools': '🛠️',
  'Mobile':          '📱',
  'CLI & Terminal':  '⌨️',
  'Documentation':   '📚',
  'Testing':         '🧪',
  'Databases':       '🗄️',
  'Security':        '🔒',
  'Cloud & DevOps':  '☁️',
};

function EmptySlot() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <p style={{ color: '#52525b', fontSize: 13 }}>Nothing set yet</p>
      <Link href="/settings" style={{ color: '#22c55e', fontSize: 13, textDecoration: 'none' }}>
        Update in Settings →
      </Link>
    </div>
  );
}

export function YourStack({ profile }: { profile: FullProfile }) {
  return (
    <div style={{ animation: 'fadeUp 400ms ease both', animationDelay: '300ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Code size={18} color="#a1a1aa" />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Your Stack</h2>
      </div>

      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>

        {/* Languages */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: 12, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Languages</p>
          {profile.languages?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.languages.map((lang) => {
                const colors = LANGUAGE_COLORS[lang] ?? { bg: '#1a1a2e', text: '#a855f7' };
                return (
                  <span
                    key={lang}
                    style={{
                      background: colors.bg,
                      color: colors.text,
                      fontSize: 13,
                      fontWeight: 500,
                      padding: '8px 14px',
                      borderRadius: 8,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: colors.text, display: 'inline-block', flexShrink: 0 }} />
                    {lang}
                  </span>
                );
              })}
            </div>
          ) : <EmptySlot />}
        </div>

        {/* Divider */}
        <div style={{ width: 1, background: '#27272a', alignSelf: 'stretch' }} />

        {/* Interests */}
        <div style={{ flex: 1, minWidth: 200 }}>
          <p style={{ fontSize: 12, color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12, fontWeight: 600 }}>Interests</p>
          {profile.interests?.length > 0 ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {profile.interests.map((interest) => (
                <span
                  key={interest}
                  style={{
                    background: '#1a1a1a',
                    border: '1px solid #27272a',
                    color: '#a1a1aa',
                    fontSize: 13,
                    padding: '6px 12px',
                    borderRadius: 8,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  {INTEREST_EMOJIS[interest] ?? '•'}
                  {interest}
                </span>
              ))}
            </div>
          ) : <EmptySlot />}
        </div>
      </div>
    </div>
  );
}
