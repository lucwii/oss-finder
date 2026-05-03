'use client';

import { useEffect, useState } from 'react';
import { Eye, Flame, GitPullRequest } from 'lucide-react';
import type { User } from '@supabase/supabase-js';
import type { Stats } from '../data/mock-data';

interface HeroHeaderProps {
  user: User | null;
  stats: Stats;
  repoCount: number;
}

function useCountUp(target: number, delay: number): number {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (target === 0) return;
    let intervalId: ReturnType<typeof setInterval>;
    const timeoutId = setTimeout(() => {
      let current = 0;
      const step = Math.max(1, Math.ceil(target / 30));
      intervalId = setInterval(() => {
        current = Math.min(current + step, target);
        setValue(current);
        if (current >= target) clearInterval(intervalId);
      }, 33);
    }, delay);
    return () => {
      clearTimeout(timeoutId);
      clearInterval(intervalId);
    };
  }, [target, delay]);

  return value;
}

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning,';
  if (h < 17) return 'Good afternoon,';
  return 'Good evening,';
}

const BUBBLES = [
  {
    key: 'repos',
    label: 'Repos Explored',
    Icon: Eye,
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.08)',
    border: 'rgba(34,197,94,0.25)',
    glow: 'rgba(34,197,94,0.12)',
    float: 'float-1',
    dur: '3s',
    delay: 300,
  },
  {
    key: 'issues',
    label: 'Issues Viewed',
    Icon: GitPullRequest,
    color: '#a855f7',
    bg: 'rgba(168,85,247,0.08)',
    border: 'rgba(168,85,247,0.25)',
    glow: 'rgba(168,85,247,0.12)',
    float: 'float-2',
    dur: '4s',
    delay: 500,
  },
  {
    key: 'streak',
    label: 'Day Streak',
    Icon: Flame,
    color: '#f97316',
    bg: 'rgba(249,115,22,0.08)',
    border: 'rgba(249,115,22,0.25)',
    glow: 'rgba(249,115,22,0.12)',
    float: 'float-3',
    dur: '3.5s',
    delay: 700,
  },
];

export function HeroHeader({ user, stats, repoCount }: HeroHeaderProps) {
  const reposCount   = useCountUp(stats.repos_viewed, 300);
  const issuesCount  = useCountUp(stats.issues_clicked, 500);
  const streakCount  = useCountUp(stats.days_streak, 700);

  const counts = { repos: reposCount, issues: issuesCount, streak: streakCount };
  const displayName =
    (user?.user_metadata?.username as string | undefined) ??
    user?.email?.split('@')[0] ??
    'developer';

  return (
    <section
      className="relative overflow-hidden pt-28 pb-10 px-4 sm:px-6"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(34,197,94,0.07) 0%, transparent 70%)',
        animation: 'fadeIn 0.6s ease both',
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-10">
        {/* Left content */}
        <div className="flex-1 min-w-0">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-5"
            style={{
              background: 'rgba(34,197,94,0.08)',
              border: '1px solid rgba(34,197,94,0.2)',
              color: '#22c55e',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 dot-pulse" />
            ✦ Updated today
          </div>

          {/* Greeting */}
          <div className="mb-4">
            <p
              className="font-bold leading-tight"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)', color: '#ffffff' }}
            >
              {getGreeting()}
            </p>
            <p
              className="font-bold leading-tight gradient-text"
              style={{ fontSize: 'clamp(32px, 5vw, 52px)' }}
            >
              {displayName}
            </p>
          </div>

          {/* Subtext */}
          <p style={{ color: '#a1a1aa', fontSize: '16px', lineHeight: 1.6 }}>
            You have{' '}
            <span style={{ color: '#22c55e', fontWeight: 600 }}>
              {repoCount} fresh repositories
            </span>{' '}
            waiting for you
          </p>
        </div>

        {/* Stat bubbles — desktop */}
        <div className="hidden lg:flex items-end gap-4 flex-shrink-0">
          {BUBBLES.map((b, i) => {
            const { Icon } = b;
            const val = counts[b.key as keyof typeof counts];
            return (
              <div
                key={b.key}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl"
                style={{
                  background: b.bg,
                  border: `1px solid ${b.border}`,
                  boxShadow: `0 0 30px ${b.glow}`,
                  minWidth: '130px',
                  animation: `fadeIn 0.6s ease ${0.3 + i * 0.15}s both, ${b.float} ${b.dur} ease-in-out ${i * 0.5}s infinite`,
                }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: `${b.bg}` }}
                >
                  <Icon size={20} style={{ color: b.color }} />
                </div>
                <span style={{ fontSize: '34px', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
                  {val}
                </span>
                <span
                  style={{ fontSize: '12px', color: '#a1a1aa', textAlign: 'center', lineHeight: 1.4 }}
                >
                  {b.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Stat row — mobile only */}
      <div
        className="flex lg:hidden gap-3 overflow-x-auto horizontal-scroll pb-2 mt-6"
      >
        {BUBBLES.map((b) => {
          const { Icon } = b;
          const val = counts[b.key as keyof typeof counts];
          return (
            <div
              key={b.key}
              className="flex-shrink-0 flex items-center gap-2.5 px-4 py-3 rounded-xl"
              style={{
                background: b.bg,
                border: `1px solid ${b.border}`,
              }}
            >
              <Icon size={16} style={{ color: b.color }} />
              <span style={{ fontSize: '20px', fontWeight: 800, color: '#fff' }}>{val}</span>
              <span style={{ fontSize: '11px', color: '#a1a1aa', whiteSpace: 'nowrap' }}>
                {b.label}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
