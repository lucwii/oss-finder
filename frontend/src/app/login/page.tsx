'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Check, X } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import AuthLeftPanel from '@/components/auth/AuthLeftPanel';

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function floatLabel(focused: boolean, hasValue: boolean): React.CSSProperties {
  const active = focused || hasValue;
  return {
    position: 'absolute',
    left: 42,
    top: active ? 6 : '50%',
    transform: active ? 'none' : 'translateY(-50%)',
    fontSize: active ? 10 : 14,
    letterSpacing: active ? '0.06em' : 0,
    textTransform: active ? 'uppercase' : 'none',
    color: focused ? '#22c55e' : '#52525b',
    pointerEvents: 'none',
    transition: 'all 0.18s ease',
    fontWeight: 500,
    whiteSpace: 'nowrap',
    zIndex: 10,
  };
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailFocused, setEmailFocused] = useState(false);
  const [emailTouched, setEmailTouched] = useState(false);
  const [pwdFocused, setPwdFocused] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && user) router.push('/dashboard');
  }, [user, authLoading, router]);

  const emailValid = isValidEmail(email);

  function emailBorder() {
    if (emailFocused) return 'rgba(34,197,94,0.5)';
    if (emailTouched && email) return emailValid ? 'rgba(34,197,94,0.35)' : 'rgba(239,68,68,0.5)';
    return '#27272a';
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { data, error: err } = await supabase.auth.signInWithPassword({ email, password });

    if (err || !data.user) {
      setLoading(false);
      const msg = err?.message ?? '';
      setError(
        msg.toLowerCase().includes('invalid') || msg.toLowerCase().includes('credentials')
          ? 'Incorrect email or password'
          : msg || 'Something went wrong',
      );
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('onboarding_completed')
      .eq('id', data.user.id)
      .single();

    router.push(profile?.onboarding_completed ? '/dashboard' : '/onboarding');
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Left panel */}
      <div className="hidden lg:block w-[60%] flex-shrink-0 h-full">
        <AuthLeftPanel />
      </div>

      {/* Right panel */}
      <div
        className="flex-1 min-w-0 flex flex-col items-center justify-center overflow-y-auto py-10 px-6 lg:px-10"
        style={{
          background:
            'radial-gradient(ellipse 80% 60% at 50% 50%, rgba(34,197,94,0.025) 0%, transparent 60%)',
        }}
      >
        <div className="w-full max-w-sm" style={{ animation: 'fadeSlideUp 0.45s ease both' }}>
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 bg-[#22c55e]/10 border border-[#22c55e]/20 rounded-full mb-6"
            style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '40ms' }}
          >
            <span className="text-[#22c55e] text-xs font-medium tracking-wide">✦ Welcome back</span>
          </div>

          <h1
            className="text-[26px] font-bold text-white mb-1.5 leading-tight"
            style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '60ms' }}
          >
            Sign in to your account
          </h1>
          <p
            className="text-[#a1a1aa] text-sm mb-1"
            style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '80ms' }}
          >
            Your personalized recommendations are waiting
          </p>
          <p
            className="text-sm text-[#52525b] mb-8"
            style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '100ms' }}
          >
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium">
              Sign up →
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Email */}
            <div style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '120ms' }}>
              <div
                className="relative h-14 rounded-xl bg-[#1a1a1a] overflow-hidden"
                style={{ border: `1.5px solid ${emailBorder()}`, transition: 'border-color 0.2s ease' }}
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                  <Mail
                    className="w-4 h-4"
                    style={{ color: emailFocused ? '#22c55e' : '#3f3f46', transition: 'color 0.2s' }}
                  />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setEmailFocused(true)}
                  onBlur={() => { setEmailFocused(false); setEmailTouched(true); }}
                  placeholder=" "
                  required
                  className="absolute inset-0 w-full h-full bg-transparent pl-10 pr-10 pt-5 pb-1 text-white text-sm focus:outline-none"
                />
                <label style={floatLabel(emailFocused, !!email)}>Email address</label>
                {email && emailValid && (
                  <div
                    className="absolute right-3.5 top-1/2 -translate-y-1/2"
                    style={{ animation: 'scaleIn 0.2s cubic-bezier(0.34,1.56,0.64,1) both' }}
                  >
                    <Check className="w-4 h-4 text-[#22c55e]" />
                  </div>
                )}
              </div>
            </div>

            {/* Password */}
            <div style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '160ms' }}>
              <div
                className="relative h-14 rounded-xl bg-[#1a1a1a] overflow-hidden"
                style={{
                  border: `1.5px solid ${pwdFocused ? 'rgba(34,197,94,0.5)' : '#27272a'}`,
                  transition: 'border-color 0.2s ease',
                }}
              >
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10">
                  <Lock
                    className="w-4 h-4"
                    style={{ color: pwdFocused ? '#22c55e' : '#3f3f46', transition: 'color 0.2s' }}
                  />
                </div>
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setPwdFocused(true)}
                  onBlur={() => setPwdFocused(false)}
                  placeholder=" "
                  required
                  className="absolute inset-0 w-full h-full bg-transparent pl-10 pr-10 pt-5 pb-1 text-white text-sm focus:outline-none"
                />
                <label style={floatLabel(pwdFocused, !!password)}>Password</label>
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPwd((v) => !v)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10 text-[#3f3f46] hover:text-[#a1a1aa] transition-colors"
                >
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Forgot password */}
              <div className="flex justify-end mt-1.5">
                <button
                  type="button"
                  className="text-[11px] text-[#3f3f46] hover:text-[#a1a1aa] transition-colors"
                >
                  Forgot password?
                </button>
              </div>
            </div>

            {/* Error card */}
            {error && (
              <div
                style={{ animation: 'slideDown 0.22s ease both' }}
                className="flex items-start gap-3 p-3.5 bg-red-500/10 border border-red-500/20 rounded-xl"
              >
                <p className="text-red-400 text-sm flex-1 leading-snug">{error}</p>
                <button
                  type="button"
                  onClick={() => setError(null)}
                  className="text-red-400/50 hover:text-red-400 flex-shrink-0 transition-colors mt-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Submit */}
            <div
              className="pt-1"
              style={{ animation: 'fadeSlideUp 0.45s ease both', animationDelay: '200ms' }}
            >
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#22c55e] hover:bg-[#16a34a] hover:-translate-y-px text-black font-semibold rounded-xl transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ boxShadow: loading ? 'none' : '0 0 24px rgba(34,197,94,0.28)' }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
