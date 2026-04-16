import { defaultSearchText } from '@/lib/admin-helpers'
import type { AdminModuleConfig } from '@/lib/admin-types'
import { collegeModules } from '@/lib/admin-modules-college'
import { examModules } from '@/lib/admin-modules-exam'
import { locationModules } from '@/lib/admin-modules-location'
import { schoolModules } from '@/lib/admin-modules-school'
import { userModules } from '@/lib/admin-modules-users'

export const adminModules: Record<string, AdminModuleConfig> = {
  ...locationModules,
  ...schoolModules,
  ...collegeModules,
  ...examModules,
  ...userModules
}

export function getAdminModuleConfig(moduleKey: string) {
  const config = adminModules[moduleKey]

  if (!config) {
    return undefined
  }

  return {
    allowCreate: true,
    allowEdit: true,
    allowDelete: true,
    pageSize: 10,
    searchText: defaultSearchText,
    ...config
  } satisfies AdminModuleConfig
}
