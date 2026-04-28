"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
      {/* Radial glow center */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[600px] h-[400px] rounded-full"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(34,197,94,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center gap-8">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#111111] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-[#a1a1aa]"
        >
          <span className="dot-pulse w-2 h-2 rounded-full bg-[#22c55e]" />
          ✦ Open Source Contribution Finder
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          <h1 className="text-[clamp(48px,8vw,84px)] font-extrabold leading-[1.05] tracking-[-0.03em] text-white">
            Find Your First
            <br />
            <span className="gradient-text">Open Source</span>
            <br />
            Contribution
          </h1>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="text-[#a1a1aa] text-lg leading-relaxed max-w-xl"
        >
          Stop scrolling through thousands of repositories. Get matched with
          projects that fit your skills and start contributing today.
        </motion.p>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="w-full max-w-xl"
        >
          <TerminalAnimation />
        </motion.div>

        {/* CTA buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65, duration: 0.5 }}
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
        </motion.div>

        {/* Stats bar */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-4 flex items-center gap-6 bg-[#111111]/80 backdrop-blur-sm border border-[#27272a] rounded-2xl px-8 py-4"
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
        </motion.div>
      </div>
    </section>
  );
}
