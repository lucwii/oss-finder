'use client';

import { TrendingUp } from 'lucide-react';
import { getLanguageBadge } from '@/app/dashboard/utils/helpers';
import { TrendingCard } from './TrendingCard';
import { TrendingSkeleton } from './SkeletonLoaders';
import type { ScoredRepo } from '../types';

interface TrendingSectionProps {
  trendingByLanguage: { language: string; repos: ScoredRepo[] }[];
  loading: boolean;
}

const POPULARITY_PCTS = [100, 66, 33];

export function TrendingSection({ trendingByLanguage, loading }: TrendingSectionProps) {
  const visible = trendingByLanguage.filter((g) => g.repos.length > 0);

  return (
    <section style={{ animation: 'fade-up 0.5s ease 0.2s both' }}>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">Trending in your languages</h2>
        <TrendingUp size={16} style={{ color: '#f97316' }} />
      </div>

      {loading ? (
        <TrendingSkeleton />
      ) : visible.length === 0 ? null : (
        <div className="space-y-8">
          {visible.map((group, gi) => {
            const lang = getLanguageBadge(group.language);
            return (
              <div key={group.language}>
                {gi > 0 && (
                  <div
                    style={{ height: '1px', background: '#27272a', marginBottom: '24px' }}
                  />
                )}

                {/* Language sub-header */}
                <div className="flex items-center gap-2 mb-4">
                  <span
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: lang.bg, color: lang.text }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
                    {group.language}
                  </span>
                  <span className="text-sm font-medium text-white">
                    Trending in {group.language}
                  </span>
                </div>

                {/* Cards — horizontal scroll on small screens */}
                <div className="overflow-x-auto horizontal-scroll pb-1">
                  <div className="grid grid-cols-3 gap-3" style={{ minWidth: '480px' }}>
                    {group.repos.map((item, i) => (
                      <TrendingCard
                        key={item.repo.id}
                        item={item}
                        rank={i + 1}
                        popularityPct={POPULARITY_PCTS[i] ?? 33}
                      />
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
