import { INTERESTS } from '@/lib/onboarding';
import { Badge, Heading, Sub, BackBtn, ContinueBtn } from './shared';

interface Props {
  selected: string[];
  onToggle: (interest: string) => void;
  onNext:   () => void;
  onBack:   () => void;
  status:   { text: string; color: string };
  shaking:  boolean;
}

export default function StepThree({ selected, onToggle, onNext, onBack, status, shaking }: Props) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <Badge text="Step 3 of 4  ·  Interests" />
      <Heading>What areas interest you most?</Heading>
      <Sub>We&apos;ll prioritize repos in these categories.</Sub>

      <div
        className="flex flex-wrap gap-2 mb-4"
        style={{ animation: shaking ? 'ob-shake 0.5s ease' : undefined }}
      >
        {INTERESTS.map(interest => {
          const sel = selected.includes(interest.value);
          return (
            <button
              key={interest.value}
              onClick={() => onToggle(interest.value)}
              className="px-3.5 py-2 rounded-full text-sm font-medium flex items-center gap-1.5 transition-all duration-150"
              style={{
                background: sel ? 'rgba(34,197,94,0.1)' : '#111111',
                border:     `1.5px solid ${sel ? '#22c55e' : '#27272a'}`,
                color:      sel ? '#ffffff' : '#a1a1aa',
                animation:  sel ? 'ob-tag-bounce 0.3s ease' : undefined,
              }}
            >
              <span>{interest.emoji}</span>
              {interest.value}
            </button>
          );
        })}
      </div>

      <p
        className="text-xs transition-all duration-300 mb-1"
        style={{ color: status.color }}
      >
        {status.text}
      </p>

      <ContinueBtn onClick={onNext} disabled={selected.length === 0}>
        Continue →
      </ContinueBtn>
    </div>
  );
}
