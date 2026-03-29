import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/lib/admin/auth';

export const runtime = 'nodejs';

const IMAGE_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);
const VIDEO_TYPES = new Set(['video/mp4', 'video/webm', 'video/quicktime']);

const IMAGE_LIMIT_BYTES = 8 * 1024 * 1024;
const VIDEO_LIMIT_BYTES = 80 * 1024 * 1024;

type AssetType = 'product-image' | 'founder-image' | 'hero-poster' | 'hero-video';

function getAssetType(value: FormDataEntryValue | null): AssetType {
  const next = typeof value === 'string' ? value : '';

  if (
    next === 'product-image' ||
    next === 'founder-image' ||
    next === 'hero-poster' ||
    next === 'hero-video'
  ) {
    return next;
  }

  return 'product-image';
}

function getUploadTarget(assetType: AssetType) {
  if (assetType === 'product-image') {
    return {
      bucket: 'product-images',
      folder: 'products',
      allowedTypes: IMAGE_TYPES,
      maxSize: IMAGE_LIMIT_BYTES,
    };
  }

  if (assetType === 'hero-video') {
    return {
      bucket: 'site-media',
      folder: 'videos',
      allowedTypes: VIDEO_TYPES,
      maxSize: VIDEO_LIMIT_BYTES,
    };
  }

  return {
    bucket: 'site-media',
    folder: 'images',
    allowedTypes: IMAGE_TYPES,
    maxSize: IMAGE_LIMIT_BYTES,
  };
}

function getFileExtension(fileName: string, fallbackType: string) {
  const fromName = fileName.split('.').pop()?.toLowerCase();
  if (fromName) return fromName;

  if (fallbackType === 'video/mp4') return 'mp4';
  if (fallbackType === 'video/webm') return 'webm';
  if (fallbackType === 'video/quicktime') return 'mov';
  if (fallbackType === 'image/png') return 'png';
  if (fallbackType === 'image/webp') return 'webp';
  return 'jpg';
}

export async function POST(req: NextRequest) {
  const unauthorized = requireAdmin(req);
  if (unauthorized) return unauthorized;

  const formData = await req.formData();
  const assetType = getAssetType(formData.get('assetType'));
  const entries = formData.getAll('files');
  const files = entries.filter((value): value is File => value instanceof File);

  if (!files.length) {
    return NextResponse.json({ error: 'No files received' }, { status: 400 });
  }

  const target = getUploadTarget(assetType);
  const urls: string[] = [];
  const bucket = supabaseAdmin().storage.from(target.bucket);

  for (const file of files) {
    if (!target.allowedTypes.has(file.type)) {
      return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
    }

    if (file.size > target.maxSize) {
      return NextResponse.json({ error: `${file.name} exceeds upload limit` }, { status: 400 });
    }

    const bytes = Buffer.from(await file.arrayBuffer());
    const ext = getFileExtension(file.name, file.type);
    const path = `${target.folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

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
