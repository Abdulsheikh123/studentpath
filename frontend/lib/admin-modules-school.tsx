import type { AdminModuleConfig } from '@/lib/admin-types'
import { currencyText, dateText } from '@/lib/admin-helpers'

export const schoolModules: Record<string, AdminModuleConfig> = {
  'school/schools': {
    key: 'school/schools',
    title: 'Schools',
    description: 'Create and maintain school records with city mapping and school profile details.',
    endpoint: '/api/schools',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Delhi Public School' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'delhi-public-school' },
      { name: 'image', label: 'School Image', type: 'image', placeholder: 'Upload school image' },
      { name: 'board', label: 'Board', placeholder: 'CBSE' },
      { name: 'type', label: 'Type', placeholder: 'Co-ed' },
      { name: 'classesFrom', label: 'Classes From', type: 'number', placeholder: '1' },
      { name: 'classesTo', label: 'Classes To', type: 'number', placeholder: '12' },
      { name: 'address', label: 'Address', placeholder: 'Full address' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://school.edu' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'School overview' },
      { name: 'cityId', label: 'City', type: 'select', optionSource: 'cities', required: true }
    ],
    filters: [
      {
        name: 'cityId',
        label: 'City',
        optionSource: 'cities',
        getValue: (item) => String(item.city?.id || item.cityId || '')
      }
    ],
    columns: [
      {
        key: 'image',
        label: 'Image',
        render: (item) =>
          item.image ? (
            <img src={item.image} alt={item.name} className="h-12 w-12 rounded-2xl object-cover" />
          ) : (
            '-'
          )
      },
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'board', label: 'Board', render: (item) => item.board || '-' },
      { key: 'type', label: 'Type', render: (item) => item.type || '-' },
      { key: 'city', label: 'City', render: (item) => item.city?.name || '-' },
      {
        key: 'website',
        label: 'Website',
        render: (item) =>
          item.website ? (
            <a href={item.website} target="_blank" rel="noreferrer" className="text-cyan-300 underline-offset-4 hover:underline">
              Visit
            </a>
          ) : (
            '-'
          )
      }
    ]
  },
  'school/admissions': {
    key: 'school/admissions',
    title: 'School Admissions',
    description: 'Track admission windows, eligibility, and exam dates for schools.',
    endpoint: '/api/school-admissions',
    fields: [
      { name: 'schoolId', label: 'School', type: 'select', optionSource: 'schools', required: true },
      { name: 'admissionClass', label: 'Class', required: true, placeholder: 'Class 11' },
      { name: 'examName', label: 'Exam Name', placeholder: 'Entrance Test' },
      { name: 'eligibility', label: 'Eligibility', placeholder: 'Any board' },
      { name: 'ageLimit', label: 'Age Limit', placeholder: '14-16 years' },
      { name: 'formStartDate', label: 'Form Start Date', type: 'date' },
      { name: 'formEndDate', label: 'Form End Date', type: 'date' },
      { name: 'examDate', label: 'Exam Date', type: 'date' }
    ],
    filters: [
      {
        name: 'schoolId',
        label: 'School',
        optionSource: 'schools',
        getValue: (item) => String(item.school?.id || item.schoolId || '')
      }
    ],
    columns: [
      { key: 'school', label: 'School', render: (item) => item.school?.name || '-' },
      { key: 'class', label: 'Class', render: (item) => item.admissionClass || '-' },
      { key: 'examName', label: 'Exam', render: (item) => item.examName || '-' },
      { key: 'eligibility', label: 'Eligibility', render: (item) => item.eligibility || '-' },
      { key: 'examDate', label: 'Exam Date', render: (item) => dateText(item.examDate) }
    ]
  },
  'school/fees': {
    key: 'school/fees',
    title: 'School Fees',
    description: 'Manage class-wise school fee slabs and fee-type breakdowns.',
    endpoint: '/api/school-fees',
    fields: [
      { name: 'schoolId', label: 'School', type: 'select', optionSource: 'schools', required: true },
      { name: 'className', label: 'Class', required: true, placeholder: 'Class 8' },
      { name: 'admissionFee', label: 'Admission Fee', type: 'number', placeholder: '25000' },
      { name: 'tuitionFee', label: 'Tuition Fee', type: 'number', placeholder: '80000' },
      { name: 'annualFee', label: 'Annual Fee', type: 'number', placeholder: '12000' },
      { name: 'hostelFee', label: 'Hostel Fee', type: 'number', placeholder: '0' },
      { name: 'transportFee', label: 'Transport Fee', type: 'number', placeholder: '0' },
      { name: 'feesType', label: 'Fees Type', placeholder: 'Yearly' }
    ],
    filters: [
      {
        name: 'schoolId',
        label: 'School',
        optionSource: 'schools',
        getValue: (item) => String(item.school?.id || item.schoolId || '')
      }
    ],
    columns: [
      { key: 'school', label: 'School', render: (item) => item.school?.name || '-' },
      { key: 'className', label: 'Class', render: (item) => item.className || '-' },
      { key: 'feesType', label: 'Fees Type', render: (item) => item.feesType || '-' },
      { key: 'admissionFee', label: 'Admission Fee', render: (item) => currencyText(item.admissionFee) },
      { key: 'tuitionFee', label: 'Tuition Fee', render: (item) => currencyText(item.tuitionFee) }
    ]
  }
}
