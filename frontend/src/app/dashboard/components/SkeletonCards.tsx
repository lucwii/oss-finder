'use client';

function SkeletonPill({ width }: { width: number }) {
  return (
    <div className="skeleton-shimmer rounded-full h-5" style={{ width }} />
  );
}

function SkeletonLine({ width = '100%' }: { width?: string | number }) {
  return (
    <div
      className="skeleton-shimmer rounded"
      style={{ height: '13px', width }}
    />
  );
}

function RegularSkeleton() {
  return (
    <div
      className="rounded-2xl p-5"
      style={{ background: '#111111', border: '1px solid #1a1a1a' }}
    >
      <div className="flex items-center justify-between mb-3">
        <SkeletonPill width={80} />
        <SkeletonPill width={44} />
      </div>
      <div className="skeleton-shimmer rounded-lg h-5 mb-2" style={{ width: '65%' }} />
      <div className="mb-1.5"><SkeletonLine /></div>
      <div className="mb-4"><SkeletonLine width="75%" /></div>
      <div className="flex gap-1.5 mb-4">
        {[64, 80, 56].map((w) => <SkeletonPill key={w} width={w} />)}
      </div>
      <div className="flex gap-4 mb-4">
        {[48, 60, 80].map((w) => <SkeletonLine key={w} width={w} />)}
      </div>
      <div className="skeleton-shimmer mb-3" style={{ height: '1px' }} />
      <div className="flex items-center justify-between">
        <SkeletonLine width={100} />
        <div className="skeleton-shimmer rounded-lg w-6 h-6" />
      </div>
    </div>
  );
}

function FeaturedSkeleton() {
  return (
    <div
      className="rounded-2xl p-8"
      style={{ background: '#111111', border: '1px solid #1a1a1a' }}
    >
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1">
          <div className="flex gap-2 mb-4">
            <SkeletonPill width={90} />
            <SkeletonPill width={80} />
          </div>
          <div className="skeleton-shimmer rounded-lg h-6 mb-3" style={{ width: '55%' }} />
          <div className="mb-1.5"><SkeletonLine /></div>
          <div className="mb-5"><SkeletonLine width="70%" /></div>
          <div className="flex gap-1.5 mb-6">
            {[68, 88, 60, 76].map((w) => <SkeletonPill key={w} width={w} />)}
          </div>
          <div className="flex flex-col gap-2">
            <div className="skeleton-shimmer rounded-xl" style={{ height: '52px' }} />
            <div className="skeleton-shimmer rounded-xl" style={{ height: '52px' }} />
          </div>
        </div>
        <div className="flex flex-col items-center gap-5 lg:w-52">
          <div
            className="skeleton-shimmer rounded-full"
            style={{ width: '120px', height: '120px' }}
          />
          <div className="w-full flex flex-col gap-2">
            <SkeletonLine />
            <SkeletonLine width="80%" />
            <SkeletonLine width="60%" />
          </div>
          <div className="w-full flex flex-col gap-2">
            <div className="skeleton-shimmer rounded-xl" style={{ height: '40px' }} />
            <div className="skeleton-shimmer rounded-xl" style={{ height: '40px' }} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCards() {
  return (
    <div>
      <p className="text-center text-sm mb-6" style={{ color: '#3f3f46' }}>
        Finding your perfect repositories…
      </p>
      <FeaturedSkeleton />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {[1, 2, 3, 4].map((i) => <RegularSkeleton key={i} />)}
      </div>
    </div>
  );
}
