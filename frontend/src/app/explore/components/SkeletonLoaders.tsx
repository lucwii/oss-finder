'use client';

export function ForYouSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl skeleton-shimmer"
          style={{ height: '210px', border: '1px solid #1f1f1f' }}
        />
      ))}
    </div>
  );
}

export function TrendingSkeleton() {
  return (
    <div className="space-y-8">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i}>
          <div className="h-5 w-44 rounded-lg skeleton-shimmer mb-4" style={{ border: '1px solid #1f1f1f' }} />
          <div className="grid grid-cols-3 gap-3" style={{ minWidth: '480px' }}>
            {Array.from({ length: 3 }).map((_, j) => (
              <div
                key={j}
                className="rounded-lg skeleton-shimmer"
                style={{ height: '110px', border: '1px solid #1f1f1f' }}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function BrowseSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl skeleton-shimmer"
          style={{ height: '230px', border: '1px solid #1f1f1f' }}
        />
      ))}
    </div>
  );
}

export function ExploreNewSkeleton() {
  return (
    <div
      className="rounded-2xl skeleton-shimmer"
      style={{ height: '192px', border: '1px solid #1f1f1f' }}
    />
  );
}
