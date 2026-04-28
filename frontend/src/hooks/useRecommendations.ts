'use client';

import { useState, useCallback } from 'react';
import { fetchRecommendations } from '@/lib/api';
import type { RepoRecommendation, SearchParams } from '@/types/github';

const PAGE_SIZE = 5;

interface UseRecommendationsReturn {
  results: RepoRecommendation[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  hasSearched: boolean;
  search: (params: SearchParams) => Promise<void>;
  goToPage: (page: number) => void;
}

export function useRecommendations(): UseRecommendationsReturn {
  const [all, setAll] = useState<RepoRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasSearched, setHasSearched] = useState(false);

  const search = useCallback(async (params: SearchParams) => {
    setLoading(true);
    setError(null);
    setPage(1);
    setHasSearched(true);
    try {
      const data = await fetchRecommendations(params);
      setAll(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
      setAll([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const totalPages = Math.max(1, Math.ceil(all.length / PAGE_SIZE));
  const results = all.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return {
    results,
    loading,
    error,
    page,
    totalPages,
    hasSearched,
    search,
    goToPage: setPage,
  };
}
