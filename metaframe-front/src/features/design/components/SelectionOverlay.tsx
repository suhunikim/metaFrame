// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

// SelectionOverlay keeps the current node focus visible even when nested containers get dense.
export function SelectionOverlay() {
  return <div className="design-canvas__selection-badge">Selected</div>
}
