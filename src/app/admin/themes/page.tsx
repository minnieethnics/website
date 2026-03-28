'use client';

import { useState, useEffect } from 'react';
import { FESTIVAL_THEMES } from '@/lib/themes';

export default function AdminThemesPage() {
  const [activeTheme, setActiveTheme] = useState('default');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch('/api/admin/site-settings')
      .then((res) => res.json())
      .then((body) => {
        if (body?.data?.active_theme) setActiveTheme(body.data.active_theme);
      })
      .catch(() => undefined);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/site-settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active_theme: activeTheme }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div>
      <div className="bg-white border-b border-charcoal/8 px-7 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-[15px] font-medium text-charcoal">Festival Themes</h1>
          <p className="text-[11px] text-faint mt-0.5">
            Switch the site palette for Indian festivals — no code needed.
          </p>
        </div>
        <button onClick={handleSave} disabled={saving} className="btn-gold text-xs py-2 px-5">
          {saved ? '✓ Theme Live!' : saving ? 'Applying…' : 'Apply Theme'}
        </button>
      </div>

      <div className="p-7">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {FESTIVAL_THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            return (
              <button
                key={theme.id}
                onClick={() => setActiveTheme(theme.id)}
                className={`rounded-lg p-4 text-left transition-all border-2 ${
                  isActive
                    ? 'border-charcoal shadow-sm'
                    : 'border-transparent hover:border-charcoal/20'
                }`}
                style={{ background: theme.bg }}
              >
                {/* Active dot */}
                {isActive && (
                  <div className="w-2 h-2 rounded-full bg-charcoal mb-3" />
                )}
                {!isActive && <div className="w-2 h-2 mb-3" />}

                {/* Colour swatches */}
                <div className="flex gap-1.5 mb-3">
                  <div className="w-5 h-5 rounded-full border border-white/40" style={{ background: theme.accent }} />
                  <div className="w-5 h-5 rounded-full border border-white/20" style={{ background: theme.heroOverlay.replace('rgba','rgb').replace(/,[\d.]+\)/, ')') }} />
                </div>

                <p className="text-sm font-medium text-charcoal">{theme.name}</p>

                {theme.bannerNote && (
                  <p className="text-[10px] text-muted mt-1 leading-snug line-clamp-2">
                    {theme.bannerNote}
                  </p>
                )}

                {/* Preview accent bar */}
                <div
                  className="mt-3 h-1 rounded-full w-3/4"
                  style={{ background: theme.accent }}
                />
              </button>
            );
          })}
        </div>

        <div className="mt-6 bg-white border border-charcoal/8 rounded-lg p-5">
          <p className="label-xs text-faint mb-3">How themes work</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-muted leading-relaxed">
            <div>
              <p className="font-medium text-charcoal mb-1">Colours change</p>
              The accent colour, hero tint, and marquee bar update across the whole site.
            </div>
            <div>
              <p className="font-medium text-charcoal mb-1">Banner note shows</p>
              Each festival theme has a preset announcement strip that appears at the top of the site.
            </div>
            <div>
              <p className="font-medium text-charcoal mb-1">One click to revert</p>
              Select &quot;Everyday&quot; to go back to the default gold palette anytime.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
