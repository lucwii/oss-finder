'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SavedPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function SavedPagination({ currentPage, totalPages, onPageChange }: SavedPaginationProps) {
  if (totalPages <= 1) return null;

  // Build visible page numbers (max 5, with ellipsis)
  const pages: (number | '...')[] = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else if (currentPage <= 3) {
    pages.push(1, 2, 3, 4, '...', totalPages);
  } else if (currentPage >= totalPages - 2) {
    pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
  } else {
    pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
  }

  return (
    <div className="flex items-center justify-center gap-1 mt-8">
      {/* Previous */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer"
        style={{
          background: '#111111',
          border: '1px solid #27272a',
          color: currentPage === 1 ? '#3f3f46' : '#a1a1aa',
          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => { if (currentPage !== 1) e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { if (currentPage !== 1) e.currentTarget.style.color = '#a1a1aa'; }}
      >
        <ChevronLeft size={14} />
        Prev
      </button>

      {/* Page numbers */}
      {pages.map((p, i) =>
        p === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: '#3f3f46' }}>
            ...
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onPageChange(p as number)}
            className="w-9 h-9 rounded-lg text-sm font-medium transition-all duration-150 cursor-pointer"
            style={{
              background: currentPage === p ? '#22c55e' : '#111111',
              border: `1px solid ${currentPage === p ? '#22c55e' : '#27272a'}`,
              color: currentPage === p ? '#000000' : '#a1a1aa',
              fontWeight: currentPage === p ? 700 : 400,
            }}
            onMouseEnter={(e) => { if (currentPage !== p) { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#ffffff'; } }}
            onMouseLeave={(e) => { if (currentPage !== p) { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; } }}
          >
            {p}
          </button>
        ),
      )}

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 rounded-lg text-sm transition-all duration-150"
        style={{
          background: '#111111',
          border: '1px solid #27272a',
          color: currentPage === totalPages ? '#3f3f46' : '#a1a1aa',
          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
        }}
        onMouseEnter={(e) => { if (currentPage !== totalPages) e.currentTarget.style.color = '#ffffff'; }}
        onMouseLeave={(e) => { if (currentPage !== totalPages) e.currentTarget.style.color = '#a1a1aa'; }}
      >
        Next
        <ChevronRight size={14} />
      </button>
    </div>
  );
}
