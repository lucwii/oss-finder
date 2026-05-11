'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { DashboardNavbar } from '@/app/dashboard/components/DashboardNavbar';
import { ForYouSection } from './components/ForYouSection';
import { TrendingSection } from './components/TrendingSection';
import { BrowseSection } from './components/BrowseSection';
import { ExploreNewBanner } from './components/ExploreNewBanner';
import type { ExploreResult, GithubRepo, ScoredRepo, SortOption } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

async function authFetch(url: string, options: RequestInit = {}) {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session?.access_token}`,
      ...options.headers,
    },
  });
}

const SORT_LABELS: Record<SortOption, string> = {
  updated: 'Most Recent',
  stars: 'Most Stars',
  issues: 'Most Issues',
};

export default function SmartExplorePage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [exploreData, setExploreData] = useState<ExploreResult | null>(null);
  const [userTopics, setUserTopics] = useState<string[]>([]);
  const [activeTopic, setActiveTopic] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sort, setSort] = useState<SortOption>('updated');
  const [sortOpen, setSortOpen] = useState(false);
  const [expandedIssues, setExpandedIssues] = useState(new Set<number>());
  const [savedRepos, setSavedRepos] = useState(new Set<number>());
  const [isRefreshingForYou, setIsRefreshingForYou] = useState(false);
  const [isLoadingBrowse, setIsLoadingBrowse] = useState(false);
  const [isLoadingNew, setIsLoadingNew] = useState(false);
  const [exploreNew, setExploreNew] = useState<ScoredRepo | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const sortRef = useRef<HTMLDivElement>(null);
  const browseRef = useRef<HTMLDivElement>(null);

  // Auth guard
  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  // Close sort dropdown on outside click
  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Initial load
  useEffect(() => {
    if (!user) return;
    const load = async () => {
      setIsLoading(true);
      try {
        const [topicsRes, dataRes] = await Promise.all([
          authFetch('/explore/topics'),
          authFetch('/explore'),
        ]);
        const topicsData = await topicsRes.json();
        const data: ExploreResult = await dataRes.json();
        setUserTopics(topicsData.topics ?? []);
        setExploreData(data);
        setExploreNew(data.exploreNew);
        checkSavedRepos(data);
      } catch (err) {
        console.error('Failed to load explore data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkSavedRepos = async (data: ExploreResult) => {
    const allRepos = [
      ...data.forYou,
      ...data.topicRepos,
      ...data.trendingByLanguage.flatMap((g) => g.repos),
    ];
    const uniqueIds = [...new Set(allRepos.map((item) => item.repo.id))];
    const results = await Promise.all(
      uniqueIds.map(async (id) => {
        try {
          const res = await authFetch(`/saved/check/${id}`);
          if (!res.ok) return null;
          const d = await res.json();
          return d.saved ? id : null;
        } catch {
          return null;
        }
      }),
    );
    const savedIds = results.filter(Boolean) as number[];
    if (savedIds.length > 0) setSavedRepos(new Set(savedIds));
  };

  const fetchBrowse = useCallback(
    async (topic: string, page: number, sortOrder: SortOption) => {
      setIsLoadingBrowse(true);
      try {
        const params = new URLSearchParams({ page: String(page), sort: sortOrder });
        if (topic !== 'all') params.set('topic', topic);
        const res = await authFetch(`/explore?${params}`);
        const data: ExploreResult = await res.json();
        setExploreData((prev) =>
          prev
            ? { ...prev, topicRepos: data.topicRepos, totalPages: data.totalPages }
            : data,
        );
      } catch (err) {
        console.error('Failed to fetch browse data:', err);
      } finally {
        setIsLoadingBrowse(false);
      }
    },
    [],
  );

  const handleTopicChange = (topic: string) => {
    setActiveTopic(topic);
    setCurrentPage(1);
    fetchBrowse(topic, 1, sort);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchBrowse(activeTopic, page, sort);
    browseRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSortChange = (newSort: SortOption) => {
    setSort(newSort);
    setSortOpen(false);
    setCurrentPage(1);
    fetchBrowse(activeTopic, 1, newSort);
  };

  const handleRefreshForYou = async () => {
    if (isRefreshingForYou) return;
    setIsRefreshingForYou(true);
    try {
      const res = await authFetch('/explore');
      const data: ExploreResult = await res.json();
      setExploreData((prev) => (prev ? { ...prev, forYou: data.forYou } : data));
    } catch (err) {
      console.error('Failed to refresh for you:', err);
    } finally {
      setIsRefreshingForYou(false);
    }
  };

  const handleRefreshNew = async () => {
    if (isLoadingNew) return;
    setIsLoadingNew(true);
    try {
      const res = await authFetch('/explore');
      const data: ExploreResult = await res.json();
      setExploreNew(data.exploreNew);
    } catch (err) {
      console.error('Failed to refresh explore new:', err);
    } finally {
      setIsLoadingNew(false);
    }
  };

  const toggleExpandIssues = (id: number) => {
    setExpandedIssues((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBookmark = useCallback(
    async (repo: GithubRepo) => {
      const alreadySaved = savedRepos.has(repo.id);
      // Optimistic update
      setSavedRepos((prev) => {
        const next = new Set(prev);
        alreadySaved ? next.delete(repo.id) : next.add(repo.id);
        return next;
      });
      try {
        if (alreadySaved) {
          await authFetch(`/saved/${repo.id}`, { method: 'DELETE' });
        } else {
          await authFetch('/saved', {
            method: 'POST',
            body: JSON.stringify({
              repo_id: repo.id,
              repo_data: {
                id: repo.id,
                name: repo.name,
                full_name: repo.full_name,
                description: repo.description,
                html_url: repo.html_url,
                stargazers_count: repo.stargazers_count,
                open_issues_count: repo.open_issues_count,
                language: repo.language,
                topics: repo.topics,
              },
            }),
          });
          setToast('Repository saved to Want to Contribute');
        }
      } catch {
        // Revert on error
        setSavedRepos((prev) => {
          const next = new Set(prev);
          alreadySaved ? next.add(repo.id) : next.delete(repo.id);
          return next;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [savedRepos],
  );

  if (authLoading || !user) return null;

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes toastIn { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
      `}</style>

      <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <DashboardNavbar user={user} streak={0} onSignOut={signOut} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24">
          {/* Page header */}
          <div
            className="flex items-start justify-between mb-12 flex-wrap gap-4"
            style={{ animation: 'fade-up 0.5s ease 0s both' }}
          >
            <div>
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3"
                style={{
                  background: 'rgba(34,197,94,0.1)',
                  color: '#22c55e',
                  border: '1px solid rgba(34,197,94,0.2)',
                }}
              >
                ✦ Smart Explore
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
                Explore Repositories
              </h1>
              <p style={{ color: '#a1a1aa', fontSize: '15px' }}>
                Personalised to your stack and interests
              </p>
            </div>

            {/* Sort dropdown — desktop only */}
            <div className="hidden md:block relative" ref={sortRef}>
              <button
                onClick={() => setSortOpen((v) => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-150"
                style={{
                  background: '#111111',
                  border: '1px solid #27272a',
                  color: '#ffffff',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#3f3f46')}
                onMouseLeave={(e) => {
                  if (!sortOpen) e.currentTarget.style.borderColor = '#27272a';
                }}
              >
                {SORT_LABELS[sort]}
                <ChevronDown
                  size={14}
                  style={{
                    color: '#71717a',
                    transform: sortOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.2s',
                  }}
                />
              </button>

              {sortOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-44 rounded-xl overflow-hidden z-20"
                  style={{
                    background: '#111111',
                    border: '1px solid #27272a',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.5)',
                    animation: 'slideDown 0.15s ease forwards',
                  }}
                >
                  {(['updated', 'stars', 'issues'] as SortOption[]).map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleSortChange(opt)}
                      className="w-full px-4 py-2.5 text-left text-sm cursor-pointer transition-colors duration-100"
                      style={{
                        color: sort === opt ? '#22c55e' : '#a1a1aa',
                        background: 'transparent',
                        border: 'none',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      {SORT_LABELS[opt]}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sections */}
          <div className="space-y-16">
            {/* Section 1 — For You */}
            <ForYouSection
              repos={exploreData?.forYou ?? []}
              loading={isLoading}
              isRefreshing={isRefreshingForYou}
              savedRepos={savedRepos}
              onRefresh={handleRefreshForYou}
              onBookmark={handleBookmark}
            />

            {!isLoading && (
              <div style={{ height: '1px', background: '#1f1f1f' }} />
            )}

            {/* Section 2 — Trending */}
            <TrendingSection
              trendingByLanguage={exploreData?.trendingByLanguage ?? []}
              loading={isLoading}
            />

            {!isLoading && (
              <div style={{ height: '1px', background: '#1f1f1f' }} />
            )}

            {/* Section 3 — Browse */}
            <div ref={browseRef}>
              <BrowseSection
                repos={exploreData?.topicRepos ?? []}
                topics={userTopics}
                activeTopic={activeTopic}
                onTopicChange={handleTopicChange}
                loading={isLoading || isLoadingBrowse}
                currentPage={currentPage}
                totalPages={exploreData?.totalPages ?? 1}
                onPageChange={handlePageChange}
                expandedIssues={expandedIssues}
                onToggleIssues={toggleExpandIssues}
                savedRepos={savedRepos}
                onBookmark={handleBookmark}
              />
            </div>

            {!isLoading && (
              <div style={{ height: '1px', background: '#1f1f1f' }} />
            )}

            {/* Section 4 — Explore New */}
            <ExploreNewBanner
              repo={exploreNew}
              loading={isLoading}
              isLoadingNew={isLoadingNew}
              onRefresh={handleRefreshNew}
            />
          </div>
        </div>
      </div>

      {toast && <GreenToast message={toast} onClose={() => setToast(null)} />}
    </>
  );
}

function GreenToast({
  message,
  onClose,
}: {
  message: string;
  onClose: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(onClose, 3000);
    return () => clearTimeout(t);
  }, [onClose]);

  return (
    <div
      className="fixed z-50 flex items-center gap-2 px-4 py-3 rounded-2xl text-sm font-semibold cursor-pointer"
      style={{
        bottom: '24px',
        right: '24px',
        background: 'linear-gradient(135deg, #16a34a, #22c55e)',
        color: '#000000',
        boxShadow: '0 8px 32px rgba(34,197,94,0.35)',
        animation: 'toastIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
        maxWidth: '320px',
      }}
      onClick={onClose}
    >
      🔖 {message}
    </div>
  );
}
