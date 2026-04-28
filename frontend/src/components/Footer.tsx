import { Terminal, GitFork } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[#27272a] py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg flex items-center justify-center">
            <Terminal className="w-3.5 h-3.5 text-[#22c55e]" />
          </div>
          <span className="font-semibold text-white text-sm tracking-tight">
            ContribFinder
          </span>
        </div>

        {/* Links */}
        <nav className="flex items-center gap-6 text-sm text-[#a1a1aa]">
          <a href="#" className="hover:text-white transition-colors flex items-center gap-1.5">
            <GitFork className="w-3.5 h-3.5" />
            GitHub
          </a>
          <a href="#how-it-works" className="hover:text-white transition-colors">
            How it works
          </a>
          <a href="#features" className="hover:text-white transition-colors">
            Features
          </a>
        </nav>

        {/* Tagline */}
        <p className="text-xs text-[#52525b]">
          Built for developers, by developers
        </p>
      </div>
    </footer>
  );
}
