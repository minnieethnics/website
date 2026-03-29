'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

export function HeroSection({
  heroVideoUrl,
  heroVideoPosterUrl,
}: {
  heroVideoUrl?: string;
  heroVideoPosterUrl?: string;
}) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <section className="relative min-h-[92vh] flex items-center overflow-hidden">
      {heroVideoUrl ? (
        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay
          muted
          loop
          playsInline
          poster={heroVideoPosterUrl || undefined}
          src={heroVideoUrl}
        >
          Your browser does not support the video tag.
        </video>
      ) : (
        <div
          className="absolute inset-0 z-0"
          style={{
            background: 'linear-gradient(135deg, #EDE0CC 0%, #D9C9B0 55%, #C9B598 100%)',
          }}
        />
      )}

      {/*
        VIDEO: When you have a stock video of children in ethnic wear / artisan making clothes,
        replace the div above with this block:

        <video
          className="absolute inset-0 w-full h-full object-cover z-0"
          autoPlay muted loop playsInline
          poster="/images/hero-poster.jpg"
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      */}

      {/* Dark veil over video/bg so text is readable */}
      <div className="absolute inset-0 z-[1]" style={{ background: 'rgba(61,53,48,0.22)' }} />

      {!heroVideoUrl && (
        <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 opacity-30 pointer-events-none select-none">
          <div className="w-16 h-16 rounded-full border border-gold/60 flex items-center justify-center">
            <div className="ml-1 border-l-[16px] border-l-gold/70 border-y-[10px] border-y-transparent" />
          </div>
          <p className="font-display italic text-ivory/60 text-sm tracking-wider">
            upload hero video in admin media
          </p>
        </div>
      )}

      {/* Content */}
      <div className="relative z-[5] px-8 md:px-16 max-w-2xl">
        <p
          className={`label-xs text-gold mb-5 ${loaded ? 'animate-fadeUp delay-1' : 'opacity-0'}`}
        >
          New Collection · Spring 2026
        </p>

        <h1
          className={`font-display text-[clamp(52px,7vw,84px)] leading-[1.02] font-light text-ivory mb-6 ${
            loaded ? 'animate-fadeUp delay-2' : 'opacity-0'
          }`}
          style={{ textShadow: '0 2px 40px rgba(61,53,48,0.3)' }}
        >
          Because<br />
          traditions<br />
          start{' '}
          <em className="italic" style={{ color: '#C5A055' }}>
            young.
          </em>
        </h1>

        <p
          className={`text-ivory/75 text-sm md:text-base leading-relaxed max-w-sm mb-10 font-light ${
            loaded ? 'animate-fadeUp delay-3' : 'opacity-0'
          }`}
        >
          Designer ethnic wear for little ones aged 0–5. Each piece
          hand-finished with love, made to be remembered.
        </p>

        <div className={`flex gap-4 flex-wrap ${loaded ? 'animate-fadeUp delay-4' : 'opacity-0'}`}>
          <Link href="/shop" className="btn-gold">
            Explore Collection
          </Link>
          <Link href="/our-story" className="btn-ghost-light">
            Our Story
          </Link>
        </div>
      </div>

      {/* Ages badge */}
      <div
        className={`absolute bottom-10 right-10 md:right-16 z-[5] border border-ivory/20 backdrop-blur-sm px-6 py-4 ${
          loaded ? 'animate-fadeUp delay-6' : 'opacity-0'
        }`}
        style={{ background: 'rgba(247,240,230,0.10)' }}
      >
        <div className="font-display text-3xl text-gold leading-none">0–5</div>
        <div className="label-xs text-ivory/55 mt-1">Years · All Sizes</div>
      </div>

      {/* Scroll hint */}
      <div
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 z-[5] flex flex-col items-center gap-2 ${
          loaded ? 'animate-fadeUp delay-6' : 'opacity-0'
        }`}
      >
        <span className="label-xs text-ivory/40">Scroll</span>
        <div
          className="w-px h-10 bg-ivory/30"
          style={{ animation: 'scrollHint 2s ease-in-out infinite' }}
        />
      </div>
    </section>
  );
}
