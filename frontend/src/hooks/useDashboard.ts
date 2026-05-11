'use client';

import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type {
  Recommendation,
  Stats,
  TrendingRepo,
  Achievement,
  RecentlyViewedRepo,
} from '@/app/dashboard/data/mock-data';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

interface DashboardState {
  recommendations: Recommendation[];
  stats: Stats;
  trending: TrendingRepo[];
  achievements: Achievement[];
  recentlyViewed: RecentlyViewedRepo[];
  loading: boolean;
  error: string | null;
}

const EMPTY_STATS: Stats = {
  repos_viewed: 0,
  issues_clicked: 0,
  days_streak: 0,
  achievements: [],
};

const DEFAULT_STATE: DashboardState = {
  recommendations: [],
  stats: EMPTY_STATS,
  trending: [],
  achievements: [],
  recentlyViewed: [],
  loading: true,
  error: null,
};

function getCacheKey(userId: string): string {
  const today = new Date().toISOString().split('T')[0];
  return `oss_dashboard_${userId}_${today}`;
}

function readCache(userId: string): DashboardState | null {
  try {
    const raw = localStorage.getItem(getCacheKey(userId));
    return raw ? (JSON.parse(raw) as DashboardState) : null;
  } catch {
    return null;
  }
}

function writeCache(userId: string, state: DashboardState): void {
  try {
    localStorage.setItem(getCacheKey(userId), JSON.stringify(state));
  } catch {}
}

function pruneOldCache(userId: string): void {
  try {
    const today = new Date().toISOString().split('T')[0];
    const prefix = `oss_dashboard_${userId}_`;
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key?.startsWith(prefix) && !key.endsWith(today)) {
        localStorage.removeItem(key);
      }
    }
  } catch {}
}

export function useDashboard() {
  const [state, setState] = useState<DashboardState>(DEFAULT_STATE);
  const userIdRef = useRef<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!session) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const userId = session.user.id;
        userIdRef.current = userId;

        // Show cached data immediately — no loading spinner for returning users
        const cached = readCache(userId);
        if (cached) {
          setState({ ...cached, loading: false });
          pruneOldCache(userId);
          return;
        }

        pruneOldCache(userId);

        const res = await fetch(`${API_BASE}/dashboard`, {
          headers: { Authorization: `Bearer ${session.access_token}` },
        });

        if (!res.ok) throw new Error(`Dashboard request failed: ${res.status}`);

        const data = await res.json();

        const trending: TrendingRepo[] = (data.trending ?? []).map((item: any) => ({
          name: item.repo.full_name,
          stars: item.repo.stargazers_count,
          language: item.repo.language,
          match_percentage: item.match_percentage,
        }));

        const recentlyViewed: RecentlyViewedRepo[] = (data.recently_viewed ?? []).map(
          (repo: any) => ({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            language: repo.language,
            updated_at: repo.updated_at,
          }),
        );

        const newState: DashboardState = {
          recommendations: data.recommendations ?? [],
          stats: data.stats ?? EMPTY_STATS,
          trending,
          achievements: data.achievements ?? [],
          recentlyViewed,
          loading: false,
          error: null,
        };

        // Only cache if we actually got recommendations — empty results could be a transient backend error
        if (newState.recommendations.length > 0) {
          writeCache(userId, newState);
        }
        setState(newState);
      } catch (err: any) {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    }

    load();
  }, []);

  async function refreshStatsAndAchievements(token: string) {
    const res = await fetch(`${API_BASE}/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    setState((prev) => {
      const newState = {
        ...prev,
        stats: data.stats ?? prev.stats,
        achievements: data.achievements ?? prev.achievements,
      };
      if (userIdRef.current) writeCache(userIdRef.current, newState);
      return newState;
    });
  }

  async function trackRepoView(repoData: any) {
    // Optimistic update — increment counter immediately in UI
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, repos_viewed: prev.stats.repos_viewed + 1 },
    }));

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`${API_BASE}/dashboard/track/repo`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ repoData }),
    });

    await refreshStatsAndAchievements(session.access_token);
  }

  async function trackIssueClick() {
    setState((prev) => ({
      ...prev,
      stats: { ...prev.stats, issues_clicked: prev.stats.issues_clicked + 1 },
    }));

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`${API_BASE}/dashboard/track/issue`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    await refreshStatsAndAchievements(session.access_token);
  }

  return { ...state, trackRepoView, trackIssueClick };
}
