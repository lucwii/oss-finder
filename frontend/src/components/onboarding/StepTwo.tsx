import { EXPERIENCE_OPTIONS, OSS_OPTIONS } from '@/lib/onboarding';
import { Badge, Heading, Sub, BackBtn, ContinueBtn, Checkmark } from './shared';

interface Props {
  experienceYears:    string;
  ossExperience:      string;
  onExperienceChange: (v: string) => void;
  onOssChange:        (v: string) => void;
  onNext:             () => void;
  onBack:             () => void;
  canContinue:        boolean;
}

export default function StepTwo({
  experienceYears,
  ossExperience,
  onExperienceChange,
  onOssChange,
  onNext,
  onBack,
  canContinue,
}: Props) {
  return (
    <div>
      <BackBtn onClick={onBack} />
      <Badge text="Step 2 of 4  ·  Experience" />
      <Heading>How long have you been coding?</Heading>
      <Sub>This helps us find the right difficulty level for you.</Sub>

      <div className="grid grid-cols-2 gap-3 mb-6">
        {EXPERIENCE_OPTIONS.map(opt => {
          const sel = experienceYears === opt.value;
          return (
            <button
              key={opt.value}
              onClick={() => onExperienceChange(opt.value)}
              className="relative flex items-start gap-3 p-4 rounded-xl text-left transition-all duration-150 overflow-hidden"
              style={{
                background: sel ? 'rgba(34,197,94,0.07)' : '#111111',
                border:     `1.5px solid ${sel ? '#22c55e' : '#27272a'}`,
              }}
            >
              {sel && (
                <div
                  className="absolute left-0 top-0 bottom-0 w-[3px] rounded-l-xl"
                  style={{ background: '#22c55e' }}
                />
              )}
              <span className="text-2xl leading-none flex-shrink-0 mt-0.5">{opt.icon}</span>
              <div>
                <p className="text-white font-bold text-sm leading-tight">{opt.label}</p>
                <p className="text-[#a1a1aa] text-xs mt-1">{opt.subtext}</p>
              </div>
              {sel && <Checkmark />}
            </button>
          );
        })}
      </div>

      {experienceYears && (
        <div style={{ animation: 'ob-fade-up 0.35s ease both' }}>
          <p className="text-white font-medium text-sm mb-3">
            Have you contributed to open source before?
          </p>
          <div className="flex gap-2.5 flex-wrap">
            {OSS_OPTIONS.map(opt => {
              const sel = ossExperience === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => onOssChange(opt.value)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-150"
                  style={{
                    background: sel ? 'rgba(34,197,94,0.1)' : '#111111',
                    border:     `1.5px solid ${sel ? '#22c55e' : '#27272a'}`,
                    color:      sel ? '#ffffff' : '#a1a1aa',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <ContinueBtn onClick={onNext} disabled={!canContinue}>
        Continue →
      </ContinueBtn>
    </div>
  );
}
