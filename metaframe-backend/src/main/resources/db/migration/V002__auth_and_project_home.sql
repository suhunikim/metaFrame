-- - Role: Defines a database change script.
-- - Notes: This file updates schema or baseline data for deployment.

ALTER TABLE project
  ADD COLUMN IF NOT EXISTS project_description TEXT,
  ADD COLUMN IF NOT EXISTS react_version TEXT NOT NULL DEFAULT '19.2.0',
  ADD COLUMN IF NOT EXISTS vite_version TEXT NOT NULL DEFAULT '7.2.4',
  ADD COLUMN IF NOT EXISTS version_preset TEXT NOT NULL DEFAULT 'stable',
  ADD COLUMN IF NOT EXISTS layout_preset TEXT NOT NULL DEFAULT 'main-layout',
  ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS deleted_by TEXT;

CREATE TABLE IF NOT EXISTS metaframe_user (
  user_id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT NOT NULL,
  global_role TEXT NOT NULL,
  account_status TEXT NOT NULL,
  extra_identifier TEXT,
  theme_preference TEXT NOT NULL DEFAULT 'system',
  ui_font_size INTEGER NOT NULL DEFAULT 14,
  autosave_interval INTEGER NOT NULL DEFAULT 3,
  approved_at TIMESTAMPTZ,
  approved_by TEXT,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS organization_profile (
  organization_id UUID PRIMARY KEY,
  organization_name TEXT NOT NULL,
  bootstrap_completed BOOLEAN NOT NULL DEFAULT TRUE,
  self_signup_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  signup_mode TEXT NOT NULL DEFAULT 'pending_approval',
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS auth_session (
  session_id UUID PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES metaframe_user(user_id) ON DELETE CASCADE,
  session_token_hash TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  last_accessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  revoked_at TIMESTAMPTZ,
  user_agent TEXT,
  client_ip TEXT
);

CREATE INDEX IF NOT EXISTS auth_session_user_idx
  ON auth_session(user_id, expires_at DESC);

CREATE TABLE IF NOT EXISTS password_reset_request (
  request_id UUID PRIMARY KEY,
  user_id TEXT REFERENCES metaframe_user(user_id) ON DELETE SET NULL,
  email TEXT NOT NULL,
  extra_identifier TEXT,
  status TEXT NOT NULL,
  requested_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_recent_visit (
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES metaframe_user(user_id) ON DELETE CASCADE,
  last_opened_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (project_id, user_id)
);
