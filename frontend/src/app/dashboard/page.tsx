'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Clock } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useDashboard } from '@/hooks/useDashboard';
import { supabase } from '@/lib/supabase';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function authFetch(url: string, options: RequestInit = {}) {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
      ...options.headers,
    },
  });
}
import { DashboardNavbar } from './components/DashboardNavbar';
import { HeroHeader } from './components/HeroHeader';
import { FilterPills } from './components/FilterPills';
import { FeaturedCard } from './components/FeaturedCard';
import { RepoCard } from './components/RepoCard';
import { TrendingSection } from './components/TrendingSection';
import { AchievementsSection } from './components/AchievementsSection';
import { RecentlyViewed } from './components/RecentlyViewed';
import { MotivationalBanner } from './components/MotivationalBanner';
import { SkeletonCards } from './components/SkeletonCards';
import { Toast } from './components/Toast';
import type { Recommendation } from './data/mock-data';

// -------------------------------------------------------------------
// Filter logic
// -------------------------------------------------------------------
const LANGUAGE_FILTERS = ['JavaScript', 'TypeScript', 'Python', 'Go', 'Rust'];

const TOPIC_MAP: Record<string, string[]> = {
  web:      ['web', 'api', 'browser', 'frontend', 'dom', 'fetch'],
  ai:       ['ai', 'ml', 'machine-learning', 'deep-learning', 'llm'],
  devtools: ['developer-tools', 'bundler', 'build-tool', 'cli', 'tooling', 'webpack'],
  testing:  ['testing', 'test', 'spec'],
};

function filterRecs(recs: Recommendation[], filter: string): Recommendation[] {
  if (filter === 'all') return recs;

  if (LANGUAGE_FILTERS.includes(filter)) {
    return recs.filter((r) => r.repo.language === filter);
  }

  if (filter === 'documentation') {
    return recs.filter(
      (r) =>
        r.repo.topics.some((t) => ['documentation', 'docs'].includes(t.toLowerCase())) ||
        r.issues.some((issue) => issue.labels.some((l) => l.name === 'documentation')),
    );
  }

  const topics = TOPIC_MAP[filter] ?? [];
  return recs.filter((r) =>
    r.repo.topics.some((t) => topics.includes(t.toLowerCase())),
  );
}

// -------------------------------------------------------------------
// Page
// -------------------------------------------------------------------
export default function DashboardPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const {
    recommendations,
    stats,
    trending,
    achievements,
    recentlyViewed,
    loading: dataLoading,
    trackRepoView,
    trackIssueClick,
  } = useDashboard();

  const [activeFilter, setActiveFilter]     = useState('all');
  const [expandedIssues, setExpandedIssues] = useState<Set<number>>(new Set());
  const [bookmarked, setBookmarked]         = useState<Set<number>>(new Set());
  const [toast, setToast]                   = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  // Load saved status for each recommendation
  useEffect(() => {
    if (!user || recommendations.length === 0) return;
    const checkAll = async () => {
      const results = await Promise.all(
        recommendations.map(async (rec) => {
          try {
            const res = await authFetch(`/saved/check/${rec.repo.id}`);
            if (!res.ok) return null;
            const data = await res.json();
            return data.saved ? rec.repo.id : null;
          } catch {
            return null;
          }
        }),
      );
      const savedIds = results.filter(Boolean) as number[];
      if (savedIds.length > 0) {
        setBookmarked(new Set(savedIds));
      }
    };
    checkAll();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, recommendations.length]);

  const filtered = filterRecs(recommendations, activeFilter);
  const [featured, ...rest] = filtered;

  const toggleExpand = (id: number) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleBookmark = useCallback(async (id: number) => {
    const alreadySaved = bookmarked.has(id);

    // Optimistic update
    setBookmarked((prev) => {
      const next = new Set(prev);
      alreadySaved ? next.delete(id) : next.add(id);
      return next;
    });

    const rec = recommendations.find((r) => r.repo.id === id);

    try {
      if (alreadySaved) {
        await authFetch(`/saved/${id}`, { method: 'DELETE' });
      } else {
        if (!rec) return;
        await authFetch('/saved', {
          method: 'POST',
          body: JSON.stringify({
            repo_id: rec.repo.id,
            repo_data: {
              id: rec.repo.id,
              name: rec.repo.name,
              full_name: rec.repo.full_name,
              description: rec.repo.description,
              html_url: rec.repo.html_url,
              stargazers_count: rec.repo.stargazers_count,
              open_issues_count: rec.repo.open_issues_count,
              language: rec.repo.language,
              topics: rec.repo.topics,
            },
          }),
        });
        setToast(`Saved ${rec.repo.name} for later!`);
      }
    } catch {
      // Revert on error
      setBookmarked((prev) => {
        const next = new Set(prev);
        alreadySaved ? next.add(id) : next.delete(id);
        return next;
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookmarked, recommendations]);

  if (authLoading || !user) return null;

  const isLoading = dataLoading;

  return (
    <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
      {/* Fixed navbar */}
      <DashboardNavbar
        user={user}
        streak={stats.days_streak}
        onSignOut={signOut}
      />

      {/* Hero */}
      <HeroHeader
        user={user}
        stats={stats}
        repoCount={recommendations.length}
      />

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pb-24">
        {/* Quick filters */}
        <div className="mb-8">
          <FilterPills activeFilter={activeFilter} onFilterChange={setActiveFilter} />
        </div>

        {/* Today's Picks */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">Today&apos;s Picks</h2>
              <div
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs"
                style={{
                  background: '#111111',
                  border: '1px solid #27272a',
                  color: '#52525b',
                }}
              >
                <Clock size={11} />
                Refreshes tomorrow
              </div>
            </div>
            <span className="text-sm" style={{ color: '#3f3f46' }}>
              Showing {filtered.length} repositor{filtered.length !== 1 ? 'ies' : 'y'}
            </span>
          </div>

          {isLoading ? (
            <SkeletonCards />
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <p className="text-white font-semibold text-lg mb-2">
                No repositories match this filter
              </p>
              <p className="text-sm mb-6" style={{ color: '#a1a1aa' }}>
                Try selecting a different language or topic
              </p>
              <button
                onClick={() => setActiveFilter('all')}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  border: '1px solid rgba(34,197,94,0.3)',
                  color: '#22c55e',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.15)')}
                onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(34,197,94,0.1)')}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <>
              {featured && (
                <div className="mb-4">
                  <FeaturedCard
                    rec={featured}
                    bookmarked={bookmarked.has(featured.repo.id)}
                    onBookmark={toggleBookmark}
                    onRepoClick={(rec) => trackRepoView(rec.repo)}
                    onIssueClick={trackIssueClick}
                  />
                </div>
              )}

              {rest.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rest.map((rec, i) => (
                    <RepoCard
                      key={rec.repo.id}
                      rec={rec}
                      isExpanded={expandedIssues.has(rec.repo.id)}
                      onToggleExpand={() => toggleExpand(rec.repo.id)}
                      bookmarked={bookmarked.has(rec.repo.id)}
                      onBookmark={toggleBookmark}
                      onRepoClick={(rec) => trackRepoView(rec.repo)}
                      onIssueClick={trackIssueClick}
                      animationDelay={`${0.6 + i * 0.08}s`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </section>

        {/* Trending + Achievements — 60/40 split */}
        <section className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-12">
          <div className="lg:col-span-3">
            <TrendingSection trending={trending} />
          </div>
          <div className="lg:col-span-2">
            <AchievementsSection achievements={achievements} />
          </div>
        </section>

        {/* Recently Viewed */}
        <section className="mb-12">
          <RecentlyViewed items={recentlyViewed} />
        </section>

        {/* Motivational banner */}
        <MotivationalBanner />
      </main>

      {toast && (
        <Toast
          message={`🔖 ${toast}`}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
