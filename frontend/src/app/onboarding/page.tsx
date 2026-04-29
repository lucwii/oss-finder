'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import type { OnboardingData } from '@/lib/onboarding';
import OnboardingNavbar   from '@/components/onboarding/OnboardingNavbar';
import OnboardingProgress from '@/components/onboarding/OnboardingProgress';
import StepOne   from '@/components/onboarding/StepOne';
import StepTwo   from '@/components/onboarding/StepTwo';
import StepThree from '@/components/onboarding/StepThree';
import StepFour  from '@/components/onboarding/StepFour';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

type Direction = 'forward' | 'backward';

export default function OnboardingPage() {
  const router = useRouter();

  const [step, setStep]                   = useState(1);
  const [direction, setDirection]         = useState<Direction>('forward');
  const [hasNavigated, setHasNavigated]   = useState(false);
  const [shaking, setShaking]             = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitError, setSubmitError]     = useState<string | null>(null);

  const [data, setData] = useState<OnboardingData>({
    languages:              [],
    experience_years:       '',
    open_source_experience: '',
    interests:              [],
    goal:                   '',
  });

  const triggerShake = () => {
    setShaking(true);
    setTimeout(() => setShaking(false), 600);
  };

  const goTo = (next: number) => {
    setDirection(next > step ? 'forward' : 'backward');
    setHasNavigated(true);
    setStep(next);
  };

  const handleNext = () => {
    if (step === 1 && data.languages.length === 0)                             return triggerShake();
    if (step === 2 && (!data.experience_years || !data.open_source_experience)) return;
    if (step === 3 && data.interests.length === 0)                             return triggerShake();
    if (step < 4) goTo(step + 1);
  };

  const handleBack = () => { if (step > 1) goTo(step - 1); };

  const handleSubmit = async () => {
    if (!data.goal) return;
    setSubmitLoading(true);
    setSubmitError(null);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const res = await fetch(`${API_BASE}/onboarding/save`, {
        method:  'POST',
        headers: {
          'Content-Type':  'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body?.message ?? 'Failed to save profile');
      }

      router.push('/dashboard');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitLoading(false);
    }
  };

  const toggleLanguage = (lang: string) =>
    setData(p => ({
      ...p,
      languages: p.languages.includes(lang)
        ? p.languages.filter(l => l !== lang)
        : [...p.languages, lang],
    }));

  const toggleInterest = (interest: string) =>
    setData(p => ({
      ...p,
      interests: p.interests.includes(interest)
        ? p.interests.filter(i => i !== interest)
        : [...p.interests, interest],
    }));

  const enterClass = !hasNavigated
    ? 'ob-initial'
    : direction === 'forward'
    ? 'ob-enter-forward'
    : 'ob-enter-backward';

  const interestStatus = (() => {
    const n = data.interests.length;
    if (n === 0) return { text: '0 areas selected',                          color: '#52525b' };
    if (n <= 2)  return { text: `${n} area${n > 1 ? 's' : ''} selected — Good start!`, color: '#a1a1aa' };
    return               { text: `${n} areas selected — Great mix! ✓`,       color: '#22c55e' };
  })();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <OnboardingNavbar step={step} />
      <OnboardingProgress step={step} hasNavigated={hasNavigated} />

      <div className="flex-1 flex justify-center px-4 pt-[120px] pb-12">
        <div className="w-full" style={{ maxWidth: 580 }}>
          <div key={step} className={enterClass}>
            {step === 1 && (
              <StepOne
                selected={data.languages}
                onToggle={toggleLanguage}
                onNext={handleNext}
                shaking={shaking && data.languages.length === 0}
              />
            )}
            {step === 2 && (
              <StepTwo
                experienceYears={data.experience_years}
                ossExperience={data.open_source_experience}
                onExperienceChange={v => setData(p => ({ ...p, experience_years: v }))}
                onOssChange={v => setData(p => ({ ...p, open_source_experience: v }))}
                onNext={handleNext}
                onBack={handleBack}
                canContinue={!!(data.experience_years && data.open_source_experience)}
              />
            )}
            {step === 3 && (
              <StepThree
                selected={data.interests}
                onToggle={toggleInterest}
                onNext={handleNext}
                onBack={handleBack}
                status={interestStatus}
                shaking={shaking && data.interests.length === 0}
              />
            )}
            {step === 4 && (
              <StepFour
                selected={data.goal}
                onSelect={v => setData(p => ({ ...p, goal: v }))}
                onSubmit={handleSubmit}
                onBack={handleBack}
                loading={submitLoading}
                error={submitError}
                onClearError={() => setSubmitError(null)}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
