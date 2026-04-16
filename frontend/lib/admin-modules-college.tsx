import type { AdminModuleConfig } from '@/lib/admin-types'
import { currencyText, numberText } from '@/lib/admin-helpers'

export const collegeModules: Record<string, AdminModuleConfig> = {
  'college/colleges': {
    key: 'college/colleges',
    title: 'Colleges',
    description: 'Manage college profiles, ownership, and classification details.',
    endpoint: '/api/colleges',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Indian Institute of Technology Delhi' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'iit-delhi' },
      { name: 'image', label: 'College Image', type: 'image', placeholder: 'Upload college image' },
      { name: 'shortName', label: 'Short Name', placeholder: 'IITD' },
      { name: 'institutionType', label: 'Institution Type', placeholder: 'University' },
      { name: 'ownership', label: 'Ownership', placeholder: 'Government' },
      { name: 'affiliation', label: 'Affiliation', placeholder: 'UGC' },
      { name: 'establishedYear', label: 'Established Year', type: 'number', placeholder: '1961' },
      { name: 'website', label: 'Website', type: 'url', placeholder: 'https://college.edu' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'College overview' },
      { name: 'cityId', label: 'City', type: 'select', optionSource: 'cities', required: true },
      { name: 'categoryId', label: 'Category', type: 'select', optionSource: 'categories', required: true }
    ],
    filters: [
      {
        name: 'cityId',
        label: 'City',
        optionSource: 'cities',
        getValue: (item) => String(item.city?.id || item.cityId || '')
      },
      {
        name: 'categoryId',
        label: 'Category',
        optionSource: 'categories',
        getValue: (item) => String(item.category?.id || item.categoryId || '')
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
      { key: 'shortName', label: 'Short Name', render: (item) => item.shortName || '-' },
      { key: 'city', label: 'City', render: (item) => item.city?.name || '-' },
      { key: 'category', label: 'Category', render: (item) => item.category?.name || '-' },
      { key: 'institutionType', label: 'Institution Type', render: (item) => item.institutionType || '-' },
      { key: 'ownership', label: 'Ownership', render: (item) => item.ownership || '-' },
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
  'college/courses': {
    key: 'college/courses',
    title: 'Courses',
    description: 'Maintain course metadata used across colleges and FAQs.',
    endpoint: '/api/courses',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Bachelor of Technology' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'bachelor-of-technology' },
      { name: 'shortName', label: 'Short Name', placeholder: 'B.Tech' },
      { name: 'duration', label: 'Duration', placeholder: '4 Years' },
      { name: 'level', label: 'Level', placeholder: 'Undergraduate' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Course overview' },
      { name: 'categoryId', label: 'Category', type: 'select', optionSource: 'categories', required: true }
    ],
    filters: [
      {
        name: 'categoryId',
        label: 'Category',
        optionSource: 'categories',
        getValue: (item) => String(item.category?.id || item.categoryId || '')
      }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'shortName', label: 'Short Name', render: (item) => item.shortName || '-' },
      { key: 'category', label: 'Category', render: (item) => item.category?.name || '-' },
      { key: 'duration', label: 'Duration', render: (item) => item.duration || '-' },
      { key: 'level', label: 'Level', render: (item) => item.level || '-' }
    ]
  },
  'college/college-courses': {
    key: 'college/college-courses',
    title: 'College Courses',
    description: 'Map courses to colleges with fee, seats, and admission mode details.',
    endpoint: '/api/college-courses',
    fields: [
      { name: 'collegeId', label: 'College', type: 'select', optionSource: 'colleges', required: true },
      { name: 'courseId', label: 'Course', type: 'select', optionSource: 'courses', required: true },
      { name: 'fees', label: 'Fees', type: 'number', placeholder: '175000' },
      { name: 'feesType', label: 'Fees Type', placeholder: 'Semester' },
      { name: 'seats', label: 'Seats', type: 'number', placeholder: '120' },
      { name: 'admissionMode', label: 'Admission Mode', placeholder: 'Entrance Exam' }
    ],
    filters: [
      {
        name: 'collegeId',
        label: 'College',
        optionSource: 'colleges',
        getValue: (item) => String(item.college?.id || item.collegeId || '')
      },
      {
        name: 'courseId',
        label: 'Course',
        optionSource: 'courses',
        getValue: (item) => String(item.course?.id || item.courseId || '')
      }
    ],
    columns: [
      { key: 'college', label: 'College', render: (item) => item.college?.name || '-' },
      { key: 'course', label: 'Course', render: (item) => item.course?.name || '-' },
      { key: 'fees', label: 'Fees', render: (item) => currencyText(item.fees) },
      { key: 'feesType', label: 'Fees Type', render: (item) => item.feesType || '-' },
      { key: 'seats', label: 'Seats', render: (item) => numberText(item.seats) },
      { key: 'admissionMode', label: 'Admission Mode', render: (item) => item.admissionMode || '-' }
    ]
  },
  'college/exams': {
    key: 'college/exams',
    title: 'College Exams',
    description: 'Map colleges and courses to the entrance exams they accept.',
    endpoint: '/api/college-exams',
    fields: [
      { name: 'collegeId', label: 'College', type: 'select', optionSource: 'colleges', required: true },
      { name: 'courseId', label: 'Course', type: 'select', optionSource: 'courses', required: true },
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true }
    ],
    filters: [
      {
        name: 'collegeId',
        label: 'College',
        optionSource: 'colleges',
        getValue: (item) => String(item.college?.id || item.collegeId || '')
      },
      {
        name: 'courseId',
        label: 'Course',
        optionSource: 'courses',
        getValue: (item) => String(item.course?.id || item.courseId || '')
      },
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      }
    ],
    columns: [
      { key: 'college', label: 'College', render: (item) => item.college?.name || '-' },
      { key: 'course', label: 'Course', render: (item) => item.course?.name || '-' },
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' }
    ]
  },
  'college/placements': {
    key: 'college/placements',
    title: 'College Placements',
    description: 'Maintain highest package, average package, and placement ratio for colleges.',
    endpoint: '/api/placements',
    fields: [
      { name: 'collegeId', label: 'College', type: 'select', optionSource: 'colleges', required: true },
      { name: 'highestPackage', label: 'Highest Package', type: 'number', placeholder: '4200000' },
      { name: 'averagePackage', label: 'Average Package', type: 'number', placeholder: '1800000' },
      { name: 'placementPercent', label: 'Placement Percent', type: 'number', placeholder: '92' },
      { name: 'topRecruiters', label: 'Top Recruiters', type: 'textarea', placeholder: 'Google, Microsoft, Amazon' }
    ],
    filters: [
      {
        name: 'collegeId',
        label: 'College',
        optionSource: 'colleges',
        getValue: (item) => String(item.college?.id || item.collegeId || '')
      }
    ],
    columns: [
      { key: 'college', label: 'College', render: (item) => item.college?.name || '-' },
      { key: 'highestPackage', label: 'Highest Package', render: (item) => currencyText(item.highestPackage) },
      { key: 'averagePackage', label: 'Average Package', render: (item) => currencyText(item.averagePackage) },
      { key: 'placementPercent', label: 'Placement %', render: (item) => (item.placementPercent ? `${item.placementPercent}%` : '-') },
      { key: 'topRecruiters', label: 'Top Recruiters', render: (item) => item.topRecruiters || '-' }
    ]
  }
}
