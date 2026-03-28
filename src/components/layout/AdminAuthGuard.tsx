'use client';

import { useEffect, useState } from 'react';

export function AdminAuthGuard({ children }: { children: React.ReactNode }) {
  const [authed, setAuthed] = useState(false);
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetch('/api/admin-auth')
      .then((res) => {
        if (!mounted) return;
        setAuthed(res.ok);
      })
      .catch(() => {
        if (!mounted) return;
        setAuthed(false);
      })
      .finally(() => {
        if (!mounted) return;
        setChecking(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  const handleLogin = async () => {
    const res = await fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw }),
    });
    if (res.ok) {
      setAuthed(true);
      setPw('');
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  if (checking) return null;

  if (!authed) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-full border border-gold mx-auto flex items-center justify-center font-display text-gold text-sm">
            ME
          </div>
          <h1 className="font-display text-3xl font-light text-charcoal">Admin Access</h1>
          <input
            type="password"
            value={pw}
            onChange={(e) => setPw(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            placeholder="Enter password"
            className={`w-full border px-4 py-3 text-sm bg-white text-charcoal focus:outline-none transition-colors ${
              error ? 'border-red-400' : 'border-charcoal/15 focus:border-gold'
            }`}
          />
          {error && <p className="text-xs text-red-500">Incorrect password</p>}
          <button onClick={handleLogin} className="btn-charcoal w-full">
            Enter
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
