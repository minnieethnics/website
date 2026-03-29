-- Adds site media fields and storage bucket for founder image + hero video assets.
-- Safe to run multiple times.

alter table if exists public.site_settings
  add column if not exists founder_image_url text not null default '',
  add column if not exists hero_video_url text not null default '',
  add column if not exists hero_video_poster_url text not null default '';

insert into storage.buckets (id, name, public)
values ('site-media', 'site-media', true)
on conflict (id) do nothing;

drop policy if exists "Public read site media" on storage.objects;
create policy "Public read site media"
  on storage.objects for select
  using (bucket_id = 'site-media');
