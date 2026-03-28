'use client';

import { useState, useEffect } from 'react';

const DEFAULTS = {
  banner_headline: 'New arrivals are here',
  banner_subtext: 'Hand-embroidered ethnic wear for your little one',
  banner_cta: 'Shop Now',
  banner_discount_text: '20% Off',
};

export default function AdminBannersPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((body) => {
        if (body?.data) setForm({ ...DEFAULTS, ...body.data });
      })
      .catch(() => undefined);
  }, []);

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/site-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <h1 className="text-[15px] font-medium text-charcoal">Banner Editor</h1>
        <button onClick={handleSave} disabled={saving} className="btn-gold text-xs py-2 px-5">
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save & Publish'}
        </button>
      </div>

      <div className="p-7 grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Live Preview */}
        <div className="space-y-3">
          <p className="label-xs text-faint">Live Preview</p>
          <div
            className="rounded-lg p-8 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg,#3D3530,#5a4f47)', minHeight: 200 }}
          >
            <div className="relative z-10">
              <p className="font-display italic text-[22px] text-ivory leading-snug mb-1">
                {form.banner_headline || 'Your headline here'}
              </p>
              <p className="text-xs tracking-widest uppercase text-ivory/55 mb-4">
                {form.banner_subtext}
              </p>
              <button className="text-[10px] tracking-widest uppercase bg-gold text-ivory px-5 py-2 font-sans">
                {form.banner_cta}
              </button>
            </div>
            <div className="absolute top-4 right-6 text-right">
              <div className="font-display text-3xl text-gold">{form.banner_discount_text}</div>
              <div className="label-xs text-ivory/40 mt-1">This week only</div>
            </div>
          </div>
          <p className="text-[10px] text-faint">Preview updates as you type.</p>
        </div>

        {/* Edit Form */}
        <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
          <p className="label-xs text-faint">Edit Content</p>
          {[
            { key: 'banner_headline',      label: 'Headline',       placeholder: 'New arrivals for Eid 2026' },
            { key: 'banner_subtext',       label: 'Subtext',        placeholder: 'Limited pieces · Order now' },
            { key: 'banner_cta',           label: 'Button Label',   placeholder: 'Shop the Edit' },
            { key: 'banner_discount_text', label: 'Discount Badge', placeholder: '20% Off' },
          ].map(({ key, label, placeholder }) => (
            <div key={key} className="space-y-1.5">
              <label className="label-xs text-faint block">{label}</label>
              <input
                value={(form as any)[key]}
                onChange={(e) => set(key, e.target.value)}
                placeholder={placeholder}
                className="w-full border border-charcoal/15 bg-[#FDFCFA] px-3 py-2 text-sm text-charcoal rounded focus:outline-none focus:border-gold transition-colors"
              />
            </div>
          ))}
          <button onClick={handleSave} disabled={saving} className="btn-charcoal w-full py-3 text-xs mt-2">
            {saved ? '✓ Changes Live on Site!' : saving ? 'Saving…' : 'Save & Publish Banner'}
          </button>
        </div>
      </div>
    </div>
  );
}
