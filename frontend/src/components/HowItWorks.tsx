"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { UserCircle, GitBranch, Code2 } from "lucide-react";

const STEPS = [
  {
    icon: UserCircle,
    step: "01",
    title: "Create Your Profile",
    desc: "Tell us your languages, experience level, and interests",
  },
  {
    icon: GitBranch,
    step: "02",
    title: "Get Matched",
    desc: "Our algorithm finds the best repositories for your level",
  },
  {
    icon: Code2,
    step: "03",
    title: "Start Contributing",
    desc: "Pick an issue and make your first contribution",
  },
];

export default function HowItWorks() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="how-it-works" className="py-32 px-6 max-w-7xl mx-auto" ref={ref}>
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center mb-20"
      >
        <span className="text-xs font-mono text-[#22c55e] tracking-widest uppercase mb-4 block">
          Process
        </span>
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Contributing made simple
        </h2>
        <p className="text-[#a1a1aa] text-lg">
          Three steps to your first pull request
        </p>
      </motion.div>

      {/* Steps */}
      <div className="relative flex flex-col md:flex-row gap-6">
        {/* Connecting line */}
        <div className="hidden md:block absolute top-[52px] left-[calc(16.66%+24px)] right-[calc(16.66%+24px)] h-px">
          <div className="w-full h-full bg-gradient-to-r from-[#27272a] via-[#22c55e]/40 to-[#27272a]" />
        </div>

        {STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 32 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 + i * 0.12 }}
              className="group relative flex-1 bg-[#111111] border border-[#27272a] rounded-2xl p-8 hover:-translate-y-1.5 transition-all duration-300 hover:border-[#22c55e]/30 hover:shadow-[0_0_30px_rgba(34,197,94,0.08)]"
              style={{ borderTop: "2px solid #22c55e" }}
            >
              {/* Step number */}
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-xl bg-[#22c55e]/10 border border-[#22c55e]/20 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-[#22c55e]" />
                </div>
                <span className="font-mono text-3xl font-bold text-[#27272a] group-hover:text-[#22c55e]/20 transition-colors">
                  {step.step}
                </span>
              </div>
              <h3 className="text-white font-semibold text-xl mb-3">{step.title}</h3>
              <p className="text-[#a1a1aa] text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
