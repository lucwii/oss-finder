export default function OnboardingNavbar({ step }: { step: number }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 border-b border-[#27272a]"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <div className="flex items-center gap-1.5">
        <span
          className="font-black text-xl leading-none"
          style={{ color: '#22c55e', textShadow: '0 0 10px rgba(34,197,94,0.4)' }}
        >
          &gt;
        </span>
        <span className="font-semibold text-white text-sm tracking-tight">ContribFinder</span>
      </div>
      <span
        className="text-[#a1a1aa] text-xs font-medium"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Step {step} of 4
      </span>
    </nav>
  );
}
