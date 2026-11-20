-- Jalankan skrip SQL ini di Supabase Dashboard -> SQL Editor
-- untuk menyiapkan tabel penyimpanan utama Kampung Hijau Harmoni.

create table if not exists public.kampung_state (
  id text primary key,
  data jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

-- Aktifkan Row Level Security (RLS) dengan policy akses untuk aplikasi server
alter table public.kampung_state enable row level security;

drop policy if exists "Allow anon read kampung_state" on public.kampung_state;
create policy "Allow anon read kampung_state"
  on public.kampung_state
  for select
  to anon, authenticated
  using (id = 'main');

drop policy if exists "Allow anon upsert kampung_state" on public.kampung_state;
create policy "Allow anon upsert kampung_state"
  on public.kampung_state
  for insert
  to anon, authenticated
  with check (id = 'main');

drop policy if exists "Allow anon update kampung_state" on public.kampung_state;
create policy "Allow anon update kampung_state"
  on public.kampung_state
  for update
  to anon, authenticated
  using (id = 'main')
  with check (id = 'main');
