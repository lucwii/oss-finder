'use client';

import { useRef, useState } from 'react';
import {
  CheckCircle,
  ChevronDown,
  ExternalLink,
  Folder,
  GitBranch,
  Star,
  Target,
  Trash2,
  Zap,
} from 'lucide-react';
import type { Collection, SavedRepo } from '../hooks/useSaved';

// ─── Language badge colors (from CLAUDE.md) ───────────────────────────────────

const LANG_BADGES: Record<string, { bg: string; text: string }> = {
  TypeScript:  { bg: '#1e3a5f', text: '#3b82f6' },
  JavaScript:  { bg: '#3d3200', text: '#eab308' },
  Python:      { bg: '#1a2d4a', text: '#3b82f6' },
  Rust:        { bg: '#3d1a0e', text: '#f97316' },
  Go:          { bg: '#0e2d3d', text: '#06b6d4' },
  Ruby:        { bg: '#3d0e0e', text: '#ef4444' },
  Java:        { bg: '#3d2200', text: '#f97316' },
  'C#':        { bg: '#2d1a3d', text: '#a855f7' },
  PHP:         { bg: '#1a1a3d', text: '#6366f1' },
  'C++':       { bg: '#0e1a3d', text: '#3b82f6' },
};

function getLangBadge(lang: string) {
  return LANG_BADGES[lang] ?? { bg: '#1a1a2e', text: '#a855f7' };
}

// ─── Status config ─────────────────────────────────────────────────────────────

const STATUS_CONFIG = [
  {
    value: 'want_to_contribute' as const,
    label: 'Want to',
    icon: <Target size={11} />,
    activeColor: '#22c55e',
    activeBg: 'rgba(34,197,94,0.12)',
    activeBorder: 'rgba(34,197,94,0.3)',
  },
  {
    value: 'in_progress' as const,
    label: 'In Progress',
    icon: <Zap size={11} />,
    activeColor: '#f97316',
    activeBg: 'rgba(249,115,22,0.12)',
    activeBorder: 'rgba(249,115,22,0.3)',
  },
  {
    value: 'completed' as const,
    label: 'Completed',
    icon: <CheckCircle size={11} />,
    activeColor: '#3b82f6',
    activeBg: 'rgba(59,130,246,0.12)',
    activeBorder: 'rgba(59,130,246,0.3)',
  },
];

// ─── Format date ──────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface SavedRepoCardProps {
  repo: SavedRepo;
  collections: Collection[];
  isRemoving: boolean;
  onUpdateStatus: (repoId: number, status: 'want_to_contribute' | 'in_progress' | 'completed') => void;
  onMoveToCollection: (repoId: number, collectionId: string | null, collectionName: string | null) => void;
  onRemove: (repoId: number) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function SavedRepoCard({
  repo,
  collections,
  isRemoving,
  onUpdateStatus,
  onMoveToCollection,
  onRemove,
}: SavedRepoCardProps) {
  const [hovered, setHovered]             = useState(false);
  const [issuesOpen, setIssuesOpen]       = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const dropdownRef                       = useRef<HTMLDivElement>(null);

  const data = repo.repo_data ?? {};
  const [owner, repoName] = (data.full_name ?? '/').split('/');
  const lang = getLangBadge(data.language);
  const customCollections = collections.filter((c) => !c.isDefault);

  // Close dropdown on outside click
  const handleCollectionToggle = () => setCollectionOpen((v) => !v);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#111111',
        border: `1px solid ${hovered ? '#3f3f46' : '#27272a'}`,
        borderRadius: '12px',
        transform: hovered ? 'translateY(-1px)' : 'translateY(0)',
        transition: 'border-color 0.15s, transform 0.15s, opacity 0.3s, max-height 0.3s',
        opacity: isRemoving ? 0 : 1,
        maxHeight: isRemoving ? '0' : '1000px',
        overflow: 'hidden',
        marginBottom: isRemoving ? '0' : undefined,
      }}
    >
      <div className="p-5">
        {/* Top row: language badge + repo name + stars */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            {data.language && (
              <span
                className="px-2 py-0.5 rounded-full text-xs font-semibold flex-shrink-0"
                style={{ background: lang.bg, color: lang.text }}
              >
                {data.language}
              </span>
            )}
            <span className="text-sm min-w-0 truncate">
              <span style={{ color: '#52525b' }}>{owner}/</span>
              <span style={{ color: '#ffffff', fontWeight: 700 }}>{repoName}</span>
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0 text-xs" style={{ color: '#52525b' }}>
            <Star size={11} style={{ color: '#eab308' }} />
            <span>{(data.stargazers_count ?? 0).toLocaleString()}</span>
          </div>
        </div>

        {/* Description */}
        {data.description && (
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
            {data.description}
          </p>
        )}

        {/* Topics */}
        {(data.topics ?? []).length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {(data.topics ?? []).slice(0, 3).map((topic: string) => (
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

        {/* Status pills */}
        <div className="flex flex-wrap gap-1.5 mb-3">
          {STATUS_CONFIG.map((s) => {
            const active = repo.status === s.value;
            return (
              <button
                key={s.value}
                onClick={() => onUpdateStatus(repo.repo_id, s.value)}
                className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer transition-all duration-150"
                style={{
                  background: active ? s.activeBg : '#1a1a1a',
                  border: `1px solid ${active ? s.activeBorder : '#27272a'}`,
                  color: active ? s.activeColor : '#a1a1aa',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#222222';
                    e.currentTarget.style.color = '#ffffff';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.background = '#1a1a1a';
                    e.currentTarget.style.color = '#a1a1aa';
                  }
                }}
              >
                {s.icon}
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Collection + issues row */}
        <div className="flex items-center justify-between gap-3 mb-3">
          {/* Collection dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={handleCollectionToggle}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs cursor-pointer transition-all duration-150"
              style={{
                background: '#1a1a1a',
                border: '1px solid #27272a',
                color: '#a1a1aa',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#ffffff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; }}
            >
              <Folder size={11} />
              <span className="max-w-[120px] truncate">
                {repo.collection_name ?? 'No collection'}
              </span>
              <ChevronDown size={10} style={{ transition: 'transform 0.15s', transform: collectionOpen ? 'rotate(180deg)' : 'none' }} />
            </button>

            {collectionOpen && (
              <div
                className="absolute left-0 z-20 rounded-xl overflow-hidden"
                style={{
                  top: 'calc(100% + 4px)',
                  background: '#111111',
                  border: '1px solid #27272a',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: '160px',
                  animation: 'fadeIn 0.12s ease forwards',
                }}
              >
                <div className="p-1">
                  <button
                    onClick={() => { onMoveToCollection(repo.repo_id, null, null); setCollectionOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors duration-100 text-left"
                    style={{ color: !repo.collection_id ? '#22c55e' : '#a1a1aa' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                  >
                    <GitBranch size={11} />
                    No collection
                  </button>
                  {customCollections.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => { onMoveToCollection(repo.repo_id, c.id, c.name); setCollectionOpen(false); }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors duration-100 text-left"
                      style={{ color: repo.collection_id === c.id ? '#22c55e' : '#a1a1aa' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Folder size={11} />
                      <span className="truncate">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Saved date */}
          <span className="text-xs" style={{ color: '#3f3f46' }}>
            Saved {formatDate(repo.saved_at)}
          </span>
        </div>

        {/* Issues preview */}
        {(data.open_issues_count ?? 0) > 0 && (
          <>
            <div style={{ height: '1px', background: '#1f1f1f', marginBottom: '10px' }} />
            <button
              onClick={() => setIssuesOpen((v) => !v)}
              className="flex items-center justify-between w-full cursor-pointer"
            >
              <span className="text-xs font-medium" style={{ color: '#71717a' }}>
                {data.open_issues_count} issue{data.open_issues_count !== 1 ? 's' : ''} available
              </span>
              <ChevronDown
                size={13}
                style={{
                  color: '#71717a',
                  transition: 'transform 0.25s ease',
                  transform: issuesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            <div
              style={{
                maxHeight: issuesOpen ? '80px' : '0px',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease',
              }}
            >
              <div className="mt-3">
                <a
                  href={`${data.html_url}/issues`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs transition-colors duration-150"
                  style={{ color: '#a1a1aa' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#22c55e'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#a1a1aa'; }}
                >
                  Browse open issues on GitHub
                  <ExternalLink size={11} />
                </a>
              </div>
            </div>
          </>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between mt-4 pt-3" style={{ borderTop: '1px solid #1f1f1f' }}>
          <a
            href={data.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs font-medium cursor-pointer transition-colors duration-150"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#22c55e'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; }}
          >
            View on GitHub
            <ExternalLink size={11} />
          </a>
          <button
            onClick={() => onRemove(repo.repo_id)}
            className="p-1.5 rounded-lg transition-all duration-150 cursor-pointer"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent'; }}
            title="Remove from saved"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
