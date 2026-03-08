// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_METAFRAME_API_BASE_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
