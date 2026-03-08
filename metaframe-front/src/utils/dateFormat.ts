// - Role: Defines a frontend implementation unit.
// - Notes: This file supports the surrounding feature package and screen flow.

// Keep date formatting in one helper so lists and panels show the same locale style.
export function formatDateTime(input: string | null | undefined) {
  if (!input) {
    return '-'
  }

  const date = new Date(input)

  if (Number.isNaN(date.getTime())) {
    return '-'
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}
