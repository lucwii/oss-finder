'use client';

import Link from 'next/link';
import { Compass, LayoutDashboard, Settings, ArrowRight, Zap } from 'lucide-react';

const ACTIONS = [
  {
    icon: Compass,
    color: '#22c55e',
    title: 'Explore Repos',
    description: 'Find new repositories to contribute to',
    href: '/explore',
  },
  {
    icon: LayoutDashboard,
    color: '#a855f7',
    title: 'View Dashboard',
    description: 'See your personalized recommendations',
    href: '/dashboard',
  },
  {
    icon: Settings,
    color: '#06b6d4',
    title: 'Edit Preferences',
    description: 'Update your languages and interests',
    href: '/settings',
  },
];

export function QuickActions() {
  return (
    <div style={{ animation: 'fadeUp 400ms ease both', animationDelay: '400ms' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <Zap size={18} color="#a1a1aa" />
        <h2 style={{ fontSize: 17, fontWeight: 700, color: '#ffffff' }}>Quick Actions</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }} className="sm:grid-cols-3 grid-cols-1">
        {ACTIONS.map(({ icon: Icon, color, title, description, href }) => (
          <Link
            key={href}
            href={href}
            style={{ textDecoration: 'none' }}
          >
            <div
              style={{
                background: '#111111',
                border: '1px solid #27272a',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                height: '100%',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = color;
                el.style.transform = 'translateY(-2px)';
                const arrow = el.querySelector('.action-arrow') as HTMLElement;
                if (arrow) { arrow.style.opacity = '1'; arrow.style.transform = 'translateX(0)'; }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLDivElement;
                el.style.borderColor = '#27272a';
                el.style.transform = 'translateY(0)';
                const arrow = el.querySelector('.action-arrow') as HTMLElement;
                if (arrow) { arrow.style.opacity = '0'; arrow.style.transform = 'translateX(-4px)'; }
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={20} color={color} />
                </div>
                <ArrowRight
                  size={16}
                  color={color}
                  className="action-arrow"
                  style={{ opacity: 0, transform: 'translateX(-4px)', transition: 'all 200ms ease' }}
                />
              </div>
              <div>
                <p style={{ fontSize: 14, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>{title}</p>
                <p style={{ fontSize: 13, color: '#a1a1aa', lineHeight: 1.5 }}>{description}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
