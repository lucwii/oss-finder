'use client';

import { History, ExternalLink } from 'lucide-react';
import { getLanguageBadge, timeAgo } from '../utils/helpers';
import type { RecentlyViewedRepo } from '../data/mock-data';

interface RecentlyViewedProps {
  items: RecentlyViewedRepo[];
}

export function RecentlyViewed({ items }: RecentlyViewedProps) {
  if (items.length === 0) return null;

  return (
    <section style={{ animation: 'fade-up 0.5s ease 1s both' }}>
      <div className="flex items-center gap-2 mb-4">
        <History size={18} style={{ color: '#a1a1aa' }} />
        <h2 className="font-bold text-white text-xl">Recently Viewed</h2>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-3 horizontal-scroll">
        {items.map((item) => {
          const lang = getLanguageBadge(item.language);
          return (
            <div
              key={item.id}
              className="flex-shrink-0 rounded-xl p-4 transition-all duration-200"
              style={{
                background: '#111111',
                border: '1px solid #27272a',
                width: '220px',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(34,197,94,0.3)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#27272a';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <p
                className="font-semibold text-sm text-white truncate mb-2"
                title={item.full_name}
              >
                {item.name}
              </p>

              <span
                className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs mb-3"
                style={{ background: lang.bg, color: lang.text }}
              >
                <span className="w-1 h-1 rounded-full" style={{ background: lang.dot }} />
                {item.language}
              </span>

              <p className="text-xs mb-3" style={{ color: '#3f3f46' }}>
                Viewed {timeAgo(item.updated_at)}
              </p>

              <a
                href={item.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium transition-colors duration-150"
                style={{ color: '#52525b' }}
                onMouseEnter={(e) => (e.currentTarget.style.color = '#22c55e')}
                onMouseLeave={(e) => (e.currentTarget.style.color = '#52525b')}
              >
                View again
                <ExternalLink size={10} />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
