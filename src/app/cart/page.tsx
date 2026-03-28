'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '919999999999'; // set in .env

interface CartItem {
  id: string;
  name: string;
  size: string;
  quantity: number;
  price: number;
}

interface FormData {
  name: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
}

function buildWhatsAppMessage(
  items: CartItem[],
  total: number,
  form: FormData
) {
  const lines = [
    `*New Order — Minnie Ethnics*`,
    ``,
    `*Customer*`,
    `Name: ${form.name}`,
    `Phone: ${form.phone}`,
    `Address: ${form.address}${form.city ? ', ' + form.city : ''}${form.pincode ? ' - ' + form.pincode : ''}`,
    ``,
    `*Items*`,
    ...items.map(
      (i) => `• ${i.name} (Size: ${i.size}, Qty: ${i.quantity}) — ₹${(i.price * i.quantity).toLocaleString('en-IN')}`
    ),
    ``,
    `*Total: ₹${total.toLocaleString('en-IN')}*`,
  ];
  return encodeURIComponent(lines.join('\n'));
}

export default function CartPage() {
  const { items, total, count } = useCart();
  const { user, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: '', phone: '', address: '', city: '', pincode: '' });
  const [error, setError] = useState('');

  // Pre-fill name from account if logged in
  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setForm((f) => ({ ...f, name: f.name || user.user_metadata.full_name }));
    }
    if (user?.email) {
      // Email available but we don't have a field for it — silently available for WhatsApp msg
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleWhatsApp = () => {
    if (!form.name || !form.phone || !form.address) {
      setError('Please fill in your name, phone, and address.');
      return;
    }
    setError('');
    const msg = buildWhatsAppMessage(items, total(), form);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  };

  if (authLoading) return null;

  if (items.length === 0) {
    return (
      <main className="relative z-[5] min-h-screen bg-ivory flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="font-display italic text-3xl text-muted">Your cart is empty.</p>
          <Link href="/shop" className="link-underline">Browse the collection</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative z-[5] bg-ivory min-h-screen">
      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-[1fr_380px] gap-12">

        {/* Left — shipping details */}
        <div>
          <p className="label-xs text-gold mb-2">Checkout</p>
          <h1 className="font-display text-4xl font-light text-charcoal mb-2">
            Your <em className="italic text-gold">details.</em>
          </h1>

          {/* Auth nudge for guests */}
          {!user && (
            <div className="mb-6 flex items-center gap-3 border border-charcoal/10 bg-white px-4 py-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold flex-shrink-0">
                <circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
              </svg>
              <p className="text-xs text-charcoal/70 leading-relaxed">
                <Link href={`/auth?next=/cart`} className="text-charcoal underline underline-offset-2 hover:text-gold transition-colors">
                  Sign in
                </Link>{' '}
                to save your details and view order history.
              </p>
            </div>
          )}

          <div className="space-y-4">
            {[
              { name: 'name',  label: 'Full Name',    type: 'text', required: true },
              { name: 'phone', label: 'Phone Number', type: 'tel',  required: true },
            ].map((f) => (
              <div key={f.name}>
                <label className="label-xs text-faint block mb-1.5">
                  {f.label} {f.required && <span className="text-gold">*</span>}
                </label>
                <input
                  type={f.type}
                  name={f.name}
                  value={(form as any)[f.name]}
                  onChange={handleChange}
                  className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                />
              </div>
            ))}

            <div>
              <label className="label-xs text-faint block mb-1.5">
                Delivery Address <span className="text-gold">*</span>
              </label>
              <textarea
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={3}
                className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                { name: 'city',    label: 'City' },
                { name: 'pincode', label: 'Pincode' },
              ].map((f) => (
                <div key={f.name}>
                  <label className="label-xs text-faint block mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    name={f.name}
                    value={(form as any)[f.name]}
                    onChange={handleChange}
                    className="w-full border border-charcoal/15 bg-white px-4 py-3 text-sm text-charcoal focus:outline-none focus:border-gold transition-colors"
                  />
                </div>
              ))}
            </div>
          </div>

          {error && <p className="mt-4 text-xs text-red-600">{error}</p>}
        </div>

        {/* Right — order summary + payment */}
        <div className="space-y-4">
          <h2 className="font-display text-2xl font-light text-charcoal">Order Summary</h2>

          <div className="space-y-3">
            {items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-3 py-3 border-b border-charcoal/6">
                <div className="w-14 flex-shrink-0 bg-ivory2 flex items-center justify-center" style={{ height: '70px' }}>
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-charcoal leading-snug">{item.name}</div>
                  <div className="text-xs text-faint mt-0.5">Size: {item.size} · Qty: {item.quantity}</div>
                </div>
                <div className="text-sm text-charcoal whitespace-nowrap">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between py-3 border-t border-charcoal/10">
            <span className="label-xs text-faint">Total</span>
            <span className="font-display text-2xl text-charcoal">
              ₹{total().toLocaleString('en-IN')}
            </span>
          </div>

          {/* ── WhatsApp CTA ─────────────────────────────────── */}
          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-center gap-2.5 py-4 bg-[#25D366] hover:bg-[#1ebe5d] text-white text-xs tracking-[0.12em] uppercase font-sans transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Order via WhatsApp
          </button>

          {/* ── Razorpay coming soon ──────────────────────────── */}
          <div className="border border-charcoal/10 bg-white px-4 py-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-charcoal/60 font-sans tracking-wide">Online Payment</span>
              <span className="text-[10px] tracking-widest uppercase bg-gold/10 text-gold border border-gold/20 px-2 py-0.5">Coming Soon</span>
            </div>
            <p className="text-xs text-faint leading-relaxed">
              UPI, cards & net banking via Razorpay will be available soon. For now, place your order via WhatsApp — we'll confirm within a few hours.
            </p>
          </div>

          <p className="text-[10px] text-center text-faint leading-relaxed">
            We typically respond within 2–4 hours on WhatsApp. Orders confirmed after payment via UPI or bank transfer.
          </p>
        </div>
      </div>
    </main>
  );
} 