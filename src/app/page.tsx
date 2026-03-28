import { HeroSection } from '@/components/home/HeroSection';
import { MarqueeBar } from '@/components/home/MarqueeBar';
import { ProductsSection } from '@/components/home/ProductsSection';
import { OurStoryStrip } from '@/components/home/OurStoryStrip';
import { ValuesSection } from '@/components/home/ValuesSection';
import { Footer } from '@/components/layout/Footer';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/supabase';

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

export default async function HomePage() {
  const products = await getProducts();

  return (
    <main>
      <HeroSection />
      <MarqueeBar />
      <ProductsSection products={products} />
      <OurStoryStrip />
      <ValuesSection />
      <Footer />
    </main>
  );
}
