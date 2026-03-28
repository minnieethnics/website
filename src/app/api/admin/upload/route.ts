import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin/auth';

export const runtime = 'nodejs';

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024;

function getFileExtension(fileName: string, fallbackType: string) {
  const fromName = fileName.split('.').pop()?.toLowerCase();
  if (fromName) return fromName;

  if (fallbackType === 'image/png') return 'png';
  if (fallbackType === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const formData = await req.formData();
  const entries = formData.getAll('files');
  const files = entries.filter((value): value is File => value instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: 'No files received' }, { status: 400 });
  }

  const urls: string[] = [];
  const bucket = supabaseAdmin().storage.from('product-images');

  for (const file of files) {
    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json({ error: `${file.name} exceeds 5MB limit` }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name, file.type);
    const path = `products/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await bucket.upload(path, bytes, {
      contentType: file.type,
      cacheControl: '31536000',
      upsert: false,
    });

    if (uploadError) {
      return NextResponse.json({ error: uploadError.message }, { status: 500 });
    }

    const { data } = bucket.getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return NextResponse.json({ urls });
}
