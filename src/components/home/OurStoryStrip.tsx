import Image from 'next/image';
import Link from 'next/link';

export function OurStoryStrip({ founderImageUrl }: { founderImageUrl?: string }) {
  const imageSrc = founderImageUrl || '/images/founder.jpg';

  return (
    <section className="relative z-[5] grid grid-cols-1 md:grid-cols-2 min-h-[480px]">
      {/* Visual side — threads SVG + founder photo placeholder */}
      <div className="relative bg-ivory2 flex items-center justify-center overflow-hidden min-h-[320px] md:min-h-0">
        {/* Animated thread lines */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 400 480"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <path d="M20,60 C90,100 130,40 200,80 C270,120 300,60 380,100"
            fill="none" stroke="#D4537E" strokeWidth="1.2" strokeDasharray="500" strokeDashoffset="500" opacity="0.4">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3s" begin="0.5s" fill="freeze"/>
          </path>
          <path d="M0,160 C70,140 120,190 190,170 C260,150 300,200 380,178"
            fill="none" stroke="#EF9F27" strokeWidth="1" strokeDasharray="500" strokeDashoffset="500" opacity="0.35">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3.5s" begin="0.8s" fill="freeze"/>
          </path>
          <path d="M10,280 C80,260 150,310 220,285 C290,260 330,305 400,282"
            fill="none" stroke="#7F77DD" strokeWidth="0.8" strokeDasharray="500" strokeDashoffset="500" opacity="0.3">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="4s" begin="1s" fill="freeze"/>
          </path>
          <path d="M0,380 C80,355 160,400 240,375 C320,350 360,390 420,368"
            fill="none" stroke="#1D9E75" strokeWidth="1" strokeDasharray="500" strokeDashoffset="500" opacity="0.25">
            <animate attributeName="stroke-dashoffset" from="500" to="0" dur="3.2s" begin="0.3s" fill="freeze"/>
          </path>
          <circle cx="200" cy="80" r="2.5" fill="#D4537E" opacity="0.5"/>
          <circle cx="300" cy="60" r="2" fill="#EF9F27" opacity="0.4"/>
          <circle cx="190" cy="170" r="2" fill="#7F77DD" opacity="0.35"/>
        </svg>

        {/* Founder photo */}
        <div className="relative z-10 flex flex-col items-center gap-3">
          <div
            className="relative w-44 h-56 rounded-2xl overflow-hidden border border-gold/20 shadow-sm flex items-center justify-center"
            style={{ background: 'rgba(212,184,150,0.25)' }}
          >
            <Image src={imageSrc} alt="Founder" fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Text side */}
      <div className="bg-ivory px-10 md:px-16 py-16 md:py-20 flex flex-col justify-center">
        <p className="label-xs text-gold mb-4">Our Story</p>
        <h2 className="font-display text-4xl md:text-[42px] font-light leading-snug text-charcoal mb-6">
          Born from a<br />
          mother&apos;s{' '}
          <em className="italic text-gold">love.</em>
        </h2>
        <p className="text-sm leading-[1.95] text-muted font-light mb-8 max-w-sm">
          Minnie Ethnics started right here, at home — with a needle, a thread,
          and the belief that every child deserves to feel the weight of
          something beautiful. We make designer ethnic wear that carries
          tradition gently, without compromising on childhood.
        </p>
        <Link href="/our-story" className="link-underline self-start">
          Read our full story
        </Link>
      </div>
    </section>
  );
}
