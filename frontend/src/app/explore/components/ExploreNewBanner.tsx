'use client';

import { Loader2, RotateCcw } from 'lucide-react';
import { getLanguageBadge, formatStars } from '@/app/dashboard/utils/helpers';
import { ExploreNewSkeleton } from './SkeletonLoaders';
import type { ScoredRepo } from '../types';

interface ExploreNewBannerProps {
  repo: ScoredRepo | null;
  loading: boolean;
  isLoadingNew: boolean;
  onRefresh: () => void;
}

export function ExploreNewBanner({
  repo,
  loading,
  isLoadingNew,
  onRefresh,
}: ExploreNewBannerProps) {
  if (loading) {
    return (
      <section style={{ animation: 'fade-up 0.5s ease 0.4s both' }}>
        <ExploreNewSkeleton />
      </section>
    );
  }

  if (!repo) return null;

  const { repo: r } = repo;
  const lang = getLanguageBadge(r.language);
  const langInitial = (r.language ?? '?').charAt(0).toUpperCase();

  return (
    <section style={{ animation: 'fade-up 0.5s ease 0.4s both' }}>
      <div
        className="rounded-2xl p-7"
        style={{
          background: 'linear-gradient(to right, #111111, rgba(168,85,247,0.05))',
          border: '1px solid rgba(168,85,247,0.3)',
          overflow: 'hidden',
        }}
      >
        <div className="flex flex-col md:flex-row items-start gap-8">
          {/* Left side */}
          <div
            className="flex-1 min-w-0"
            key={r.id}
            style={{ animation: 'slideIn 0.3s ease' }}
          >
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold mb-4"
              style={{
                background: 'rgba(168,85,247,0.1)',
                color: '#a855f7',
                border: '1px solid rgba(168,85,247,0.3)',
              }}
            >
              ✦ Outside your comfort zone
            </span>

            <h3 className="font-extrabold text-white mb-2" style={{ fontSize: '22px' }}>
              Feeling adventurous?
            </h3>

            <p className="text-sm mb-4" style={{ color: '#a1a1aa', lineHeight: 1.6 }}>
              This repo is in{' '}
              <span
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                style={{ background: lang.bg, color: lang.text }}
              >
                {r.language}
              </span>{' '}
              — outside your usual stack. Great way to explore something new.
            </p>

            {/* Repo info */}
            <div className="mb-5">
              <p className="font-bold text-white mb-1 truncate">{r.full_name}</p>
              <p
                className="text-sm mb-2 truncate"
                style={{ color: '#a1a1aa' }}
              >
                {r.description}
              </p>
              <div className="flex items-center gap-3 flex-wrap" style={{ color: '#a1a1aa', fontSize: '13px' }}>
                <span>⭐ {formatStars(r.stargazers_count)}</span>
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: lang.bg, color: lang.text }}
                >
                  {r.language}
                </span>
                <span>{r.open_issues_count} good first issues</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={r.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-150"
                style={{
                  border: '1px solid #a855f7',
                  color: '#a855f7',
                  background: 'transparent',
                  textDecoration: 'none',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(168,85,247,0.1)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              >
                Explore Repo →
              </a>
              <button
                onClick={onRefresh}
                disabled={isLoadingNew}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium cursor-pointer transition-all duration-150"
                style={{
                  border: '1px solid #27272a',
                  color: '#a1a1aa',
                  background: 'transparent',
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
                {isLoadingNew ? (
                  <Loader2 size={14} style={{ animation: 'spin 0.7s linear infinite' }} />
                ) : (
                  <RotateCcw size={14} />
                )}
                Show me another
              </button>
            </div>
          </div>

          {/* Right side — language circle, desktop only */}
          <div
            className="hidden md:flex items-center justify-center flex-shrink-0"
            style={{ width: '160px', height: '160px' }}
          >
            <div
              className="w-32 h-32 rounded-full flex items-center justify-center"
              style={{
                background: `${lang.dot}20`,
                border: `2px solid ${lang.dot}40`,
                boxShadow: `0 0 48px ${lang.dot}20`,
              }}
            >
              <span
                className="font-extrabold select-none"
                style={{
                  color: lang.text,
                  fontSize: '52px',
                  fontFamily: '"JetBrains Mono", monospace',
                }}
              >
                {langInitial}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
