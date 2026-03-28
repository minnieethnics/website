import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin/auth';

export const runtime = 'nodejs';

const VALID_AGE_GROUPS = new Set(['0-1', '1-2', '2-3', '3-5']);
const VALID_GENDERS = new Set(['boys', 'girls', 'unisex']);

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeProductPayload(input: Record<string, any>) {
  const name = String(input.name ?? '').trim();
  const price = Number(input.price ?? 0);
  const ageGroup = String(input.age_group ?? '');
  const gender = String(input.gender ?? '');
  const images = Array.isArray(input.images) ? input.images.filter(Boolean) : [];
  const sizes = Array.isArray(input.sizes) ? input.sizes.filter(Boolean) : [];

  if (!name) return { error: 'Product name is required' };
  if (!Number.isFinite(price) || price <= 0) return { error: 'Price must be greater than 0' };
  if (!VALID_AGE_GROUPS.has(ageGroup)) return { error: 'Invalid age group' };
  if (!VALID_GENDERS.has(gender)) return { error: 'Invalid gender' };

  const payload = {
    name,
    description: String(input.description ?? ''),
    price: Math.round(price),
    original_price: input.original_price ? Math.round(Number(input.original_price)) : null,
    age_group: ageGroup,
    gender,
    category: String(input.category ?? 'kurta set').trim() || 'kurta set',
    images,
    sizes,
    in_stock: Boolean(input.in_stock),
    is_featured: Boolean(input.is_featured),
    is_new: Boolean(input.is_new),
    occasion: input.occasion ? String(input.occasion).trim() : null,
    slug: String(input.slug ?? '').trim() || toSlug(name),
  };

  if (!payload.slug) return { error: 'Slug is required' };

  return { payload };
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { payload, error: payloadError } = normalizeProductPayload(body ?? {});

  if (payloadError) {
    return NextResponse.json({ error: payloadError }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from('products')
    .insert(payload)
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
