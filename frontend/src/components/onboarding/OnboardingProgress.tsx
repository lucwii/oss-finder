import { Check } from 'lucide-react';

export default function OnboardingProgress({
  step,
  hasNavigated,
}: {
  step:         number;
  hasNavigated: boolean;
}) {
  return (
    <div
      className="fixed top-14 left-0 right-0 z-40 px-5 pt-3 pb-3"
      style={{
        background:    'rgba(10,10,10,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom:  '1px solid rgba(39,39,42,0.4)',
      }}
    >
      {/* Step dots */}
      <div className="flex items-center mb-2.5 mx-auto" style={{ maxWidth: 300 }}>
        {[1, 2, 3, 4].map((s, i) => (
          <div key={s} className="flex items-center" style={{ flex: i < 3 ? 1 : 'none' }}>
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0 transition-all duration-300"
              style={{
                background: s < step ? '#22c55e' : 'transparent',
                border:     `2px solid ${s <= step ? '#22c55e' : '#27272a'}`,
                color:      s < step ? '#000' : s === step ? '#22c55e' : '#3f3f46',
                boxShadow:  s === step
                  ? '0 0 0 3px rgba(34,197,94,0.12), 0 0 10px rgba(34,197,94,0.12)'
                  : undefined,
                animation:  s === step && hasNavigated ? 'ob-dot-pulse 0.45s ease' : undefined,
              }}
            >
              {s < step ? <Check size={11} strokeWidth={3} /> : s}
            </div>
            {i < 3 && (
              <div
                className="flex-1 h-[2px] mx-1.5 rounded-full transition-all duration-500"
                style={{ background: s < step ? '#22c55e' : '#27272a' }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Progress bar */}
      <div
        className="h-[3px] rounded-full overflow-hidden mx-auto"
        style={{ maxWidth: 580, background: '#1a1a1a' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width:      `${step * 25}%`,
            background: '#22c55e',
            transition: 'width 600ms ease',
            boxShadow:  '0 0 8px rgba(34,197,94,0.6)',
          }}
        />
      </div>
    </div>
  );
}
