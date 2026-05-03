'use client';

import { useEffect, useState } from 'react';
import { Flame, Star } from 'lucide-react';
import { formatStars, getLanguageBadge } from '../utils/helpers';
import type { TrendingRepo } from '../data/mock-data';

interface TrendingSectionProps {
  trending: TrendingRepo[];
}

export function TrendingSection({ trending }: TrendingSectionProps) {
  // Animate bars from 0 to actual width on mount
  const [barsReady, setBarsReady] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setBarsReady(true), 900);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="rounded-2xl p-6 h-full"
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        animation: 'fade-up 0.5s ease 0.8s both',
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-1">
        <Flame size={18} style={{ color: '#f97316' }} />
        <h2 className="font-bold text-white text-lg">Trending Today</h2>
      </div>
      <p className="text-xs mb-5" style={{ color: '#52525b' }}>
        Most active repositories right now
      </p>

      {/* List */}
      <div className="flex flex-col">
        {trending.map((item, i) => {
          const isHot = i === 0;
          const lang = getLanguageBadge(item.language);
          return (
            <a
              key={item.name}
              href={`https://github.com/${item.name}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-100"
              style={{ animation: `fade-up 0.4s ease ${0.85 + i * 0.05}s both` }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
            >
              {/* Rank */}
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 800,
                  width: '26px',
                  textAlign: 'right',
                  flexShrink: 0,
                  color: isHot ? '#f97316' : '#3f3f46',
                  fontVariantNumeric: 'tabular-nums',
                  lineHeight: 1,
                }}
              >
                {i + 1}
              </span>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <span
                    className="text-sm font-semibold text-white truncate"
                    style={{ maxWidth: '180px' }}
                  >
                    {item.name}
                  </span>
                  {isHot && (
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold flex-shrink-0"
                      style={{
                        background: 'rgba(249,115,22,0.15)',
                        color: '#f97316',
                        border: '1px solid rgba(249,115,22,0.3)',
                      }}
                    >
                      🔥 Hot
                    </span>
                  )}
                </div>

                {/* Match bar */}
                <div className="flex items-center gap-2">
                  <div
                    className="flex-1 rounded-full overflow-hidden"
                    style={{ height: '3px', background: '#27272a' }}
                  >
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: barsReady ? `${item.match_percentage}%` : '0%',
                        background: 'linear-gradient(90deg, #22c55e, #06b6d4)',
                        transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                      }}
                    />
                  </div>
                  <span
                    className="text-xs flex-shrink-0"
                    style={{ color: '#a1a1aa', minWidth: '32px', textAlign: 'right' }}
                  >
                    {item.match_percentage}%
                  </span>
                </div>
              </div>

              {/* Lang + stars */}
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span
                  className="px-2 py-0.5 rounded-full text-xs"
                  style={{ background: lang.bg, color: lang.text }}
                >
                  {item.language}
                </span>
                <span
                  className="flex items-center gap-1 text-xs"
                  style={{ color: '#52525b' }}
                >
                  <Star size={10} style={{ color: '#eab308' }} />
                  {formatStars(item.stars)}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
