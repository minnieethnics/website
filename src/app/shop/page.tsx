import { supabase } from '@/lib/supabase';
import { ProductsSection } from '@/components/home/ProductsSection';
import { Footer } from '@/components/layout/Footer';
import type { Product } from '@/lib/supabase';

export const metadata = {
  title: 'Shop — Minnie Ethnics',
  description: 'Browse our full collection of designer ethnic wear for children aged 0–5.',
};

async function getAllProducts(): Promise<Product[]> {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('in_stock', true)
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const products = await getAllProducts();

  return (
    <main>
      {/* Page header */}
      <div className="bg-ivory px-6 md:px-12 pt-12 pb-6 border-b border-charcoal/8 relative z-[5]">
        <p className="label-xs text-gold mb-3">The Collection</p>
        <h1 className="font-display text-5xl md:text-6xl font-light text-charcoal leading-tight">
          All <em className="italic text-gold">pieces.</em>
        </h1>
        <p className="text-sm text-muted mt-3 max-w-sm leading-relaxed">
          Designer ethnic wear for children aged 0–5. Hand-embroidered, made with love.
        </p>
      </div>

      <ProductsSection products={products} />
      <Footer />
    </main>
  );
}
