'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

type MediaForm = {
  founder_image_url: string;
  hero_video_url: string;
  hero_video_poster_url: string;
};

const DEFAULTS: MediaForm = {
  founder_image_url: '',
  hero_video_url: '',
  hero_video_poster_url: '',
};

type UploadKind = 'founder-image' | 'hero-poster' | 'hero-video';

export default function AdminMediaPage() {
  const [form, setForm] = useState<MediaForm>(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState<UploadKind | ''>('');
  const [error, setError] = useState('');

  const founderInputRef = useRef<HTMLInputElement>(null);
  const posterInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((body) => {
        if (body?.data) {
          setForm({
            founder_image_url: body.data.founder_image_url ?? '',
            hero_video_url: body.data.hero_video_url ?? '',
            hero_video_poster_url: body.data.hero_video_poster_url ?? '',
          });
        }
      })
      .catch(() => undefined);
  }, []);

  const set = (k: keyof MediaForm, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const uploadOne = async (kind: UploadKind, file: File | null) => {
    if (!file) return;

    setError('');
    setUploading(kind);

    const payload = new FormData();
    payload.append('assetType', kind);
    payload.append('files', file);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: payload,
    });

    const body = await res.json().catch(() => ({ error: 'Upload failed' }));
    if (!res.ok) {
      setError(body.error ?? 'Upload failed');
      setUploading('');
      return;
    }

    const uploaded = Array.isArray(body.urls) ? body.urls[0] : '';
    if (!uploaded) {
      setUploading('');
      return;
    }

    if (kind === 'founder-image') set('founder_image_url', uploaded);
    if (kind === 'hero-poster') set('hero_video_poster_url', uploaded);
    if (kind === 'hero-video') set('hero_video_url', uploaded);

    setUploading('');
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');

    const res = await fetch('/api/admin/site-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Save failed' }));
      setError(body.error ?? 'Save failed');
      setSaving(false);
      return;
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-medium text-charcoal">Story & Hero Media</h1>
          <p className="text-[11px] text-faint mt-0.5">Upload founder image and hero video without touching code.</p>
        </div>
        <button onClick={handleSave} disabled={saving || !!uploading} className="btn-gold text-xs py-2 px-5">
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Media URLs'}
        </button>
      </div>

      <div className="p-7 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="space-y-6">
          <MediaCard title="Founder Image" note="Shown on home story strip + Our Story page">
            <div className="space-y-3">
              <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-ivory2 border border-charcoal/10">
                {form.founder_image_url ? (
                  <Image src={form.founder_image_url} alt="Founder preview" fill className="object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-faint text-xs">No image uploaded yet</div>
                )}
              </div>

              <div className="flex gap-2">
                <button
                  className="btn-charcoal text-xs py-2 px-4"
                  onClick={() => founderInputRef.current?.click()}
                  disabled={uploading === 'founder-image'}
                >
                  {uploading === 'founder-image' ? 'Uploading…' : 'Upload Founder Image'}
                </button>
                <button
                  className="btn-ghost text-xs py-2 px-4"
                  onClick={() => set('founder_image_url', '')}
                >
                  Clear
                </button>
              </div>
              <input
                ref={founderInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => uploadOne('founder-image', e.target.files?.[0] ?? null)}
              />
            </div>
          </MediaCard>

          <MediaCard title="Hero Video" note="Displayed in homepage hero section">
            <div className="space-y-3">
              <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-charcoal border border-charcoal/15">
                {form.hero_video_url ? (
                  <video src={form.hero_video_url} poster={form.hero_video_poster_url || undefined} controls className="w-full h-full object-cover" />
                ) : (
                  <div className="h-full w-full flex items-center justify-center text-ivory/55 text-xs">No video uploaded yet</div>
                )}
              </div>

              <div className="flex gap-2 flex-wrap">
                <button
                  className="btn-charcoal text-xs py-2 px-4"
                  onClick={() => videoInputRef.current?.click()}
                  disabled={uploading === 'hero-video'}
                >
                  {uploading === 'hero-video' ? 'Uploading…' : 'Upload Hero Video'}
                </button>
                <button className="btn-ghost text-xs py-2 px-4" onClick={() => set('hero_video_url', '')}>Clear Video</button>
              </div>
              <input
                ref={videoInputRef}
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                className="hidden"
                onChange={(e) => uploadOne('hero-video', e.target.files?.[0] ?? null)}
              />

              <div className="pt-1">
                <p className="label-xs text-faint mb-2">Optional Poster Image</p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    className="btn-ghost text-xs py-2 px-4"
                    onClick={() => posterInputRef.current?.click()}
                    disabled={uploading === 'hero-poster'}
                  >
                    {uploading === 'hero-poster' ? 'Uploading…' : 'Upload Poster'}
                  </button>
                  <button className="btn-ghost text-xs py-2 px-4" onClick={() => set('hero_video_poster_url', '')}>Clear Poster</button>
                </div>
                <input
                  ref={posterInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => uploadOne('hero-poster', e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
          </MediaCard>
        </div>

        <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
          <p className="label-xs text-faint">Media URLs</p>
          <UrlField
            label="Founder Image URL"
            value={form.founder_image_url}
            onChange={(v) => set('founder_image_url', v)}
            placeholder="https://.../site-media/images/founder.jpg"
          />
          <UrlField
            label="Hero Video URL"
            value={form.hero_video_url}
            onChange={(v) => set('hero_video_url', v)}
            placeholder="https://.../site-media/videos/hero.mp4"
          />
          <UrlField
            label="Hero Poster URL"
            value={form.hero_video_poster_url}
            onChange={(v) => set('hero_video_poster_url', v)}
            placeholder="https://.../site-media/images/hero-poster.jpg"
          />

          {error && (
            <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
              {error}
            </p>
          )}

          <button onClick={handleSave} disabled={saving || !!uploading} className="btn-charcoal w-full py-3 text-xs">
            {saved ? '✓ Changes Live!' : saving ? 'Saving…' : 'Save & Publish Media'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MediaCard({ title, note, children }: { title: string; note: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-2">
      <p className="text-sm font-medium text-charcoal">{title}</p>
      <p className="text-[11px] text-faint">{note}</p>
      <div className="pt-2">{children}</div>
    </div>
  );
}

function UrlField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder: string }) {
  return (
    <div className="space-y-1.5">
      <label className="label-xs text-faint block">{label}</label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full border border-charcoal/15 bg-[#FDFCFA] px-3 py-2 text-xs text-charcoal rounded focus:outline-none focus:border-gold transition-colors"
      />
    </div>
  );
}
