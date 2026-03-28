'use client';

import { Suspense } from 'react';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

function AuthForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading } = useAuth();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const next = searchParams.get('next') ?? '/';
  const oauthError = searchParams.get('error') === 'oauth';

  useEffect(() => {
    if (!loading && user) router.replace(next);
  }, [user, loading, router, next]);

  const handleGoogle = async () => {
    setError('');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      },
    });
    if (error) setError(error.message);
  };

  const handleEmailAuth = async () => {
    if (!email || !password) { setError('Please enter your email and password.'); return; }
    setError(''); setMessage(''); setSubmitting(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) { setError('Please enter your name.'); return; }
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        setMessage('Check your email to confirm your account, then come back to log in.');
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.replace(next);
      }
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return null;

  return (
    <div className="w-full max-w-sm space-y-8">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-full border border-gold mx-auto flex items-center justify-center font-display text-gold text-sm tracking-widest">
          ME
        </div>
        <h1 className="font-display text-3xl font-light text-charcoal">
          {mode === 'login' ? 'Welcome back.' : 'Create account.'}
        </h1>
        <p className="text-sm text-faint">
          {mode === 'login'
            ? 'Sign in to access your cart and orders.'
            : 'Join to save your cart and track orders.'}
        </p>
      </div>

      {oauthError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 text-center">
          Google sign-in failed. Please try again.
        </div>
      )}

      <button
        onClick={handleGoogle}
        className="w-full flex items-center justify-center gap-3 border border-charcoal/20 bg-white py-3 text-sm text-charcoal hover:border-charcoal/40 transition-colors"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Continue with Google
      </button>

      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-charcoal/10" />
        <span className="text-xs text-faint tracking-widest uppercase">or</span>
        <div className="flex-1 h-px bg-charcoal/10" />
      </div>

      <div className="space-y-3">
        {mode === 'signup' && (
          <div>
            <label className="label-xs text-faint block mb-1.5">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Priya Sharma"
              className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
            />
          </div>
        )}

        <div>
          <label className="label-xs text-faint block mb-1.5">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        <div>
          <label className="label-xs text-faint block mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            onKeyDown={(e) => e.key === 'Enter' && handleEmailAuth()}
            className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
          />
        </div>

        {error && <p className="text-xs text-red-600">{error}</p>}
        {message && <p className="text-xs text-green-700">{message}</p>}

        <button
          onClick={handleEmailAuth}
          disabled={submitting}
          className={`w-full py-3 text-xs tracking-[0.15em] uppercase font-sans transition-all mt-2 ${
            submitting ? 'bg-muted text-ivory cursor-wait' : 'btn-gold'
          }`}
        >
          {submitting ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
        </button>
      </div>

      <p className="text-center text-xs text-faint">
        {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
        <button
          onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError(''); setMessage(''); }}
          className="text-charcoal underline underline-offset-2 hover:text-gold transition-colors"
        >
          {mode === 'login' ? 'Sign up' : 'Sign in'}
        </button>
      </p>
    </div>
  );
}

export default function AuthPage() {
  return (
    <main className="relative z-[5] min-h-screen bg-ivory flex items-center justify-center px-6 py-16">
      <Suspense>
        <AuthForm />
      </Suspense>
    </main>
  );
}