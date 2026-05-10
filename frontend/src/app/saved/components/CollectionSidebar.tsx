'use client';

import { useEffect, useRef, useState } from 'react';
import {
  BookOpen,
  CheckCircle,
  Folder,
  MoreHorizontal,
  Plus,
  Target,
  Trash2,
  X,
  Zap,
} from 'lucide-react';
import type { Collection } from '../hooks/useSaved';

const DEFAULT_ICONS: Record<string, React.ReactNode> = {
  all:                <BookOpen size={14} />,
  want_to_contribute: <Target size={14} />,
  in_progress:        <Zap size={14} />,
  completed:          <CheckCircle size={14} />,
};

interface CollectionSidebarProps {
  collections: Collection[];
  activeId: string;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  onDelete: (id: string) => void;
}

export function CollectionSidebar({
  collections,
  activeId,
  loading,
  onSelect,
  onCreate,
  onDelete,
}: CollectionSidebarProps) {
  const [showInput, setShowInput]             = useState(false);
  const [inputValue, setInputValue]           = useState('');
  const [submitting, setSubmitting]           = useState(false);
  const [menuOpenId, setMenuOpenId]           = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const defaultCollections = collections.filter((c) => c.isDefault);
  const customCollections  = collections.filter((c) => !c.isDefault);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  const closeMenu = () => {
    setMenuOpenId(null);
    setConfirmDeleteId(null);
  };

  const handleCreate = async () => {
    const name = inputValue.trim();
    if (!name) return;
    setSubmitting(true);
    try {
      await onCreate(name);
      setInputValue('');
      setShowInput(false);
    } catch {
      // error handled in hook
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate();
    if (e.key === 'Escape') { setShowInput(false); setInputValue(''); }
  };

  if (loading) return <SidebarSkeleton />;

  return (
    <>
      {/* Invisible backdrop — clicking it closes any open menu */}
      {menuOpenId && (
        <div
          className="fixed inset-0 z-20"
          onClick={closeMenu}
        />
      )}

      <div className="flex flex-col gap-0.5">
        {/* Header */}
        <div className="flex items-center justify-between px-2 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#52525b' }}>
            Collections
          </span>
          <button
            onClick={() => setShowInput((v) => !v)}
            className="p-1 rounded-lg transition-colors duration-150 cursor-pointer"
            style={{ color: '#52525b' }}
            onMouseEnter={(e) => { e.currentTarget.style.color = '#22c55e'; e.currentTarget.style.background = 'rgba(34,197,94,0.08)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; e.currentTarget.style.background = 'transparent'; }}
            title="New collection"
          >
            <Plus size={14} />
          </button>
        </div>

        {/* Default collections */}
        {defaultCollections.map((c) => (
          <DefaultCollectionRow
            key={c.id}
            collection={c}
            active={activeId === c.id}
            icon={DEFAULT_ICONS[c.id]}
            onSelect={() => onSelect(c.id)}
          />
        ))}

        {/* Divider */}
        {customCollections.length > 0 && (
          <div style={{ height: '1px', background: '#27272a', margin: '8px 0' }} />
        )}

        {/* Custom collections */}
        {customCollections.map((c) => (
          <CustomCollectionRow
            key={c.id}
            collection={c}
            active={activeId === c.id}
            menuOpen={menuOpenId === c.id}
            confirmDelete={confirmDeleteId === c.id}
            onSelect={() => { onSelect(c.id); closeMenu(); }}
            onMenuOpen={() => {
              // If this menu is already open, close it; otherwise open it
              if (menuOpenId === c.id) {
                closeMenu();
              } else {
                setMenuOpenId(c.id);
                setConfirmDeleteId(null);
              }
            }}
            onAskDelete={() => setConfirmDeleteId(c.id)}
            onCancelDelete={() => setConfirmDeleteId(null)}
            onConfirmDelete={() => {
              onDelete(c.id);
              closeMenu();
            }}
          />
        ))}

        {/* New collection input */}
        {showInput && (
          <div style={{ animation: 'slideDown 0.2s ease forwards', marginTop: '4px' }}>
            <div
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ background: '#1a1a1a', border: '1px solid #22c55e' }}
            >
              <Folder size={13} style={{ color: '#22c55e', flexShrink: 0 }} />
              <input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value.slice(0, 30))}
                onKeyDown={handleKeyDown}
                placeholder="Collection name..."
                disabled={submitting}
                className="flex-1 bg-transparent text-sm outline-none"
                style={{ color: '#ffffff' }}
              />
              <span className="text-xs" style={{ color: '#3f3f46', flexShrink: 0 }}>
                {inputValue.length}/30
              </span>
            </div>
            <p className="text-xs mt-1 px-1" style={{ color: '#52525b' }}>
              Enter to save · Esc to cancel
            </p>
          </div>
        )}
      </div>
    </>
  );
}

// ─── Default collection row ───────────────────────────────────────────────────

function DefaultCollectionRow({
  collection,
  active,
  icon,
  onSelect,
}: {
  collection: Collection;
  active: boolean;
  icon?: React.ReactNode;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className="w-full flex items-center justify-between gap-2 py-2 rounded-xl text-sm transition-all duration-100 cursor-pointer"
      style={{
        background: active ? '#1a1a1a' : 'transparent',
        borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
        color: active ? '#ffffff' : '#a1a1aa',
        paddingLeft: '10px',
        paddingRight: '12px',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#ffffff'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; } }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span style={{ color: active ? '#22c55e' : '#52525b', flexShrink: 0 }}>{icon}</span>
        <span className="truncate">{collection.name}</span>
      </div>
      {collection.count > 0 && (
        <span
          className="px-1.5 py-0.5 rounded-full text-xs shrink-0"
          style={{ background: '#27272a', color: '#a1a1aa' }}
        >
          {collection.count}
        </span>
      )}
    </button>
  );
}

// ─── Custom collection row ────────────────────────────────────────────────────

function CustomCollectionRow({
  collection,
  active,
  menuOpen,
  confirmDelete,
  onSelect,
  onMenuOpen,
  onAskDelete,
  onCancelDelete,
  onConfirmDelete,
}: {
  collection: Collection;
  active: boolean;
  menuOpen: boolean;
  confirmDelete: boolean;
  onSelect: () => void;
  onMenuOpen: () => void;
  onAskDelete: () => void;
  onCancelDelete: () => void;
  onConfirmDelete: () => void;
}) {
  return (
    <div className="relative group">
      <div
        className="flex items-center rounded-xl transition-all duration-100"
        style={{
          background: active ? '#1a1a1a' : 'transparent',
          borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
        }}
        onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = '#111111'; }}
        onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = 'transparent'; }}
      >
        {/* Label — select area */}
        <button
          onClick={onSelect}
          className="flex-1 flex items-center gap-2 py-2 text-sm cursor-pointer min-w-0 text-left"
          style={{
            color: active ? '#ffffff' : '#a1a1aa',
            paddingLeft: '10px',
            background: 'transparent',
            border: 'none',
          }}
          onMouseEnter={(e) => { if (!active) e.currentTarget.style.color = '#ffffff'; }}
          onMouseLeave={(e) => { if (!active) e.currentTarget.style.color = '#a1a1aa'; }}
        >
          <Folder size={14} style={{ color: active ? '#22c55e' : '#52525b', flexShrink: 0 }} />
          <span className="truncate flex-1">{collection.name}</span>
          {collection.count > 0 && (
            <span
              className="ml-1 px-1.5 py-0.5 rounded-full text-xs shrink-0"
              style={{ background: '#27272a', color: '#a1a1aa' }}
            >
              {collection.count}
            </span>
          )}
        </button>

        {/* "..." button — z-30 so it sits above the backdrop */}
        <button
          onClick={(e) => { e.stopPropagation(); onMenuOpen(); }}
          className="relative z-30 opacity-0 group-hover:opacity-100 p-1.5 mr-1 rounded-lg cursor-pointer transition-all duration-100 shrink-0"
          style={{
            color: '#71717a',
            opacity: menuOpen ? 1 : undefined,
            background: menuOpen ? '#1f1f1f' : 'transparent',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#a1a1aa'; e.currentTarget.style.background = '#1f1f1f'; }}
          onMouseLeave={(e) => {
            if (!menuOpen) {
              e.currentTarget.style.color = '#71717a';
              e.currentTarget.style.background = 'transparent';
            }
          }}
          title="Collection options"
        >
          <MoreHorizontal size={13} />
        </button>
      </div>

      {/* Dropdown — z-30 so it sits above the backdrop */}
      {menuOpen && (
        <div
          className="absolute right-0 z-30 rounded-xl overflow-hidden"
          style={{
            top: 'calc(100% + 2px)',
            background: '#111111',
            border: '1px solid #27272a',
            boxShadow: '0 8px 32px rgba(0,0,0,0.7)',
            minWidth: '160px',
            animation: 'fadeIn 0.12s ease forwards',
          }}
        >
          {confirmDelete ? (
            <div className="p-3">
              <p className="text-xs mb-2.5 leading-relaxed" style={{ color: '#a1a1aa' }}>
                Delete <span className="text-white font-medium">"{collection.name}"</span>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={onConfirmDelete}
                  className="flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold cursor-pointer transition-colors duration-100"
                  style={{
                    background: 'rgba(239,68,68,0.15)',
                    color: '#ef4444',
                    border: '1px solid rgba(239,68,68,0.3)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.25)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; }}
                >
                  Delete
                </button>
                <button
                  onClick={onCancelDelete}
                  className="p-1.5 rounded-lg cursor-pointer transition-colors duration-100"
                  style={{ color: '#71717a' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; e.currentTarget.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#71717a'; }}
                >
                  <X size={13} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-1">
              <button
                onClick={onAskDelete}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors duration-100"
                style={{ color: '#ef4444' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
              >
                <Trash2 size={12} />
                Delete collection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-2 px-2">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-9 rounded-xl"
          style={{
            background: '#111111',
            animation: 'pulse 1.5s ease-in-out infinite',
            animationDelay: `${i * 0.1}s`,
            opacity: 1 - i * 0.1,
          }}
        />
      ))}
    </div>
  );
}
