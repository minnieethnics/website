import { supabaseAdmin } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import { ProductForm } from '../../ProductForm';

async function getProduct(id: string) {
  try {
    const { data } = await supabaseAdmin()
      .from('products')
      .select('*')
      .eq('id', id)
      .single();
    return data;
  } catch { return null; }
}

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  if (!product) notFound();
  return <ProductForm product={product} />;
}
