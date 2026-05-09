'use client';

import { useEffect, useState } from 'react';
import { Eye, GitPullRequest, Flame, Calendar } from 'lucide-react';
import type { FullProfile } from '../types';

function useCountUp(target: number, duration = 1000): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    const start = Date.now();
    const tick = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, duration]);

  return value;
}

function daysSince(dateStr: string): number {
  const ms = Date.now() - new Date(dateStr).getTime();
  return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
}

interface StatCardProps {
  icon: React.ReactNode;
  accentColor: string;
  target: number;
  label: string;
  badge?: React.ReactNode;
  delay: string;
}

function StatCard({ icon, accentColor, target, label, badge, delay }: StatCardProps) {
  const value = useCountUp(target);

  return (
    <div
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        borderTop: `2px solid ${accentColor}`,
        borderRadius: 12,
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 8,
        animation: `fadeUp 400ms ease both`,
        animationDelay: delay,
        transition: 'transform 150ms ease',
        cursor: 'default',
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1.02)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLDivElement).style.transform = 'scale(1)'; }}
    >
      <div style={{ color: accentColor }}>{icon}</div>
      <div>
        <p style={{ fontSize: 28, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>{value}</p>
        {badge}
      </div>
      <p style={{ fontSize: 12, color: '#a1a1aa' }}>{label}</p>
    </div>
  );
}

export function StatsRow({ profile }: { profile: FullProfile }) {
  const memberDays = daysSince(profile.created_at);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }} className="sm:grid-cols-4 grid-cols-2">
      <StatCard
        icon={<Eye size={18} />}
        accentColor="#22c55e"
        target={profile.stats.repos_viewed}
        label="Repos Explored"
        delay="100ms"
      />
      <StatCard
        icon={<GitPullRequest size={18} />}
        accentColor="#a855f7"
        target={profile.stats.issues_clicked}
        label="Issues Viewed"
        delay="150ms"
      />
      <StatCard
        icon={<Flame size={18} />}
        accentColor="#f97316"
        target={profile.stats.days_streak}
        label="Day Streak"
        badge={
          profile.stats.days_streak >= 7 ? (
            <span style={{ fontSize: 11, color: '#f97316', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', borderRadius: 20, padding: '2px 8px', marginLeft: 6 }}>
              🔥 On fire!
            </span>
          ) : undefined
        }
        delay="200ms"
      />
      <StatCard
        icon={<Calendar size={18} />}
        accentColor="#06b6d4"
        target={memberDays}
        label="Days as Member"
        delay="250ms"
      />
    </div>
  );
}
