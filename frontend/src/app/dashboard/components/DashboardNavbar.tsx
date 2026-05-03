'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Flame, LogOut, Settings, User, Zap } from 'lucide-react';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface DashboardNavbarProps {
  user: SupabaseUser | null;
  streak: number;
  onSignOut: () => void;
}

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Explore', href: '/explore' },
  { label: 'Settings', href: '/settings' },
];

export function DashboardNavbar({ user, streak, onSignOut }: DashboardNavbarProps) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
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

  const initials = user?.email
    ? user.email.slice(0, 2).toUpperCase()
    : 'CF';

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(10,10,10,0.88)' : 'rgba(10,10,10,0.5)',
        backdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
        WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'blur(8px)',
        borderBottom: scrolled ? '1px solid #27272a' : '1px solid transparent',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 flex-shrink-0">
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

        {/* Nav pills — hidden on small screens */}
        <div
          className="hidden sm:flex items-center gap-1 rounded-full p-1"
          style={{ background: '#111111', border: '1px solid #27272a' }}
        >
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={{
                  background: active ? '#22c55e' : 'transparent',
                  color: active ? '#000000' : '#a1a1aa',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Streak counter */}
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm"
            style={{
              background: 'rgba(249,115,22,0.1)',
              border: '1px solid rgba(249,115,22,0.3)',
            }}
          >
            <Flame size={14} style={{ color: '#f97316' }} />
            <span style={{ color: '#f97316', fontWeight: 600 }}>{streak} day streak</span>
          </div>

          {/* Avatar + dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 cursor-pointer"
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{
                  background: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  color: '#000',
                }}
              >
                {initials}
              </div>
              <ChevronDown
                size={14}
                style={{
                  color: '#a1a1aa',
                  transition: 'transform 0.2s',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              />
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-52 rounded-2xl overflow-hidden"
                style={{
                  background: '#111111',
                  border: '1px solid #27272a',
                  boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                  animation: 'fadeIn 0.15s ease forwards',
                }}
              >
                <div className="px-4 py-3" style={{ borderBottom: '1px solid #27272a' }}>
                  <p className="text-xs font-semibold text-white truncate">{user?.email}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#52525b' }}>Free plan</p>
                </div>
                <div className="p-1.5">
                  <DropdownItem icon={<User size={13} />} label="Profile" href="/profile" />
                  <DropdownItem icon={<Settings size={13} />} label="Settings" href="/settings" />
                  <button
                    onClick={onSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-100"
                    style={{ color: '#ef4444' }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239,68,68,0.1)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <LogOut size={13} />
                    Sign out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
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
      className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors duration-100"
      style={{ color: '#a1a1aa' }}
      onMouseEnter={(e) => (e.currentTarget.style.background = '#1a1a1a')}
      onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
    >
      {icon}
      {label}
    </Link>
  );
}
