'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Terminal } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    const { error: signUpError } = await supabase.auth.signUp({ email, password });
    setLoading(false);

    if (signUpError) {
      setError(signUpError.message);
      return;
    }

    router.push('/onboarding');
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div className="w-8 h-8 bg-[#22c55e]/10 border border-[#22c55e]/30 rounded-lg flex items-center justify-center">
            <Terminal className="w-4 h-4 text-[#22c55e]" strokeWidth={2} />
          </div>
          <Link href="/" className="font-semibold text-white text-[15px] tracking-tight">
            ContribFinder
          </Link>
        </div>

        <div className="bg-[#111111] border border-[#27272a] rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-white mb-1">Create your account</h1>
          <p className="text-[#a1a1aa] text-sm mb-6">Start finding open source contributions</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#27272a] rounded-xl text-white text-sm placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Min. 6 characters"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#27272a] rounded-xl text-white text-sm placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/50 transition-colors"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-mono text-[#a1a1aa] tracking-widest uppercase">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Repeat your password"
                className="w-full px-4 py-3 bg-[#0d0d0d] border border-[#27272a] rounded-xl text-white text-sm placeholder-[#3f3f46] focus:outline-none focus:border-[#22c55e]/50 transition-colors"
              />
            </div>

            {error && (
              <p className="text-sm text-red-400 py-2 px-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#22c55e] hover:bg-[#16a34a] disabled:opacity-60 disabled:cursor-not-allowed text-black font-semibold rounded-xl transition-all duration-200 btn-glow mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-[#a1a1aa] mt-6">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-[#22c55e] hover:text-[#4ade80] transition-colors font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
