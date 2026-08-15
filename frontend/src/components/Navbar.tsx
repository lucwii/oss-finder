"use client";

import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { user, loading, signOut } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{ animation: "fadeIn 0.4s ease both" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-[#0a0a0a]/90 backdrop-blur-xl border-b border-[#27272a]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/">
          <img src="/logo.svg" alt="Mergly" className="hidden sm:block" style={{ height: '28px', width: 'auto' }} />
          <img src="/icon-green.svg" alt="Mergly" className="block sm:hidden" style={{ height: '28px', width: 'auto' }} />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8">
          {["How it works", "Features"].map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-sm text-[#a1a1aa] hover:text-white transition-colors duration-200"
            >
              {link}
            </a>
          ))}
          <Link
            href="/explore"
            className="text-sm text-[#a1a1aa] hover:text-white transition-colors duration-200"
          >
            Explore
          </Link>
        </div>

        {/* CTA buttons */}
        <div className="flex items-center gap-3">
          {!loading && (
            user ? (
              <>
                <span className="hidden sm:block text-sm text-[#a1a1aa] font-mono truncate max-w-[160px]">
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="flex items-center gap-1.5 text-sm text-[#a1a1aa] hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg border border-[#27272a] hover:border-[#3f3f46]"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden sm:block text-sm text-[#a1a1aa] hover:text-white transition-colors duration-200 px-4 py-2 rounded-lg border border-transparent hover:border-[#27272a]"
                >
                  Log In
                </Link>
                <Link
                  href="/register"
                  className="text-sm font-medium bg-[#22c55e] hover:bg-[#16a34a] text-black px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  Get Started
                </Link>
              </>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
