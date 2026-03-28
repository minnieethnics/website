import Link from 'next/link';

export function Footer() {
  return (
    <footer className="relative z-[5] bg-[#F0E8D8] border-t border-charcoal/10 px-6 md:px-12 py-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <p className="font-display italic text-lg text-charcoal">
            &ldquo;Because traditions start young.&rdquo;
          </p>
          <p className="text-[10px] tracking-[0.08em] text-faint mt-2">
            © 2026 Minnie Ethnics · Kolkata, India
          </p>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-3">
          {[
            { href: '/shop', label: 'Shop' },
            { href: '/our-story', label: 'Our Story' },
            { href: '/shop?tag=new', label: 'New Arrivals' },
          ].map(({ href, label }) => (
            <Link
              key={label}
              href={href}
              className="text-[10px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors no-underline"
            >
              {label}
            </Link>
          ))}
        </div>

        <div className="flex gap-5">
          <a
            href="https://instagram.com/minnie_ethnics"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors no-underline"
          >
            Instagram
          </a>
          <a
            href="https://wa.me/91XXXXXXXXXX"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[10px] tracking-[0.1em] uppercase text-muted hover:text-gold transition-colors no-underline"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </footer>
  );
}
