'use client';

import { Lock, Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../types';
import type { FullProfile } from '../types';

export function Achievements({ profile }: { profile: FullProfile }) {
  const unlockedCount = ACHIEVEMENTS.filter((a) => a.unlockedWhen(profile.stats)).length;

  return (
    <div style={{ animation: 'fadeUp 400ms ease both', animationDelay: '200ms' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={18} color="#eab308" />
          <h2 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Achievements</h2>
        </div>
        <span style={{ fontSize: 13, color: '#a1a1aa' }}>
          {unlockedCount} / {ACHIEVEMENTS.length} unlocked
        </span>
      </div>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12 }} className="sm:grid-cols-5 grid-cols-2">
        {ACHIEVEMENTS.map((achievement, i) => {
          const unlocked = achievement.unlockedWhen(profile.stats);
          return (
            <div
              key={achievement.id}
              title={unlocked ? undefined : `Requires: ${achievement.requirement}`}
              style={{
                background: unlocked ? '#111111' : '#0d0d0d',
                border: `1px solid ${unlocked ? 'rgba(34,197,94,0.6)' : '#1a1a1a'}`,
                borderRadius: 12,
                padding: 20,
                opacity: unlocked ? 1 : 0.6,
                boxShadow: unlocked ? '0 0 16px rgba(34,197,94,0.1)' : 'none',
                transition: 'transform 200ms ease, box-shadow 200ms ease',
                cursor: 'default',
                position: 'relative',
                animation: `fadeUp 400ms ease both`,
                animationDelay: `${200 + i * 50}ms`,
              }}
              onMouseEnter={(e) => {
                if (unlocked) (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.03)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)';
              }}
            >
              {/* Unlocked badge */}
              {unlocked && (
                <div style={{ position: 'absolute', top: 12, right: 12 }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: '#22c55e', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: 20, padding: '2px 8px' }}>
                    ✓ Unlocked
                  </span>
                </div>
              )}

              {/* Emoji with optional lock */}
              <div style={{ position: 'relative', display: 'inline-block', marginBottom: 10 }}>
                <span style={{ fontSize: 36, filter: unlocked ? 'none' : 'grayscale(1)' }}>
                  {achievement.icon}
                </span>
                {!unlocked && (
                  <div style={{ position: 'absolute', bottom: -2, right: -6, background: '#1a1a1a', border: '1px solid #27272a', borderRadius: '50%', width: 18, height: 18, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Lock size={10} color="#555555" />
                  </div>
                )}
              </div>

              <p style={{ fontSize: 14, fontWeight: 600, color: unlocked ? '#ffffff' : '#555555', marginBottom: 4 }}>
                {achievement.name}
              </p>
              <p style={{ fontSize: 12, color: unlocked ? '#a1a1aa' : '#333333', lineHeight: 1.5 }}>
                {achievement.description}
              </p>

              {!unlocked && (
                <p style={{ fontSize: 11, color: '#444444', marginTop: 8 }}>
                  Requires: {achievement.requirement}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
