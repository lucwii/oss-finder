'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { Profile, FormData, PasswordData, Toast } from '../types';

const authFetch = async (url: string, options: RequestInit = {}) => {
  const { data: { session } } = await supabase.auth.getSession();
  return fetch(`http://localhost:3001${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${session?.access_token}`,
      ...options.headers,
    },
  });
};

export function useSettings(userId: string | undefined) {
  const router = useRouter();
  const toastCounter = useRef(0);

  const [isLoading, setIsLoading]       = useState(true);
  const [isSaving, setIsSaving]         = useState(false);
  const [saveSuccess, setSaveSuccess]   = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [isDeleting, setIsDeleting]     = useState(false);
  const [profile, setProfile]           = useState<Profile | null>(null);
  const [toasts, setToasts]             = useState<Toast[]>([]);

  const [formData, setFormData] = useState<FormData>({
    languages: [],
    experience_years: '',
    open_source_experience: '',
    interests: [],
    goal: '',
  });

  const [passwordData, setPasswordData] = useState<PasswordData>({
    current_password: '',
    new_password: '',
    confirm_password: '',
  });

  const addToast = useCallback((type: 'success' | 'error', message: string) => {
    const id = ++toastCounter.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    if (!userId) return;
    (async () => {
      try {
        const res = await authFetch('/settings/profile');
        if (!res.ok) throw new Error();
        const data: Profile = await res.json();
        setProfile(data);
        setFormData({
          languages: data.languages ?? [],
          experience_years: data.experience_years ?? '',
          open_source_experience: data.open_source_experience ?? '',
          interests: data.interests ?? [],
          goal: data.goal ?? '',
        });
      } catch {
        addToast('error', 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    })();
  }, [userId, addToast]);

  const savePreferences = async () => {
    setIsSaving(true);
    try {
      const res = await authFetch('/settings/profile', {
        method: 'PATCH',
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to save preferences');
      }
      setSaveSuccess(true);
      addToast('success', 'Preferences saved successfully');
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to save preferences');
    } finally {
      setIsSaving(false);
    }
  };

  const updatePassword = async () => {
    setIsUpdatingPassword(true);
    try {
      const res = await authFetch('/settings/password', {
        method: 'PATCH',
        body: JSON.stringify(passwordData),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to update password');
      }
      setPasswordData({ current_password: '', new_password: '', confirm_password: '' });
      addToast('success', 'Password updated successfully');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to update password');
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const deleteAccount = async () => {
    setIsDeleting(true);
    try {
      const res = await authFetch('/settings/account', { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete account');
      }
      await supabase.auth.signOut();
      router.push('/');
    } catch (err) {
      addToast('error', err instanceof Error ? err.message : 'Failed to delete account');
      setIsDeleting(false);
      throw err;
    }
  };

  return {
    isLoading,
    isSaving,
    saveSuccess,
    isUpdatingPassword,
    isDeleting,
    profile,
    formData,
    setFormData,
    passwordData,
    setPasswordData,
    toasts,
    addToast,
    removeToast,
    savePreferences,
    updatePassword,
    deleteAccount,
  };
}
