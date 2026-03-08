// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import { apiRequest } from '@/shared/api/apiClient'
import { DEV_LOGIN_BYPASS_ENABLED } from '@/shared/dev/devMode'
import { getDevVersionCatalog } from '@/shared/dev/devProjectData'
import type { VersionCatalog } from '@/types/project.types'

export function getVersionCatalog() {
  if (DEV_LOGIN_BYPASS_ENABLED) {
    return Promise.resolve(getDevVersionCatalog())
  }

  return apiRequest<VersionCatalog>('/api/projects/version-catalog')
}
