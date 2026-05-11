'use client';

import { ChevronLeft, ChevronRight, Compass, Loader2 } from 'lucide-react';
import { BrowseCard } from './BrowseCard';
import { BrowseSkeleton } from './SkeletonLoaders';
import type { GithubRepo, ScoredRepo } from '../types';

interface BrowseSectionProps {
  repos: ScoredRepo[];
  topics: string[];
  activeTopic: string;
  onTopicChange: (topic: string) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  expandedIssues: Set<number>;
  onToggleIssues: (id: number) => void;
  savedRepos: Set<number>;
  onBookmark: (repo: GithubRepo) => void;
}

function Pagination({
  current,
  total,
  onChange,
}: {
  current: number;
  total: number;
  onChange: (p: number) => void;
}) {
  if (total <= 1) return null;

  const maxVisible = 8;
  const pages = Array.from({ length: Math.min(total, maxVisible) }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 mt-8 flex-wrap">
      <button
        onClick={() => onChange(current - 1)}
        disabled={current === 1}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150"
        style={{
          background: 'transparent',
          border: '1px solid transparent',
          color: current === 1 ? '#3f3f46' : '#a1a1aa',
          cursor: current === 1 ? 'default' : 'pointer',
        }}
        onMouseEnter={(e) => { if (current !== 1) e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { if (current !== 1) e.currentTarget.style.color = '#a1a1aa'; }}
      >
        <ChevronLeft size={14} />
        Previous
      </button>

      {pages.map((page) => (
        <button
          key={page}
          onClick={() => onChange(page)}
          className="w-8 h-8 flex items-center justify-center rounded-lg text-sm transition-all duration-150 cursor-pointer"
          style={{
            background: current === page ? '#22c55e' : '#111111',
            border: `1px solid ${current === page ? '#22c55e' : '#27272a'}`,
            color: current === page ? '#000000' : '#a1a1aa',
            fontWeight: current === page ? 700 : 400,
          }}
          onMouseEnter={(e) => {
            if (current !== page) {
              e.currentTarget.style.borderColor = '#3f3f46';
              e.currentTarget.style.color = '#ffffff';
            }
          }}
          onMouseLeave={(e) => {
            if (current !== page) {
              e.currentTarget.style.borderColor = '#27272a';
              e.currentTarget.style.color = '#a1a1aa';
            }
          }}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onChange(current + 1)}
        disabled={current === total}
        className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-sm transition-colors duration-150"
        style={{
          background: 'transparent',
          border: '1px solid transparent',
          color: current === total ? '#3f3f46' : '#a1a1aa',
          cursor: current === total ? 'default' : 'pointer',
        }}
        onMouseEnter={(e) => { if (current !== total) e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { if (current !== total) e.currentTarget.style.color = '#a1a1aa'; }}
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
}

export function BrowseSection({
  repos,
  topics,
  activeTopic,
  onTopicChange,
  loading,
  currentPage,
  totalPages,
  onPageChange,
  expandedIssues,
  onToggleIssues,
  savedRepos,
  onBookmark,
}: BrowseSectionProps) {
  const allTopics = ['all', ...topics];

  return (
    <section style={{ animation: 'fade-up 0.5s ease 0.3s both' }}>
      <div className="flex items-center gap-2 mb-6">
        <h2 className="text-xl font-bold text-white">Browse by Topic</h2>
        <Compass size={16} style={{ color: '#a855f7' }} />
      </div>

      {/* Topic tabs */}
      <div className="overflow-x-auto horizontal-scroll pb-2 mb-6">
        <div className="flex gap-2 w-max">
          {allTopics.map((topic) => {
            const active = activeTopic === topic;
            return (
              <button
                key={topic}
                onClick={() => onTopicChange(topic)}
                className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap cursor-pointer transition-all duration-150"
                style={{
                  background: active ? 'rgba(34,197,94,0.1)' : '#111111',
                  border: `1px solid ${active ? '#22c55e' : '#27272a'}`,
                  color: active ? '#ffffff' : '#a1a1aa',
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.borderColor = '#3f3f46';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#a1a1aa';
                    e.currentTarget.style.borderColor = '#27272a';
                  }
                }}
              >
                {topic === 'all' ? 'All' : topic}
              </button>
            );
          })}
        </div>
      </div>

      {/* Repo grid */}
      <div className="relative">
        {/* Spinner overlay when refreshing with existing results */}
        {loading && repos.length > 0 && (
          <div className="absolute top-2 right-2 z-10">
            <Loader2
              size={18}
              style={{ color: '#22c55e', animation: 'spin 0.7s linear infinite' }}
            />
          </div>
        )}

        <div
          style={{
            opacity: loading && repos.length > 0 ? 0.6 : 1,
            transition: 'opacity 0.2s',
          }}
        >
          {loading && repos.length === 0 ? (
            <BrowseSkeleton />
          ) : repos.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Compass size={48} style={{ color: '#27272a', marginBottom: '16px' }} />
              <p className="font-semibold text-white mb-2">
                No repositories found for this topic
              </p>
              <p className="text-sm" style={{ color: '#a1a1aa' }}>
                Try a different topic or clear filters
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {repos.map((item, i) => (
                <BrowseCard
                  key={item.repo.id}
                  item={item}
                  isExpanded={expandedIssues.has(item.repo.id)}
                  onToggleExpand={() => onToggleIssues(item.repo.id)}
                  saved={savedRepos.has(item.repo.id)}
                  onBookmark={onBookmark}
                  animationDelay={`${i * 0.04}s`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Pagination current={currentPage} total={totalPages} onChange={onPageChange} />
    </section>
  );
}
