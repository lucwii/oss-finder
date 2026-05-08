'use client';

import { useState } from 'react';
import { AlertCircle, Bookmark, ChevronDown, Clock, ExternalLink, Star } from 'lucide-react';
import { getLanguageBadge, getLabelStyle, timeAgo } from '../utils/helpers';
import type { Recommendation } from '../data/mock-data';

interface RepoCardProps {
  rec: Recommendation;
  isExpanded: boolean;
  onToggleExpand: () => void;
  bookmarked: boolean;
  onBookmark: (id: number) => void;
  onRepoClick?: (rec: Recommendation) => void;
  onIssueClick?: () => void;
  animationDelay?: string;
}

export function RepoCard({
  rec,
  isExpanded,
  onToggleExpand,
  bookmarked,
  onBookmark,
  onRepoClick,
  onIssueClick,
  animationDelay = '0s',
}: RepoCardProps) {
  const [hovered, setHovered] = useState(false);
  const [bookmarkPop, setBookmarkPop] = useState(false);
  const lang = getLanguageBadge(rec.repo.language);
  const [owner, repoName] = rec.repo.full_name.split('/');

  const handleBookmark = () => {
    onBookmark(rec.repo.id);
    setBookmarkPop(true);
    setTimeout(() => setBookmarkPop(false), 250);
  };

  // Each issue row is ~56px for max-height calculation
  const expandedHeight = rec.issues.length * 60;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="rounded-2xl overflow-hidden"
      style={{
        background: '#111111',
        border: `1px solid ${hovered ? 'rgba(34,197,94,0.35)' : '#27272a'}`,
        transform: hovered ? 'translateY(-2px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 40px rgba(34,197,94,0.07)' : 'none',
        transition: 'border-color 0.15s, transform 0.15s, box-shadow 0.15s',
        animation: `fade-up 0.5s ease ${animationDelay} both`,
      }}
    >
      <div className="p-5">
        {/* Language + match % */}
        <div className="flex items-center justify-between mb-3">
          <span
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
            style={{ background: lang.bg, color: lang.text }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: lang.dot }} />
            {rec.repo.language}
          </span>
          <span
            className="px-2.5 py-1 rounded-full text-xs font-bold"
            style={{
              background: 'rgba(34,197,94,0.12)',
              color: '#22c55e',
              border: '1px solid rgba(34,197,94,0.2)',
            }}
          >
            {rec.match_percentage}%
          </span>
        </div>

        {/* Repo name */}
        <h3 className="mb-2" style={{ fontSize: '14px' }}>
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
          {rec.repo.description}
        </p>

        {/* Topics */}
        <div className="flex flex-wrap gap-1 mb-4">
          {rec.repo.topics.slice(0, 3).map((topic) => (
            <span
              key={topic}
              className="px-2 py-0.5 rounded-full text-xs"
              style={{ background: '#1a1a1a', color: '#71717a', border: '1px solid #27272a' }}
            >
              {topic}
            </span>
          ))}
        </div>

        {/* Stats row */}
        <div className="flex items-center gap-4 text-xs mb-4" style={{ color: '#52525b' }}>
          <span className="flex items-center gap-1">
            <Star size={11} style={{ color: '#eab308' }} />
            {rec.repo.stargazers_count.toLocaleString()}
          </span>
          <span className="flex items-center gap-1">
            <AlertCircle size={11} style={{ color: '#3b82f6' }} />
            {rec.repo.open_issues_count}
          </span>
          <span className="flex items-center gap-1">
            <Clock size={11} />
            {timeAgo(rec.repo.updated_at)}
          </span>
        </div>

        {/* Divider */}
        <div className="mb-3" style={{ height: '1px', background: '#1f1f1f' }} />

        {/* Issues toggle */}
        <button
          onClick={onToggleExpand}
          className="flex items-center justify-between w-full mb-0 cursor-pointer"
        >
          <span className="text-xs font-medium" style={{ color: '#71717a' }}>
            {rec.issues.length} issue{rec.issues.length !== 1 ? 's' : ''} available
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

        {/* Expandable issues */}
        <div
          style={{
            maxHeight: isExpanded ? `${expandedHeight}px` : '0px',
            overflow: 'hidden',
            transition: 'max-height 0.3s ease',
          }}
        >
          <div className="flex flex-col gap-1.5 mt-3">
            {rec.issues.map((issue) => {
              const ls = getLabelStyle(issue.labels[0]?.name ?? '');
              return (
                <a
                  key={issue.id}
                  href={issue.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => onIssueClick?.()}
                  className="flex items-center justify-between gap-2 p-2.5 rounded-lg transition-colors duration-100 cursor-pointer"
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
                  <span
                    className="text-xs text-white truncate flex-1 min-w-0"
                  >
                    {issue.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded-full text-xs flex-shrink-0 whitespace-nowrap"
                    style={{ background: ls.bg, color: ls.color }}
                  >
                    {issue.labels[0]?.name}
                  </span>
                </a>
              );
            })}
          </div>
        </div>

        {/* Bottom row — visible below expanded issues */}
        <div
          className="flex items-center justify-between"
          style={{ marginTop: isExpanded ? '12px' : '12px' }}
        >
          <a
            href={rec.repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onRepoClick?.(rec)}
            className="flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors duration-150"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
          >
            View on GitHub
            <ExternalLink size={11} />
          </a>
          <button
            onClick={handleBookmark}
            className="cursor-pointer transition-all duration-150 rounded-lg p-1.5"
            style={{
              color: bookmarked ? '#22c55e' : '#52525b',
              background: bookmarked ? 'rgba(34,197,94,0.1)' : 'transparent',
              transform: bookmarkPop ? 'scale(0.75)' : 'scale(1)',
              transition: 'transform 0.15s, color 0.2s, background 0.2s',
            }}
            onMouseEnter={(e) => {
              if (!bookmarked) e.currentTarget.style.color = '#a1a1aa';
            }}
            onMouseLeave={(e) => {
              if (!bookmarked) e.currentTarget.style.color = '#52525b';
            }}
          >
            <Bookmark
              size={15}
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>
      </div>
    </div>
  );
}
