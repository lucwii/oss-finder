'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onPageChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </button>

      <div className="flex items-center gap-1.5">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            onClick={() => onPageChange(p)}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-all duration-200 ${
              p === page
                ? 'bg-[#22c55e]/10 border border-[#22c55e]/40 text-[#22c55e]'
                : 'bg-[#111111] border border-[#27272a] text-[#a1a1aa] hover:text-white hover:border-[#3f3f46]'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="flex items-center gap-1.5 px-3 py-2 bg-[#111111] border border-[#27272a] rounded-lg text-sm text-[#a1a1aa] hover:text-white hover:border-[#3f3f46] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
