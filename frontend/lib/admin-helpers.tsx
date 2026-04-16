/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminOption } from '@/lib/admin-types'

export function badge(text: string, tone: 'blue' | 'amber' | 'green' | 'slate' = 'slate') {
  const classes = {
    blue: 'border-cyan-400/30 bg-cyan-500/10 text-cyan-200',
    amber: 'border-amber-400/30 bg-amber-500/10 text-amber-200',
    green: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-200',
    slate: 'border-white/10 bg-white/5 text-slate-200'
  }

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${classes[tone]}`}
    >
      {text}
    </span>
  )
}

export function dateText(value: string | null | undefined) {
  if (!value) return '-'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleDateString()
}

export function currencyText(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(numeric)
}

export function numberText(value: number | string | null | undefined) {
  if (value === null || value === undefined || value === '') return '-'
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return String(value)
  return numeric.toLocaleString('en-IN')
}

export function boolLabel(value: boolean | string | null | undefined) {
  return value === true || value === 'true' ? 'Yes' : 'No'
}

export const itemTypeOptions: AdminOption[] = [
  { label: 'College', value: 'college' },
  { label: 'School', value: 'school' },
  { label: 'Exam', value: 'exam' },
  { label: 'Course', value: 'course' }
]

export function defaultSearchText(item: Record<string, any>) {
  return JSON.stringify(item).toLowerCase()
}
