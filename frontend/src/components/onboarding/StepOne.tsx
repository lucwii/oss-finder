import { Check } from 'lucide-react';
import { LANGUAGES } from '@/lib/onboarding';
import { Badge, Heading, Sub, ContinueBtn } from './shared';

interface Props {
  selected: string[];
  onToggle: (lang: string) => void;
  onNext:   () => void;
  shaking:  boolean;
}

export default function StepOne({ selected, onToggle, onNext, shaking }: Props) {
  const canContinue = selected.length > 0;

  return (
    <div>
      <Badge text="Step 1 of 4  ·  Skills" />
      <Heading>What languages do you work with?</Heading>
      <Sub>Select all that apply. We&apos;ll find repos in your stack.</Sub>

      <div
        className="grid grid-cols-3 gap-2.5 mb-1"
        style={{ animation: shaking ? 'ob-shake 0.5s ease' : undefined }}
      >
        {LANGUAGES.map(lang => {
          const sel = selected.includes(lang.name);
          return (
            <button
              key={lang.name}
              onClick={() => onToggle(lang.name)}
              className="relative flex items-center gap-2.5 p-3 rounded-xl text-left transition-all duration-150"
              style={{
                background: sel ? `${lang.color}14` : '#111111',
                border:     `1.5px solid ${sel ? lang.color : '#27272a'}`,
                transform:  sel ? 'scale(1.025)' : 'scale(1)',
                boxShadow:  sel ? `0 0 14px ${lang.color}1e` : 'none',
              }}
            >
              <span
                className="flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black leading-none"
                style={{ background: `${lang.color}20`, color: lang.color }}
              >
                {lang.abbr}
              </span>
              <span className="text-xs font-medium text-white truncate">{lang.name}</span>

              {sel && (
                <span
                  className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full flex items-center justify-center"
                  style={{
                    background: '#22c55e',
                    animation:  'ob-check-in 0.2s cubic-bezier(0.34,1.56,0.64,1) both',
                  }}
                >
                  <Check size={9} strokeWidth={3} color="#000" />
                </span>
              )}
            </button>
          );
        })}
      </div>

      {shaking && !canContinue && (
        <p className="text-[#ef4444] text-xs mt-2" style={{ animation: 'ob-fade-up 0.2s ease both' }}>
          Please select at least one language
        </p>
      )}

      <ContinueBtn onClick={onNext} disabled={!canContinue}>
        Continue →
      </ContinueBtn>
    </div>
  );
}
