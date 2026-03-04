-- İda'nın Son Muhafızları — Supabase Schema (hardened)
-- Run in Supabase SQL Editor.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  code VARCHAR(6) UNIQUE NOT NULL,
  name TEXT NOT NULL,
  dm_player_id TEXT NOT NULL,
  dm_user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

ALTER TABLE sessions ADD COLUMN IF NOT EXISTS dm_user_id UUID;

-- Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES sessions(id) ON DELETE CASCADE,
  player_id TEXT NOT NULL,
  user_id UUID,
  name TEXT NOT NULL,
  role VARCHAR(10) DEFAULT 'player' CHECK (role IN ('dm', 'player')),
  character_data JSONB,
  is_online BOOLEAN DEFAULT TRUE,
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(session_id, player_id)
);

ALTER TABLE players ADD COLUMN IF NOT EXISTS user_id UUID;

-- Server-authoritative DM state (combat + NPCs)
CREATE TABLE IF NOT EXISTS session_state (
  session_id UUID PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  combat_state JSONB,
  npc_state JSONB DEFAULT '[]'::JSONB,
  updated_by UUID,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Backfill UUID fields when legacy ids are UUID strings
UPDATE sessions
SET dm_user_id = dm_player_id::uuid
WHERE dm_user_id IS NULL
  AND dm_player_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

UPDATE players
SET user_id = player_id::uuid
WHERE user_id IS NULL
  AND player_id ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'players_session_user_unique'
  ) THEN
    ALTER TABLE players
      ADD CONSTRAINT players_session_user_unique UNIQUE (session_id, user_id);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_sessions_code ON sessions(code);
CREATE INDEX IF NOT EXISTS idx_sessions_dm_user_id ON sessions(dm_user_id);
CREATE INDEX IF NOT EXISTS idx_players_session ON players(session_id);
CREATE INDEX IF NOT EXISTS idx_players_player_id ON players(player_id);
CREATE INDEX IF NOT EXISTS idx_players_user_id ON players(user_id);
CREATE INDEX IF NOT EXISTS idx_session_state_updated_at ON session_state(updated_at DESC);

-- Normalize + protect identity/roles on write.
CREATE OR REPLACE FUNCTION normalize_session_row()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.code := UPPER(NEW.code);

  IF NEW.dm_user_id IS NOT NULL THEN
    NEW.dm_player_id := NEW.dm_user_id::text;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_normalize_session_row ON sessions;
CREATE TRIGGER trg_normalize_session_row
BEFORE INSERT OR UPDATE ON sessions
FOR EACH ROW
EXECUTE FUNCTION normalize_session_row();

CREATE OR REPLACE FUNCTION enforce_player_identity_and_role()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
DECLARE
  session_dm UUID;
BEGIN
  IF TG_OP = 'UPDATE' AND NEW.user_id IS DISTINCT FROM OLD.user_id THEN
    RAISE EXCEPTION 'player user_id cannot be changed';
  END IF;

  SELECT dm_user_id INTO session_dm
  FROM sessions
  WHERE id = NEW.session_id;

  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'user_id is required';
  END IF;

  NEW.player_id := NEW.user_id::text;
  NEW.role := CASE WHEN NEW.user_id = session_dm THEN 'dm' ELSE 'player' END;
  NEW.is_online := COALESCE(NEW.is_online, TRUE);

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enforce_player_identity_and_role ON players;
CREATE TRIGGER trg_enforce_player_identity_and_role
BEFORE INSERT OR UPDATE ON players
FOR EACH ROW
EXECUTE FUNCTION enforce_player_identity_and_role();

CREATE OR REPLACE FUNCTION touch_session_state()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := NOW();
  NEW.updated_by := auth.uid();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_touch_session_state ON session_state;
CREATE TRIGGER trg_touch_session_state
BEFORE INSERT OR UPDATE ON session_state
FOR EACH ROW
EXECUTE FUNCTION touch_session_state();

-- Policy helper functions (SECURITY DEFINER avoids recursive RLS checks).
CREATE OR REPLACE FUNCTION is_session_member(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM players p
    WHERE p.session_id = session_uuid
      AND p.user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION is_session_dm(session_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM sessions s
    WHERE s.id = session_uuid
      AND s.dm_user_id = auth.uid()
  );
$$;

GRANT EXECUTE ON FUNCTION is_session_member(UUID) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION is_session_dm(UUID) TO anon, authenticated;

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_state ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow all access to sessions" ON sessions;
DROP POLICY IF EXISTS "Allow all access to players" ON players;

DROP POLICY IF EXISTS sessions_select_policy ON sessions;
DROP POLICY IF EXISTS sessions_insert_policy ON sessions;
DROP POLICY IF EXISTS sessions_update_policy ON sessions;
DROP POLICY IF EXISTS sessions_delete_policy ON sessions;

DROP POLICY IF EXISTS players_select_policy ON players;
DROP POLICY IF EXISTS players_insert_policy ON players;
DROP POLICY IF EXISTS players_update_policy ON players;
DROP POLICY IF EXISTS players_delete_policy ON players;

DROP POLICY IF EXISTS session_state_select_policy ON session_state;
DROP POLICY IF EXISTS session_state_insert_policy ON session_state;
DROP POLICY IF EXISTS session_state_update_policy ON session_state;
DROP POLICY IF EXISTS session_state_delete_policy ON session_state;

-- Sessions: anyone authenticated can discover active sessions by code,
-- only creator (dm_user_id) can mutate.
CREATE POLICY sessions_select_policy
ON sessions
FOR SELECT
USING (
  is_active = TRUE
  OR is_session_member(id)
  OR dm_user_id = auth.uid()
);

CREATE POLICY sessions_insert_policy
ON sessions
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND dm_user_id = auth.uid()
);

CREATE POLICY sessions_update_policy
ON sessions
FOR UPDATE
USING (
  dm_user_id = auth.uid()
)
WITH CHECK (
  dm_user_id = auth.uid()
);

CREATE POLICY sessions_delete_policy
ON sessions
FOR DELETE
USING (
  dm_user_id = auth.uid()
);

-- Players: member-scoped reads, self insert/update, DM can update/delete everyone.
CREATE POLICY players_select_policy
ON players
FOR SELECT
USING (
  is_session_member(session_id)
  OR is_session_dm(session_id)
);

CREATE POLICY players_insert_policy
ON players
FOR INSERT
WITH CHECK (
  auth.uid() IS NOT NULL
  AND user_id = auth.uid()
  AND EXISTS (
    SELECT 1
    FROM sessions s
    WHERE s.id = session_id
      AND s.is_active = TRUE
  )
);

CREATE POLICY players_update_policy
ON players
FOR UPDATE
USING (
  auth.uid() IS NOT NULL
  AND (user_id = auth.uid() OR is_session_dm(session_id))
)
WITH CHECK (
  auth.uid() IS NOT NULL
  AND (user_id = auth.uid() OR is_session_dm(session_id))
);

CREATE POLICY players_delete_policy
ON players
FOR DELETE
USING (
  auth.uid() IS NOT NULL
  AND (user_id = auth.uid() OR is_session_dm(session_id))
);

-- Session state: read for members, write only for DM.
CREATE POLICY session_state_select_policy
ON session_state
FOR SELECT
USING (
  is_session_member(session_id)
  OR is_session_dm(session_id)
);

CREATE POLICY session_state_insert_policy
ON session_state
FOR INSERT
WITH CHECK (
  is_session_dm(session_id)
);

CREATE POLICY session_state_update_policy
ON session_state
FOR UPDATE
USING (
  is_session_dm(session_id)
)
WITH CHECK (
  is_session_dm(session_id)
);

CREATE POLICY session_state_delete_policy
ON session_state
FOR DELETE
USING (
  is_session_dm(session_id)
);

-- Realtime
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'sessions'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sessions;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'players'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE players;
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime'
      AND schemaname = 'public'
      AND tablename = 'session_state'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE session_state;
  END IF;
END $$;
