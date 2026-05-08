'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

const LINES: { text: string; color: string }[] = [
  { text: '> Scanning 47,832 repositories...', color: '#a1a1aa' },
  { text: '> Filtering by good-first-issues...', color: '#a1a1aa' },
  { text: '> Matching to your skill level...', color: '#a1a1aa' },
  { text: '> Found 8 perfect repositories ✓', color: '#22c55e' },
  { text: '', color: '' },
  { text: '> react-query/tanstack — 94% match', color: '#e4e4e7' },
  { text: '  Issue: Fix TypeScript generic inference', color: '#52525b' },
  { text: '> supabase/supabase-js — 91% match', color: '#e4e4e7' },
  { text: '  Issue: Improve error messages for auth', color: '#52525b' },
  { text: '> vitejs/vite — 88% match', color: '#e4e4e7' },
  { text: '  Issue: Add missing config docs', color: '#52525b' },
];

const STATS = ['50K+ Repos', '10K+ Issues', 'Free Forever'];

export default function AuthLeftPanel() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    let current = 0;
    let timer: ReturnType<typeof setTimeout>;

    const tick = () => {
      current++;
      if (current > LINES.length) {
        current = 0;
        setVisibleCount(0);
        timer = setTimeout(tick, 1800);
      } else {
        setVisibleCount(current);
        timer = setTimeout(tick, 480);
      }
    };

    timer = setTimeout(tick, 600);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className="w-full h-full flex flex-col relative overflow-hidden"
      style={{
        background: 'linear-gradient(160deg, #0a0a0a 0%, #0b1a0b 45%, #0a0e0a 70%, #0a0a0a 100%)',
      }}
    >
      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)',
          backgroundSize: '50px 50px',
        }}
      />

      {/* Radial glow center */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,197,94,0.05) 0%, transparent 70%)',
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-center px-12 py-12">
        {/* Logo */}
        <div className="mb-12">
          <Link href="/" className="inline-flex mb-2">
            <img src="/logo.svg" alt="Mergly" style={{ height: '36px', width: 'auto' }} />
          </Link>
          <p className="text-[#3f3f46] text-sm">Find your first open source contribution.</p>
        </div>

        {/* Terminal window */}
        <div className="bg-[#0c0c0c] border border-[#1a1a1a] rounded-xl overflow-hidden shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
          {/* Title bar */}
          <div className="flex items-center gap-1.5 px-4 py-3 border-b border-[#161616]">
            <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <div className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-3 text-xs text-[#3f3f46] font-mono tracking-wide">
              mergly — terminal
            </span>
          </div>

          {/* Body */}
          <div className="p-5 font-mono text-sm min-h-[230px]">
            {LINES.slice(0, visibleCount).map((line, i) => (
              <div
                key={`${i}-${visibleCount}`}
                className="leading-6"
                style={{
                  color: line.color || 'transparent',
                  animation: 'fadeIn 0.25s ease both',
                }}
              >
                {line.text || ' '}
              </div>
            ))}
            {/* Blinking cursor */}
            <span
              className="inline-block w-[7px] h-[14px] align-middle cursor-blink"
              style={{ backgroundColor: '#22c55e' }}
            />
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-6 mt-10">
          {STATS.map((stat) => (
            <div key={stat} className="flex items-center gap-2">
              <span className="block w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0 dot-pulse" />
              <span className="text-xs text-[#3f3f46] font-medium">{stat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
