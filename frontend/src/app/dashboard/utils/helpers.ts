export function timeAgo(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 2592000) return `${Math.floor(diff / 86400)}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export type LanguageBadge = { bg: string; text: string; dot: string };

const LANGUAGE_BADGES: Record<string, LanguageBadge> = {
  TypeScript: { bg: '#1e3a5f', text: '#3b82f6', dot: '#3b82f6' },
  JavaScript: { bg: '#3d3200', text: '#eab308', dot: '#eab308' },
  Python:     { bg: '#1a2d4a', text: '#3b82f6', dot: '#3b82f6' },
  Rust:       { bg: '#3d1a0e', text: '#f97316', dot: '#f97316' },
  Go:         { bg: '#0e2d3d', text: '#06b6d4', dot: '#06b6d4' },
  Ruby:       { bg: '#3d0e0e', text: '#ef4444', dot: '#ef4444' },
};

const DEFAULT_BADGE: LanguageBadge = { bg: '#1a1a2e', text: '#a855f7', dot: '#a855f7' };

export function getLanguageBadge(lang: string): LanguageBadge {
  return LANGUAGE_BADGES[lang] ?? DEFAULT_BADGE;
}

export type LabelStyle = { borderColor: string; color: string; bg: string };

const LABEL_STYLES: Record<string, LabelStyle> = {
  'good first issue': { borderColor: '#22c55e', color: '#22c55e', bg: 'rgba(34, 197, 94, 0.1)' },
  'documentation':    { borderColor: '#3b82f6', color: '#3b82f6', bg: 'rgba(59, 130, 246, 0.1)' },
  'help wanted':      { borderColor: '#f97316', color: '#f97316', bg: 'rgba(249, 115, 22, 0.1)' },
};

const DEFAULT_LABEL: LabelStyle = {
  borderColor: '#a855f7',
  color: '#a855f7',
  bg: 'rgba(168, 85, 247, 0.1)',
};

export function getLabelStyle(label: string): LabelStyle {
  return LABEL_STYLES[label] ?? DEFAULT_LABEL;
}

export function formatStars(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k`;
  return String(n);
}
