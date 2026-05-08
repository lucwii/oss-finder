'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Activity,
  Bookmark,
  ChevronDown,
  Flame,
  LogOut,
  Settings,
  Trophy,
  User,
  Zap,
} from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardNavbarProps {
  user: SupabaseUser | null;
  streak: number;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', soon: false },
  { label: 'Saved', href: '/saved', soon: true, icon: Bookmark },
  { label: 'Activity', href: '/activity', soon: true, icon: Activity },
  { label: 'Leaderboard', href: '/leaderboard', soon: true, icon: Trophy },
];

export function DashboardNavbar({ user, streak, onSignOut }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const displayName =
    (user?.user_metadata?.username as string | undefined) ??
    user?.email?.split('@')[0] ??
    'User';

  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? 'rgba(10,10,10,0.92)' : 'rgba(10,10,10,0.6)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: scrolled ? '1px solid #27272a' : '1px solid transparent',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(34,197,94,0.15)',
                border: '1px solid rgba(34,197,94,0.3)',
              }}
            >
              <Zap size={16} style={{ color: '#22c55e' }} />
            </div>
            <span className="font-bold text-white text-sm tracking-tight hidden sm:block">
              ContribFinder
            </span>
          </Link>

          {/* Nav items — desktop */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              if (item.soon) {
                return (
                  <div
                    key={item.href}
                    className="relative flex items-center gap-2 px-4 py-1.5 rounded-full text-sm select-none"
                    style={{ color: '#3f3f46', cursor: 'default' }}
                    title="Coming soon"
                  >
                    {item.label}
                    <span
                      className="px-1.5 py-0.5 rounded-full text-xs font-semibold"
                      style={{
                        background: 'rgba(168,85,247,0.12)',
                        color: '#a855f7',
                        border: '1px solid rgba(168,85,247,0.2)',
                        fontSize: '10px',
                        lineHeight: 1,
                      }}
                    >
                      soon
                    </span>
                  </div>
                );
              }
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                  style={{
                    background: active ? '#22c55e' : 'transparent',
                    color: active ? '#000000' : '#a1a1aa',
                  }}
                  onMouseEnter={(e) => {
                    if (!active) e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) e.currentTarget.style.color = '#a1a1aa';
                  }}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">

            {/* Streak */}
            {streak > 0 && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
                style={{
                  background: 'rgba(249,115,22,0.1)',
                  border: '1px solid rgba(249,115,22,0.25)',
                }}
              >
                <Flame size={13} style={{ color: '#f97316' }} />
                <span style={{ color: '#f97316', fontWeight: 600 }}>{streak}</span>
              </div>
            )}

            {/* Avatar + dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((v) => !v)}
                className="flex items-center gap-1.5 cursor-pointer rounded-full transition-all duration-150 p-0.5"
                style={{
                  background: dropdownOpen ? 'rgba(34,197,94,0.1)' : 'transparent',
                  border: `1px solid ${dropdownOpen ? 'rgba(34,197,94,0.3)' : 'transparent'}`,
                }}
              >
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                    color: '#000',
                  }}
                >
                  {initials}
                </div>
                <ChevronDown
                  size={13}
                  style={{
                    color: '#71717a',
                    transition: 'transform 0.2s',
                    transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    marginRight: '2px',
                  }}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="absolute right-0 top-full mt-2 w-56 rounded-2xl overflow-hidden"
                  style={{
                    background: '#111111',
                    border: '1px solid #27272a',
                    boxShadow: '0 24px 48px rgba(0,0,0,0.6)',
                    animation: 'fadeIn 0.15s ease forwards',
                  }}
                >
                  {/* User info */}
                  <div className="px-4 py-3" style={{ borderBottom: '1px solid #1f1f1f' }}>
                    <div className="flex items-center gap-2.5 mb-1">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{
                          background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                          color: '#000',
                        }}
                      >
                        {initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{displayName}</p>
                        <p className="text-xs truncate" style={{ color: '#52525b' }}>{user?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Links */}
                  <div className="p-1.5">
                    <DropdownItem icon={<User size={13} />} label="Profile" href="/profile" />
                    <DropdownItem icon={<Settings size={13} />} label="Settings" href="/settings" />

                    <div style={{ height: '1px', background: '#1f1f1f', margin: '6px 0' }} />

                    <button
                      onClick={() => { setDropdownOpen(false); onSignOut(); }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm cursor-pointer transition-colors duration-100"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                    >
                      <LogOut size={13} />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              className="md:hidden flex flex-col gap-1 p-2 rounded-lg cursor-pointer"
              onClick={() => setMobileOpen((v) => !v)}
              style={{ color: '#a1a1aa' }}
            >
              <span
                className="block w-4 h-0.5 rounded transition-all duration-200"
                style={{
                  background: '#a1a1aa',
                  transform: mobileOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none',
                }}
              />
              <span
                className="block w-4 h-0.5 rounded transition-all duration-200"
                style={{
                  background: '#a1a1aa',
                  opacity: mobileOpen ? 0 : 1,
                }}
              />
              <span
                className="block w-4 h-0.5 rounded transition-all duration-200"
                style={{
                  background: '#a1a1aa',
                  transform: mobileOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none',
                }}
              />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div
            className="md:hidden px-4 pb-4"
            style={{ borderTop: '1px solid #1f1f1f' }}
          >
            <div className="flex flex-col gap-1 pt-3">
              {NAV_ITEMS.map((item) => {
                const active = pathname === item.href;
                if (item.soon) {
                  return (
                    <div
                      key={item.href}
                      className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm"
                      style={{ color: '#3f3f46' }}
                    >
                      {item.label}
                      <span
                        className="px-1.5 py-0.5 rounded-full font-semibold"
                        style={{
                          background: 'rgba(168,85,247,0.12)',
                          color: '#a855f7',
                          border: '1px solid rgba(168,85,247,0.2)',
                          fontSize: '10px',
                        }}
                      >
                        soon
                      </span>
                    </div>
                  );
                }
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors duration-150"
                    style={{
                      background: active ? 'rgba(34,197,94,0.1)' : 'transparent',
                      color: active ? '#22c55e' : '#a1a1aa',
                      border: active ? '1px solid rgba(34,197,94,0.2)' : '1px solid transparent',
                    }}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>
    </>
  );
}

function DropdownItem({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors duration-100"
      style={{ color: '#a1a1aa' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </Link>
  );
}
