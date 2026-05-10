'use client';

export function SkeletonRepoCards() {
  return (
    <div className="flex flex-col gap-4">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-xl p-5"
          style={{
            background: '#111111',
            border: '1px solid #27272a',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.15}s`,
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <div className="h-5 w-20 rounded-full" style={{ background: '#1a1a1a' }} />
            <div className="h-5 w-40 rounded-full" style={{ background: '#1a1a1a' }} />
          </div>
          <div className="h-4 w-full rounded-full mb-2" style={{ background: '#1a1a1a' }} />
          <div className="h-4 w-3/4 rounded-full mb-4" style={{ background: '#1a1a1a' }} />
          <div className="flex gap-2 mb-3">
            <div className="h-7 w-24 rounded-full" style={{ background: '#1a1a1a' }} />
            <div className="h-7 w-24 rounded-full" style={{ background: '#1a1a1a' }} />
            <div className="h-7 w-24 rounded-full" style={{ background: '#1a1a1a' }} />
          </div>
          <div className="flex justify-between">
            <div className="h-4 w-32 rounded-full" style={{ background: '#1a1a1a' }} />
            <div className="h-4 w-20 rounded-full" style={{ background: '#1a1a1a' }} />
          </div>
        </div>
      ))}
    </div>
  );
}
