// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

import type { CanonicalNodeModel } from '@/types/canonical-model'
import type { ManagedFileNode } from '@/types/file-tree.types'

interface CurrentPathBreadcrumbProps {
  fileTrail: ManagedFileNode[]
  nodeTrail: CanonicalNodeModel[]
}

// Breadcrumb rendering is split out so file and node path rules stay readable.
export function CurrentPathBreadcrumb({ fileTrail, nodeTrail }: CurrentPathBreadcrumbProps) {
  return (
    <div className="status-bar__section status-bar__section--trail">
      <div className="status-bar__trail">
        {fileTrail.map((node, index) => (
          <span key={node.id} className="status-bar__trail-item">
            {index > 0 ? <span className="status-bar__trail-separator">/</span> : null}
            <span>{node.name}</span>
          </span>
        ))}
      </div>

      {nodeTrail.length > 0 ? (
        <div className="status-bar__trail status-bar__trail--nodes">
          {nodeTrail.map((node, index) => (
            <span key={node.id} className="status-bar__trail-item">
              {index > 0 ? <span className="status-bar__trail-separator">{'>'}</span> : null}
              <span>{node.name}</span>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  )
}
