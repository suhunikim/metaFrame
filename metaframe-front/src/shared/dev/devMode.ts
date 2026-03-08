// - Role: Defines local-development runtime flags.
// - Notes: This file keeps small dev-only bypass switches out of feature logic.

export const DEV_LOGIN_BYPASS_ENABLED =
  import.meta.env.DEV && import.meta.env.VITE_METAFRAME_BYPASS_LOGIN !== 'false'
