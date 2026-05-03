'use client';

import { Trophy } from 'lucide-react';
import type { Achievement } from '../data/mock-data';

const ACHIEVEMENT_BORDER: Record<string, string> = {
  first_look:   '#22c55e',
  explorer:     '#3b82f6',
  committed:    '#a855f7',
  issue_hunter: '#f97316',
  contributor:  '#ec4899',
};

interface AchievementsSectionProps {
  achievements: Achievement[];
}

export function AchievementsSection({ achievements }: AchievementsSectionProps) {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        animation: 'fade-up 0.5s ease 0.9s both',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Trophy size={18} style={{ color: '#eab308' }} />
        <h2 className="font-bold text-white text-lg">Achievements</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: '#52525b' }}>
        {unlockedCount}/{achievements.length} unlocked
      </p>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-2">
        {achievements.map((achievement, i) => {
          const borderColor = ACHIEVEMENT_BORDER[achievement.id] ?? '#27272a';
          return (
            <div
              key={achievement.id}
              className="relative p-3 rounded-xl transition-all duration-200 cursor-default select-none"
              style={{
                background: achievement.unlocked ? '#111111' : '#0d0d0d',
                border: `1px solid ${achievement.unlocked ? borderColor : '#1a1a1a'}`,
                opacity: achievement.unlocked ? 1 : 0.5,
                boxShadow: achievement.unlocked ? `0 0 16px ${borderColor}18` : 'none',
                animation: `pop-in 0.4s ease ${0.9 + i * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                if (achievement.unlocked) {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = `0 0 28px ${borderColor}30`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = achievement.unlocked
                  ? `0 0 16px ${borderColor}18`
                  : 'none';
              }}
            >
              {/* Icon */}
              <div className="relative inline-block mb-2">
                <span
                  style={{
                    fontSize: '26px',
                    display: 'block',
                    lineHeight: 1,
                    filter: achievement.unlocked ? 'none' : 'grayscale(1)',
                  }}
                >
                  {achievement.icon}
                </span>
                {!achievement.unlocked && (
                  <div
                    className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ background: '#1a1a1a', fontSize: '8px', lineHeight: 1 }}
                  >
                    🔒
                  </div>
                )}
              </div>

              {/* Name */}
              <p
                className="text-xs font-semibold mb-0.5 truncate"
                style={{ color: achievement.unlocked ? '#ffffff' : '#444444' }}
              >
                {achievement.name}
              </p>

              {/* Description */}
              <p
                className="text-xs leading-tight"
                style={{
                  color: achievement.unlocked ? '#71717a' : '#333333',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {achievement.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
