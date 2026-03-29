import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';

async function getStats() {
  try {
    const sb = supabaseAdmin();
    const [{ count: orderCount }, { count: productCount }] = await Promise.all([
      sb.from('orders').select('*', { count: 'exact', head: true }),
      sb.from('products').select('*', { count: 'exact', head: true }).eq('in_stock', true),
    ]);
    const { data: recentOrders } = await sb
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    return { orderCount: orderCount ?? 0, productCount: productCount ?? 0, recentOrders: recentOrders ?? [] };
  } catch {
    return { orderCount: 0, productCount: 0, recentOrders: [] };
  }
}

export default async function AdminDashboard() {
  const { orderCount, productCount, recentOrders } = await getStats();

  const STATUS_COLORS: Record<string, string> = {
    pending:   'bg-amber-50 text-amber-800',
    paid:      'bg-green-50 text-green-800',
    shipped:   'bg-blue-50 text-blue-800',
    delivered: 'bg-teal-50 text-teal-800',
  };

  return (
    <div>
      {/* Topbar */}
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <h1 className="text-[15px] font-medium text-charcoal">Dashboard</h1>
        <Link href="/admin/products/new" className="btn-gold text-xs py-2 px-5">
          + Add Product
        </Link>
      </div>

      <div className="p-7 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Orders', value: orderCount, note: 'All time' },
            { label: 'Products Live', value: productCount, note: 'In stock' },
            { label: 'This Month', value: '—', note: 'Revenue' },
            { label: 'Visitors', value: '—', note: 'This week' },
          ].map((s) => (
            <div key={s.label} className="bg-white border border-charcoal/8 rounded-lg p-4">
              <div className="font-display text-3xl text-charcoal leading-none">{s.value}</div>
              <div className="label-xs text-faint mt-2">{s.label}</div>
              <div className="text-[10px] text-faint/70 mt-0.5">{s.note}</div>
            </div>
          ))}
        </div>

        {/* Quick actions */}
        <div className="bg-white border border-charcoal/8 rounded-lg p-5">
          <p className="label-xs text-faint mb-4">Quick Actions</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { href: '/admin/products/new', label: '+ Add new product' },
              { href: '/admin/banners',      label: 'Edit hero banner' },
              { href: '/admin/media',        label: 'Upload story/hero media' },
              { href: '/admin/themes',       label: 'Switch festival theme' },
              { href: '/admin/discounts',    label: 'Toggle discount banner' },
              { href: '/admin/orders',       label: 'View all orders' },
              { href: '/admin/products',     label: 'Manage products' },
            ].map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className="btn-ghost text-xs py-3 text-center block"
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* Recent orders */}
        <div className="bg-white border border-charcoal/8 rounded-lg p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="label-xs text-faint">Recent Orders</p>
            <Link href="/admin/orders" className="label-xs text-gold hover:underline">
              View all →
            </Link>
          </div>
          {recentOrders.length === 0 ? (
            <p className="text-sm text-faint italic py-4 text-center">No orders yet.</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr>
                  {['Customer', 'Total', 'Status', 'Date'].map((h) => (
                    <th key={h} className="text-left label-xs text-faint pb-3 pr-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order: any) => (
                  <tr key={order.id} className="border-t border-charcoal/5">
                    <td className="py-3 pr-4 text-sm text-charcoal">{order.customer_name}</td>
                    <td className="py-3 pr-4 text-sm">₹{order.total?.toLocaleString('en-IN')}</td>
                    <td className="py-3 pr-4">
                      <span className={`label-xs px-2 py-1 rounded-full ${STATUS_COLORS[order.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-xs text-faint">
                      {new Date(order.created_at).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
