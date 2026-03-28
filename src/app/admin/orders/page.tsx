import { supabaseAdmin } from '@/lib/supabase';

async function getOrders() {
  try {
    const { data } = await supabaseAdmin()
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    return data ?? [];
  } catch { return []; }
}

const STATUS_COLORS: Record<string, string> = {
  pending:   'bg-amber-50 text-amber-800',
  paid:      'bg-green-50 text-green-800',
  shipped:   'bg-blue-50 text-blue-800',
  delivered: 'bg-teal-50 text-teal-800',
};

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  return (
    <div>
      <div className="bg-white border-b border-charcoal/8 px-7 py-4">
        <h1 className="text-[15px] font-medium text-charcoal">Orders ({orders.length})</h1>
      </div>
      <div className="p-7">
        <div className="bg-white border border-charcoal/8 rounded-lg overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-charcoal/8">
              <tr>
                {['Customer', 'Phone', 'Items', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left label-xs text-faint px-4 py-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-faint italic">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((o: any) => (
                  <tr key={o.id} className="border-t border-charcoal/5 hover:bg-ivory/40">
                    <td className="px-4 py-3">
                      <div className="text-sm font-medium text-charcoal">{o.customer_name}</div>
                      <div className="text-[11px] text-faint">{o.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted">{o.customer_phone}</td>
                    <td className="px-4 py-3 text-sm text-muted">{o.items?.length ?? 0} item(s)</td>
                    <td className="px-4 py-3 text-sm font-medium">₹{o.total?.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`label-xs px-2 py-1 rounded-full ${STATUS_COLORS[o.status] ?? 'bg-gray-100 text-gray-700'}`}>
                        {o.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-faint">
                      {new Date(o.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
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
