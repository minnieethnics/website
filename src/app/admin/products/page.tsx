import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { AdminProductActions } from './AdminProductActions';

async function getProducts() {
  try {
    const { data } = await supabaseAdmin()
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch { return []; }
}

export default async function AdminProductsPage() {
  const products = await getProducts();

  return (
    <div>
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <h1 className="text-[15px] font-medium text-charcoal">Products ({products.length})</h1>
        <Link href="/admin/products/new" className="btn-gold text-xs py-2 px-5">
          + Add Product
        </Link>
      </div>

      <div className="p-7">
        <div className="bg-white border border-charcoal/8 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-charcoal/8">
              <tr>
                {['', 'Product', 'Price', 'Age', 'Gender', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left label-xs text-faint px-4 py-3 pr-2">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-sm text-faint italic">
                    No products yet.{' '}
                    <Link href="/admin/products/new" className="text-gold hover:underline">
                      Add your first piece →
                    </Link>
                  </td>
                </tr>
              ) : (
                products.map((p: any) => (
                  <tr key={p.id} className="border-t border-charcoal/5 hover:bg-ivory/50">
                    <td className="px-4 py-3 w-12">
                      <div className="w-9 h-11 bg-ivory2 flex items-center justify-center text-[9px] text-faint font-display italic overflow-hidden">
                        {p.images?.[0]
                          ? <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                          : 'img'}
                      </div>
                    </td>
                    <td className="px-2 py-3">
                      <div className="text-sm font-medium text-charcoal">{p.name}</div>
                      <div className="text-[11px] text-faint mt-0.5 capitalize">{p.category} · {p.occasion ?? '—'}</div>
                    </td>
                    <td className="px-2 py-3 text-sm">₹{p.price?.toLocaleString('en-IN')}</td>
                    <td className="px-2 py-3 text-sm text-muted">{p.age_group} yrs</td>
                    <td className="px-2 py-3 text-sm text-muted capitalize">{p.gender}</td>
                    <td className="px-2 py-3">
                      <span className={`label-xs px-2 py-1 ${
                        !p.in_stock
                          ? 'bg-red-50 text-red-700'
                          : p.is_new
                          ? 'bg-amber-50 text-amber-800'
                          : 'bg-green-50 text-green-800'
                      }`}>
                        {!p.in_stock ? 'Sold Out' : p.is_new ? 'New' : 'Live'}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <AdminProductActions id={p.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
