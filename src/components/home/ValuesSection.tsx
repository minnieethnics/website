export function ValuesSection() {
  return (
    <section className="relative z-[5] bg-charcoal py-20 px-6 md:px-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-px">
        {[
          {
            num: '01',
            title: 'Hand finished.',
            titleEm: 'finished.',
            desc: 'Every stitch of embroidery is done by hand. No mass printing, no shortcuts. That\'s the Minnie Ethnics promise.',
          },
          {
            num: '02',
            title: 'Affordable luxury.',
            titleEm: 'luxury.',
            desc: 'Designer quality shouldn\'t mean designer prices. We believe tradition should be accessible to every family.',
          },
          {
            num: '03',
            title: 'Made with care.',
            titleEm: 'care.',
            desc: 'Soft fabrics chosen for baby skin. Sizes made for real children. Clothes made to be loved and handed down.',
          },
        ].map((v) => {
          const [before, em] = v.title.split(v.titleEm);
          return (
            <div
              key={v.num}
              className="px-8 md:px-10 py-12 border-b md:border-b-0 md:border-r border-ivory/8 last:border-0"
            >
              <div className="font-display text-[48px] font-light mb-4 leading-none"
                style={{ color: 'rgba(197,160,85,0.18)' }}>
                {v.num}
              </div>
              <h3 className="font-display text-[22px] font-light text-ivory mb-3 leading-snug">
                {before}
                <em className="italic text-gold">{v.titleEm}</em>
              </h3>
              <p className="text-xs leading-[1.9] font-light" style={{ color: 'rgba(247,240,230,0.45)' }}>
                {v.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
