'use client';

import { motion } from 'framer-motion';
import { Star, CircleDot, ExternalLink, Tag } from 'lucide-react';
import type { RepoRecommendation } from '@/types/github';

const LANG_COLORS: Record<string, string> = {
  JavaScript: '#f7df1e',
  TypeScript: '#3178c6',
  Python: '#3572A5',
  Go: '#00ADD8',
  Rust: '#dea584',
  Java: '#b07219',
  'C++': '#f34b7d',
  'C#': '#178600',
  Ruby: '#701516',
  PHP: '#4F5D95',
  Swift: '#ffac45',
  Kotlin: '#A97BFF',
  Dart: '#00B4AB',
  Scala: '#c22d40',
  Elixir: '#6e4a7e',
  Shell: '#89e051',
};

const MAX_SCORE = 85;

function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return String(n);
}

function timeAgo(dateStr: string): string {
  const days = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86_400_000);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

interface Props {
  recommendation: RepoRecommendation;
  index: number;
}

export default function RepoCard({ recommendation, index }: Props) {
  const { repo, score, issues } = recommendation;
  const langColor = LANG_COLORS[repo.language] ?? '#6b7280';
  const barPercent = Math.min(100, Math.round((score / MAX_SCORE) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07, ease: 'easeOut' }}
      className="group relative bg-[#111111] border border-[#27272a] rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:border-[#22c55e]/30 hover:shadow-[0_8px_40px_rgba(34,197,94,0.08)] overflow-hidden"
    >
      {/* Hover glow overlay */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top, rgba(34,197,94,0.04) 0%, transparent 70%)',
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-3 relative z-10">
        <div className="min-w-0 flex-1">
          <a
            href={repo.html_url}
            target="_blank"
            rel="noopener noreferrer"
            className="group/link inline-flex items-center gap-2 mb-2"
          >
            <div className="w-4 h-4 rounded-full bg-gradient-to-br from-[#22c55e]/40 to-[#16a34a]/20 border border-[#22c55e]/20 flex-shrink-0" />
            <span className="font-mono text-sm font-semibold text-white group-hover/link:text-[#22c55e] transition-colors">
              {repo.full_name}
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-[#52525b] group-hover/link:text-[#22c55e] flex-shrink-0 transition-colors" />
          </a>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span
                className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: langColor }}
              />
              <span className="text-xs text-[#a1a1aa]">{repo.language}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
              <Star className="w-3 h-3" />
              {formatCount(repo.stargazers_count)}
            </div>
            <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
              <CircleDot className="w-3 h-3" />
              {formatCount(repo.open_issues_count)}
            </div>
          </div>
        </div>

        <span className="text-xs font-mono text-[#3f3f46] flex-shrink-0 mt-0.5">
          {timeAgo(repo.updated_at)}
        </span>
      </div>

      {/* Description */}
      {repo.description && (
        <p className="text-sm text-[#a1a1aa] leading-relaxed mb-4 relative z-10 line-clamp-2">
          {repo.description}
        </p>
      )}

      {/* Issues */}
      {issues.length > 0 && (
        <>
          <div className="border-t border-[#1a1a1a] my-4" />
          <div className="relative z-10 space-y-3 mb-4">
            {issues.map((issue) => (
              <a
                key={issue.id}
                href={issue.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2.5 group/issue"
              >
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-sm text-[#d4d4d8] leading-snug group-hover/issue:text-[#22c55e] transition-colors">
                    {issue.title}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {issue.labels.slice(0, 2).map((label) => (
                      <span
                        key={label.name}
                        className="inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20"
                      >
                        <Tag className="w-2.5 h-2.5" />
                        {label.name}
                      </span>
                    ))}
                  </div>
                </div>
              </a>
            ))}
          </div>
        </>
      )}

      {/* Score bar */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-xs font-mono text-[#3f3f46]">Match Score</span>
          <span className="text-xs font-bold text-[#22c55e] font-mono">{score}</span>
        </div>
        <div className="w-full h-1 bg-[#1a1a1a] rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-[#16a34a] to-[#22c55e]"
            initial={{ width: 0 }}
            animate={{ width: `${barPercent}%` }}
            transition={{ duration: 0.8, delay: 0.15 + index * 0.07, ease: 'easeOut' }}
          />
        </div>
      </div>
    </motion.div>
  );
}
