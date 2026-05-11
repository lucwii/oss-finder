'use client';

import { useState } from 'react';
import { AlertCircle, Bookmark, ChevronDown, Clock, Star } from 'lucide-react';
import {
  getLanguageBadge,
  getLabelStyle,
  timeAgo,
  formatStars,
} from '@/app/dashboard/utils/helpers';
import type { GithubRepo, ScoredRepo } from '../types';

interface BrowseCardProps {
  item: ScoredRepo;
  isExpanded: boolean;
  onToggleExpand: () => void;
  saved: boolean;
  onBookmark: (repo: GithubRepo) => void;
  animationDelay?: string;
}

export function BrowseCard({
  item,
  isExpanded,
  onToggleExpand,
  saved,
  onBookmark,
  animationDelay = '0s',
}: BrowseCardProps) {
  const [hovered, setHovered] = useState(false);
  const [bookmarkPop, setBookmarkPop] = useState(false);

  const { repo, match_percentage, issues } = item;
  const lang = getLanguageBadge(repo.language);
  const [owner, repoName] = (repo.full_name ?? `/${repo.name}`).split('/');
  const issueCount = issues?.length ?? 0;
  const expandedHeight = issueCount * 58 + 16;

  const handleBookmark = () => {
    onBookmark(repo);
    setBookmarkPop(true);
    setTimeout(() => setBookmarkPop(false), 250);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-xl"
      style={{
        background: '#111111',
        border: `1px solid ${hovered ? 'rgba(34,197,94,0.3)' : '#27272a'}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 8px 32px rgba(34,197,94,0.06)' : 'none',
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
        animation: `fade-up 0.4s ease ${animationDelay} both`,
      }}
    >
      <div className="p-5">
        {/* Language + match */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: lang.bg, color: lang.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
            {repo.language ?? 'Unknown'}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(34,197,94,0.12)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            {match_percentage}%
          </span>
        </div>

        {/* Repo name */}
        <h3 className="mb-2" style={{ fontSize: '16px' }}>
          <span style={{ color: '#52525b' }}>{owner}/</span>
          <span style={{ color: '#ffffff', fontWeight: 700 }}>{repoName}</span>
        </h3>

        {/* Description */}
        <p
          className="text-sm leading-relaxed mb-3"
          style={{
            color: '#a1a1aa',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {repo.description ?? 'No description available'}
        </p>

        {/* Topics */}
        {(repo.topics?.length ?? 0) > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {repo.topics.slice(0, 3).map((topic) => (
              <span
                key={topic}
                className="px-2 py-0.5 rounded-full text-xs"
                style={{ background: '#1a1a1a', color: '#71717a', border: '1px solid #27272a' }}
              >
                {topic}
              </span>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#52525b' }}>
          <span className="flex items-center gap-1">
            <Star size={11} style={{ color: '#eab308' }} />
            {formatStars(repo.stargazers_count)}
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle size={11} style={{ color: '#3b82f6' }} />
            {repo.open_issues_count} issues
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(repo.updated_at)}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-3" style={{ height: '1px', background: '#1f1f1f' }} />

        {/* Issues toggle */}
        {issueCount > 0 && (
          <>
            <button
              onClick={onToggleExpand}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span className="text-xs font-medium" style={{ color: '#71717a' }}>
                {issueCount} issue{issueCount !== 1 ? 's' : ''} available
              </span>
              <ChevronDown
                size={14}
                style={{
                  color: '#71717a',
                  transition: 'transform 0.25s ease',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            <div
              style={{
                maxHeight: isExpanded ? `${expandedHeight}px` : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <div className="flex flex-col gap-1.5 mt-3">
                {issues.map((issue) => {
                  const labelName = issue.labels?.[0]?.name ?? '';
                  const ls = getLabelStyle(labelName);
                  return (
                    <a
                      key={issue.id}
                      href={issue.html_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between gap-2 p-2.5 rounded-lg transition-colors duration-100"
                      style={{
                        background: '#1a1a1a',
                        border: '1px solid #222222',
                        borderLeft: `3px solid ${ls.borderColor}`,
                        textDecoration: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#222222')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                    >
                      <span className="text-xs text-white truncate flex-1 min-w-0">
                        {issue.title}
                      </span>
                      {labelName && (
                        <span
                          className="px-2 py-0.5 rounded-full text-xs flex-shrink-0 whitespace-nowrap"
                          style={{ background: ls.bg, color: ls.color }}
                        >
                          {labelName}
                        </span>
                      )}
                    </a>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-3">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium transition-colors duration-150"
            style={{ color: '#52525b', textDecoration: 'none' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
          >
            View on GitHub ↗
          </a>
          <button
            onClick={handleBookmark}
            className="cursor-pointer rounded-lg p-1.5"
            style={{
              color: saved ? '#22c55e' : '#52525b',
              background: saved ? 'rgba(34,197,94,0.1)' : 'transparent',
              transform: bookmarkPop ? 'scale(1.2)' : 'scale(1)',
              transition: 'transform 0.2s, color 0.2s, background 0.2s',
              border: 'none',
            }}
            onMouseEnter={(e) => { if (!saved) e.currentTarget.style.color = '#a1a1aa'; }}
            onMouseLeave={(e) => { if (!saved) e.currentTarget.style.color = '#52525b'; }}
          >
            <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
          </button>
        </div>
      </div>
    </div>
  );
}
