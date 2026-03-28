'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/cart';

export function CartDrawer() {
  const [open, setOpen] = useState(false);
  const { items, removeItem, updateQuantity, total, count } = useCart();

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener('open-cart', handler);
    return () => window.removeEventListener('open-cart', handler);
  }, []);

  // Close on escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <>
      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-[90] bg-charcoal/30 backdrop-blur-[2px]"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-[100] h-full w-full max-w-sm bg-ivory shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-charcoal/10">
          <div>
            <h2 className="font-display text-xl text-charcoal">Your Cart</h2>
            <p className="text-xs text-faint mt-0.5">{count()} items</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="text-muted hover:text-charcoal transition-colors"
            aria-label="Close cart"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-20 text-center">
              <div className="font-display italic text-2xl text-muted">Your cart is empty.</div>
              <p className="text-sm text-faint">Add something beautiful for your little one.</p>
              <button onClick={() => setOpen(false)}>
                <Link href="/shop" className="link-underline" onClick={() => setOpen(false)}>
                  Browse the collection
                </Link>
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}`} className="flex gap-4 py-4 border-b border-charcoal/6">
                {/* Image */}
                <div
                  className="w-16 h-20 flex-shrink-0 flex items-center justify-center"
                  style={{ background: '#EEE5D3' }}
                >
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[9px] text-charcoal/30 font-display italic">img</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1">
                  <div className="font-display text-base text-charcoal leading-snug">{item.name}</div>
                  <div className="text-xs text-faint mt-0.5">Size: {item.size}</div>
                  <div className="text-xs text-muted mt-1">
                    ₹{item.price.toLocaleString('en-IN')}
                  </div>

                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                      className="w-6 h-6 border border-charcoal/20 text-charcoal text-sm flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      −
                    </button>
                    <span className="text-sm w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                      className="w-6 h-6 border border-charcoal/20 text-charcoal text-sm flex items-center justify-center hover:border-charcoal transition-colors"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeItem(item.id, item.size)}
                      className="ml-auto text-faint hover:text-charcoal transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                        <polyline points="3,6 5,6 21,6"/>
                        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-charcoal/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="label-xs text-faint">Total</span>
              <span className="font-display text-2xl text-charcoal">
                ₹{total().toLocaleString('en-IN')}
              </span>
            </div>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="btn-charcoal w-full text-center block"
            >
              Proceed to Checkout
            </Link>
            <button
              onClick={() => setOpen(false)}
              className="w-full text-center text-xs tracking-widest uppercase text-muted hover:text-charcoal transition-colors py-1"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
