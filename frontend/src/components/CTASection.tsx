"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Radial gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.07) 0%, transparent 70%)",
        }}
      />

      {/* Decorative grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(34,197,94,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.04) 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 32 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8"
      >
        {/* Top badge */}
        <div className="inline-flex items-center gap-2 bg-[#111111] border border-[#27272a] rounded-full px-4 py-1.5 text-sm text-[#a1a1aa]">
          <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
          Join 10,000+ contributors
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ready to make your first contribution?
        </h2>

        <p className="text-[#a1a1aa] text-lg max-w-md">
          Join developers who found their open source home with ContribFinder.
        </p>

        <button className="btn-glow group flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02]">
          Get Started for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-[#52525b] text-sm">
          No credit card required&nbsp;&nbsp;•&nbsp;&nbsp;Free forever
        </p>
      </motion.div>
    </section>
  );
}
