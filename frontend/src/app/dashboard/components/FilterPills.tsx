'use client';

const FILTERS = [
  { id: 'all', label: '⚡ All', dot: null },
  { id: 'JavaScript', label: 'JavaScript', dot: '#eab308' },
  { id: 'TypeScript', label: 'TypeScript', dot: '#3b82f6' },
  { id: 'Python', label: 'Python', dot: '#3b82f6' },
  { id: 'Go', label: 'Go', dot: '#06b6d4' },
  { id: 'Rust', label: 'Rust', dot: '#f97316' },
  { id: 'web', label: '🌐 Web', dot: null },
  { id: 'ai', label: '🤖 AI/ML', dot: null },
  { id: 'devtools', label: '🛠️ DevTools', dot: null },
  { id: 'documentation', label: '📚 Docs', dot: null },
  { id: 'testing', label: '🧪 Testing', dot: null },
];

interface FilterPillsProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function FilterPills({ activeFilter, onFilterChange }: FilterPillsProps) {
  return (
    <div
      className="flex items-center gap-2 overflow-x-auto pb-2 horizontal-scroll"
      style={{ animation: 'fadeIn 0.5s ease 0.2s both', scrollbarWidth: 'none' }}
    >
      {FILTERS.map((f) => {
        const active = activeFilter === f.id;
        return (
          <button
            key={f.id}
            onClick={() => onFilterChange(f.id)}
            className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium cursor-pointer transition-all duration-200"
            style={{
              background: active ? 'rgba(34,197,94,0.1)' : '#111111',
              border: `1px solid ${active ? '#22c55e' : '#27272a'}`,
              color: active ? '#22c55e' : '#a1a1aa',
            }}
            onMouseEnter={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#3f3f46';
            }}
            onMouseLeave={(e) => {
              if (!active) e.currentTarget.style.borderColor = '#27272a';
            }}
          >
            {f.dot && (
              <span
                className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                style={{ background: f.dot }}
              />
            )}
            {f.label}
          </button>
        );
      })}
    </div>
  );
}
