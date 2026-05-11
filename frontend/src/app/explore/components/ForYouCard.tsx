'use client';

import { useState } from 'react';
import { Bookmark, Star } from 'lucide-react';
import { getLanguageBadge, getLabelStyle, formatStars } from '@/app/dashboard/utils/helpers';
import type { GithubRepo, ScoredRepo } from '../types';

interface ForYouCardProps {
  item: ScoredRepo;
  saved: boolean;
  onBookmark: (repo: GithubRepo) => void;
}

export function ForYouCard({ item, saved, onBookmark }: ForYouCardProps) {
  const [hovered, setHovered] = useState(false);
  const [bookmarkPop, setBookmarkPop] = useState(false);

  const { repo, match_percentage, issues } = item;
  const lang = getLanguageBadge(repo.language);
  const [owner, repoName] = (repo.full_name ?? `/${repo.name}`).split('/');

  const firstIssue = issues?.[0];
  const firstLabelName = firstIssue?.labels?.[0]?.name ?? 'good first issue';
  const labelStyle = getLabelStyle(firstLabelName);

  const handleBookmark = () => {
    onBookmark(repo);
    setBookmarkPop(true);
    setTimeout(() => setBookmarkPop(false), 250);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl p-4 flex flex-col"
      style={{
        background: '#111111',
        border: `1px solid ${hovered ? 'rgba(34,197,94,0.3)' : '#27272a'}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'border-color 0.15s, transform 0.15s',
      }}
    >
      {/* Language + match % */}
      <div className="flex items-center justify-between mb-3">
        <span
          className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-semibold"
          style={{ background: lang.bg, color: lang.text }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
          {repo.language ?? 'Unknown'}
        </span>
        <span
          className="px-2 py-0.5 rounded-full text-xs font-bold"
          style={{
            background: 'rgba(34,197,94,0.1)',
            color: '#22c55e',
            border: '1px solid rgba(34,197,94,0.2)',
          }}
        >
          {match_percentage}%
        </span>
      </div>

      {/* Repo name */}
      <div className="mb-2 text-sm truncate">
        <span style={{ color: '#a1a1aa' }}>{owner}/</span>
        <span className="font-bold" style={{ color: '#ffffff' }}>{repoName}</span>
      </div>

      {/* Description */}
      <p
        className="mb-3 flex-1"
        style={{
          color: '#a1a1aa',
          fontSize: '13px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5',
        }}
      >
        {repo.description ?? 'No description available'}
      </p>

      {/* Issue preview */}
      {firstIssue ? (
        <div className="mb-3 p-2 rounded-lg" style={{ background: '#1a1a1a' }}>
          <div className="flex items-start justify-between gap-2">
            <span
              className="text-xs text-white truncate flex-1"
              style={{ lineHeight: 1.45 }}
            >
              {firstIssue.title}
            </span>
            <span
              className="px-1.5 py-0.5 rounded-full flex-shrink-0 whitespace-nowrap"
              style={{
                background: labelStyle.bg,
                color: labelStyle.color,
                fontSize: '10px',
              }}
            >
              {firstLabelName}
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-3" />
      )}

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs" style={{ color: '#a1a1aa' }}>
          <Star size={11} style={{ color: '#eab308' }} />
          {formatStars(repo.stargazers_count)}
        </span>
        <button
          onClick={handleBookmark}
          className="cursor-pointer rounded-lg p-1"
          style={{
            color: saved ? '#22c55e' : '#52525b',
            background: saved ? 'rgba(34,197,94,0.1)' : 'transparent',
            transform: bookmarkPop ? 'scale(1.35)' : 'scale(1)',
            transition: 'transform 0.2s, color 0.2s, background 0.2s',
            border: 'none',
          }}
          onMouseEnter={(e) => { if (!saved) e.currentTarget.style.color = '#a1a1aa'; }}
          onMouseLeave={(e) => { if (!saved) e.currentTarget.style.color = '#52525b'; }}
        >
          <Bookmark size={14} fill={saved ? 'currentColor' : 'none'} />
        </button>
      </div>
    </div>
  );
}
