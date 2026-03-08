// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

export type ManagedFileKind = 'folder' | 'file'

export type ManagedFileType = 'general' | 'page' | 'layout' | 'system'

// - Role: Fix the shared managed file tree contract for the whole IDE.
// - Notes: Mock data and API-backed data use the same shape so type duplication stays out.
export interface ManagedFileNode {
  id: string
  name: string
  path: string
  extension: string | null
  kind: ManagedFileKind
  managedType: ManagedFileType | 'folder'
  isProtected: boolean
  isDeleted: boolean
  children?: ManagedFileNode[]
}
