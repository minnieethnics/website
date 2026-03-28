import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin/auth';

function toSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function normalizeUpdatePayload(input: Record<string, any>) {
  const next: Record<string, any> = {};

  if (typeof input.name === 'string') next.name = input.name.trim();
  if (typeof input.description === 'string') next.description = input.description;
  if (input.price !== undefined) next.price = Math.round(Number(input.price));
  if (input.original_price !== undefined) {
    next.original_price = input.original_price ? Math.round(Number(input.original_price)) : null;
  }
  if (typeof input.age_group === 'string') next.age_group = input.age_group;
  if (typeof input.gender === 'string') next.gender = input.gender;
  if (typeof input.category === 'string') next.category = input.category;
  if (Array.isArray(input.images)) next.images = input.images.filter(Boolean);
  if (Array.isArray(input.sizes)) next.sizes = input.sizes.filter(Boolean);
  if (typeof input.in_stock === 'boolean') next.in_stock = input.in_stock;
  if (typeof input.is_featured === 'boolean') next.is_featured = input.is_featured;
  if (typeof input.is_new === 'boolean') next.is_new = input.is_new;
  if (input.occasion !== undefined) next.occasion = input.occasion || null;

  if (typeof input.slug === 'string') {
    next.slug = input.slug.trim() || undefined;
  }

  if (!next.slug && next.name) {
    next.slug = toSlug(next.name);
  }

  if (Object.keys(next).length === 0) {
    return { error: 'No valid fields to update' };
  }

  return { payload: next };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();
  const { payload, error: payloadError } = normalizeUpdatePayload(body ?? {});

  if (payloadError) {
    return NextResponse.json({ error: payloadError }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin()
    .from('products')
    .update(payload)
    .eq('id', params.id)
    .select('*')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ data });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const { error } = await supabaseAdmin()
    .from('products')
    .delete()
    .eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
