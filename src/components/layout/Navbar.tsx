'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';

export function Navbar() {
  const pathname = usePathname();
  const { count } = useCart();
  const { user, loading, signOut } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  const isAdmin = pathname.startsWith('/admin');
  if (isAdmin) return null;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close account dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (accountRef.current && !accountRef.current.contains(e.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const openCart = () => window.dispatchEvent(new Event('open-cart'));

  const navLinks = [
    { href: '/shop',      label: 'Shop' },
    { href: '/our-story', label: 'Our Story' },
  ];

  const initials = user?.user_metadata?.full_name
    ? user.user_metadata.full_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : user?.email?.slice(0, 2).toUpperCase() ?? '?';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[80] transition-all duration-300 ${
        scrolled ? 'bg-ivory/95 backdrop-blur-sm shadow-[0_1px_0_0_rgba(0,0,0,0.06)]' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-xl text-charcoal tracking-wide hover:text-gold transition-colors">
          Minnie Ethnics
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-xs tracking-[0.12em] uppercase transition-colors ${
                pathname === l.href ? 'text-charcoal' : 'text-muted hover:text-charcoal'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative text-charcoal hover:text-gold transition-colors"
            aria-label="Open cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            {count() > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-gold text-ivory text-[9px] font-sans font-medium rounded-full flex items-center justify-center leading-none">
                {count()}
              </span>
            )}
          </button>

          {/* Auth — desktop */}
          {!loading && (
            <div className="hidden md:block relative" ref={accountRef}>
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen((o) => !o)}
                    className="w-8 h-8 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center text-gold text-[11px] font-display tracking-wide hover:bg-gold/25 transition-colors"
                    aria-label="Account menu"
                  >
                    {initials}
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 top-10 w-48 bg-ivory border border-charcoal/10 shadow-lg py-1 z-[200]">
                      <div className="px-4 py-2 border-b border-charcoal/6">
                        <p className="text-xs text-charcoal font-medium truncate">{user.user_metadata?.full_name ?? 'My Account'}</p>
                        <p className="text-[10px] text-faint truncate">{user.email}</p>
                      </div>
                      <button
                        onClick={async () => { setAccountOpen(false); await signOut(); }}
                        className="w-full text-left px-4 py-2.5 text-xs text-muted hover:text-charcoal hover:bg-charcoal/4 transition-colors"
                      >
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href="/auth"
                  className="text-xs tracking-[0.12em] uppercase text-muted hover:text-charcoal transition-colors"
                >
                  Sign in
                </Link>
              )}
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="md:hidden text-charcoal"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-ivory border-t border-charcoal/10 px-6 py-4 space-y-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMenuOpen(false)}
              className="block text-sm text-charcoal py-1.5"
            >
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-charcoal/6">
            {user ? (
              <div className="space-y-2">
                <p className="text-xs text-faint">{user.user_metadata?.full_name ?? user.email}</p>
                <button
                  onClick={async () => { setMenuOpen(false); await signOut(); }}
                  className="text-sm text-charcoal"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/auth"
                onClick={() => setMenuOpen(false)}
                className="block text-sm text-charcoal py-1.5"
              >
                Sign in / Create account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}