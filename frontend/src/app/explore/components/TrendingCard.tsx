'use client';

import { getLanguageBadge, timeAgo } from '@/app/dashboard/utils/helpers';
import type { ScoredRepo } from '../types';

interface TrendingCardProps {
  item: ScoredRepo;
  rank: number;
  popularityPct: number;
}

export function TrendingCard({ item, rank, popularityPct }: TrendingCardProps) {
  const { repo } = item;
  const lang = getLanguageBadge(repo.language);

  return (
    <a
      href={repo.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="block rounded-lg p-3.5"
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        transition: 'border-color 0.15s',
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3f3f46'; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#27272a'; }}
    >
      <div className="flex items-start gap-3">
        {/* Rank + dot */}
        <div className="flex flex-col items-center gap-2 flex-shrink-0 pt-0.5">
          <span
            className="w-2.5 h-2.5 rounded-full flex-shrink-0"
            style={{ background: lang.dot }}
          />
          <span
            className="font-bold leading-none select-none"
            style={{ color: '#555555', fontSize: '22px' }}
          >
            {rank}
          </span>
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <p className="font-bold text-white text-sm truncate mb-1">
            {repo.full_name}
          </p>
          <p className="text-xs mb-0.5" style={{ color: '#a1a1aa' }}>
            ⭐ {repo.stargazers_count.toLocaleString()}
          </p>
          <p className="text-xs" style={{ color: '#555555' }}>
            {timeAgo(repo.updated_at)}
          </p>

          {/* Popularity bar */}
          <div
            className="mt-2.5 rounded-full overflow-hidden"
            style={{ height: '2px', background: '#27272a' }}
          >
            <div
              style={{
                width: `${popularityPct}%`,
                height: '100%',
                background: '#22c55e',
                borderRadius: '9999px',
                transition: 'width 0.5s ease',
              }}
            />
          </div>
        </div>
      </div>
    </a>
  );
}
