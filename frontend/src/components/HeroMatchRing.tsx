"use client";

import { useEffect, useState } from "react";
import { Star } from "lucide-react";

interface HeroMatchRingProps {
  percentage?: number;
  repo?: string;
  language?: string;
  languageColor?: string;
  stars?: string;
  issuesOpen?: number;
  goodFirstIssue?: boolean;
}

export default function HeroMatchRing({
  percentage = 98,
  repo = "facebook/react",
  language = "JavaScript",
  languageColor = "#eab308",
  stars = "218k",
  issuesOpen = 3,
  goodFirstIssue = true,
}: HeroMatchRingProps) {
  const [animated, setAnimated] = useState(false);

  const radius = 82;
  const circumference = 2 * Math.PI * radius;
  const targetOffset = circumference * (1 - percentage / 100);

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Ambient glow */}
      <div
        className="absolute w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "rgba(34, 197, 94, 0.15)", filter: "blur(90px)" }}
      />

      {/* Ring */}
      <div className="relative" style={{ width: 380, height: 380 }}>
        <svg width="380" height="380" viewBox="0 0 200 200" className="-rotate-0">
          {/* faint outer halo ring */}
          <circle cx="100" cy="100" r="98" fill="none" stroke="#27272a" strokeWidth="1" opacity="0.6" />
          {/* track */}
          <circle cx="100" cy="100" r={radius} fill="none" stroke="#1a1a1a" strokeWidth="16" />
          {/* progress */}
          <circle
            cx="100"
            cy="100"
            r={radius}
            fill="none"
            stroke="#22c55e"
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={animated ? targetOffset : circumference}
            transform="rotate(-90 100 100)"
            style={{
              transition: animated ? "stroke-dashoffset 1.4s cubic-bezier(0.4, 0, 0.2, 1)" : "none",
            }}
          />
        </svg>

        {/* Center label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5">
          <div className="flex items-baseline">
            <span className="text-[64px] font-extrabold text-white leading-none tracking-tight">
              {percentage}
            </span>
            <span className="text-2xl font-bold text-[#22c55e] leading-none">%</span>
          </div>
          <span className="text-xs font-mono tracking-widest text-[#a1a1aa]">MATCH SCORE</span>
          <span className="text-lg font-bold text-white mt-1">{repo}</span>
        </div>

        {/* Language badge */}
        <div
          className="absolute top-[16%] -left-10 flex items-center gap-2 bg-[#111111] border border-[#27272a] rounded-full px-3.5 py-1.5 text-sm text-[#e4e4e7] shadow-lg"
          style={{ animation: "float-1 5s ease-in-out infinite" }}
        >
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: languageColor }} />
          {language}
        </div>

        {/* Good first issue badge */}
        {goodFirstIssue && (
          <div
            className="absolute top-[8%] -right-8 flex items-center bg-[#0a0a0a] border border-[#22c55e]/40 rounded-full px-3.5 py-1.5 text-sm font-medium text-[#22c55e] shadow-lg"
            style={{ animation: "float-2 4.5s ease-in-out infinite" }}
          >
            good first issue
          </div>
        )}

        {/* Stars badge */}
        <div
          className="absolute bottom-[14%] -left-10 flex items-center gap-1.5 bg-[#111111] border border-[#27272a] rounded-full px-3.5 py-1.5 text-sm text-[#e4e4e7] shadow-lg"
          style={{ animation: "float-3 5.5s ease-in-out infinite" }}
        >
          <Star className="w-3.5 h-3.5 text-[#a1a1aa]" />
          {stars}
        </div>

        {/* Issues open badge */}
        <div
          className="absolute bottom-[8%] -right-8 flex items-center bg-[#111111] border border-[#27272a] rounded-full px-3.5 py-1.5 text-sm text-[#e4e4e7] shadow-lg"
          style={{ animation: "float-1 4.8s ease-in-out infinite", animationDelay: "0.4s" }}
        >
          {issuesOpen} issues open
        </div>
      </div>
    </div>
  );
}
