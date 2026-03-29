-- Minnie Ethnics schema bootstrap.
-- For migration-based setup, use: supabase/migrations/20260328_001_initial_schema.sql

create extension if not exists pgcrypto;

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text default ''::text,
  price integer not null check (price > 0),
  original_price integer check (original_price is null or original_price > 0),
  age_group text not null check (age_group in ('0-1', '1-2', '2-3', '3-5')),
  gender text not null check (gender in ('boys', 'girls', 'unisex')),
  category text not null default 'kurta set',
  images text[] not null default '{}'::text[],
  sizes text[] not null default '{}'::text[],
  in_stock boolean not null default true,
  is_featured boolean not null default false,
  is_new boolean not null default true,
  occasion text,
  slug text not null unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  customer_email text default ''::text,
  customer_phone text not null,
  shipping_address text not null,
  items jsonb not null default '[]'::jsonb,
  total integer not null check (total >= 0),
  status text not null default 'pending' check (status in ('pending', 'paid', 'shipped', 'delivered')),
  razorpay_order_id text,
  razorpay_payment_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.site_settings (
  id integer primary key default 1 check (id = 1),
  banner_headline text not null default 'New arrivals are here',
  banner_subtext text not null default 'Hand-embroidered ethnic wear for your little one',
  banner_cta text not null default 'Shop Now',
  banner_discount_text text not null default '20% Off',
  active_theme text not null default 'default',
  discount_banner_enabled boolean not null default false,
  discount_banner_text text not null default 'Grand Launch Sale - Flat 20% off!',
  discount_code text not null default 'MINNIE20',
  discount_percent integer not null default 20,
  founder_image_url text not null default '',
  hero_video_url text not null default '',
  hero_video_poster_url text not null default '',
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id)
values (1)
on conflict (id) do nothing;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists products_set_updated_at on public.products;
create trigger products_set_updated_at
before update on public.products
for each row execute procedure public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute procedure public.set_updated_at();

drop trigger if exists site_settings_set_updated_at on public.site_settings;
create trigger site_settings_set_updated_at
before update on public.site_settings
for each row execute procedure public.set_updated_at();

alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.site_settings enable row level security;

drop policy if exists "Public can read products" on public.products;
create policy "Public can read products"
  on public.products
  for select
  using (true);

drop policy if exists "Public can read site settings" on public.site_settings;
create policy "Public can read site settings"
  on public.site_settings
  for select
  using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images"
  on storage.objects
  for select
  using (bucket_id = 'product-images');

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media"
  on storage.objects
  for select
  using (bucket_id = 'site-media');
