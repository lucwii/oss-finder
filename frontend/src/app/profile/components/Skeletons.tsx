'use client';

function Pulse({ width, height, borderRadius = 8 }: { width: string | number; height: number; borderRadius?: number }) {
  return (
    <div className="animate-pulse" style={{ width, height, borderRadius, background: '#1a1a1a', flexShrink: 0 }} />
  );
}

export function ProfileSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* Header */}
      <div style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 16, padding: 32 }}>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <Pulse width={96} height={96} borderRadius={9999} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1 }}>
            <Pulse width={200} height={20} />
            <Pulse width={140} height={14} />
            <div style={{ display: 'flex', gap: 8 }}>
              <Pulse width={90} height={26} borderRadius={20} />
              <Pulse width={110} height={26} borderRadius={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
        {Array(4).fill(0).map((_, i) => (
          <div key={i} style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 12, padding: 20 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Pulse width={32} height={32} borderRadius={8} />
              <Pulse width={48} height={28} />
              <Pulse width={80} height={12} />
            </div>
          </div>
        ))}
      </div>

      {/* Achievements */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Pulse width={140} height={20} />
          <Pulse width={80} height={16} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {Array(5).fill(0).map((_, i) => (
            <div key={i} style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 12, padding: 20 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Pulse width={40} height={40} borderRadius={8} />
                <Pulse width={80} height={16} />
                <Pulse width="100%" height={12} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
