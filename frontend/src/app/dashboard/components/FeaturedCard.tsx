'use client';

import { useState } from 'react';
import { AlertCircle, Bookmark, ExternalLink, Package, Star } from 'lucide-react';
import { MatchScoreRing } from './MatchScoreRing';
import { getLanguageBadge, getLabelStyle, timeAgo } from '../utils/helpers';
import type { Recommendation } from '../data/mock-data';

interface FeaturedCardProps {
  rec: Recommendation;
  bookmarked: boolean;
  onBookmark: (id: number) => void;
  onRepoClick?: (rec: Recommendation) => void;
}

export function FeaturedCard({ rec, bookmarked, onBookmark, onRepoClick }: FeaturedCardProps) {
  const [bookmarkPop, setBookmarkPop] = useState(false);
  const lang = getLanguageBadge(rec.repo.language);
  const [owner, repoName] = rec.repo.full_name.split('/');

  const handleBookmark = () => {
    onBookmark(rec.repo.id);
    setBookmarkPop(true);
    setTimeout(() => setBookmarkPop(false), 300);
  };

  return (
    <div
      className="relative w-full rounded-2xl overflow-hidden"
      style={{
        background: '#111111',
        border: '1px solid #27272a',
        boxShadow: '0 0 60px rgba(34,197,94,0.04)',
        animation: 'fade-up 0.6s ease 0.4s both',
      }}
    >
      {/* Left gradient accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0"
        style={{
          width: '4px',
          background: 'linear-gradient(180deg, #22c55e 0%, #a855f7 100%)',
        }}
      />

      <div className="p-6 sm:p-8 pl-8 sm:pl-10">
        {/* Two-column layout — stacks on mobile */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left column */}
          <div className="flex-1 min-w-0">
            {/* Badges */}
            <div className="flex items-center gap-2 flex-wrap mb-4">
              <span
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                style={{ background: lang.bg, color: lang.text, border: `1px solid ${lang.dot}30` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
                {rec.repo.language}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                style={{
                  background: 'rgba(34,197,94,0.15)',
                  color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.3)',
                }}
              >
                ★ TOP MATCH
              </span>
            </div>

            {/* Repo name */}
            <h2 className="mb-2" style={{ fontSize: '20px', lineHeight: 1.3 }}>
              <span style={{ color: '#52525b' }}>{owner}/</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>{repoName}</span>
            </h2>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-4" style={{ color: '#a1a1aa' }}>
              {rec.repo.description}
            </p>

            {/* Topics */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {rec.repo.topics.slice(0, 5).map((topic) => (
                <span
                  key={topic}
                  className="px-2.5 py-1 rounded-full text-xs"
                  style={{ background: '#1a1a1a', color: '#71717a', border: '1px solid #27272a' }}
                >
                  {topic}
                </span>
              ))}
            </div>

            {/* Issues */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="text-sm font-semibold text-white">Open Issues</h3>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}
                >
                  {rec.issues.length}
                </span>
              </div>

              <div className="flex flex-col gap-2">
                {rec.issues.map((issue) => {
                  const ls = getLabelStyle(issue.labels[0]?.name ?? '');
                  return (
                    <a
                      key={issue.id}
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-3 p-3 rounded-xl transition-colors duration-150 cursor-pointer"
                      style={{
                        background: '#1a1a1a',
                        borderLeft: `3px solid ${ls.borderColor}`,
                        border: `1px solid #222222`,
                        borderLeftWidth: '3px',
                        borderLeftColor: ls.borderColor,
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#222222')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                    >
                      <span className="text-sm text-white truncate flex-1 min-w-0">
                        {issue.title}
                      </span>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span
                          className="px-2 py-0.5 rounded-full text-xs whitespace-nowrap"
                          style={{ background: ls.bg, color: ls.color }}
                        >
                          {issue.labels[0]?.name}
                        </span>
                        <span className="text-xs hidden sm:block" style={{ color: '#3f3f46' }}>
                          {timeAgo(issue.created_at)}
                        </span>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right column — match ring + stats + actions */}
          <div
            className="flex flex-row lg:flex-col items-center lg:items-stretch gap-6 lg:w-52 flex-shrink-0"
          >
            {/* Match ring */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <MatchScoreRing
                percentage={rec.match_percentage}
                uid={`featured-${rec.repo.id}`}
              />
              <span className="text-xs" style={{ color: '#52525b' }}>Match Score</span>
            </div>

            {/* Stats + actions */}
            <div className="flex-1 flex flex-col gap-4 lg:gap-5 min-w-0">
              {/* Stats */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a1a1aa' }}>
                  <Star size={13} style={{ color: '#eab308' }} />
                  <span>{rec.repo.stargazers_count.toLocaleString()} stars</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a1a1aa' }}>
                  <AlertCircle size={13} style={{ color: '#3b82f6' }} />
                  <span>{rec.repo.open_issues_count} open issues</span>
                </div>
                <div className="flex items-center gap-2 text-sm" style={{ color: '#a1a1aa' }}>
                  <Package size={13} style={{ color: lang.dot }} />
                  <span>{rec.repo.language}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                <a
                  href={rec.repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onRepoClick?.(rec)}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap"
                  style={{ background: '#22c55e', color: '#000000' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#16a34a')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#22c55e')}
                >
                  View Repository
                  <ExternalLink size={13} />
                </a>
                <button
                  onClick={handleBookmark}
                  className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap"
                  style={{
                    background: bookmarked ? 'rgba(34,197,94,0.1)' : 'transparent',
                    border: `1px solid ${bookmarked ? 'rgba(34,197,94,0.4)' : '#27272a'}`,
                    color: bookmarked ? '#22c55e' : '#a1a1aa',
                    transform: bookmarkPop ? 'scale(0.95)' : 'scale(1)',
                    transition: 'transform 0.15s, background 0.2s, border-color 0.2s, color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!bookmarked) e.currentTarget.style.borderColor = '#3f3f46';
                  }}
                  onMouseLeave={(e) => {
                    if (!bookmarked) e.currentTarget.style.borderColor = '#27272a';
                  }}
                >
                  <Bookmark
                    size={14}
                    fill={bookmarked ? 'currentColor' : 'none'}
                  />
                  {bookmarked ? 'Saved' : 'Save for Later'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
