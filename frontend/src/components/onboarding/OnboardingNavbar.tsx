export default function OnboardingNavbar({ step }: { step: number }) {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 h-14 flex items-center justify-between px-5 border-b border-[#27272a]"
      style={{ background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(12px)' }}
    >
      <img src="/logo.svg" alt="Mergly" style={{ height: '26px', width: 'auto' }} />
      <span
        className="text-[#a1a1aa] text-xs font-medium"
        style={{ fontFamily: 'var(--font-mono)' }}
      >
        Step {step} of 4
      </span>
    </nav>
  );
}
