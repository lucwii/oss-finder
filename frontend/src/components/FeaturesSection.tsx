"use client";

import { Sparkles, Shield, BrainCircuit, RefreshCw } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

const FEATURES = [
  {
    icon: Sparkles,
    title: "Smart Matching",
    desc: "Our algorithm analyzes your skills, past contributions, and preferences to surface repositories where you'll thrive.",
  },
  {
    icon: Shield,
    title: "Beginner Friendly",
    desc: "Every issue is pre-filtered by difficulty level so you never feel overwhelmed. Only issues that match your experience.",
  },
  {
    icon: BrainCircuit,
    title: "AI Explanations",
    desc: "Understand exactly what to do before you start. Get plain-language breakdowns of each issue and codebase.",
  },
  {
    icon: RefreshCw,
    title: "Always Fresh",
    desc: "Our index is updated daily from GitHub, so you always see active projects with real open issues.",
  },
];

export default function FeaturesSection() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section id="features" className="py-32 px-6 max-w-7xl mx-auto" ref={ref}>
      {/* Header */}
      <div
        className="text-center mb-16"
        style={{ opacity: inView ? undefined : 0, animation: inView ? "fade-up 0.5s ease both" : undefined }}
      >
        <span className="text-xs font-mono text-[#22c55e] tracking-widest uppercase mb-4 block">
          Features
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
          Everything you need to contribute
        </h2>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {FEATURES.map((feat, i) => {
          const Icon = feat.icon;
          return (
            <div
              key={feat.title}
              className="group bg-[#111111] border border-[#27272a] rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 hover:border-[#22c55e]/30"
              style={{
                opacity: inView ? undefined : 0,
                animation: inView ? `fade-up 0.5s ease ${i * 80}ms both` : undefined,
              }}
            >
              <div className="w-11 h-11 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center mb-5">
                <Icon className="w-5 h-5 text-[#22c55e]" />
              </div>
              <h3 className="text-white font-semibold text-xl mb-2.5">{feat.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{feat.desc}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
