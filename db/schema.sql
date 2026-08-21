-- Re-Chord schema
-- Run with: psql -d rechord_dev -f db/schema.sql

CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT UNIQUE NOT NULL,
  username      TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  display_name  TEXT NOT NULL,
  avatar_url    TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE albums (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id        TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  artist_name       TEXT NOT NULL,
  artist_spotify_id TEXT,
  cover_url         TEXT,
  release_date      TEXT,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE tracks (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  spotify_id        TEXT UNIQUE NOT NULL,
  title             TEXT NOT NULL,
  artist_name       TEXT NOT NULL,
  artist_spotify_id TEXT,
  duration_ms       INTEGER NOT NULL,
  album_id          UUID REFERENCES albums(id),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE reviews (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rating     REAL NOT NULL,
  body       TEXT,
  sentiment  TEXT NOT NULL CHECK (sentiment IN ('liked', 'fine', 'disliked')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  album_id   UUID REFERENCES albums(id) ON DELETE CASCADE,
  track_id   UUID REFERENCES tracks(id) ON DELETE CASCADE,
  -- NULL is distinct in a unique index, so one album review + many track
  -- reviews can coexist per user without these two constraints colliding.
  UNIQUE (user_id, album_id),
  UNIQUE (user_id, track_id)
);

CREATE TABLE follows (
  follower_id  UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (follower_id, following_id)
);

-- Postgres doesn't auto-index foreign key columns, unlike Prisma did.
CREATE INDEX ON tracks (album_id);
CREATE INDEX ON reviews (user_id);
CREATE INDEX ON reviews (album_id);
CREATE INDEX ON reviews (track_id);
CREATE INDEX ON follows (following_id);
