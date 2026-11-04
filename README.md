# Aora

Aora is an Expo React Native video-sharing app backed by Supabase.

## Setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and set:

   - `EXPO_PUBLIC_SUPABASE_URL`: your Supabase project URL
   - `EXPO_PUBLIC_SUPABASE_ANON_KEY`: your Supabase publishable/anon key

3. Start Expo:

   ```bash
   npm start
   ```

## Supabase requirements

- Create public `videos` and `thumbnails` storage buckets.
- Store matching files in both buckets. A video named `example.mp4` expects a thumbnail named `example.jpg`.
- The `videos` table must include at least `id`, `filename`, `title`, and `creator`.
- Enable Row Level Security on the `videos` table and storage tables, then add only the policies required by the app.

The client uses the publishable/anon key by design. Never place a service-role key in the app or commit it to the repository.
