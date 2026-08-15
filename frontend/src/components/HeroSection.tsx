"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, ChevronDown } from "lucide-react";
import TerminalAnimation from "./TerminalAnimation";

const STATS = [
  { value: 50, suffix: "K+", label: "Repositories" },
  { value: 10, suffix: "K+", label: "Issues" },
  { label: "Free Forever", value: null, suffix: null },
];

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0);
  const started = useRef(false);

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
      else setCount(target);
    };
    requestAnimationFrame(step);
  }, [target, duration]);

  return count;
}

function StatNumber({ value, suffix }: { value: number; suffix: string }) {
  const count = useCountUp(value, 1400);
  return (
    <span className="font-bold text-white text-lg">
      {count}
      {suffix}
    </span>
  );
}

export default function HeroSection() {
  return (
    <section className="relative hero-grid min-h-screen flex flex-col items-center justify-center pt-16 overflow-hidden">
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <div
          style={{ animation: "fadeSlideUp 0.45s ease both" }}
          className="inline-flex items-center gap-2 bg-[#111111] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-[#a1a1aa]"
        >
          <span className="dot-pulse w-2 h-2 rounded-full bg-[#22c55e]" />
          Open Source Contribution Finder
        </div>

        {/* Headline */}
        <div style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "60ms" }}>
          <h1 className="text-[clamp(48px,8vw,84px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            Find Your First
            <br />
            <span className="gradient-text">Open Source</span>
            <br />
            Contribution
          </h1>
        </div>

        {/* Subheadline */}
        <p
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "120ms" }}
          className="text-[#a1a1aa] text-lg leading-relaxed max-w-xl"
        >
          Stop scrolling through thousands of repositories. Get matched with
          projects that fit your skills and start contributing today.
        </p>

        {/* Terminal */}
        <div
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "180ms" }}
          className="w-full max-w-xl"
        >
          <TerminalAnimation />
        </div>

        {/* CTA buttons */}
        <div
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "240ms" }}
          className="flex flex-wrap gap-4 justify-center"
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

        {/* Stats bar */}
        <div
          style={{ animation: "fadeSlideUp 0.45s ease both", animationDelay: "300ms" }}
          className="mt-4 flex items-center gap-6 bg-[#111111] border border-[#27272a] rounded-2xl px-8 py-4"
        >
          {STATS.map((stat, i) => (
            <div key={i} className="flex items-center gap-6">
              {i > 0 && (
                <span className="text-[#27272a] text-xl select-none">•</span>
              )}
              <div className="flex flex-col items-center">
                {stat.value !== null ? (
                  <StatNumber value={stat.value} suffix={stat.suffix!} />
                ) : (
                  <span className="font-bold text-white text-lg">
                    {stat.label}
                  </span>
                )}
                {stat.value !== null && (
                  <span className="text-xs text-[#a1a1aa]">{stat.label}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
