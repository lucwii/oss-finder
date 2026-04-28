'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';
import type { SearchParams, SkillLevel } from '@/types/github';

const LANGUAGES = [
  { name: 'JavaScript', color: '#f7df1e' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Python', color: '#3572A5' },
  { name: 'Go', color: '#00ADD8' },
  { name: 'Rust', color: '#dea584' },
  { name: 'Java', color: '#b07219' },
  { name: 'C++', color: '#f34b7d' },
  { name: 'C#', color: '#178600' },
  { name: 'Ruby', color: '#701516' },
  { name: 'PHP', color: '#4F5D95' },
  { name: 'Swift', color: '#ffac45' },
  { name: 'Kotlin', color: '#A97BFF' },
  { name: 'Dart', color: '#00B4AB' },
  { name: 'Scala', color: '#c22d40' },
  { name: 'Elixir', color: '#6e4a7e' },
  { name: 'Shell', color: '#89e051' },
];

const LEVELS: { label: string; value: SkillLevel }[] = [
  { label: 'Beginner', value: 'beginner' },
  { label: 'Help Wanted', value: 'help wanted' },
];

interface Props {
  onSearch: (params: SearchParams) => void;
  loading: boolean;
}

export default function RecommendationsForm({ onSearch, loading }: Props) {
  const [language, setLanguage] = useState('TypeScript');
  const [level, setLevel] = useState<SkillLevel>('beginner');

  const selectedLang = LANGUAGES.find((l) => l.name === language) ?? LANGUAGES[0];

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSearch({ language, level });
  }

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-end">
        {/* Language select */}
        <div className="flex-1 flex flex-col gap-1.5">
          <label className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
            Language
          </label>
          <div className="relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
              <span
                className="block w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedLang.color }}
              />
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full pl-8 pr-10 py-3 bg-[#111111] border border-[#27272a] rounded-xl text-white text-sm font-medium appearance-none cursor-pointer focus:outline-none focus:border-[#22c55e]/50 hover:border-[#3f3f46] transition-colors"
            >
              {LANGUAGES.map((l) => (
                <option key={l.name} value={l.name} className="bg-[#111111]">
                  {l.name}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg
                className="w-4 h-4 text-[#52525b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Skill level */}
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
            Skill Level
          </label>
          <div className="flex gap-2">
            {LEVELS.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => setLevel(l.value)}
                className={`px-4 py-3 rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer ${
                  level === l.value
                    ? 'bg-[#22c55e]/10 border-[#22c55e]/40 text-[#22c55e]'
                    : 'bg-[#111111] border-[#27272a] text-[#a1a1aa] hover:border-[#3f3f46] hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-200 btn-glow cursor-pointer whitespace-nowrap"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
              Searching...
            </>
          ) : (
            <>
              <Search className="w-4 h-4" />
              Find Repos
            </>
          )}
        </button>
      </div>
    </form>
  );
}
