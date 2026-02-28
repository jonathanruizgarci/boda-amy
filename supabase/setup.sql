-- =============================================
-- SUPABASE SETUP - Wedding Gallery App
-- Run this SQL in your Supabase SQL Editor
-- =============================================

-- 1. Create the photos table
CREATE TABLE IF NOT EXISTS public.photos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  image_url   TEXT        NOT NULL,
  uploader_name TEXT
);

-- 2. Enable Row Level Security
ALTER TABLE public.photos ENABLE ROW LEVEL SECURITY;

-- 3. Allow ANYONE to read photos (public gallery)
CREATE POLICY "Anyone can view photos"
  ON public.photos FOR SELECT
  USING (true);

-- 4. Allow ANYONE to insert photos
CREATE POLICY "Anyone can upload photos"
  ON public.photos FOR INSERT
  WITH CHECK (true);

-- NOTE: No UPDATE or DELETE policies = nobody can delete/modify

-- =============================================
-- STORAGE SETUP (do this in Supabase Dashboard)
-- =============================================
-- 1. Go to Storage → Create bucket
-- 2. Bucket name: wedding-gallery
-- 3. Set as PUBLIC bucket
-- 4. Add storage policy:

-- Allow anyone to upload images only:
CREATE POLICY "Allow public image upload"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'wedding-gallery'
    AND (storage.foldername(name))[1] != '..'
    AND (RIGHT(LOWER(name), 4) IN ('.jpg', '.png', '.gif', '.avif', 'webp')
      OR RIGHT(LOWER(name), 5) IN ('.jpeg', '.heic', '.heif'))
  );

-- Allow anyone to read/view images:
CREATE POLICY "Allow public image read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'wedding-gallery');
