"use client";

import { ArrowRight, ChevronDown, GitFork, Sparkles, Star } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6 max-w-xl">
            <div
              style={{ animation: "fadeSlideUp 0.45s ease both" }}
              className="inline-flex items-center gap-2 self-start bg-[#111111] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-[#a1a1aa]"
            >
              <span className="dot-pulse w-2 h-2 rounded-full bg-[#22c55e]" />
              Open Source Contribution Finder
            </div>

            <h1
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "60ms" }}
              className="text-[clamp(40px,6vw,64px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white"
            >
              Find Your First
              <br />
              <span className="gradient-text">Open Source</span> Contribution.
            </h1>

            <p
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "120ms" }}
              className="text-[#a1a1aa] text-lg leading-relaxed max-w-md"
            >
              Mergly matches you with repositories and issues that fit your
              skills, so you can stop searching and start contributing.
            </p>

            <div
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "180ms" }}
              className="flex flex-wrap gap-4"
            >
              <button className="btn-glow group flex items-center gap-2 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-3 rounded-xl text-base transition-all duration-200 hover:scale-[1.02]">
                Find Your Match
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
              <button className="flex items-center gap-2 border border-[#27272a] hover:border-white/20 text-white font-medium px-6 py-3 rounded-xl text-base transition-all duration-200 hover:bg-white/5">
                See how it works
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            <div
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "240ms" }}
              className="flex items-center gap-4 text-sm text-[#a1a1aa] pt-2"
            >
              <span className="flex items-center gap-1.5">
                <GitFork className="w-3.5 h-3.5" />
                50,000+ repositories
              </span>
              <span className="w-1 h-1 rounded-full bg-[#27272a]" />
              <span>Free forever</span>
            </div>
          </div>

          {/* Right column — floating match card */}
          <div
            style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "160ms" }}
            className="relative hidden lg:block h-[420px]"
          >
            {/* Back card, muted */}
            <div
              className="absolute top-16 left-16 w-[340px] h-[280px] bg-[#111111] border border-[#27272a] rounded-2xl opacity-50"
              style={{ transform: "rotate(-6deg)" }}
            />

            {/* Front card */}
            <div
              className="absolute top-4 left-4 w-[340px] bg-[#111111] border border-[#27272a] rounded-2xl p-6 shadow-2xl"
              style={{
                transform: "rotate(2deg)",
                animation: "float-2 5s ease-in-out infinite",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#22c55e]/40 to-[#16a34a]/20 border border-[#22c55e]/20" />
                    <span className="font-mono text-sm font-semibold text-white">
                      facebook/react
                    </span>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#eab308]" />
                      <span className="text-xs text-[#a1a1aa]">JavaScript</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-[#a1a1aa]">
                      <Star className="w-3 h-3" />
                      218k
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#27272a] my-4" />

              <div className="mb-5">
                <div className="flex items-start gap-2.5 mb-3">
                  <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-[#22c55e] flex-shrink-0" />
                  <p className="text-sm text-[#e4e4e7] leading-snug font-medium">
                    Fix TypeScript types for useRef hook
                  </p>
                </div>
                <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full border bg-[#22c55e]/15 text-[#22c55e] border-[#22c55e]/30">
                  good first issue
                </span>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#a1a1aa] font-mono">Match Score</span>
                  <span className="text-xs font-bold text-[#22c55e] font-mono">98%</span>
                </div>
                <div className="w-full h-1.5 bg-[#27272a] rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-[#22c55e]" style={{ width: "98%" }} />
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div
              className="absolute -top-3 -left-3 flex items-center gap-1.5 bg-[#0a0a0a] border border-[#27272a] rounded-full px-3 py-1.5 text-xs font-medium text-white shadow-lg"
              style={{ animation: "float-1 4s ease-in-out infinite" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#22c55e]" />
              Matched for you
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
