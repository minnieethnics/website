'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import type { Product } from '@/lib/supabase';

type FormData = Omit<Product, 'id' | 'created_at' | 'images'> & { images: string[] };

const EMPTY: FormData = {
  name: '', description: '', price: 0, original_price: undefined,
  age_group: '0-1', gender: 'boys', category: 'kurta',
  images: [], sizes: [], in_stock: true, is_featured: false,
  is_new: true, occasion: '', slug: '',
};

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

export function ProductForm({ product }: { product?: Product }) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(
    product ? { ...product } : EMPTY
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const set = (field: keyof FormData, value: any) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError('');

    const payload = new FormData();
    for (const file of Array.from(files)) {
      payload.append('files', file);
    }

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: payload,
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Upload failed' }));
      setError(body.error ?? 'Upload failed');
      setUploading(false);
      return;
    }

    const body = await res.json();
    const uploaded = Array.isArray(body.urls) ? body.urls : [];
    set('images', [...form.images, ...uploaded]);
    setUploading(false);
  };

  const removeImage = (url: string) =>
    set('images', form.images.filter((i) => i !== url));

  const handleSizesChange = (val: string) =>
    set('sizes', val.split(',').map((s) => s.trim()).filter(Boolean));

  const handleSubmit = async () => {
    if (!form.name || !form.price) {
      setError('Name and price are required.');
      return;
    }
    if (!form.slug) form.slug = toSlug(form.name);
    setSaving(true);
    setError('');

    const payload = { ...form };

    const endpoint = product?.id
      ? `/api/admin/products/${product.id}`
      : '/api/admin/products';

    const method = product?.id ? 'PATCH' : 'POST';
    const response = await fetch(endpoint, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    setSaving(false);
    if (!response.ok) {
      const body = await response.json().catch(() => ({ error: 'Save failed' }));
      setError(body.error ?? 'Save failed');
      return;
    }

    router.push('/admin/products');
    router.refresh();
  };

  return (
    <div>
      {/* Topbar */}
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <h1 className="text-[15px] font-medium text-charcoal">
          {product ? 'Edit Product' : 'Add New Product'}
        </h1>
        <div className="flex gap-2">
          <button onClick={() => router.back()} className="btn-ghost text-xs py-2 px-4">
            Cancel
          </button>
          <button onClick={handleSubmit} disabled={saving} className="btn-gold text-xs py-2 px-5">
            {saving ? 'Saving…' : product ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </div>

      <div className="p-7 grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">

        {/* Main fields */}
        <div className="space-y-5">

          {/* Images */}
          <div className="bg-white border border-charcoal/8 rounded-lg p-5">
            <p className="label-xs text-faint mb-4">Product Photos</p>
            <div className="grid grid-cols-3 gap-2 mb-3">
              {form.images.map((url) => (
                <div key={url} className="relative aspect-[3/4] bg-ivory2 overflow-hidden group">
                  <img src={url} alt="" className="w-full h-full object-cover" />
                  <button
                    onClick={() => removeImage(url)}
                    className="absolute top-1 right-1 w-6 h-6 bg-charcoal/70 text-ivory text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="aspect-[3/4] border border-dashed border-charcoal/20 flex flex-col items-center justify-center gap-1 text-faint hover:border-gold hover:text-gold transition-colors text-xs"
              >
                {uploading ? (
                  <span className="animate-pulse">Uploading…</span>
                ) : (
                  <>
                    <span className="text-xl">+</span>
                    <span className="label-xs">Add Photo</span>
                  </>
                )}
              </button>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => handleUpload(e.target.files)}
            />
            <p className="text-[10px] text-faint">Upload JPG or PNG. First image is the main product photo.</p>
          </div>

          {/* Basic info */}
          <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
            <p className="label-xs text-faint">Product Details</p>

            <Field label="Product Name *">
              <input
                value={form.name}
                onChange={(e) => {
                  set('name', e.target.value);
                  set('slug', toSlug(e.target.value));
                }}
                className="admin-input"
                placeholder="e.g. The Blossom Kurta Set"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={form.description}
                onChange={(e) => set('description', e.target.value)}
                rows={4}
                className="admin-input resize-none"
                placeholder="Describe the fabric, embroidery, occasion…"
              />
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Price (₹) *">
                <input
                  type="number"
                  value={form.price || ''}
                  onChange={(e) => set('price', Number(e.target.value))}
                  className="admin-input"
                  placeholder="1890"
                />
              </Field>
              <Field label="Original Price (₹) — for sale display">
                <input
                  type="number"
                  value={form.original_price ?? ''}
                  onChange={(e) => set('original_price', e.target.value ? Number(e.target.value) : undefined)}
                  className="admin-input"
                  placeholder="2490"
                />
              </Field>
            </div>

            <Field label="Sizes (comma separated)">
              <input
                value={form.sizes.join(', ')}
                onChange={(e) => handleSizesChange(e.target.value)}
                className="admin-input"
                placeholder="XS, S, M, L, XL  or  0-6m, 6-12m, 1-2y"
              />
            </Field>

            <Field label="URL Slug (auto-generated)">
              <input
                value={form.slug}
                onChange={(e) => set('slug', e.target.value)}
                className="admin-input"
                placeholder="the-blossom-kurta-set"
              />
            </Field>
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">

          {/* Publish settings */}
          <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
            <p className="label-xs text-faint">Publish Settings</p>

            {[
              { key: 'in_stock',   label: 'In Stock' },
              { key: 'is_featured', label: 'Featured on Home Page' },
              { key: 'is_new',     label: 'Mark as New Arrival' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between cursor-pointer">
                <span className="text-sm text-charcoal">{label}</span>
                <div
                  onClick={() => set(key as any, !(form as any)[key])}
                  className={`w-9 h-5 rounded-full relative transition-colors ${
                    (form as any)[key] ? 'bg-gold' : 'bg-charcoal/20'
                  }`}
                >
                  <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${
                    (form as any)[key] ? 'left-4' : 'left-0.5'
                  }`} />
                </div>
              </label>
            ))}
          </div>

          {/* Classification */}
          <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
            <p className="label-xs text-faint">Classification</p>

            <Field label="Age Group">
              <select value={form.age_group} onChange={(e) => set('age_group', e.target.value)} className="admin-input">
                <option value="0-1">0–1 years</option>
                <option value="1-2">1–2 years</option>
                <option value="2-3">2–3 years</option>
                <option value="3-5">3–5 years</option>
              </select>
            </Field>

            <Field label="Gender">
              <select value={form.gender} onChange={(e) => set('gender', e.target.value as any)} className="admin-input">
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="unisex">Unisex</option>
              </select>
            </Field>

            <Field label="Category">
              <select value={form.category} onChange={(e) => set('category', e.target.value)} className="admin-input">
                {['kurta set', 'lehenga', 'sharara', 'anarkali', 'dhoti set', 'sherwani', 'coord set', 'other'].map((c) => (
                  <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                ))}
              </select>
            </Field>

            <Field label="Occasion">
              <select value={form.occasion ?? ''} onChange={(e) => set('occasion', e.target.value)} className="admin-input">
                <option value="">— Select —</option>
                {['festive', 'wedding', 'casual', 'daily', 'puja'].map((o) => (
                  <option key={o} value={o}>{o.charAt(0).toUpperCase() + o.slice(1)}</option>
                ))}
              </select>
            </Field>
          </div>

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button onClick={handleSubmit} disabled={saving} className="btn-gold w-full py-3 text-xs">
            {saving ? 'Saving…' : product ? 'Save Changes' : 'Publish Product'}
          </button>
        </div>
      </div>

      <style jsx>{`
        .admin-input {
          width: 100%;
          border: 0.5px solid rgba(61,53,48,0.15);
          background: #FDFCFA;
          padding: 8px 12px;
          font-size: 13px;
          color: #3D3530;
          font-family: inherit;
          outline: none;
          transition: border-color 0.2s;
          border-radius: 4px;
        }
        .admin-input:focus { border-color: #C5A055; }
      `}</style>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <label className="label-xs text-faint block">{label}</label>
      {children}
    </div>
  );
}
