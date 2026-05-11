'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookMarked,
  CheckCircle,
  ChevronDown,
  Folder,
  Search,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { DashboardNavbar } from '@/app/dashboard/components/DashboardNavbar';
import { useSaved } from './hooks/useSaved';
import { CollectionSidebar } from './components/CollectionSidebar';
import { SavedRepoCard } from './components/SavedRepoCard';
import { SavedPagination } from './components/SavedPagination';
import { SkeletonRepoCards } from './components/SkeletonSaved';
import { SavedToastContainer } from './components/SavedToast';

export default function SavedPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();
  const repoListRef = useRef<HTMLDivElement>(null);

  const {
    collections,
    repos,
    total,
    totalPages,
    currentPage,
    availableLanguages,
    totalSaved,
    inProgressCount,
    completedCount,
    activeCollection,
    activeCollectionName,
    sort,
    langFilter,
    loadingCollections,
    loadingRepos,
    removingId,
    toasts,
    selectCollection,
    createCollection,
    deleteCollection,
    removeRepo,
    updateStatus,
    moveToCollection,
    goToPage,
    setSort,
    setLangFilter,
    removeToast,
  } = useSaved();

  useEffect(() => {
    if (!authLoading && !user) router.push('/login');
  }, [authLoading, user, router]);

  // Scroll to top of repo list on page change
  const handlePageChange = (page: number) => {
    goToPage(page);
    repoListRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (authLoading || !user) return null;

  const isAllEmpty = !loadingRepos && total === 0 && activeCollection === 'all' && langFilter === 'all';
  const isCollectionEmpty = !loadingRepos && repos.length === 0 && !isAllEmpty && langFilter === 'all';
  const isFilterEmpty = !loadingRepos && repos.length === 0 && langFilter !== 'all';

  return (
    <>
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes toastIn {
          from { transform: translateX(110%); opacity: 0; }
          to   { transform: translateX(0);    opacity: 1; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        @keyframes cardIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{ background: '#0a0a0a', minHeight: '100vh' }}>
        <DashboardNavbar user={user} streak={0} onSignOut={signOut} />

        {/* Page content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-24">
          {/* Mobile: collection pills */}
          <div className="md:hidden mb-6 overflow-x-auto pb-2">
            <div className="flex gap-2 w-max">
              {collections.map((c) => (
                <button
                  key={c.id}
                  onClick={() => selectCollection(c.id)}
                  className="px-3 py-1.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all duration-150"
                  style={{
                    background: activeCollection === c.id ? '#22c55e' : '#111111',
                    border: `1px solid ${activeCollection === c.id ? '#22c55e' : '#27272a'}`,
                    color: activeCollection === c.id ? '#000000' : '#a1a1aa',
                    fontWeight: activeCollection === c.id ? 600 : 400,
                  }}
                >
                  {c.name}
                  {c.count > 0 && (
                    <span className="ml-1.5 text-xs opacity-70">{c.count}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-8">
            {/* Left sidebar — desktop only */}
            <aside
              className="hidden md:block flex-shrink-0"
              style={{ width: '240px', position: 'sticky', top: '88px', alignSelf: 'flex-start', maxHeight: 'calc(100vh - 100px)', overflowY: 'auto' }}
            >
              <CollectionSidebar
                collections={collections}
                activeId={activeCollection}
                loading={loadingCollections}
                onSelect={selectCollection}
                onCreate={createCollection}
                onDelete={deleteCollection}
              />
            </aside>

            {/* Right content */}
            <div className="flex-1 min-w-0">
              {/* Content header */}
              <div className="mb-6">
                <div className="flex items-start justify-between gap-4 mb-4 flex-wrap">
                  <div>
                    <h1 className="text-2xl font-bold text-white">{activeCollectionName}</h1>
                    <p className="text-sm mt-0.5" style={{ color: '#a1a1aa' }}>
                      {total} {total === 1 ? 'repository' : 'repositories'}
                    </p>
                  </div>
                  {/* Sort dropdown */}
                  <div className="relative">
                    <select
                      value={sort}
                      onChange={(e) => setSort(e.target.value as 'date' | 'stars')}
                      className="appearance-none pl-3 pr-8 py-2 rounded-lg text-sm cursor-pointer transition-colors duration-150 outline-none"
                      style={{
                        background: '#111111',
                        border: '1px solid #27272a',
                        color: '#a1a1aa',
                      }}
                    >
                      <option value="date">Date Saved</option>
                      <option value="stars">Most Stars</option>
                    </select>
                    <ChevronDown
                      size={12}
                      className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2"
                      style={{ color: '#52525b' }}
                    />
                  </div>
                </div>

                {/* Stats bar */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <StatBadge
                    icon={<BookMarked size={12} />}
                    label={`${totalSaved} Saved`}
                    active={activeCollection === 'all'}
                    onClick={() => selectCollection('all')}
                  />
                  <StatBadge
                    icon={<Zap size={12} />}
                    label={`${inProgressCount} In Progress`}
                    active={activeCollection === 'in_progress'}
                    onClick={() => selectCollection('in_progress')}
                  />
                  <StatBadge
                    icon={<CheckCircle size={12} />}
                    label={`${completedCount} Completed`}
                    active={activeCollection === 'completed'}
                    onClick={() => selectCollection('completed')}
                  />
                </div>

                {/* Language filter pills */}
                {availableLanguages.length > 0 && (
                  <div className="overflow-x-auto pb-1">
                    <div className="flex gap-1.5 w-max">
                      {['all', ...availableLanguages].map((lang) => (
                        <button
                          key={lang}
                          onClick={() => setLangFilter(lang)}
                          className="px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap cursor-pointer transition-all duration-150"
                          style={{
                            background: langFilter === lang ? 'rgba(34,197,94,0.12)' : '#111111',
                            border: `1px solid ${langFilter === lang ? 'rgba(34,197,94,0.3)' : '#27272a'}`,
                            color: langFilter === lang ? '#22c55e' : '#a1a1aa',
                          }}
                          onMouseEnter={(e) => { if (langFilter !== lang) { e.currentTarget.style.color = '#ffffff'; e.currentTarget.style.borderColor = '#3f3f46'; } }}
                          onMouseLeave={(e) => { if (langFilter !== lang) { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.borderColor = '#27272a'; } }}
                        >
                          {lang === 'all' ? 'All' : lang}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Repo list */}
              <div ref={repoListRef} className="relative">
                {loadingRepos && repos.length > 0 && (
                  <div
                    className="absolute inset-0 z-10 flex items-start justify-end pt-2 pr-2"
                    style={{ background: 'rgba(10,10,10,0.4)' }}
                  >
                    <div
                      className="w-5 h-5 rounded-full border-2"
                      style={{
                        borderColor: '#22c55e',
                        borderTopColor: 'transparent',
                        animation: 'spin 0.7s linear infinite',
                      }}
                    />
                  </div>
                )}

                <div
                  style={{
                    opacity: loadingRepos && repos.length > 0 ? 0.5 : 1,
                    transition: 'opacity 0.2s',
                  }}
                >
                  {/* Empty states */}
                  {isAllEmpty && <EmptyAll />}
                  {isCollectionEmpty && <EmptyCollection />}
                  {isFilterEmpty && (
                    <EmptyFilter onClear={() => setLangFilter('all')} />
                  )}

                  {/* Initial loading */}
                  {loadingRepos && repos.length === 0 && <SkeletonRepoCards />}

                  {/* Repo cards */}
                  {!loadingRepos || repos.length > 0 ? (
                    <div className="flex flex-col gap-4">
                      {repos.map((repo, i) => (
                        <div
                          key={repo.id}
                          style={{
                            animation: `cardIn 0.3s ease ${i * 0.05}s both`,
                          }}
                        >
                          <SavedRepoCard
                            repo={repo}
                            collections={collections}
                            isRemoving={removingId === repo.repo_id}
                            onUpdateStatus={updateStatus}
                            onMoveToCollection={moveToCollection}
                            onRemove={removeRepo}
                          />
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Pagination */}
              <SavedPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>

      <SavedToastContainer toasts={toasts} onRemove={removeToast} />

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
}

// ─── Stat badge ───────────────────────────────────────────────────────────────

function StatBadge({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition-all duration-150"
      style={{
        background: '#111111',
        border: `1px solid ${active ? '#22c55e' : '#27272a'}`,
        color: active ? '#22c55e' : '#a1a1aa',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.borderColor = '#3f3f46'; e.currentTarget.style.color = '#ffffff'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.borderColor = '#27272a'; e.currentTarget.style.color = '#a1a1aa'; } }}
    >
      {icon}
      {label}
    </button>
  );
}

// ─── Empty states ─────────────────────────────────────────────────────────────

function EmptyAll() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <BookMarked size={48} style={{ color: '#27272a', marginBottom: '16px' }} />
      <h3 className="text-lg font-bold text-white mb-2">No saved repositories yet</h3>
      <p className="text-sm mb-6 max-w-xs" style={{ color: '#a1a1aa' }}>
        Explore repositories and bookmark the ones you like
      </p>
      <Link
        href="/explore"
        className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
        style={{
          background: 'rgba(34,197,94,0.1)',
          border: '1px solid rgba(34,197,94,0.3)',
          color: '#22c55e',
        }}
        onMouseEnter={(e: any) => { e.currentTarget.style.background = 'rgba(34,197,94,0.18)'; }}
        onMouseLeave={(e: any) => { e.currentTarget.style.background = 'rgba(34,197,94,0.1)'; }}
      >
        Explore Repositories →
      </Link>
    </div>
  );
}

function EmptyCollection() {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Folder size={48} style={{ color: '#27272a', marginBottom: '16px' }} />
      <h3 className="text-lg font-bold text-white mb-2">This collection is empty</h3>
      <p className="text-sm" style={{ color: '#a1a1aa' }}>
        Move repositories here from All Saved
      </p>
    </div>
  );
}

function EmptyFilter({ onClear }: { onClear: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Search size={48} style={{ color: '#27272a', marginBottom: '16px' }} />
      <h3 className="text-lg font-bold text-white mb-2">No repositories match this filter</h3>
      <button
        onClick={onClear}
        className="mt-4 text-sm font-medium transition-colors duration-150 cursor-pointer"
        style={{ color: '#22c55e' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#16a34a'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = '#22c55e'; }}
      >
        Clear filters
      </button>
    </div>
  );
}
