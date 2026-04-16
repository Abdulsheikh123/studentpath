/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from 'react'

export type AdminOption = {
  label: string
  value: string
}

export type OptionSourceKey =
  | 'cities'
  | 'categories'
  | 'schools'
  | 'colleges'
  | 'courses'
  | 'exams'
  | 'users'

export type AdminFieldConfig = {
  name: string
  label: string
  type?: 'text' | 'textarea' | 'number' | 'url' | 'date' | 'select' | 'boolean' | 'image'
  placeholder?: string
  required?: boolean
  options?: AdminOption[]
  optionSource?: OptionSourceKey
}

export type AdminFilterConfig = {
  name: string
  label: string
  options?: AdminOption[]
  optionSource?: OptionSourceKey
  getValue: (item: any) => string
}

export type AdminColumnConfig = {
  key: string
  label: string
  render: (item: any) => ReactNode
}

export type AdminRowLink = {
  label: string
  href: (item: any) => string
}

export type AdminModuleConfig = {
  key: string
  title: string
  description: string
  endpoint: string
  listPath?: string
  fields?: AdminFieldConfig[]
  columns: AdminColumnConfig[]
  filters?: AdminFilterConfig[]
  allowCreate?: boolean
  allowEdit?: boolean
  allowDelete?: boolean
  pageSize?: number
  rowLinks?: AdminRowLink[]
  emptyState?: string
  serialize?: (
    form: Record<string, string | boolean>,
    mode: 'create' | 'edit',
    item?: any
  ) => Record<string, unknown>
  deserialize?: (item: any) => Record<string, string | boolean>
  updatePath?: (item: any) => string
  deletePath?: (item: any) => string
  searchText?: (item: any) => string
}

export type AdminNavGroup = {
  label: string
  icon: any
  items: Array<{
    label: string
    href: string
    role?: 'superAdmin' | 'institutionAdmin'
  }>
}
