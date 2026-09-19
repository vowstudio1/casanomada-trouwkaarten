-- Voer dit uit in Supabase SQL Editor

-- Gasten tabel
CREATE TABLE IF NOT EXISTS guests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  language TEXT DEFAULT 'nl',
  token TEXT UNIQUE NOT NULL,
  opened_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RSVP tabel (uitgebreid)
CREATE TABLE IF NOT EXISTS rsvp (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  invitation_id UUID REFERENCES invitations(id) ON DELETE CASCADE,
  guest_id UUID REFERENCES guests(id) ON DELETE CASCADE,
  name TEXT,
  attending BOOLEAN NOT NULL,
  diet TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Invitations tabel uitbreiden
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS published BOOLEAN DEFAULT FALSE;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS paid BOOLEAN DEFAULT FALSE;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS color_index INTEGER DEFAULT 0;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS music_index INTEGER DEFAULT 0;
ALTER TABLE invitations ADD COLUMN IF NOT EXISTS wedding_time TEXT;

-- Row Level Security
ALTER TABLE guests ENABLE ROW LEVEL SECURITY;
ALTER TABLE rsvp ENABLE ROW LEVEL SECURITY;

-- Gasten: eigenaar kan alles
CREATE POLICY "Eigenaar kan gasten zien" ON guests
  FOR ALL USING (
    invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid())
  );

-- RSVP: publiek invoegen (gasten bevestigen), eigenaar kan lezen
CREATE POLICY "Iedereen kan RSVP aanmaken" ON rsvp
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Eigenaar kan RSVP lezen" ON rsvp
  FOR SELECT USING (
    invitation_id IN (SELECT id FROM invitations WHERE user_id = auth.uid())
  );

-- Gasten kunnen hun eigen uitnodiging lezen via token lookup
CREATE POLICY "Publieke uitnodiging lezen" ON invitations
  FOR SELECT USING (published = true OR user_id = auth.uid());

CREATE POLICY "Gasten kunnen zichzelf lezen" ON guests
  FOR SELECT USING (true);
