'use client';

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { FullProfile } from '../types';

const authFetch = async (url: string) => {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(`http://localhost:3001${url}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
    },
  });
};

export function useProfile(userId: string | undefined) {
  const [profile, setProfile]   = useState<FullProfile | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [error, setError]       = useState(false);

  const fetch = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    setError(false);
    try {
      const res = await authFetch('/settings/profile/full');
      if (!res.ok) throw new Error();
      const data: FullProfile = await res.json();
      setProfile(data);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { profile, isLoading, error, retry: fetch };
}
