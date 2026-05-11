'use client';

import Link from 'next/link';
import { RotateCcw, Sparkles } from 'lucide-react';
import { ForYouCard } from './ForYouCard';
import { ForYouSkeleton } from './SkeletonLoaders';
import type { GithubRepo, ScoredRepo } from '../types';

interface ForYouSectionProps {
  repos: ScoredRepo[];
  loading: boolean;
  isRefreshing: boolean;
  savedRepos: Set<number>;
  onRefresh: () => void;
  onBookmark: (repo: GithubRepo) => void;
}

export function ForYouSection({
  repos,
  loading,
  isRefreshing,
  savedRepos,
  onRefresh,
  onBookmark,
}: ForYouSectionProps) {
  return (
    <section style={{ animation: 'fade-up 0.5s ease 0.1s both' }}>
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-white">Picked for you</h2>
          <Sparkles size={16} style={{ color: '#22c55e' }} />
        </div>
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh picks"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm cursor-pointer transition-all duration-150"
          style={{
            background: 'transparent',
            border: '1px solid #27272a',
            color: '#a1a1aa',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.borderColor = '#3f3f46';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#a1a1aa';
            e.currentTarget.style.borderColor = '#27272a';
          }}
        >
          <RotateCcw
            size={14}
            style={{ animation: isRefreshing ? 'spin 0.8s linear infinite' : 'none' }}
          />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {loading ? (
        <ForYouSkeleton />
      ) : repos.length === 0 ? (
        <div className="text-center py-14">
          <p className="text-sm mb-2" style={{ color: '#a1a1aa' }}>
            Complete your onboarding to see personalised picks
          </p>
          <Link
            href="/settings"
            className="text-sm font-medium"
            style={{ color: '#22c55e' }}
          >
            Update preferences →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {repos.map((item) => (
            <ForYouCard
              key={item.repo.id}
              item={item}
              saved={savedRepos.has(item.repo.id)}
              onBookmark={onBookmark}
            />
          ))}
        </div>
      )}
    </section>
  );
}
