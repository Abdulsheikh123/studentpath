import type { AdminModuleConfig } from '@/lib/admin-types'
import { badge, boolLabel } from '@/lib/admin-helpers'

export const locationModules: Record<string, AdminModuleConfig> = {
  'location/cities': {
    key: 'location/cities',
    title: 'Cities',
    description: 'Manage city names, states, slugs, and SEO details.',
    endpoint: '/api/cities',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Mumbai' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'mumbai' },
      { name: 'state', label: 'State', placeholder: 'Maharashtra' },
      { name: 'isPopular', label: 'Popular City', type: 'boolean' },
      { name: 'metaTitle', label: 'Meta Title', placeholder: 'Mumbai Schools, Colleges & Exams' },
      { name: 'metaDescription', label: 'Meta Description', type: 'textarea', placeholder: 'SEO description' }
    ],
    filters: [
      {
        name: 'isPopular',
        label: 'Popular',
        options: [
          { label: 'All', value: '' },
          { label: 'Popular', value: 'true' },
          { label: 'Regular', value: 'false' }
        ],
        getValue: (item) => String(Boolean(item.isPopular))
      }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'slug', label: 'Slug', render: (item) => item.slug || '-' },
      { key: 'state', label: 'State', render: (item) => item.state || '-' },
      {
        key: 'isPopular',
        label: 'Popular',
        render: (item) => badge(boolLabel(item.isPopular), item.isPopular ? 'green' : 'slate')
      }
    ],
    serialize: (form) => ({
      ...form,
      isPopular: form.isPopular === true
    })
  },
  'location/categories': {
    key: 'location/categories',
    title: 'Categories',
    description: 'Control category records shared across colleges, courses, and exams.',
    endpoint: '/api/categories',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Engineering' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'engineering' }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'slug', label: 'Slug', render: (item) => item.slug || '-' }
    ]
  }
}
