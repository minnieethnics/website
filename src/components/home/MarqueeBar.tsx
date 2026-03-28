export function MarqueeBar() {
  const items = [
    'Hand-embroidered',
    'Designer ethnic wear',
    'Made with love',
    'Traditions start young',
    'Affordable luxury',
    'Crafted in India',
    'Ages 0 to 5',
  ];

  // duplicate for seamless loop
  const all = [...items, ...items];

  return (
    <div className="bg-charcoal py-3.5 overflow-hidden select-none">
      <div className="marquee-track">
        {all.map((item, i) => (
          <span key={i} className="flex items-center gap-10 flex-shrink-0">
            <span className="font-display italic text-[15px] text-gold tracking-wide">
              {item}
            </span>
            <span className="text-warm/40 text-[7px]">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
