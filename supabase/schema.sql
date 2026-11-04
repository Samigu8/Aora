-- Aora: Supabase backend setup
--
-- Run this in the Supabase dashboard: SQL Editor -> New query -> paste -> Run.
-- It is safe to run more than once.
--
-- What the app needs from the backend:
--   * Two PUBLIC storage buckets: "videos" (.mp4 files) and "thumbnails" (.jpg files).
--     A video named example.mp4 expects a thumbnail named example.jpg.
--   * A "videos" table used by search and the profile screen.
--   * Read-only access for the client. The app never inserts or updates rows,
--     so no write policies are created. Add content from the dashboard.

-- ---------------------------------------------------------------------------
-- 1. Storage buckets
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values
  ('videos', 'videos', true),
  ('thumbnails', 'thumbnails', true)
on conflict (id) do nothing;

-- The home feed calls storage.from('videos').list(), which needs SELECT on
-- storage.objects. Public buckets serve file URLs without a policy, but
-- listing does not.
drop policy if exists "Public read for Aora buckets" on storage.objects;
create policy "Public read for Aora buckets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id in ('videos', 'thumbnails'));

-- ---------------------------------------------------------------------------
-- 2. videos table
-- ---------------------------------------------------------------------------
create table if not exists public.videos (
  id         uuid primary key default gen_random_uuid(),
  filename   text not null,   -- object name in the "videos" bucket, e.g. example.mp4
  title      text,            -- falls back to filename in the app
  creator    text,            -- the profile screen matches this to the user's email
  avatar     text,            -- optional URL; the app has a placeholder
  video      text,            -- optional URL override; defaults to the storage URL
  thumbnail  text,            -- optional URL override; defaults to thumbnails/<name>.jpg
  created_at timestamptz not null default now()
);

create index if not exists videos_creator_idx on public.videos (creator);

-- ---------------------------------------------------------------------------
-- 3. Row Level Security
-- ---------------------------------------------------------------------------
alter table public.videos enable row level security;

-- Anyone with the app can read videos. With RLS on and no insert/update/delete
-- policies, the public anon key cannot modify data.
-- To require sign-in for reads, change "anon, authenticated" to "authenticated".
drop policy if exists "Public read for videos" on public.videos;
create policy "Public read for videos"
  on public.videos
  for select
  to anon, authenticated
  using (true);

-- ---------------------------------------------------------------------------
-- 4. Optional sample row
-- ---------------------------------------------------------------------------
-- Upload example.mp4 to the "videos" bucket and example.jpg to "thumbnails"
-- first (Storage -> bucket -> Upload), then uncomment and run:
--
-- insert into public.videos (filename, title, creator)
-- values ('example.mp4', 'Example video', 'demo@example.com');
--
-- Note: the home feed lists the storage bucket directly, so uploaded files
-- appear there even without a table row. Search and the profile screen read
-- from this table.