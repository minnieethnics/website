'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { getTheme } from '@/lib/themes';

type LiveSettings = {
  banner_headline: string;
  banner_subtext: string;
  banner_cta: string;
  banner_discount_text: string;
  active_theme: string;
  discount_banner_enabled: boolean;
  discount_banner_text: string;
  discount_code: string;
  discount_percent: number;
  founder_image_url: string;
  hero_video_url: string;
  hero_video_poster_url: string;
  // derived from active_theme
  accent: string;
  bg: string;
};

const DEFAULTS: LiveSettings = {
  banner_headline: 'New arrivals are here',
  banner_subtext: 'Hand-embroidered ethnic wear for your little one',
  banner_cta: 'Shop Now',
  banner_discount_text: '',
  active_theme: 'default',
  discount_banner_enabled: false,
  discount_banner_text: '',
  discount_code: '',
  discount_percent: 0,
  founder_image_url: '',
  hero_video_url: '',
  hero_video_poster_url: '',
  accent: '#C5A055',
  bg: '#F7F0E6',
};

export function useSiteSettings() {
  const [settings, setSettings] = useState<LiveSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .single();
        if (data) {
          const theme = getTheme(data.active_theme ?? 'default');
          setSettings({
            ...DEFAULTS,
            ...data,
            accent: theme.accent,
            bg: theme.bg,
          });
        }
      } catch {
        // use defaults if supabase not configured yet
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  return { settings, loading };
}
