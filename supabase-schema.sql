-- ============================================
-- CASA NOMADA — COMPLETE DATABASE SCHEMA
-- Voer uit in Supabase SQL Editor
-- ============================================

-- EXTENSIES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- PROFILES (uitbreiding van auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  language TEXT DEFAULT 'nl',
  avatar_url TEXT,
  role TEXT DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'superadmin')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'deleted')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

-- Auto-create profile bij registratie
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================
-- WEDDINGS
-- ============================================
CREATE TABLE IF NOT EXISTS weddings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  -- Namen
  partner1_first TEXT NOT NULL DEFAULT '',
  partner1_last TEXT DEFAULT '',
  partner2_first TEXT NOT NULL DEFAULT '',
  partner2_last TEXT DEFAULT '',
  display_name TEXT,
  -- Datum & locatie
  wedding_date DATE,
  wedding_time TIME,
  timezone TEXT DEFAULT 'Europe/Amsterdam',
  country TEXT DEFAULT 'Nederland',
  city TEXT,
  venue TEXT,
  address TEXT,
  -- Content
  intro_text TEXT,
  welcome_message TEXT,
  closing_message TEXT,
  -- Template & design
  template_slug TEXT DEFAULT 'bloom',
  primary_color TEXT DEFAULT '#8B2635',
  secondary_color TEXT DEFAULT '#f9f5f1',
  bg_color TEXT DEFAULT '#ffffff',
  text_color TEXT DEFAULT '#16161D',
  heading_font TEXT DEFAULT 'cormorant',
  body_font TEXT DEFAULT 'roboto',
  -- Instellingen
  slug TEXT UNIQUE,
  language TEXT DEFAULT 'nl',
  privacy TEXT DEFAULT 'token' CHECK (privacy IN ('public', 'unlisted', 'token', 'private')),
  -- Status
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'preview', 'payment_pending', 'paid', 'published', 'archived')),
  package TEXT DEFAULT 'collection' CHECK (package IN ('collection', 'destination', 'custom')),
  published_at TIMESTAMPTZ,
  -- Opties
  show_countdown BOOLEAN DEFAULT TRUE,
  show_schedule BOOLEAN DEFAULT TRUE,
  show_photos BOOLEAN DEFAULT TRUE,
  show_messages BOOLEAN DEFAULT TRUE,
  show_rsvp BOOLEAN DEFAULT TRUE,
  rsvp_deadline DATE,
  -- Meta
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-generate slug
CREATE OR REPLACE FUNCTION generate_wedding_slug(p1 TEXT, p2 TEXT)
RETURNS TEXT AS $$
DECLARE
  base TEXT;
  candidate TEXT;
  counter INT := 0;
BEGIN
  base := lower(regexp_replace(p1 || '-' || p2, '[^a-z0-9]', '-', 'g'));
  base := regexp_replace(base, '-+', '-', 'g');
  base := trim(both '-' from base);
  candidate := base;
  WHILE EXISTS (SELECT 1 FROM weddings WHERE slug = candidate) LOOP
    counter := counter + 1;
    candidate := base || '-' || counter;
  END LOOP;
  RETURN candidate;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- EVENTS (bruiloftmomenten)
-- ============================================
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  event_date DATE,
  start_time TIME,
  end_time TIME,
  venue TEXT,
  address TEXT,
  city TEXT,
  description TEXT,
  dresscode TEXT,
  map_url TEXT,
  image_url TEXT,
  is_main BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- RSVP VRAGEN
-- ============================================
CREATE TABLE IF NOT EXISTS rsvp_questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  type TEXT DEFAULT 'text' CHECK (type IN ('text', 'boolean', 'single_choice', 'multiple_choice', 'number', 'dropdown')),
  options JSONB,
  required BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GASTEN
-- ============================================
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  -- Naam
  first_name TEXT NOT NULL,
  last_name TEXT DEFAULT '',
  email TEXT,
  phone TEXT,
  -- Groep & instellingen
  group_name TEXT DEFAULT 'Gasten',
  language TEXT DEFAULT 'nl',
  token TEXT UNIQUE DEFAULT encode(gen_random_bytes(12), 'hex'),
  -- Status
  status TEXT DEFAULT 'invited' CHECK (status IN ('invited', 'opened', 'confirmed', 'declined', 'maybe')),
  notes TEXT,
  -- Tracking
  opened_at TIMESTAMPTZ,
  last_seen TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Gast-event koppeling (welke events ziet welke gast)
CREATE TABLE IF NOT EXISTS guest_events (
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  PRIMARY KEY (guest_id, event_id)
);

-- ============================================
-- RSVP ANTWOORDEN
-- ============================================
CREATE TABLE IF NOT EXISTS rsvps (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  -- Basis
  name TEXT NOT NULL,
  email TEXT,
  attending BOOLEAN NOT NULL,
  -- Details
  adults INT DEFAULT 1,
  children INT DEFAULT 0,
  diet TEXT,
  allergies TEXT,
  message TEXT,
  -- Event
  event_id UUID REFERENCES events(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVP antwoorden op custom vragen
CREATE TABLE IF NOT EXISTS rsvp_answers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  rsvp_id UUID REFERENCES rsvps(id) ON DELETE CASCADE,
  question_id UUID REFERENCES rsvp_questions(id) ON DELETE CASCADE,
  answer TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- FOTO'S
-- ============================================
CREATE TABLE IF NOT EXISTS photos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  uploader_name TEXT,
  url TEXT NOT NULL,
  thumbnail_url TEXT,
  caption TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  file_size INT,
  width INT,
  height INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BERICHTEN
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL,
  content TEXT NOT NULL,
  photo_url TEXT,
  status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MUZIEK
-- ============================================
CREATE TABLE IF NOT EXISTS music_tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  is_library BOOLEAN DEFAULT FALSE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- TAFELS & ZITPLAATSEN
-- ============================================
CREATE TABLE IF NOT EXISTS tables (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  capacity INT DEFAULT 8,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS table_seats (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  table_id UUID REFERENCES tables(id) ON DELETE CASCADE NOT NULL,
  guest_id UUID REFERENCES guests(id) ON DELETE SET NULL,
  seat_number INT,
  locked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- HOTELS (destination)
-- ============================================
CREATE TABLE IF NOT EXISTS hotels (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  address TEXT,
  website TEXT,
  booking_url TEXT,
  phone TEXT,
  description TEXT,
  image_url TEXT,
  price_from TEXT,
  discount_code TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- BETALINGEN
-- ============================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  stripe_session_id TEXT UNIQUE,
  stripe_payment_intent TEXT,
  amount INT NOT NULL,
  currency TEXT DEFAULT 'eur',
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed', 'refunded', 'cancelled')),
  package TEXT,
  paid_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- NOTIFICATIES
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- QR CODES
-- ============================================
CREATE TABLE IF NOT EXISTS qr_codes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_id UUID REFERENCES weddings(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  url TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  action TEXT NOT NULL,
  resource TEXT,
  resource_id TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

-- Profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eigen profiel lezen" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "Eigen profiel bijwerken" ON profiles FOR UPDATE USING (id = auth.uid());

-- Weddings
ALTER TABLE weddings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eigen weddings beheren" ON weddings FOR ALL USING (user_id = auth.uid());
CREATE POLICY "Gepubliceerde weddings lezen" ON weddings FOR SELECT USING (status = 'published' OR user_id = auth.uid());

-- Events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Events via wedding" ON events FOR ALL USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);
CREATE POLICY "Publieke events lezen" ON events FOR SELECT USING (
  wedding_id IN (SELECT id FROM weddings WHERE status = 'published')
);

-- Guests
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Gasten via wedding" ON guests FOR ALL USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);
CREATE POLICY "Gast zelf lezen via token" ON guests FOR SELECT USING (true);

-- RSVPs
ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "RSVP aanmaken" ON rsvps FOR INSERT WITH CHECK (true);
CREATE POLICY "RSVP lezen via wedding" ON rsvps FOR SELECT USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);

-- Photos
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Foto uploaden" ON photos FOR INSERT WITH CHECK (true);
CREATE POLICY "Foto lezen" ON photos FOR SELECT USING (
  status = 'approved' OR wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);
CREATE POLICY "Foto beheren" ON photos FOR UPDATE USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);
CREATE POLICY "Foto verwijderen" ON photos FOR DELETE USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);

-- Messages
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Bericht aanmaken" ON messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Bericht lezen" ON messages FOR SELECT USING (
  status = 'approved' OR wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);
CREATE POLICY "Bericht beheren" ON messages FOR ALL USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);

-- Tables
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Tafels via wedding" ON tables FOR ALL USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);

-- Table seats
ALTER TABLE table_seats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Zitplaatsen via tafel" ON table_seats FOR ALL USING (
  table_id IN (SELECT t.id FROM tables t JOIN weddings w ON t.wedding_id = w.id WHERE w.user_id = auth.uid())
);

-- Hotels
ALTER TABLE hotels ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Hotels via wedding" ON hotels FOR ALL USING (
  wedding_id IN (SELECT id FROM weddings WHERE user_id = auth.uid())
);

-- Payments
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eigen betalingen" ON payments FOR SELECT USING (user_id = auth.uid());

-- Notifications
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Eigen notificaties" ON notifications FOR ALL USING (user_id = auth.uid());

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_weddings_user ON weddings(user_id);
CREATE INDEX IF NOT EXISTS idx_weddings_slug ON weddings(slug);
CREATE INDEX IF NOT EXISTS idx_guests_wedding ON guests(wedding_id);
CREATE INDEX IF NOT EXISTS idx_guests_token ON guests(token);
CREATE INDEX IF NOT EXISTS idx_rsvps_wedding ON rsvps(wedding_id);
CREATE INDEX IF NOT EXISTS idx_photos_wedding ON photos(wedding_id);
CREATE INDEX IF NOT EXISTS idx_messages_wedding ON messages(wedding_id);
CREATE INDEX IF NOT EXISTS idx_events_wedding ON events(wedding_id);

-- ============================================
-- DEMO LIBRARY MUZIEK
-- ============================================
INSERT INTO music_tracks (wedding_id, name, url, is_library, sort_order) VALUES
  (NULL, 'Amber Glow', 'https://cdn.pixabay.com/audio/2023/11/10/audio_d4d18e7aa3.mp3', TRUE, 1),
  (NULL, 'Tender Rose', 'https://cdn.pixabay.com/audio/2022/10/31/audio_cdbf8b5699.mp3', TRUE, 2),
  (NULL, 'Garden Waltz', 'https://cdn.pixabay.com/audio/2023/02/28/audio_febc508520.mp3', TRUE, 3),
  (NULL, 'Dolce Vita', 'https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3', TRUE, 4)
ON CONFLICT DO NOTHING;

