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

// ─── Icon map for default collections ────────────────────────────────────────

const DEFAULT_ICONS: Record<string, React.ReactNode> = {
  all:                 <BookOpen size={14} />,
  want_to_contribute:  <Target size={14} />,
  in_progress:         <Zap size={14} />,
  completed:           <CheckCircle size={14} />,
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CollectionSidebarProps {
  collections: Collection[];
  activeId: string;
  loading: boolean;
  onSelect: (id: string) => void;
  onCreate: (name: string) => Promise<void>;
  onDelete: (id: string) => void;
}

// ─── Component ────────────────────────────────────────────────────────────────

export function CollectionSidebar({
  collections,
  activeId,
  loading,
  onSelect,
  onCreate,
  onDelete,
}: CollectionSidebarProps) {
  const [showInput, setShowInput]         = useState(false);
  const [inputValue, setInputValue]       = useState('');
  const [submitting, setSubmitting]       = useState(false);
  const [menuOpenId, setMenuOpenId]       = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const inputRef  = useRef<HTMLInputElement>(null);
  const menuRef   = useRef<HTMLDivElement>(null);

  const defaultCollections = collections.filter((c) => c.isDefault);
  const customCollections  = collections.filter((c) => !c.isDefault);

  useEffect(() => {
    if (showInput) inputRef.current?.focus();
  }, [showInput]);

  // Close menu on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

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
    <div className="flex flex-col gap-1">
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
        <CollectionItem
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
      <div ref={menuRef}>
        {customCollections.map((c) => (
          <div key={c.id} className="relative group">
            <CollectionItem
              collection={c}
              active={activeId === c.id}
              icon={<Folder size={14} />}
              onSelect={() => { onSelect(c.id); setMenuOpenId(null); }}
              rightSlot={
                <button
                  onClick={(e) => { e.stopPropagation(); setMenuOpenId(menuOpenId === c.id ? null : c.id); }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all duration-100 cursor-pointer"
                  style={{ color: '#52525b' }}
                  onMouseEnter={(e) => { e.currentTarget.style.color = '#a1a1aa'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.color = '#52525b'; }}
                >
                  <MoreHorizontal size={13} />
                </button>
              }
            />

            {/* Context menu */}
            {menuOpenId === c.id && (
              <div
                className="absolute right-0 z-20 rounded-xl overflow-hidden"
                style={{
                  top: '100%',
                  background: '#111111',
                  border: '1px solid #27272a',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                  minWidth: '140px',
                  animation: 'fadeIn 0.12s ease forwards',
                }}
              >
                {confirmDeleteId === c.id ? (
                  <div className="p-3">
                    <p className="text-xs mb-2" style={{ color: '#a1a1aa' }}>Delete "{c.name}"?</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { onDelete(c.id); setMenuOpenId(null); setConfirmDeleteId(null); }}
                        className="flex-1 py-1 px-2 rounded-lg text-xs font-medium cursor-pointer transition-colors duration-100"
                        style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)' }}
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => setConfirmDeleteId(null)}
                        className="p-1 rounded-lg text-xs cursor-pointer transition-colors duration-100"
                        style={{ color: '#a1a1aa' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = '#1a1a1a'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-1">
                    <button
                      onClick={() => setConfirmDeleteId(c.id)}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs cursor-pointer transition-colors duration-100"
                      style={{ color: '#ef4444' }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.08)'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* New collection input */}
      {showInput && (
        <div
          style={{
            animation: 'slideDown 0.2s ease forwards',
            marginTop: '4px',
          }}
        >
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-xl"
            style={{
              background: '#1a1a1a',
              border: '1px solid #22c55e',
            }}
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
  );
}

// ─── Collection item ──────────────────────────────────────────────────────────

function CollectionItem({
  collection,
  active,
  icon,
  onSelect,
  rightSlot,
}: {
  collection: Collection;
  active: boolean;
  icon?: React.ReactNode;
  onSelect: () => void;
  rightSlot?: React.ReactNode;
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onSelect(); }}
      className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-sm transition-all duration-100 cursor-pointer"
      style={{
        background: active ? '#1a1a1a' : 'transparent',
        borderLeft: active ? '3px solid #22c55e' : '3px solid transparent',
        color: active ? '#ffffff' : '#a1a1aa',
        paddingLeft: '10px',
      }}
      onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = '#111111'; e.currentTarget.style.color = '#ffffff'; } }}
      onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#a1a1aa'; } }}
    >
      <div className="flex items-center gap-2 min-w-0">
        <span style={{ color: active ? '#22c55e' : '#52525b', flexShrink: 0 }}>{icon}</span>
        <span className="truncate">{collection.name}</span>
      </div>
      <div className="flex items-center gap-1 flex-shrink-0">
        {rightSlot}
        {collection.count > 0 && (
          <span
            className="px-1.5 py-0.5 rounded-full text-xs"
            style={{ background: '#27272a', color: '#a1a1aa' }}
          >
            {collection.count}
          </span>
        )}
      </div>
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
