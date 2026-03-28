import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin/auth';

export const runtime = 'nodejs';

export async function GET() {
  const { data, error } = await supabaseAdmin()
    .from('site_settings')
    .select('*')
    .eq('id', 1)
    .maybeSingle();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (data) return NextResponse.json({ data });

  const { data: inserted, error: insertError } = await supabaseAdmin()
    .from('site_settings')
    .upsert({ id: 1 })
    .select('*')
    .single();

  if (insertError) {
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ data: inserted });
}

export async function PATCH(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const body = await req.json();

  const { data, error } = await supabaseAdmin()
    .from('site_settings')
    .upsert({ id: 1, ...body })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
