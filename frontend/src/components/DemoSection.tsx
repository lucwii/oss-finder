"use client";

import { Star, GitFork, ExternalLink } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const REPOS = [
  {
    name: "facebook/react",
    language: "JavaScript",
    langColor: "#f7df1e",
    stars: "218k",
    forks: "45.2k",
    issue: "Fix TypeScript types for useRef hook",
    label: "good first issue",
    labelColor: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
    match: 98,
  },
  {
    name: "vercel/next.js",
    language: "TypeScript",
    langColor: "#3178c6",
    stars: "115k",
    forks: "25.1k",
    issue: "Improve error message for missing env vars",
    label: "good first issue",
    labelColor: "bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30",
    match: 94,
  },
  {
    name: "tailwindlabs/tailwindcss",
    language: "JavaScript",
    langColor: "#f7df1e",
    stars: "78k",
    forks: "3.9k",
    issue: "Add missing transition utilities docs",
    label: "documentation",
    labelColor: "bg-[#3b82f6]/15 text-[#60a5fa] border-[#3b82f6]/30",
    match: 89,
  },
];

export default function DemoSection() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section className="py-32 px-6 max-w-7xl mx-auto" ref={ref}>
      {/* Header */}
      <div
        className="text-center mb-16"
        style={{ opacity: inView ? undefined : 0, animation: inView ? "fade-up 0.5s ease both" : undefined }}
      >
        <span className="text-xs font-mono text-[#22c55e] tracking-widest uppercase mb-4 block">
          Preview
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          See your recommendations
        </h2>
        <p className="text-[#a1a1aa] text-lg">
          Here&apos;s what your personalized feed looks like
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {REPOS.map((repo, i) => (
          <div
            key={repo.name}
            className="group relative bg-[#111111] border border-[#27272a] rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:border-[#22c55e]/30 cursor-pointer"
            style={{
              opacity: inView ? undefined : 0,
              animation: inView ? `fade-up 0.5s ease ${i * 100}ms both` : undefined,
            }}
          >
            {/* Repo header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22c55e]/40 to-[#16a34a]/20 border border-[#22c55e]/20" />
                  <span className="font-mono text-sm font-semibold text-white">
                    {repo.name}
                  </span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1.5">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: repo.langColor }}
                    />
                    <span className="text-xs text-[#a1a1aa]">{repo.language}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                    <Star className="w-3 h-3" />
                    {repo.stars}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                    <GitFork className="w-3 h-3" />
                    {repo.forks}
                  </div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-[#52525b] group-hover:text-[#22c55e] transition-colors" />
            </div>

            {/* Divider */}
            <div className="border-t border-[#27272a] my-4" />

            {/* Issue preview */}
            <div className="mb-5">
              <div className="flex items-start gap-2.5 mb-3">
                <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />
                <p className="text-sm text-[#e4e4e7] leading-snug font-medium">
                  {repo.issue}
                </p>
              </div>
              <span
                className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border ${repo.labelColor}`}
              >
                {repo.label}
              </span>
            </div>

            {/* Match score */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-[#a1a1aa] font-mono">Match Score</span>
                <span className="text-xs font-bold text-[#22c55e] font-mono">
                  {repo.match}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-[#22c55e]"
                  style={{
                    width: inView ? `${repo.match}%` : 0,
                    transition: `width 0.8s ease ${0.2 + i * 0.1}s`,
                  }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
