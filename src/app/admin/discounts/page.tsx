'use client';

import { useState, useEffect } from 'react';

const DEFAULTS = {
  discount_banner_enabled: false,
  discount_banner_text: 'Grand Launch Sale — Flat 20% off on all orders!',
  discount_code: 'MINNIE20',
  discount_percent: 20,
};

export default function AdminDiscountsPage() {
  const [form, setForm] = useState(DEFAULTS);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((body) => {
        if (body?.data) {
          setForm({
            ...DEFAULTS,
            discount_banner_enabled: body.data.discount_banner_enabled,
            discount_banner_text: body.data.discount_banner_text,
            discount_code: body.data.discount_code,
            discount_percent: body.data.discount_percent,
          });
        }
      })
      .catch(() => undefined);
  }, []);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

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
        <div>
          <h1 className="text-[15px] font-medium text-charcoal">Discounts & Offers</h1>
          <p className="text-[11px] text-faint mt-0.5">Control your discount banner and offer code without touching code.</p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gold text-xs py-2 px-5">
          {saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      <div className="p-7 max-w-2xl space-y-5">

        {/* Toggle banner on/off */}
        <div className="bg-white border border-charcoal/8 rounded-lg p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-charcoal">Discount Banner</p>
              <p className="text-xs text-faint mt-0.5">Shows a coloured strip at the very top of your site</p>
            </div>
            <div
              onClick={() => set('discount_banner_enabled', !form.discount_banner_enabled)}
              className={`w-11 h-6 rounded-full relative cursor-pointer transition-colors ${
                form.discount_banner_enabled ? 'bg-gold' : 'bg-charcoal/20'
              }`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                form.discount_banner_enabled ? 'left-6' : 'left-1'
              }`} />
            </div>
          </div>

          {/* Banner preview */}
          {form.discount_banner_enabled && (
            <div
              className="mt-4 py-2 px-4 text-center text-xs tracking-widest text-ivory rounded"
              style={{ background: '#C5A055' }}
            >
              {form.discount_banner_text}
              {form.discount_code && (
                <span className="ml-2 opacity-75">· Code: {form.discount_code}</span>
              )}
            </div>
          )}
        </div>

        {/* Banner text */}
        <div className="bg-white border border-charcoal/8 rounded-lg p-5 space-y-4">
          <p className="label-xs text-faint">Banner Content</p>

          <div className="space-y-1.5">
            <label className="label-xs text-faint block">Banner Message</label>
            <input
              value={form.discount_banner_text}
              onChange={(e) => set('discount_banner_text', e.target.value)}
              className="w-full border border-charcoal/15 bg-[#FDFCFA] px-3 py-2 text-sm text-charcoal rounded focus:outline-none focus:border-gold"
              placeholder="Grand Launch Sale — Flat 20% off on all orders!"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="label-xs text-faint block">Discount Code</label>
              <input
                value={form.discount_code}
                onChange={(e) => set('discount_code', e.target.value.toUpperCase())}
                className="w-full border border-charcoal/15 bg-[#FDFCFA] px-3 py-2 text-sm text-charcoal rounded focus:outline-none focus:border-gold font-mono tracking-widest"
                placeholder="MINNIE20"
              />
            </div>
            <div className="space-y-1.5">
              <label className="label-xs text-faint block">Discount % (display only)</label>
              <input
                type="number"
                min={0} max={100}
                value={form.discount_percent}
                onChange={(e) => set('discount_percent', Number(e.target.value))}
                className="w-full border border-charcoal/15 bg-[#FDFCFA] px-3 py-2 text-sm text-charcoal rounded focus:outline-none focus:border-gold"
              />
            </div>
          </div>
        </div>

        <div className="bg-ivory2 border border-charcoal/8 rounded-lg p-4 text-xs text-muted leading-relaxed">
          <p className="font-medium text-charcoal mb-1">Note on discount codes</p>
          The code shown here is for display purposes — customers see it and use it manually.
          Automatic code validation at checkout will be added in a future update.
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-charcoal w-full py-3 text-xs">
          {saved ? '✓ Changes Live!' : saving ? 'Saving…' : 'Save & Publish'}
        </button>
      </div>
    </div>
  );
}
