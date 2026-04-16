import type { AdminModuleConfig } from '@/lib/admin-types'
import { currencyText, dateText, numberText } from '@/lib/admin-helpers'

export const examModules: Record<string, AdminModuleConfig> = {
  'exam/exams': {
    key: 'exam/exams',
    title: 'Exams',
    description: 'Manage exam profiles and jump directly to date, city, fee, eligibility, pattern, and FAQ pages.',
    endpoint: '/api/exams',
    fields: [
      { name: 'name', label: 'Name', required: true, placeholder: 'Joint Entrance Examination Main' },
      { name: 'slug', label: 'Slug', required: true, placeholder: 'jee-main' },
      { name: 'shortName', label: 'Short Name', placeholder: 'JEE Main' },
      { name: 'stream', label: 'Stream', placeholder: 'Engineering' },
      { name: 'image', label: 'Image URL', type: 'url', placeholder: 'https://...' },
      { name: 'examType', label: 'Mode', placeholder: 'Online' },
      { name: 'level', label: 'Level', placeholder: 'National' },
      { name: 'conductedBy', label: 'Conducted By', placeholder: 'NTA' },
      { name: 'applyLink', label: 'Apply Link', type: 'url', placeholder: 'https://...' },
      { name: 'officialWebsite', label: 'Official Website', type: 'url', placeholder: 'https://...' },
      { name: 'syllabusLink', label: 'Syllabus Link', type: 'url', placeholder: 'https://...' },
      { name: 'description', label: 'Description', type: 'textarea', placeholder: 'Exam overview' },
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
    rowLinks: [
      { label: 'Dates', href: (item) => `/admin/exam/dates?examId=${item.id}` },
      { label: 'Cities', href: (item) => `/admin/exam/cities?examId=${item.id}` },
      { label: 'Fees', href: (item) => `/admin/exam/fees?examId=${item.id}` },
      { label: 'Eligibility', href: (item) => `/admin/exam/eligibility?examId=${item.id}` },
      { label: 'Pattern', href: (item) => `/admin/exam/pattern?examId=${item.id}` },
      { label: 'FAQ', href: (item) => `/admin/faq?tab=exam&itemId=${item.id}` }
    ],
    columns: [
      { key: 'name', label: 'Name', render: (item) => item.name || '-' },
      { key: 'shortName', label: 'Short Name', render: (item) => item.shortName || '-' },
      { key: 'examType', label: 'Mode', render: (item) => item.examType || '-' },
      { key: 'level', label: 'Level', render: (item) => item.level || '-' },
      { key: 'conductedBy', label: 'Conducted By', render: (item) => item.conductedBy || '-' }
    ]
  },
  'exam/dates': {
    key: 'exam/dates',
    title: 'Exam Dates',
    description: 'Manage form, admit card, exam, and result milestones for exams.',
    endpoint: '/api/exam-dates',
    fields: [
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true },
      { name: 'session', label: 'Session', placeholder: 'April 2026' },
      { name: 'formStartDate', label: 'Form Start Date', type: 'date' },
      { name: 'formEndDate', label: 'Form End Date', type: 'date' },
      { name: 'correctionDate', label: 'Correction Date', type: 'date' },
      { name: 'admitCardDate', label: 'Admit Card Date', type: 'date' },
      { name: 'examDate', label: 'Exam Date', type: 'date' },
      { name: 'resultDate', label: 'Result Date', type: 'date' }
    ],
    filters: [
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      }
    ],
    columns: [
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' },
      { key: 'session', label: 'Session', render: (item) => item.session || '-' },
      { key: 'examDate', label: 'Exam Date', render: (item) => dateText(item.examDate) },
      { key: 'resultDate', label: 'Result Date', render: (item) => dateText(item.resultDate) }
    ]
  },
  'exam/cities': {
    key: 'exam/cities',
    title: 'Exam Cities',
    description: 'Map exams to the cities where they are conducted.',
    endpoint: '/api/exam-cities',
    fields: [
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true },
      { name: 'cityId', label: 'City', type: 'select', optionSource: 'cities', required: true }
    ],
    filters: [
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      },
      {
        name: 'cityId',
        label: 'City',
        optionSource: 'cities',
        getValue: (item) => String(item.city?.id || item.cityId || '')
      }
    ],
    columns: [
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' },
      { key: 'city', label: 'City', render: (item) => item.city?.name || '-' },
      { key: 'state', label: 'State', render: (item) => item.city?.state || '-' }
    ]
  },
  'exam/fees': {
    key: 'exam/fees',
    title: 'Exam Fees',
    description: 'Manage category-wise exam application fee structures.',
    endpoint: '/api/exam-fees',
    fields: [
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true },
      { name: 'categoryName', label: 'Category Name', required: true, placeholder: 'General' },
      { name: 'year', label: 'Year', type: 'number', required: true, placeholder: '2026' },
      { name: 'applicationFee', label: 'Application Fee', type: 'number', required: true, placeholder: '1000' },
      { name: 'lateFee', label: 'Late Fee', type: 'number', placeholder: '0' },
      { name: 'correctionFee', label: 'Correction Fee', type: 'number', placeholder: '0' },
      { name: 'totalFee', label: 'Total Fee', type: 'number', required: true, placeholder: '1000' },
      { name: 'notes', label: 'Notes', type: 'textarea', placeholder: 'Optional notes' }
    ],
    filters: [
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      }
    ],
    columns: [
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' },
      { key: 'categoryName', label: 'Category', render: (item) => item.categoryName || '-' },
      { key: 'year', label: 'Year', render: (item) => item.year || '-' },
      { key: 'applicationFee', label: 'Application Fee', render: (item) => currencyText(item.applicationFee) },
      { key: 'totalFee', label: 'Total Fee', render: (item) => currencyText(item.totalFee) }
    ]
  },
  'exam/eligibility': {
    key: 'exam/eligibility',
    title: 'Exam Eligibility',
    description: 'Control qualification, marks, age, and stream rules for each exam.',
    endpoint: '/api/exam-eligibilities',
    fields: [
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true },
      { name: 'qualification', label: 'Qualification', placeholder: '12th Pass' },
      { name: 'minimumMarks', label: 'Minimum Marks', placeholder: '75%' },
      { name: 'ageLimit', label: 'Age Limit', placeholder: 'No age limit' },
      { name: 'stream', label: 'Stream', placeholder: 'PCM' }
    ],
    filters: [
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      }
    ],
    columns: [
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' },
      { key: 'qualification', label: 'Qualification', render: (item) => item.qualification || '-' },
      { key: 'minimumMarks', label: 'Minimum Marks', render: (item) => item.minimumMarks || '-' },
      { key: 'ageLimit', label: 'Age Limit', render: (item) => item.ageLimit || '-' },
      { key: 'stream', label: 'Stream', render: (item) => item.stream || '-' }
    ]
  },
  'exam/pattern': {
    key: 'exam/pattern',
    title: 'Exam Pattern',
    description: 'Define exam mode, duration, sections, marks, and language by year.',
    endpoint: '/api/exam-patterns',
    fields: [
      { name: 'examId', label: 'Exam', type: 'select', optionSource: 'exams', required: true },
      { name: 'year', label: 'Year', type: 'number', required: true, placeholder: '2026' },
      { name: 'mode', label: 'Mode', placeholder: 'Computer Based Test' },
      { name: 'duration', label: 'Duration', required: true, placeholder: '3 hours' },
      { name: 'totalQuestions', label: 'Total Questions', type: 'number', required: true, placeholder: '90' },
      { name: 'totalMarks', label: 'Total Marks', type: 'number', required: true, placeholder: '300' },
      { name: 'negativeMarking', label: 'Negative Marking', type: 'boolean' },
      { name: 'language', label: 'Language', placeholder: 'English, Hindi' },
      { name: 'sections', label: 'Sections JSON', type: 'textarea', placeholder: '[{\"name\":\"Maths\",\"questions\":30}]' }
    ],
    filters: [
      {
        name: 'examId',
        label: 'Exam',
        optionSource: 'exams',
        getValue: (item) => String(item.exam?.id || item.examId || '')
      }
    ],
    columns: [
      { key: 'exam', label: 'Exam', render: (item) => item.exam?.name || '-' },
      { key: 'year', label: 'Year', render: (item) => item.year || '-' },
      { key: 'mode', label: 'Mode', render: (item) => item.mode || '-' },
      { key: 'duration', label: 'Duration', render: (item) => item.duration || '-' },
      { key: 'totalQuestions', label: 'Questions', render: (item) => numberText(item.totalQuestions) },
      { key: 'totalMarks', label: 'Marks', render: (item) => numberText(item.totalMarks) }
    ],
    serialize: (form) => ({
      ...form,
      negativeMarking: form.negativeMarking === true,
      sections: form.sections ? JSON.parse(String(form.sections)) : undefined
    }),
    deserialize: (item) => ({
      examId: String(item.examId || item.exam?.id || ''),
      year: String(item.year || ''),
      mode: String(item.mode || ''),
      duration: String(item.duration || ''),
      totalQuestions: String(item.totalQuestions || ''),
      totalMarks: String(item.totalMarks || ''),
      negativeMarking: Boolean(item.negativeMarking),
      language: String(item.language || ''),
      sections: item.sections ? JSON.stringify(item.sections, null, 2) : ''
    })
  }
}
