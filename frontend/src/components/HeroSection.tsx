"use client";

import HeroMatchRing from "./HeroMatchRing";

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden bg-[#0a0a0a]">
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left column */}
          <div className="flex flex-col gap-6 max-w-xl">
            <div
              style={{ animation: "fadeSlideUp 0.45s ease both" }}
              className="flex items-center gap-2.5"
            >
              <span className="w-1 h-4 bg-[#22c55e]" />
              <span className="font-mono text-xs tracking-[0.2em] text-[#22c55e] uppercase">
                OSS Contribution Finder
              </span>
            </div>

            <h1
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "60ms" }}
              className="text-[clamp(40px,6vw,64px)] font-extrabold leading-[1.08] tracking-[-0.02em] text-white"
            >
              Stop browsing.
              <br />
              Start
              <br />
              contributing.
            </h1>

            <p
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "120ms" }}
              className="text-[#a1a1aa] text-lg leading-relaxed max-w-md"
            >
              Mergly scores every repository against the languages you write,
              the level you&apos;re at and the topics you care about — then
              hands you the issue, not the search box.
            </p>

            <div
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "180ms" }}
              className="flex flex-wrap gap-4"
            >
              <button className="btn-glow bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-6 py-3 rounded-xl text-base transition-all duration-200 hover:scale-[1.02]">
                Find your match
              </button>
              <button className="border border-[#27272a] hover:border-white/20 text-white font-medium px-6 py-3 rounded-xl text-base transition-all duration-200 hover:bg-white/5">
                See how it works
              </button>
            </div>

            <div
              style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "240ms" }}
              className="flex items-center gap-10 pt-6 mt-2 border-t border-[#27272a]"
            >
              <div className="flex flex-col gap-1 pt-6">
                <span className="text-2xl font-extrabold text-white">50,000+</span>
                <span className="font-mono text-[11px] tracking-widest text-[#a1a1aa] uppercase">
                  Repositories
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-6">
                <span className="text-2xl font-extrabold text-white">12,800</span>
                <span className="font-mono text-[11px] tracking-widest text-[#a1a1aa] uppercase">
                  Open beginner issues
                </span>
              </div>
              <div className="flex flex-col gap-1 pt-6">
                <span className="text-2xl font-extrabold text-white">Free</span>
                <span className="font-mono text-[11px] tracking-widest text-[#a1a1aa] uppercase">
                  Forever
                </span>
              </div>
            </div>
          </div>

          {/* Right column — match score ring */}
          <div
            style={{ animation: "fadeSlideUp 0.5s ease both", animationDelay: "160ms" }}
            className="relative hidden lg:flex items-center justify-center h-[460px]"
          >
            <HeroMatchRing />
          </div>
        </div>
      </div>
    </section>
  );
}
