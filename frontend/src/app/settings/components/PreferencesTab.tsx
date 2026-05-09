'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import {
  LANGUAGES, LANGUAGE_COLORS, EXPERIENCE_OPTIONS,
  OSS_OPTIONS, INTERESTS, GOALS,
} from '../types';
import type { FormData } from '../types';
import { PreferencesSkeleton } from './Skeletons';

interface Props {
  isLoading: boolean;
  isSaving: boolean;
  saveSuccess: boolean;
  formData: FormData;
  onChange: (data: FormData) => void;
  onSave: () => void;
  addToast: (type: 'success' | 'error', message: string) => void;
}

export function PreferencesTab({ isLoading, isSaving, saveSuccess, formData, onChange, onSave, addToast }: Props) {
  const [shake, setShake]               = useState(false);
  const [validationError, setValidation] = useState('');

  const triggerShake = (msg: string) => {
    setValidation(msg);
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const toggleLanguage = (lang: string) => {
    onChange({
      ...formData,
      languages: formData.languages.includes(lang)
        ? formData.languages.filter((l) => l !== lang)
        : [...formData.languages, lang],
    });
  };

  const toggleInterest = (label: string) => {
    onChange({
      ...formData,
      interests: formData.interests.includes(label)
        ? formData.interests.filter((i) => i !== label)
        : [...formData.interests, label],
    });
  };

  const handleSave = () => {
    if (formData.languages.length === 0) return triggerShake('Please select at least one language');
    if (!formData.experience_years)       return triggerShake('Please select your experience level');
    if (formData.interests.length === 0)  return triggerShake('Please select at least one interest');
    if (!formData.goal)                   return triggerShake('Please select your goal');
    setValidation('');
    onSave();
  };

  if (isLoading) return <PreferencesSkeleton />;

  return (
    <div style={{ animation: shake ? 'shake 400ms ease' : undefined }}>

      {/* Languages */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Languages</h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Select the languages you work with</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
          {LANGUAGES.map((lang) => {
            const selected = formData.languages.includes(lang);
            const colors = LANGUAGE_COLORS[lang] ?? { bg: '#1a1a2e', text: '#a855f7' };
            return (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                style={{
                  padding: '10px 8px',
                  borderRadius: 8,
                  border: `1px solid ${selected ? colors.text : '#27272a'}`,
                  background: selected ? `${colors.bg}cc` : '#111111',
                  color: selected ? colors.text : '#a1a1aa',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                {selected && <Check size={12} />}
                {lang}
              </button>
            );
          })}
        </div>
      </section>

      {/* Experience */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Experience Level</h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Years of programming experience</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {EXPERIENCE_OPTIONS.map((opt) => {
            const selected = formData.experience_years === opt;
            return (
              <button
                key={opt}
                onClick={() => onChange({ ...formData, experience_years: opt })}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  border: `1px solid ${selected ? '#22c55e' : '#27272a'}`,
                  background: selected ? 'rgba(34,197,94,0.08)' : '#111111',
                  color: selected ? '#22c55e' : '#a1a1aa',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </section>

      {/* Open source experience */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Open Source Experience</h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Have you contributed to open source before?</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {OSS_OPTIONS.map((opt) => {
            const selected = formData.open_source_experience === opt;
            return (
              <button
                key={opt}
                onClick={() => onChange({ ...formData, open_source_experience: opt })}
                style={{
                  padding: '8px 18px',
                  borderRadius: 20,
                  border: `1px solid ${selected ? '#22c55e' : '#27272a'}`,
                  background: selected ? 'rgba(34,197,94,0.08)' : '#111111',
                  color: selected ? '#22c55e' : '#a1a1aa',
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                }}
              >
                {opt}
              </button>
            );
          })}
        </div>
      </section>

      {/* Interests */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Interests</h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>Topics you enjoy working on</p>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {INTERESTS.map(({ label, emoji }) => {
            const selected = formData.interests.includes(label);
            return (
              <button
                key={label}
                onClick={() => toggleInterest(label)}
                style={{
                  padding: '8px 14px',
                  borderRadius: 20,
                  border: `1px solid ${selected ? '#22c55e' : '#27272a'}`,
                  background: selected ? 'rgba(34,197,94,0.08)' : '#111111',
                  color: selected ? '#22c55e' : '#a1a1aa',
                  fontSize: 13,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                <span>{emoji}</span>
                {label}
              </button>
            );
          })}
        </div>
      </section>

      {/* Goal */}
      <section style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, color: '#ffffff', marginBottom: 4 }}>Your Goal</h3>
        <p style={{ fontSize: 13, color: '#a1a1aa', marginBottom: 12 }}>What are you looking to achieve?</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {GOALS.map(({ value, label, emoji }) => {
            const selected = formData.goal === value;
            return (
              <button
                key={value}
                onClick={() => onChange({ ...formData, goal: value })}
                style={{
                  padding: '12px 16px',
                  borderRadius: 8,
                  border: `1px solid ${selected ? '#22c55e' : '#27272a'}`,
                  borderLeft: `3px solid ${selected ? '#22c55e' : 'transparent'}`,
                  background: selected ? 'rgba(34,197,94,0.08)' : '#111111',
                  color: selected ? '#ffffff' : '#a1a1aa',
                  fontSize: 14,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                }}
              >
                <span style={{ fontSize: 18 }}>{emoji}</span>
                {label}
                {selected && <Check size={14} color="#22c55e" style={{ marginLeft: 'auto' }} />}
              </button>
            );
          })}
        </div>
      </section>

      {validationError && (
        <p style={{ color: '#ef4444', fontSize: 13, marginBottom: 12 }}>{validationError}</p>
      )}

      <button
        onClick={handleSave}
        disabled={isSaving}
        style={{
          width: '100%',
          padding: '12px 0',
          borderRadius: 8,
          border: 'none',
          background: saveSuccess ? '#16a34a' : '#22c55e',
          color: '#000000',
          fontSize: 15,
          fontWeight: 700,
          cursor: isSaving ? 'wait' : 'pointer',
          transition: 'background 200ms',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
        }}
      >
        {isSaving ? 'Saving...' : saveSuccess ? '✓ Saved' : 'Save Preferences'}
      </button>
    </div>
  );
}
