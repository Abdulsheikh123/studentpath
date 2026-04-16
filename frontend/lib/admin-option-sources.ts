/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AdminOption, OptionSourceKey } from '@/lib/admin-types'

export const optionSources: Record<
  OptionSourceKey,
  {
    endpoint: string
    listPath?: string
    mapOption: (item: Record<string, any>) => AdminOption
  }
> = {
  cities: {
    endpoint: '/api/cities',
    mapOption: (item) => ({
      label: item.state ? `${item.name}, ${item.state.name}` : item.name,
      value: String(item.id)
    })
  },
  categories: {
    endpoint: '/api/categories',
    mapOption: (item) => ({
      label: item.name,
      value: String(item.id)
    })
  },
  schools: {
    endpoint: '/api/schools',
    mapOption: (item) => ({
      label: item.name,
      value: String(item.id)
    })
  },
  colleges: {
    endpoint: '/api/colleges',
    mapOption: (item) => ({
      label: item.shortName ? `${item.name} (${item.shortName})` : item.name,
      value: String(item.id)
    })
  },
  courses: {
    endpoint: '/api/courses',
    mapOption: (item) => ({
      label: item.shortName ? `${item.name} (${item.shortName})` : item.name,
      value: String(item.id)
    })
  },
  exams: {
    endpoint: '/api/exams',
    mapOption: (item) => ({
      label: item.shortName ? `${item.name} (${item.shortName})` : item.name,
      value: String(item.id)
    })
  },
  users: {
    endpoint: '/api/users',
    listPath: '/api/users?limit=500',
    mapOption: (item) => ({
      label: item.email ? `${item.name} (${item.email})` : item.name,
      value: String(item.id)
    })
  }
}
