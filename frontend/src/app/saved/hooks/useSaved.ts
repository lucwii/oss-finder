'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';

// ─── Types ───────────────────────────────────────────────────────────────────

export interface RepoData {
  id: number;
  name: string;
  full_name: string;
  description: string;
  html_url: string;
  stargazers_count: number;
  open_issues_count: number;
  language: string;
  topics: string[];
}

export interface SavedRepo {
  id: string;
  repo_id: number;
  repo_data: RepoData;
  status: 'want_to_contribute' | 'in_progress' | 'completed';
  collection_id: string | null;
  collection_name: string | null;
  saved_at: string;
}

export interface Collection {
  id: string;
  name: string;
  count: number;
  isDefault: boolean;
  created_at?: string;
}

export interface Toast {
  id: number;
  type: 'success' | 'error';
  message: string;
}

// ─── Auth helper ─────────────────────────────────────────────────────────────

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

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useSaved() {
  const toastCounter = useRef(0);

  const [collections, setCollections]       = useState<Collection[]>([]);
  const [repos, setRepos]                   = useState<SavedRepo[]>([]);
  const [total, setTotal]                   = useState(0);
  const [totalPages, setTotalPages]         = useState(1);
  const [currentPage, setCurrentPage]       = useState(1);
  const [activeCollection, setActiveCollection] = useState('all');
  const [sort, setSort]                     = useState<'date' | 'stars'>('date');
  const [langFilter, setLangFilter]         = useState('all');
  const [loadingCollections, setLoadingCollections] = useState(true);
  const [loadingRepos, setLoadingRepos]     = useState(true);
  const [removingId, setRemovingId]         = useState<number | null>(null);
  const [toasts, setToasts]                 = useState<Toast[]>([]);

  // ── Toast helpers ────────────────────────────────────────────────────────

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ── Fetch collections ────────────────────────────────────────────────────

  const fetchCollections = useCallback(async () => {
    setLoadingCollections(true);
    try {
      const res = await authFetch('/saved/collections');
      if (!res.ok) return;
      const data = await res.json();
      setCollections(data);
    } catch {
      // silent
    } finally {
      setLoadingCollections(false);
    }
  }, []);

  // ── Fetch repos ──────────────────────────────────────────────────────────

  const fetchRepos = useCallback(async (collection: string, page: number) => {
    setLoadingRepos(true);
    try {
      const res = await authFetch(`/saved?collection=${collection}&page=${page}`);
      if (!res.ok) return;
      const data = await res.json();
      setRepos(data.repos);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      // silent
    } finally {
      setLoadingRepos(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    fetchCollections();
  }, [fetchCollections]);

  useEffect(() => {
    fetchRepos(activeCollection, currentPage);
  }, [fetchRepos, activeCollection, currentPage]);

  // ── Collection actions ───────────────────────────────────────────────────

  const selectCollection = useCallback((id: string) => {
    setActiveCollection(id);
    setCurrentPage(1);
    setLangFilter('all');
  }, []);

  const createCollection = useCallback(async (name: string) => {
    try {
      const res = await authFetch('/saved/collections', {
        method: 'POST',
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? 'Failed to create collection');
      }
      const collection = await res.json();
      setCollections((prev) => [...prev, collection]);
      addToast('success', 'Collection created');
      return collection;
    } catch (err: any) {
      addToast('error', err.message ?? 'Failed to create collection');
      throw err;
    }
  }, [addToast]);

  const deleteCollection = useCallback(async (collectionId: string) => {
    try {
      const res = await authFetch(`/saved/collections/${collectionId}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete collection');
      setCollections((prev) => prev.filter((c) => c.id !== collectionId));
      if (activeCollection === collectionId) {
        setActiveCollection('all');
        setCurrentPage(1);
      }
      // Reload repos since collection_id may have become null on some repos
      fetchRepos('all', 1);
      addToast('success', 'Collection deleted');
    } catch (err: any) {
      addToast('error', err.message ?? 'Failed to delete collection');
    }
  }, [activeCollection, fetchRepos, addToast]);

  // ── Repo actions ─────────────────────────────────────────────────────────

  const removeRepo = useCallback(async (repoId: number) => {
    setRemovingId(repoId);
    // Wait for animation
    setTimeout(async () => {
      try {
        const res = await authFetch(`/saved/${repoId}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to remove repository');
        setRepos((prev) => prev.filter((r) => r.repo_id !== repoId));
        setTotal((prev) => Math.max(0, prev - 1));
        // Refresh collection counts
        fetchCollections();
        addToast('success', 'Repository removed');
      } catch (err: any) {
        addToast('error', err.message ?? 'Failed to remove repository');
      } finally {
        setRemovingId(null);
      }
    }, 300);
  }, [fetchCollections, addToast]);

  const updateStatus = useCallback(
    async (repoId: number, status: 'want_to_contribute' | 'in_progress' | 'completed') => {
      // Optimistic update
      setRepos((prev) =>
        prev.map((r) => (r.repo_id === repoId ? { ...r, status } : r)),
      );

      const labels: Record<string, string> = {
        want_to_contribute: 'Want to Contribute',
        in_progress: 'In Progress',
        completed: 'Completed',
      };

      try {
        const res = await authFetch(`/saved/${repoId}/status`, {
          method: 'PATCH',
          body: JSON.stringify({ status }),
        });
        if (!res.ok) throw new Error('Failed to update status');
        addToast('success', `Status updated to ${labels[status]}`);
        fetchCollections();
      } catch (err: any) {
        // Revert optimistic update
        fetchRepos(activeCollection, currentPage);
        addToast('error', err.message ?? 'Failed to update status');
      }
    },
    [activeCollection, currentPage, fetchCollections, fetchRepos, addToast],
  );

  const moveToCollection = useCallback(
    async (repoId: number, collectionId: string | null, collectionName: string | null) => {
      // Optimistic update
      setRepos((prev) =>
        prev.map((r) =>
          r.repo_id === repoId
            ? { ...r, collection_id: collectionId, collection_name: collectionName }
            : r,
        ),
      );

      try {
        const res = await authFetch(`/saved/${repoId}/collection`, {
          method: 'PATCH',
          body: JSON.stringify({ collection_id: collectionId }),
        });
        if (!res.ok) throw new Error('Failed to move to collection');
        fetchCollections();
      } catch (err: any) {
        fetchRepos(activeCollection, currentPage);
        addToast('error', err.message ?? 'Failed to move to collection');
      }
    },
    [activeCollection, currentPage, fetchCollections, fetchRepos, addToast],
  );

  const goToPage = useCallback((page: number) => {
    setCurrentPage(page);
    setLangFilter('all');
  }, []);

  // ── Derived data ─────────────────────────────────────────────────────────

  // Unique languages in current page
  const availableLanguages = Array.from(
    new Set(repos.map((r) => r.repo_data?.language).filter(Boolean)),
  ) as string[];

  // Client-side language + sort filtering
  const displayedRepos = (() => {
    let result = langFilter === 'all' ? repos : repos.filter((r) => r.repo_data?.language === langFilter);
    if (sort === 'stars') {
      result = [...result].sort(
        (a, b) => (b.repo_data?.stargazers_count ?? 0) - (a.repo_data?.stargazers_count ?? 0),
      );
    }
    return result;
  })();

  // Counts for stats bar (from collections)
  const totalSaved     = collections.find((c) => c.id === 'all')?.count ?? 0;
  const inProgressCount = collections.find((c) => c.id === 'in_progress')?.count ?? 0;
  const completedCount  = collections.find((c) => c.id === 'completed')?.count ?? 0;

  // Active collection label
  const activeCollectionName =
    collections.find((c) => c.id === activeCollection)?.name ?? 'All Saved';

  return {
    // Data
    collections,
    repos: displayedRepos,
    total,
    totalPages,
    currentPage,
    availableLanguages,
    totalSaved,
    inProgressCount,
    completedCount,
    activeCollection,
    activeCollectionName,
    sort,
    langFilter,
    loadingCollections,
    loadingRepos,
    removingId,
    toasts,
    // Actions
    selectCollection,
    createCollection,
    deleteCollection,
    removeRepo,
    updateStatus,
    moveToCollection,
    goToPage,
    setSort,
    setLangFilter,
    removeToast,
    refreshCollections: fetchCollections,
  };
}
