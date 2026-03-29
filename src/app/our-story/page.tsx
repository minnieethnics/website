import Image from 'next/image';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';

export const metadata = {
  title: 'Our Story — Minnie Ethnics',
  description: 'How Minnie Ethnics was born, and why we make what we make.',
};

async function getFounderImageUrl() {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('founder_image_url')
      .eq('id', 1)
      .single();

    return data?.founder_image_url || '/images/founder.jpg';
  } catch {
    return '/images/founder.jpg';
  }
}

export default async function OurStoryPage() {
  const founderImageUrl = await getFounderImageUrl();

  return (
    <main>
      <section className="relative z-[5] bg-ivory">
        {/* Hero */}
        <div className="max-w-3xl mx-auto px-6 md:px-12 pt-16 pb-12 text-center">
          <p className="label-xs text-gold mb-4">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl font-light text-charcoal leading-tight">
            Born from a<br />
            mother&apos;s <em className="italic text-gold">love.</em>
          </h1>
        </div>

        {/* Founder photo placeholder */}
        <div className="relative w-full max-w-2xl mx-auto aspect-[4/3] bg-ivory2 flex items-center justify-center mb-16 rounded-2xl overflow-hidden border border-charcoal/10 shadow-sm">
          <Image src={founderImageUrl} alt="Founder" fill className="object-cover" />
        </div>

        {/* Story text */}
        <div className="max-w-2xl mx-auto px-6 md:px-12 pb-20 space-y-8">
          <div className="space-y-5 text-sm leading-[2] text-muted font-light">
            <p>
              {/* ADD YOUR OWN STORY HERE — This is placeholder text */}
              Minnie Ethnics began the way most real things do — not in a boardroom or a pitch
              deck, but at a kitchen table, with a needle and thread and a newborn asleep in
              the next room.
            </p>
            <p>
              I had been searching for ethnic wear for my baby that felt like it had actually
              been thought about — soft enough for a child&apos;s skin, embroidered with real
              craft, and priced in a way that didn&apos;t make me feel guilty for buying it.
              I couldn&apos;t find it. So I made it.
            </p>
            <p>
              The first piece took three evenings. It wasn&apos;t perfect, but it had something
              that every Minnie Ethnics piece still has today: it was made with intention.
              With the quiet hope that a child would wear it to a puja, a wedding, a first
              birthday — and that somewhere in a photo, years later, the tiny clothes would
              carry the memory of who they were at age one.
            </p>
            <p>
              That&apos;s what traditions do. They hold time. And they start young.
            </p>
          </div>

          {/* Signature */}
          <div className="pt-6 border-t border-charcoal/8">
            <p className="font-display italic text-2xl text-charcoal">With love,</p>
            <p className="font-display text-3xl text-gold mt-1">
              {/* Replace with your name */}
              Supriya
            </p>
            <p className="text-xs text-faint mt-1 label-xs">Founder, Minnie Ethnics</p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
