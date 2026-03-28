import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// ─── Browser client (auth-aware, use in Client Components) ───────────────────
// Uses @supabase/ssr so the session is persisted in cookies and shared with
// the server — required for Supabase Auth to work properly in Next.js App Router.
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);

// ─── Server / Admin client (no auth, use only in API routes) ─────────────────
export const supabaseAdmin = () =>
  createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!);

// ─── Types ───────────────────────────────────────────────────────────────────
export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  original_price?: number;
  age_group: '0-1' | '1-2' | '2-3' | '3-5';
  gender: 'boys' | 'girls' | 'unisex';
  category: string;
  images: string[];
  sizes: string[];
  in_stock: boolean;
  is_featured: boolean;
  is_new: boolean;
  occasion?: string;
  slug: string;
  created_at: string;
};

export type Order = {
  id: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
};

export type OrderItem = {
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
};

export type SiteSettings = {
  id: number;
  banner_headline: string;
  banner_subtext: string;
  banner_cta: string;
  banner_discount_text: string;
  active_theme: string;
  discount_banner_enabled: boolean;
  discount_banner_text: string;
  discount_code: string;
  discount_percent: number;
  updated_at: string;
};