-- - Role: Defines a database change script.
-- - Notes: This file updates schema or baseline data for deployment.

CREATE TABLE IF NOT EXISTS project (
  project_id UUID PRIMARY KEY,
  project_name TEXT NOT NULL,
  template_type TEXT NOT NULL,
  schema_version TEXT NOT NULL,
  collaboration_mode TEXT NOT NULL,
  autosave_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  owner_user_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS project_member (
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  role TEXT NOT NULL,
  status TEXT NOT NULL,
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  invited_by TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  PRIMARY KEY (project_id, user_id)
);

CREATE TABLE IF NOT EXISTS file_node (
  file_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  parent_id UUID REFERENCES file_node(file_id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  path TEXT NOT NULL,
  node_type TEXT NOT NULL,
  managed_type TEXT NOT NULL,
  extension TEXT,
  is_protected BOOLEAN NOT NULL DEFAULT FALSE,
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  node_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS file_node_project_path_idx
  ON file_node(project_id, path);

CREATE TABLE IF NOT EXISTS canonical_snapshot (
  snapshot_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL,
  scope_id UUID NOT NULL,
  schema_version TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  checksum TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS canonical_snapshot_scope_idx
  ON canonical_snapshot(project_id, scope_type, scope_id, updated_at DESC);

CREATE TABLE IF NOT EXISTS managed_layout (
  layout_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  file_id UUID NOT NULL UNIQUE REFERENCES file_node(file_id) ON DELETE CASCADE,
  canonical_snapshot_id UUID NOT NULL REFERENCES canonical_snapshot(snapshot_id) ON DELETE RESTRICT,
  layout_name TEXT NOT NULL,
  revision_head_id UUID,
  schema_version TEXT NOT NULL,
  editability_state TEXT NOT NULL,
  export_state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS managed_page (
  page_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  file_id UUID NOT NULL UNIQUE REFERENCES file_node(file_id) ON DELETE CASCADE,
  canonical_snapshot_id UUID NOT NULL REFERENCES canonical_snapshot(snapshot_id) ON DELETE RESTRICT,
  page_name TEXT NOT NULL,
  route_path TEXT NOT NULL,
  linked_layout_id UUID REFERENCES managed_layout(layout_id),
  revision_head_id UUID,
  schema_version TEXT NOT NULL,
  editability_state TEXT NOT NULL,
  export_state TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS router_entry (
  route_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  page_id UUID NOT NULL UNIQUE REFERENCES managed_page(page_id) ON DELETE CASCADE,
  route_path TEXT NOT NULL,
  layout_id UUID REFERENCES managed_layout(layout_id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS revision (
  revision_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL,
  scope_id UUID NOT NULL,
  file_id UUID REFERENCES file_node(file_id) ON DELETE SET NULL,
  save_type TEXT NOT NULL,
  summary TEXT,
  schema_version TEXT NOT NULL,
  snapshot JSONB NOT NULL,
  parent_revision_id UUID REFERENCES revision(revision_id),
  created_by TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS revision_project_scope_idx
  ON revision(project_id, scope_type, scope_id, created_at DESC);

CREATE TABLE IF NOT EXISTS autosave_snapshot (
  autosave_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  scope_type TEXT NOT NULL,
  scope_id UUID NOT NULL,
  based_on_revision_id UUID REFERENCES revision(revision_id),
  snapshot JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  recoverable BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS activity_log (
  activity_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  actor_user_id TEXT NOT NULL,
  action_type TEXT NOT NULL,
  target_type TEXT NOT NULL,
  target_id UUID,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS file_presence (
  presence_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  file_id UUID NOT NULL REFERENCES file_node(file_id) ON DELETE CASCADE,
  page_id UUID REFERENCES managed_page(page_id) ON DELETE CASCADE,
  layout_id UUID REFERENCES managed_layout(layout_id) ON DELETE CASCADE,
  open_mode TEXT NOT NULL,
  is_viewing BOOLEAN NOT NULL DEFAULT TRUE,
  is_editing BOOLEAN NOT NULL DEFAULT FALSE,
  session_id TEXT NOT NULL,
  last_heartbeat TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS file_presence_project_idx
  ON file_presence(project_id, last_heartbeat DESC);

CREATE TABLE IF NOT EXISTS file_lock (
  lock_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  file_id UUID NOT NULL REFERENCES file_node(file_id) ON DELETE CASCADE,
  page_id UUID REFERENCES managed_page(page_id) ON DELETE CASCADE,
  layout_id UUID REFERENCES managed_layout(layout_id) ON DELETE CASCADE,
  locked_by TEXT NOT NULL,
  lock_type TEXT NOT NULL,
  reason TEXT NOT NULL,
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS export_job (
  export_job_id UUID PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES project(project_id) ON DELETE CASCADE,
  snapshot_revision_id UUID REFERENCES revision(revision_id),
  requested_by TEXT NOT NULL,
  status TEXT NOT NULL,
  warning_count INTEGER NOT NULL DEFAULT 0,
  output_path TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
