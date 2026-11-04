# Aora

A mobile video-sharing app built with React Native, Expo, and Supabase. Create an account, browse a feed of videos, search by keyword, flip through a trending carousel, and view your profile.

> Built for CS 370 Mobile Development at Ensign College.

## Demo

[Watch the demo video](https://REPLACE-WITH-DEMO-LINK)

<!--
Add 3-4 screenshots to docs/screenshots/ and uncomment:

<p align="center">
  <img src="docs/screenshots/sign-in.png" width="200" />
  <img src="docs/screenshots/home.png" width="200" />
  <img src="docs/screenshots/search.png" width="200" />
  <img src="docs/screenshots/profile.png" width="200" />
</p>
-->

> **Backend note:** the hosted demo backend runs on Supabase's free tier and may be paused. Watch the demo video above, or recreate the backend in a few minutes with [`supabase/schema.sql`](supabase/schema.sql) (see [Getting started](#getting-started)).

## Features

- **Authentication:** email/password sign-up and sign-in with Supabase Auth. Sessions persist across app restarts, and the app redirects based on session state.
- **Video feed:** videos are listed from Supabase Storage, with pull-to-refresh and an empty state.
- **Search:** a dynamic `search/[query]` route runs case-insensitive matching on title and filename.
- **Trending carousel:** a horizontal list whose centered card animates, driven by FlatList viewability callbacks.
- **Video playback:** in-app playback with `expo-video`, including fullscreen and picture-in-picture.
- **Profile:** shows your username, your post count, and your videos, with logout.
- **Styling:** NativeWind (Tailwind CSS for React Native) with a Poppins type scale and reusable components.

## Tech stack

| Area | Tools |
| --- | --- |
| App | React Native 0.81, React 19, Expo SDK 54 |
| Navigation | Expo Router 6 (file-based routing, route groups) |
| Backend | Supabase (Auth, Postgres, Storage) via `@supabase/supabase-js` |
| Styling | NativeWind 4, Tailwind CSS 3 |
| Media and motion | `expo-video`, `react-native-animatable`, `react-native-reanimated` |
| Storage on device | `@react-native-async-storage/async-storage` (auth session) |

## Project structure

```
app/
  index.jsx             Onboarding screen
  _layout.jsx           Font loading and session check/redirect
  (auth)/               sign-in, sign-up
  (tabs)/               home, create, bookmark, profile
  search/[query].jsx    Dynamic search results
components/             VideoCard, Trending, SearchInput, FormField,
                        CustomButton, EmptyState, InfoBox, Loader
hooks/useSupabase.js    Data fetching and row mapping (mapVideoRow)
lib/supabase.js         Supabase client, configured from env vars
constants/              Icons and images
supabase/schema.sql     Table, Row Level Security policies, storage buckets
```

## Getting started

You need Node.js, a free [Supabase](https://supabase.com) account, and either a simulator or the Expo Go app on a phone.

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Create the backend.** Create a Supabase project, open **SQL Editor**, and run [`supabase/schema.sql`](supabase/schema.sql). It creates the `videos` table, the `videos` and `thumbnails` storage buckets, and read-only Row Level Security policies.

3. **Add content.** In **Storage**, upload `example.mp4` to the `videos` bucket and `example.jpg` to the `thumbnails` bucket. A video's thumbnail must share its name. To make the video searchable and show it on a profile, add a row to the `videos` table (a sample insert is in the SQL file).

4. **Configure auth for local testing.** In **Authentication**, turn off "Confirm email" while developing. The app goes to the home screen right after sign-up, which does not work while confirmation is required.

5. **Set environment variables.** Copy `.env.example` to `.env` and fill in your project URL and anon key (from **Project Settings > API**):

   ```
   EXPO_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

6. **Run the app**

   ```bash
   npx expo start -c
   ```

   The `-c` flag clears the cache so the new env vars are picked up. Scan the QR code with Expo Go, or press `i` / `a` for a simulator.

## Security notes

- The client uses Supabase's public **anon** key, which is designed to ship inside apps. What protects the data is Row Level Security: it is enabled on the `videos` table, and the policies grant read access only.
- Never put a service-role key in the app or in this repository. `.env` is git-ignored, and only `.env.example` is committed.

## Known limitations and roadmap

- The **Create** (video upload) and **Bookmark** tabs are placeholders. Videos are currently added through the Supabase dashboard.
- Playback is tap-to-play. Autoplay for the video in view is not implemented.
- Search currently matches only titles and filenames.

Ideas for next steps: video upload from the device, bookmarks stored per user, and autoplay for the visible card.

## Credits

Created by [Samigu8](https://github.com/Samigu8) as a CS 370 course project.