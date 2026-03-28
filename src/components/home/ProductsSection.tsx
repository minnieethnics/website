'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '@/lib/supabase';
import { useCart } from '@/lib/cart';

type Filter = 'all' | '0-1' | '1-2' | '2-3' | '3-5' | 'boys' | 'girls' | 'new' | 'festive';

const FILTERS: { id: Filter; label: string }[] = [
  { id: 'all',     label: 'All' },
  { id: '0-1',     label: '0–1 yrs' },
  { id: '1-2',     label: '1–2 yrs' },
  { id: '2-3',     label: '2–3 yrs' },
  { id: '3-5',     label: '3–5 yrs' },
  { id: 'boys',    label: 'Boys' },
  { id: 'girls',   label: 'Girls' },
  { id: 'new',     label: 'New In' },
  { id: 'festive', label: 'Festive' },
];

// Placeholder products shown when DB is empty (dev mode)
const PLACEHOLDER_PRODUCTS: Product[] = Array.from({ length: 8 }, (_, i) => ({
  id: `placeholder-${i}`,
  name: ['The Blossom Kurta Set', 'Garden Jhoomar Coord', 'Sage Embroidery Lehenga',
         'Ivory Sequin Sharara', 'Dusty Rose Anarkali', 'Mint Floral Dhoti Set',
         'Blush Bandhani Kurti', 'Gold Thread Sherwani'][i],
  description: 'Hand-embroidered designer ethnic wear for your little one.',
  price: [1890, 2490, 3200, 2890, 2190, 1990, 1690, 3490][i],
  age_group: ['0-1', '2-3', '3-5', '1-2', '2-3', '0-1', '3-5', '1-2'][i] as Product['age_group'],
  gender: ['boys', 'girls', 'girls', 'girls', 'girls', 'boys', 'girls', 'boys'][i] as Product['gender'],
  category: 'ethnic',
  images: [],
  sizes: ['S', 'M', 'L'],
  in_stock: true,
  is_featured: i < 4,
  is_new: i % 3 === 0,
  occasion: i % 2 === 0 ? 'festive' : 'casual',
  slug: `product-${i}`,
  created_at: new Date().toISOString(),
}));

const CARD_BG = ['#E8DDD0', '#DDE5E2', '#E8D6D6', '#E0DDE8'];

interface Props {
  products: Product[];
}

export function ProductsSection({ products }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all');
  const { addItem } = useCart();

  const displayProducts = products.length > 0 ? products : PLACEHOLDER_PRODUCTS;

  const filtered = displayProducts.filter((p) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'boys') return p.gender === 'boys';
    if (activeFilter === 'girls') return p.gender === 'girls';
    if (activeFilter === 'new') return p.is_new;
    if (activeFilter === 'festive') return p.occasion === 'festive';
    return p.age_group === activeFilter;
  });

  return (
    <section className="relative z-[5] bg-ivory">
      {/* Filter bar */}
      <div className="px-6 md:px-12 py-6 border-b border-charcoal/8 flex items-center gap-0 flex-wrap">
        <span className="label-xs text-faint mr-7 whitespace-nowrap hidden md:block">Browse by</span>
        <div className="flex flex-wrap gap-0">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setActiveFilter(f.id)}
              className={`text-[11px] tracking-[0.08em] uppercase px-4 py-2 border-y border-r border-charcoal/10 first:border-l transition-all duration-200 font-sans ${
                activeFilter === f.id
                  ? 'bg-ivory2 text-charcoal border-charcoal/20'
                  : 'bg-transparent text-muted hover:text-charcoal hover:bg-ivory2/50'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="ml-auto hidden md:flex items-center gap-2 text-xs text-faint">
          <span>{filtered.length} pieces</span>
        </div>
      </div>

      {/* Grid */}
      <div className="px-6 md:px-12 pt-8 pb-16">
        {filtered.length === 0 ? (
          <div className="py-20 text-center">
            <p className="font-display italic text-2xl text-muted">No pieces in this filter yet.</p>
            <button
              onClick={() => setActiveFilter('all')}
              className="mt-4 link-underline"
            >
              View all
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[2px]">
            {filtered.map((product, idx) => (
              <ProductCard
                key={product.id}
                product={product}
                bgColor={CARD_BG[idx % CARD_BG.length]}
                onAddToCart={() =>
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    size: product.sizes[0] ?? 'One Size',
                    image: product.images[0] ?? '',
                    quantity: 1,
                  })
                }
              />
            ))}
          </div>
        )}

        {/* View all CTA */}
        <div className="flex justify-center mt-12">
          <Link href="/shop" className="btn-ghost">
            View All Pieces
          </Link>
        </div>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  bgColor,
  onAddToCart,
}: {
  product: Product;
  bgColor: string;
  onAddToCart: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    onAddToCart();
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      href={`/product/${product.slug}`}
      className="product-card group block no-underline relative overflow-hidden"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Product image / placeholder */}
      <div
        className="relative aspect-[3/4] overflow-hidden flex items-center justify-center"
        style={{ background: bgColor }}
      >
        {product.images[0] ? (
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover product-img-zoom"
            sizes="(max-width:768px) 50vw, 25vw"
          />
        ) : (
          <span className="font-display italic text-xs text-charcoal/30 select-none">
            product photo
          </span>
        )}

        {/* Tags */}
        {product.is_new && (
          <span className="absolute top-3 left-3 bg-ivory label-xs text-gold px-2 py-1">
            New
          </span>
        )}
        {product.occasion === 'festive' && !product.is_new && (
          <span className="absolute top-3 left-3 bg-ivory label-xs text-gold px-2 py-1">
            Festive
          </span>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAdd}
          className={`absolute bottom-3 left-3 right-3 py-2 text-[10px] tracking-[0.1em] uppercase font-sans transition-all duration-300 ${
            added
              ? 'bg-charcoal text-ivory opacity-100'
              : 'bg-ivory/90 text-charcoal opacity-0 group-hover:opacity-100'
          }`}
        >
          {added ? '✓ Added to cart' : '+ Add to Cart'}
        </button>
      </div>

      {/* Info */}
      <div className="bg-ivory py-4 px-1">
        <div className="font-display text-[17px] text-charcoal mb-1 leading-snug">
          {product.name}
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">
            ₹{product.price.toLocaleString('en-IN')} · {product.age_group} yrs
          </span>
          {product.original_price && (
            <span className="text-xs text-faint line-through">
              ₹{product.original_price.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
