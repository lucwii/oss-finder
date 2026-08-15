"use client";

import { ArrowRight } from "lucide-react";
import { useReveal } from "@/hooks/useReveal";

export default function CTASection() {
  const { ref, inView } = useReveal<HTMLElement>();

  return (
    <section className="py-32 px-6 relative overflow-hidden" ref={ref}>
      {/* Subtle radial gradient bg */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 70% 60% at 50% 50%, rgba(34,197,94,0.06) 0%, transparent 70%)",
        }}
      />

      <div
        className="relative z-10 max-w-3xl mx-auto text-center flex flex-col items-center gap-8"
        style={{ opacity: inView ? undefined : 0, animation: inView ? "fade-up 0.5s ease both" : undefined }}
      >
        <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white leading-tight">
          Ready to make your first contribution?
        </h2>

        <p className="text-[#a1a1aa] text-lg max-w-md">
          Join developers who found their open source home with Mergly.
        </p>

        <button className="btn-glow group flex items-center gap-2.5 bg-[#22c55e] hover:bg-[#16a34a] text-black font-semibold px-8 py-4 rounded-xl text-lg transition-all duration-200 hover:scale-[1.02]">
          Get Started for Free
          <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
        </button>

        <p className="text-[#52525b] text-sm">
          No credit card required&nbsp;&nbsp;•&nbsp;&nbsp;Free forever
        </p>
      </div>
    </section>
  );
}
