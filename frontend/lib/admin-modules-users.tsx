import type { AdminModuleConfig } from '@/lib/admin-types'
import { badge, dateText, itemTypeOptions } from '@/lib/admin-helpers'

export const userModules: Record<string, AdminModuleConfig> = {
  'users/users': {
    key: 'users/users',
    title: 'Users',
    description: 'Review Google-authenticated users and update profile metadata.',
    endpoint: '/api/users',
    listPath: '/api/users?limit=500',
    allowCreate: false,
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Student name' },
      { name: 'profileImage', label: 'Profile Image', type: 'url', placeholder: 'https://...' }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'email', label: 'Email', render: (item) => item.email || '-' },
      { key: 'googleId', label: 'Google ID', render: (item) => item.googleId || '-' },
      { key: 'createdAt', label: 'Joined', render: (item) => dateText(item.createdAt) }
    ]
  },
  'users/contact-requests': {
    key: 'users/contact-requests',
    title: 'Contact Requests',
    description: 'Track incoming support messages and update their status.',
    endpoint: '/api/contact-requests',
    allowCreate: false,
    fields: [
      {
        name: 'status',
        label: 'Status',
        type: 'select',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Resolved', value: 'resolved' },
          { label: 'Rejected', value: 'rejected' }
        ],
        required: true
      }
    ],
    filters: [
      {
        name: 'status',
        label: 'Status',
        options: [
          { label: 'Pending', value: 'pending' },
          { label: 'In Progress', value: 'in_progress' },
          { label: 'Resolved', value: 'resolved' },
          { label: 'Rejected', value: 'rejected' }
        ],
        getValue: (item) => String(item.status || '')
      }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'email', label: 'Email', render: (item) => item.email || '-' },
      { key: 'phone', label: 'Phone', render: (item) => item.phone || '-' },
      { key: 'subject', label: 'Subject', render: (item) => item.subject || '-' },
      {
        key: 'status',
        label: 'Status',
        render: (item) =>
          badge(
            String(item.status || 'pending').replace('_', ' '),
            item.status === 'resolved'
              ? 'green'
              : item.status === 'in_progress'
                ? 'blue'
                : 'amber'
          )
      }
    ],
    updatePath: (item) => `/api/contact-requests/${item.id}/status`,
    serialize: (form) => ({
      status: form.status
    })
  },
  'users/comments': {
    key: 'users/comments',
    title: 'Comments',
    description: 'Moderate and correct user-submitted comments tied to colleges, schools, exams, and courses.',
    endpoint: '/api/comments',
    allowCreate: false,
    fields: [
      { name: 'userId', label: 'User', type: 'select', optionSource: 'users', required: true },
      { name: 'itemType', label: 'Item Type', type: 'select', options: itemTypeOptions, required: true },
      { name: 'itemId', label: 'Item ID', type: 'number', required: true, placeholder: '12' },
      { name: 'message', label: 'Message', type: 'textarea', required: true, placeholder: 'Comment text' }
    ],
    filters: [
      {
        name: 'itemType',
        label: 'Item Type',
        options: itemTypeOptions,
        getValue: (item) => String(item.itemType || '')
      }
    ],
    columns: [
      { key: 'user', label: 'User', render: (item) => item.user?.name || '-' },
      { key: 'itemType', label: 'Item Type', render: (item) => item.itemType || '-' },
      { key: 'itemId', label: 'Item ID', render: (item) => item.itemId || '-' },
      { key: 'message', label: 'Message', render: (item) => item.message || '-' },
      { key: 'createdAt', label: 'Created', render: (item) => dateText(item.createdAt) }
    ]
  },
  'users/ratings': {
    key: 'users/ratings',
    title: 'Ratings',
    description: 'Review user ratings across supported content items.',
    endpoint: '/api/ratings',
    allowCreate: false,
    allowEdit: false,
    fields: [],
    columns: [
      { key: 'user', label: 'User', render: (item) => item.user?.name || '-' },
      { key: 'rating', label: 'Rating', render: (item) => item.rating || '-' },
      { key: 'itemType', label: 'Item Type', render: (item) => item.itemType || '-' },
      { key: 'itemId', label: 'Item ID', render: (item) => item.itemId || '-' },
      { key: 'createdAt', label: 'Created', render: (item) => dateText(item.createdAt) }
    ]
  },
  'users/search-history': {
    key: 'users/search-history',
    title: 'Search History',
    description: 'Inspect user search behaviour and remove invalid query entries.',
    endpoint: '/api/search-history',
    allowCreate: false,
    allowEdit: false,
    fields: [],
    columns: [
      { key: 'user', label: 'User', render: (item) => item.user?.name || '-' },
      { key: 'keyword', label: 'Keyword', render: (item) => item.keyword || '-' },
      { key: 'itemType', label: 'Item Type', render: (item) => item.itemType || '-' },
      { key: 'createdAt', label: 'Created', render: (item) => dateText(item.createdAt) }
    ]
  }
}
