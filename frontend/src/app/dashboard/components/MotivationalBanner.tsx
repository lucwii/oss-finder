'use client';

export function MotivationalBanner() {
  return (
    <section
      className="rounded-2xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6"
      style={{
        background:
          'linear-gradient(135deg, rgba(34,197,94,0.08) 0%, rgba(34,197,94,0.03) 60%, transparent 100%)',
        border: '1px solid rgba(34,197,94,0.15)',
        animation: 'fade-up 0.5s ease 1.1s both',
      }}
    >
      <div>
        <h2 className="text-xl font-bold text-white mb-2">
          Ready to make your first contribution?
        </h2>
        <p style={{ color: '#a1a1aa', fontSize: '14px', lineHeight: 1.6 }}>
          Pick an issue above and start today.{' '}
          <span style={{ color: '#71717a' }}>Every expert was once a beginner.</span>
        </p>
      </div>
      <button
        className="flex-shrink-0 px-6 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-200 whitespace-nowrap"
        style={{
          border: '1px solid rgba(34,197,94,0.4)',
          color: '#22c55e',
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(34,197,94,0.1)';
          e.currentTarget.style.borderColor = '#22c55e';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'transparent';
          e.currentTarget.style.borderColor = 'rgba(34,197,94,0.4)';
        }}
      >
        How to Contribute
      </button>
    </section>
  );
}
