'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProfile } from './hooks/useProfile';
import { ProfileHeader } from './components/ProfileHeader';
import { StatsRow } from './components/StatsRow';
import { Achievements } from './components/Achievements';
import { YourStack } from './components/YourStack';
import { QuickActions } from './components/QuickActions';
import { ProfileSkeleton } from './components/Skeletons';
import { ErrorState } from './components/ErrorState';
import { ActivityGraph } from '@/components/ActivityGraph';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { profile, isLoading, error, retry } = useProfile(user?.id);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  if (authLoading || (!user && !authLoading)) return null;

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: '#ffffff', paddingTop: 80 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          <button
            onClick={() => router.push('/dashboard')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              color: '#a1a1aa',
              fontSize: 13,
              cursor: 'pointer',
              padding: 0,
              alignSelf: 'flex-start',
              transition: 'color 150ms',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#a1a1aa'; }}
          >
            <ArrowLeft size={14} />
            Back to Dashboard
          </button>

          {isLoading && <ProfileSkeleton />}

          {!isLoading && error && <ErrorState onRetry={retry} />}

          {!isLoading && !error && profile && (
            <>
              <ProfileHeader profile={profile} />
              <StatsRow profile={profile} />

              {/* Activity graph */}
              <div style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 16, padding: 28, animation: 'fadeUp 400ms ease both', animationDelay: '150ms' }}>
                <ActivityGraph userId={user!.id} />
              </div>

              {/* Achievements + Stack in a card */}
              <div style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 16, padding: 28, display: 'flex', flexDirection: 'column', gap: 28 }}>
                <Achievements profile={profile} />
                <div style={{ height: 1, background: '#27272a' }} />
                <YourStack profile={profile} />
              </div>

              <QuickActions />
            </>
          )}

        </div>
      </div>
    </>
  );
}
