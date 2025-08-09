# Supabase Like System Deployment Guide

## 1. Set up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to the **SQL Editor** (left sidebar)
3. Click **New Query**
4. Copy and paste the contents of `scripts/supabase-setup.sql`
5. Click **Run** to execute the SQL

This will create:
- `likes` table to store like counts for each item
- `user_likes` table to track which users liked which items
- Row Level Security (RLS) policies for public read/write access
- Performance indexes for fast queries

## 2. Get Your Supabase Credentials

1. In your Supabase dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project-id.supabase.co`)
   - **Anon/Public Key** (the `anon` key under "Project API keys")

## 3. Configure the Like System


1. Open `public/js/util/like-system.js`
2. Replace the placeholder values:

```javascript
// Replace these with your actual Supabase credentials
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

## 4. Test the System

1. Open your website locally (`python3 dev-server.py`)
2. Navigate to blog or projects page
3. Test the like buttons - they should:
   - Show current like counts
   - Allow clicking to like/unlike
   - Persist across page refreshes
   - Work for all visitors globally

## 5. Deploy to GitHub Pages

1. Commit and push your changes:
```bash
git add .
git commit -m "Add Supabase like system"
git push origin main
```

2. Your GitHub Pages site will automatically update
3. Test the live version to ensure everything works

## Database Schema Overview

### `likes` table
- `item_id` (text): Unique identifier for blog posts/projects
- `count` (integer): Current like count for the item
- `created_at` / `updated_at`: Timestamps

### `user_likes` table  
- `user_fingerprint` (text): Anonymous user identifier
- `item_id` (text): Which item was liked
- `created_at`: When the like was made

## Security Notes

- Uses Row Level Security (RLS) for data protection
- Anonymous access is enabled for public like functionality
- User fingerprints are generated client-side for privacy
- No personal data is stored

## Troubleshooting

**Issue: "Failed to fetch like count"**
- Check your Supabase URL and anon key are correct
- Verify the database schema was created successfully
- Check browser console for detailed error messages

**Issue: Likes not persisting**
- Ensure RLS policies are enabled and configured correctly
- Check that the `user_likes` table allows inserts
- Verify network connectivity to Supabase

**Issue: Like buttons not appearing**
- Ensure cards have `data-item-id` attributes
- Check that the like system is being initialized
- Verify CSS styles are loading correctly
