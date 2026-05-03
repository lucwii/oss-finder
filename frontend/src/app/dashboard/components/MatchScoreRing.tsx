'use client';

import { useEffect, useState } from 'react';

interface MatchScoreRingProps {
  percentage: number;
  uid?: string; // unique id suffix to avoid duplicate SVG gradient ids
}

export function MatchScoreRing({ percentage, uid = 'default' }: MatchScoreRingProps) {
  const [animated, setAnimated] = useState(false);

  const circumference = 2 * Math.PI * 45; // ≈ 282.74
  const targetOffset = circumference * (1 - percentage / 100);
  const currentOffset = animated ? targetOffset : circumference;
  const gradientId = `ring-grad-${uid}`;

  // Delay matches the spec: 600ms after card appears
  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 600);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative flex items-center justify-center" style={{ width: 120, height: 120 }}>
      <svg width="120" height="120" viewBox="0 0 100 100" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>

        {/* Glow behind ring */}
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="rgba(34, 197, 94, 0.08)"
          strokeWidth="14"
        />

        {/* Track */}
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke="#27272a"
          strokeWidth="8"
        />

        {/* Progress arc — starts from top via rotate(-90 50 50) */}
        <circle
          cx="50" cy="50" r="45"
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={currentOffset}
          transform="rotate(-90 50 50)"
          style={{
            transition: animated ? 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
          }}
        />
      </svg>

      {/* Center label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center"
        style={{ pointerEvents: 'none' }}
      >
        <span style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', lineHeight: 1 }}>
          {percentage}%
        </span>
        <span style={{ fontSize: '10px', color: '#a1a1aa', marginTop: '2px' }}>Match</span>
      </div>
    </div>
  );
}
