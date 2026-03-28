'use client';

import { useState } from 'react';
import Image from 'next/image';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

export function ProductDetail({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] ?? '');
  const [activeImg, setActiveImg] = useState(0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      image: product.images[0] ?? '',
      quantity: 1,
    });
    setAdded(true);
    window.dispatchEvent(new Event('open-cart'));
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="relative z-[5] bg-ivory min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-start">

        {/* Images */}
        <div className="space-y-2">
          {/* Main image */}
          <div
            className="relative aspect-[4/5] w-full overflow-hidden flex items-center justify-center"
            style={{ background: '#EEE5D3' }}
          >
            {product.images[activeImg] ? (
              <Image
                src={product.images[activeImg]}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 50vw"
                priority
              />
            ) : (
              <span className="font-display italic text-muted/40">product photo</span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  className={`relative w-16 h-20 overflow-hidden flex-shrink-0 border transition-colors ${
                    activeImg === i ? 'border-gold' : 'border-transparent'
                  }`}
                  style={{ background: '#EEE5D3' }}
                >
                  <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="py-2 space-y-6">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 label-xs text-faint">
            <span>Shop</span>
            <span>/</span>
            <span className="text-gold">{product.name}</span>
          </div>

          <div>
            {product.is_new && (
              <span className="inline-block label-xs text-gold border border-gold/40 px-2 py-1 mb-3">
                New Arrival
              </span>
            )}
            <h1 className="font-display text-4xl md:text-5xl font-light text-charcoal leading-tight">
              {product.name}
            </h1>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-4">
            <span className="font-display text-3xl text-charcoal">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.original_price && (
              <span className="text-sm text-faint line-through">
                ₹{product.original_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Meta */}
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-xs text-muted">
            <span>Age: <strong className="text-charcoal">{product.age_group} yrs</strong></span>
            <span>For: <strong className="text-charcoal capitalize">{product.gender}</strong></span>
            {product.occasion && (
              <span>Occasion: <strong className="text-charcoal capitalize">{product.occasion}</strong></span>
            )}
          </div>

          <hr className="border-charcoal/8" />

          {/* Description */}
          <p className="text-sm leading-relaxed text-muted font-light">
            {product.description}
          </p>

          {/* Size selector */}
          {product.sizes.length > 0 && (
            <div>
              <p className="label-xs text-faint mb-3">Select Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm border transition-all duration-200 ${
                      selectedSize === size
                        ? 'border-charcoal bg-charcoal text-ivory'
                        : 'border-charcoal/20 text-muted hover:border-charcoal hover:text-charcoal'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Add to cart */}
          <button
            onClick={handleAdd}
            disabled={!product.in_stock}
            className={`w-full py-4 text-xs tracking-[0.15em] uppercase font-sans transition-all duration-300 ${
              !product.in_stock
                ? 'bg-ivory2 text-faint cursor-not-allowed'
                : added
                ? 'bg-sage text-ivory'
                : 'btn-charcoal'
            }`}
          >
            {!product.in_stock
              ? 'Sold Out'
              : added
              ? '✓ Added to Cart — opening…'
              : 'Add to Cart'}
          </button>

          {/* Handmade note */}
          <div className="flex items-start gap-3 p-4 border border-gold/20 bg-gold/5">
            <span className="text-gold text-lg mt-0.5">✦</span>
            <p className="text-xs text-muted leading-relaxed">
              This piece is hand-embroidered by artisans. Minor variations in
              the embroidery are a natural feature of handmade work, not a defect.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
