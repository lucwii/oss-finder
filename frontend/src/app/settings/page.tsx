'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useSettings } from './hooks/useSettings';
import { Sidebar } from './components/Sidebar';
import { PreferencesTab } from './components/PreferencesTab';
import { SecurityTab } from './components/SecurityTab';
import { DangerTab } from './components/DangerTab';
import { DeleteModal } from './components/DeleteModal';
import { ToastContainer } from './components/ToastContainer';
import type { TabKey } from './components/Sidebar';

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab]           = useState<TabKey>('preferences');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
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
  } = useSettings(user?.id);

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  const handleDeleteConfirm = async () => {
    try {
      await deleteAccount();
    } catch {
      setShowDeleteModal(false);
    }
  };

  if (authLoading || (!user && !authLoading)) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes modalIn {
          from { transform: scale(0.95); opacity: 0; }
          to   { transform: scale(1);    opacity: 1; }
        }
        @keyframes shake {
          0%   { transform: translateX(0); }
          20%  { transform: translateX(-8px); }
          40%  { transform: translateX(8px); }
          60%  { transform: translateX(-4px); }
          80%  { transform: translateX(4px); }
          100% { transform: translateX(0); }
        }
        @keyframes tabFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        input::placeholder { color: #52525b; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Inter, sans-serif', color: '#ffffff' }}>

        {/* Page header */}
        <div style={{ borderBottom: '1px solid #27272a', padding: '24px 0' }}>
          <div className="max-w-[960px] mx-auto px-4 sm:px-6">
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
                marginBottom: 16,
                transition: 'color 150ms',
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#ffffff'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.color = '#a1a1aa'; }}
            >
              <ArrowLeft size={14} />
              Back to Dashboard
            </button>
            <h1 className="text-2xl md:text-[28px]" style={{ fontWeight: 700, color: '#ffffff', marginBottom: 4 }}>Settings</h1>
            <p style={{ color: '#a1a1aa', fontSize: 14 }}>Manage your account and preferences</p>
          </div>
        </div>

        <div className="max-w-[960px] mx-auto px-4 sm:px-6 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">

            {/* Sidebar */}
            <div className="w-full md:w-[220px] md:flex-shrink-0">
              <Sidebar activeTab={activeTab} onChange={setActiveTab} />
            </div>

            {/* Tab content */}
            <div className="flex-1 min-w-0 w-full">
              {activeTab === 'preferences' && (
                <PreferencesTab
                  isLoading={isLoading}
                  isSaving={isSaving}
                  saveSuccess={saveSuccess}
                  formData={formData}
                  onChange={setFormData}
                  onSave={savePreferences}
                  addToast={addToast}
                />
              )}

              {activeTab === 'security' && (
                <SecurityTab
                  profile={profile}
                  passwordData={passwordData}
                  isUpdating={isUpdatingPassword}
                  onChange={setPasswordData}
                  onUpdate={updatePassword}
                  addToast={addToast}
                />
              )}

              {activeTab === 'danger' && (
                <DangerTab onDeleteClick={() => setShowDeleteModal(true)} />
              )}
            </div>
          </div>
        </div>
      </div>

      {showDeleteModal && (
        <DeleteModal
          isDeleting={isDeleting}
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleDeleteConfirm}
        />
      )}

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  );
}
