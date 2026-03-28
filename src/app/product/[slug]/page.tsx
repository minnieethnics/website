import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProductDetail } from '@/components/shop/ProductDetail';
import { Footer } from '@/components/layout/Footer';
import type { Product } from '@/lib/supabase';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) return { title: 'Minnie Ethnics' };
  return {
    title: `${product.name} — Minnie Ethnics`,
    description: product.description,
  };
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();
    return data;
  } catch {
    return null;
  }
}

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await getProduct(params.slug);
  if (!product) notFound();

  return (
    <main>
      <ProductDetail product={product} />
      <Footer />
    </main>
  );
}
