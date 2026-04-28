'use client';

import { AlertCircle, SearchX } from 'lucide-react';
import RepoCard from './RepoCard';
import LoadingSkeleton from './LoadingSkeleton';
import Pagination from './Pagination';
import type { RepoRecommendation } from '@/types/github';

interface Props {
  results: RepoRecommendation[];
  loading: boolean;
  error: string | null;
  hasSearched: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function RepoGrid({
  results,
  loading,
  error,
  hasSearched,
  page,
  totalPages,
  onPageChange,
}: Props) {
  if (loading) return <LoadingSkeleton />;

  if (error) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-400" />
        </div>
        <p className="text-[#a1a1aa] text-sm">{error}</p>
      </div>
    );
  }

  if (hasSearched && results.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-20 text-center">
        <div className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-[#27272a] flex items-center justify-center">
          <SearchX className="w-6 h-6 text-[#52525b]" />
        </div>
        <p className="text-white font-medium">No repositories found</p>
        <p className="text-[#a1a1aa] text-sm">Try a different language or skill level.</p>
      </div>
    );
  }

  if (!hasSearched) return null;

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((rec, i) => (
          <RepoCard key={rec.repo.id} recommendation={rec} index={i} />
        ))}
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
