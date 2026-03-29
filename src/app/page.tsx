import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeBar } from '@/components/home/MarqueeBar';
import { ProductsSection } from '@/components/home/ProductsSection';
import { OurStoryStrip } from '@/components/home/OurStoryStrip';
import { ValuesSection } from '@/components/home/ValuesSection';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';

type SiteMedia = {
  founder_image_url: string;
  hero_video_url: string;
  hero_video_poster_url: string;
};

async function getProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(8);
    return data ?? [];
  } catch {
    return [];
  }
}

async function getSiteMedia(): Promise<SiteMedia> {
  try {
    const { data } = await supabase
      .from('site_settings')
      .select('founder_image_url,hero_video_url,hero_video_poster_url')
      .eq('id', 1)
      .single();

    return {
      founder_image_url: data?.founder_image_url ?? '',
      hero_video_url: data?.hero_video_url ?? '',
      hero_video_poster_url: data?.hero_video_poster_url ?? '',
    };
  } catch {
    return {
      founder_image_url: '',
      hero_video_url: '',
      hero_video_poster_url: '',
    };
  }
}

export default async function HomePage() {
  const [products, media] = await Promise.all([getProducts(), getSiteMedia()]);

  return (
    <main>
      <HeroSection
        heroVideoUrl={media.hero_video_url}
        heroVideoPosterUrl={media.hero_video_poster_url}
      />
      <MarqueeBar />
      <ProductsSection products={products} />
      <OurStoryStrip founderImageUrl={media.founder_image_url} />
      <ValuesSection />
      <Footer />
    </main>
  );
}
