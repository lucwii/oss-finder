'use client';

import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import type { Profile, PasswordData } from '../types';

function getStrength(pw: string): { score: number; label: string; color: string } {
  if (!pw) return { score: 0, label: '', color: '' };
  let score = 0;
  if (pw.length >= 8)             score++;
  if (/[0-9]/.test(pw))           score++;
  if (/[^a-zA-Z0-9]/.test(pw))    score++;
  if (pw.length >= 12)            score++;
  const map = [
    { label: 'Weak',   color: '#ef4444' },
    { label: 'Fair',   color: '#f97316' },
    { label: 'Good',   color: '#eab308' },
    { label: 'Strong', color: '#22c55e' },
  ];
  return { score, ...map[Math.min(score - 1, 3)] };
}

const inputStyle = (borderColor: string): React.CSSProperties => ({
  width: '100%',
  padding: '10px 40px 10px 14px',
  background: '#0a0a0a',
  border: `1px solid ${borderColor}`,
  borderRadius: 8,
  color: '#ffffff',
  fontSize: 14,
  transition: 'border-color 200ms',
  outline: 'none',
  boxSizing: 'border-box',
});

interface Props {
  profile: Profile | null;
  passwordData: PasswordData;
  isUpdating: boolean;
  onChange: (data: PasswordData) => void;
  onUpdate: () => void;
  addToast: (type: 'success' | 'error', message: string) => void;
}

export function SecurityTab({ profile, passwordData, isUpdating, onChange, onUpdate, addToast }: Props) {
  const [showCurrent, setShowCurrent]   = useState(false);
  const [showNew, setShowNew]           = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const [focused, setFocused]           = useState<string | null>(null);

  const strength       = getStrength(passwordData.new_password);
  const passwordsMatch = passwordData.confirm_password.length > 0 && passwordData.new_password === passwordData.confirm_password;
  const mismatch       = passwordData.confirm_password.length > 0 && passwordData.new_password !== passwordData.confirm_password;

  const handleUpdate = () => {
    if (!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password) {
      return addToast('error', 'Please fill in all password fields');
    }
    if (passwordData.new_password !== passwordData.confirm_password) {
      return addToast('error', 'Passwords do not match');
    }
    if (passwordData.new_password.length < 8) {
      return addToast('error', 'Password must be at least 8 characters');
    }
    onUpdate();
  };

  const disabled = !passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, animation: 'tabFadeIn 150ms ease' }}>

      {/* Change password */}
      <div style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 20 }}>Change Password</h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Current */}
          <div>
            <label style={{ fontSize: 13, color: '#a1a1aa', display: 'block', marginBottom: 6 }}>Current Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                value={passwordData.current_password}
                onChange={(e) => onChange({ ...passwordData, current_password: e.target.value })}
                placeholder="Enter current password"
                style={inputStyle(focused === 'current' ? '#22c55e' : '#27272a')}
                onFocus={() => setFocused('current')}
                onBlur={() => setFocused(null)}
              />
              <button onClick={() => setShowCurrent((p) => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 0 }}>
                {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* New */}
          <div>
            <label style={{ fontSize: 13, color: '#a1a1aa', display: 'block', marginBottom: 6 }}>New Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                value={passwordData.new_password}
                onChange={(e) => onChange({ ...passwordData, new_password: e.target.value })}
                placeholder="Enter new password"
                style={inputStyle(focused === 'new' ? '#22c55e' : '#27272a')}
                onFocus={() => setFocused('new')}
                onBlur={() => setFocused(null)}
              />
              <button onClick={() => setShowNew((p) => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 0 }}>
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {passwordData.new_password.length > 0 && (
              <div style={{ marginTop: 10 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: i <= strength.score ? strength.color : '#27272a', transition: 'background 200ms' }} />
                  ))}
                </div>
                {strength.label && <p style={{ fontSize: 12, color: strength.color, marginBottom: 8 }}>{strength.label}</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {[
                    { label: 'At least 8 characters', met: passwordData.new_password.length >= 8 },
                    { label: 'Contains a number',     met: /[0-9]/.test(passwordData.new_password) },
                    { label: 'Contains a symbol',     met: /[^a-zA-Z0-9]/.test(passwordData.new_password) },
                  ].map(({ label, met }) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <div style={{ width: 14, height: 14, borderRadius: '50%', background: met ? 'rgba(34,197,94,0.2)' : 'transparent', border: `1px solid ${met ? '#22c55e' : '#52525b'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        {met && <Check size={9} color="#22c55e" />}
                      </div>
                      <span style={{ fontSize: 12, color: met ? '#22c55e' : '#52525b' }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Confirm */}
          <div>
            <label style={{ fontSize: 13, color: '#a1a1aa', display: 'block', marginBottom: 6 }}>Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={passwordData.confirm_password}
                onChange={(e) => onChange({ ...passwordData, confirm_password: e.target.value })}
                placeholder="Confirm new password"
                style={inputStyle(passwordsMatch ? '#22c55e' : mismatch ? '#ef4444' : focused === 'confirm' ? '#22c55e' : '#27272a')}
                onFocus={() => setFocused('confirm')}
                onBlur={() => setFocused(null)}
              />
              <button onClick={() => setShowConfirm((p) => !p)} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#52525b', padding: 0 }}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {passwordsMatch && <p style={{ fontSize: 12, color: '#22c55e', marginTop: 6 }}>✓ Passwords match</p>}
            {mismatch      && <p style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>Passwords don&apos;t match</p>}
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={isUpdating || disabled}
          style={{
            marginTop: 20,
            width: '100%',
            padding: '11px 0',
            borderRadius: 8,
            border: 'none',
            background: '#22c55e',
            color: '#000000',
            fontSize: 14,
            fontWeight: 700,
            cursor: isUpdating ? 'wait' : disabled ? 'not-allowed' : 'pointer',
            opacity: disabled ? 0.5 : 1,
            transition: 'opacity 150ms',
          }}
        >
          {isUpdating ? 'Updating...' : 'Update Password'}
        </button>
      </div>

      {/* Connected account */}
      {profile && (
        <div style={{ background: '#111111', border: '1px solid #27272a', borderRadius: 12, padding: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, color: '#ffffff', marginBottom: 16 }}>Connected Account</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #27272a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ fontSize: 16 }}>
                {profile.email ? profile.email.charAt(0).toUpperCase() : '?'}
              </span>
            </div>
            <div>
              <p style={{ color: '#ffffff', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>{profile.email ?? 'Unknown'}</p>
              <span style={{ fontSize: 12, color: '#a1a1aa', background: '#1a1a1a', border: '1px solid #27272a', borderRadius: 4, padding: '2px 8px' }}>
                Email &amp; Password
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
