import { GOALS } from '@/lib/onboarding';
import { Badge, Heading, Sub, BackBtn, ContinueBtn, Checkmark, ErrorBanner } from './shared';

interface Props {
  selected:     string;
  onSelect:     (v: string) => void;
  onSubmit:     () => void;
  onBack:       () => void;
  loading:      boolean;
  error:        string | null;
  onClearError: () => void;
}

export default function StepFour({
  selected,
  onSelect,
  onSubmit,
  onBack,
  loading,
  error,
  onClearError,
}: Props) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <Badge text="Step 4 of 4  ·  Your Goal" />
      <Heading>Why do you want to contribute?</Heading>
      <Sub>Help us understand what matters most to you.</Sub>

      <div className="flex flex-col gap-3">
        {GOALS.map(goal => {
          const sel = selected === goal.value;
          return (
            <button
              key={goal.value}
              onClick={() => onSelect(goal.value)}
              className="relative flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-150 overflow-hidden"
              style={{
                background: sel ? 'rgba(34,197,94,0.07)' : '#111111',
                border:     `1.5px solid ${sel ? '#22c55e' : '#27272a'}`,
              }}
            >
              {sel && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px]"
                  style={{ background: '#22c55e' }}
                />
              )}
              <span className="text-[28px] leading-none flex-shrink-0">{goal.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-white font-bold text-sm">{goal.title}</p>
                <p className="text-[#a1a1aa] text-xs mt-1 leading-relaxed">{goal.description}</p>
              </div>
              {sel && <Checkmark />}
            </button>
          );
        })}
      </div>

      {error && <ErrorBanner message={error} onClear={onClearError} />}

      <ContinueBtn onClick={onSubmit} disabled={!selected} loading={loading} glow>
        Find My Repositories 🚀
      </ContinueBtn>
    </div>
  );
}
