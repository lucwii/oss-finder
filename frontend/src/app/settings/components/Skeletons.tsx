'use client';

function SkeletonBlock({ width, height, borderRadius = 6 }: { width: string | number; height: number; borderRadius?: number }) {
  return (
    <div
      className="animate-pulse"
      style={{ width, height, borderRadius, background: '#1a1a1a', flexShrink: 0 }}
    />
  );
}

export function PreferencesSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
      <div>
        <SkeletonBlock width={120} height={16} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8, marginTop: 12 }}>
          {Array(10).fill(0).map((_, i) => <SkeletonBlock key={i} width="100%" height={44} />)}
        </div>
      </div>
      <div>
        <SkeletonBlock width={140} height={16} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {Array(4).fill(0).map((_, i) => <SkeletonBlock key={i} width={90} height={36} borderRadius={20} />)}
        </div>
      </div>
      <div>
        <SkeletonBlock width={180} height={16} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {Array(3).fill(0).map((_, i) => <SkeletonBlock key={i} width={100} height={36} borderRadius={20} />)}
        </div>
      </div>
      <div>
        <SkeletonBlock width={100} height={16} />
        <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
          {Array(8).fill(0).map((_, i) => <SkeletonBlock key={i} width={120} height={36} borderRadius={20} />)}
        </div>
      </div>
    </div>
  );
}
