/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  BookOpen,
  Building2,
  CircleHelp,
  FileClock,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MapPinned,
  MessageSquare,
  School,
  Search,
  Tags,
  UserCog,
  Users
} from 'lucide-react'

import type { AdminNavGroup } from '@/lib/admin-types'
import { getPartnerDashboardPath } from '@/lib/admin-paths'

export const adminNavGroups: AdminNavGroup[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    items: [
      { label: 'Overview', href: '/admin/dashboard' },
      { label: 'Approvals', href: '/admin/approvals', role: 'superAdmin' },
      { label: 'Partners', href: '/admin/partners', role: 'superAdmin' }
    ]
  },
  {
    label: 'Location',
    icon: MapPinned,
    items: [
      { label: 'Cities', href: '/admin/location/cities' },
      { label: 'Categories', href: '/admin/location/categories' }
    ]
  },
  {
    label: 'School',
    icon: School,
    items: [
      { label: 'Schools', href: '/admin/school/schools' },
      { label: 'School Admissions', href: '/admin/school/admissions' },
      { label: 'School Fees', href: '/admin/school/fees' }
    ]
  },
  {
    label: 'College',
    icon: Building2,
    items: [
      { label: 'Colleges', href: '/admin/college/colleges' },
      { label: 'Courses', href: '/admin/college/courses' },
      { label: 'College Courses', href: '/admin/college/college-courses' },
      { label: 'College Exams', href: '/admin/college/exams' },
      { label: 'College Placements', href: '/admin/college/placements' }
    ]
  },
  {
    label: 'Exam',
    icon: GraduationCap,
    items: [
      { label: 'Exams', href: '/admin/exam/exams' },
      { label: 'Exam Dates', href: '/admin/exam/dates' },
      { label: 'Exam Cities', href: '/admin/exam/cities' },
      { label: 'Exam Fees', href: '/admin/exam/fees' },
      { label: 'Exam Eligibility', href: '/admin/exam/eligibility' },
      { label: 'Exam Pattern', href: '/admin/exam/pattern' }
    ]
  },
  {
    label: 'FAQ',
    icon: CircleHelp,
    items: [
      { label: 'College FAQ', href: '/admin/faq?tab=college' },
      { label: 'School FAQ', href: '/admin/faq?tab=school' },
      { label: 'Exam FAQ', href: '/admin/faq?tab=exam' },
      { label: 'Course FAQ', href: '/admin/faq?tab=course' }
    ]
  },
  {
    label: 'Users',
    icon: Users,
    items: [
      { label: 'Users', href: '/admin/users/users' },
      { label: 'Contact Requests', href: '/admin/users/contact-requests' },
      { label: 'Comments', href: '/admin/users/comments' },
      { label: 'Ratings', href: '/admin/users/ratings' },
      { label: 'Search History', href: '/admin/users/search-history' }
    ]
  },
  {
    label: 'Admin',
    icon: UserCog,
    items: [{ label: 'Profile', href: '/admin/admin/profile' }]
  }
]

export function getFilteredNavGroups(role: 'superAdmin' | 'institutionAdmin' | null, institutionType?: string): AdminNavGroup[] {
  if (!role) return [];

  const prefix = role === 'superAdmin' ? '/admin/super' : '/admin/partner';

  const groups = role === 'superAdmin' 
    ? adminNavGroups 
    : adminNavGroups.filter(group => {
        if (group.label === 'Dashboard' || group.label === 'Admin' || group.label === 'FAQ') return true;
        if (institutionType && group.label.toLowerCase().includes(institutionType.toLowerCase())) return true;
        if (institutionType === 'University' || institutionType === 'College' || institutionType === 'StandaloneInstitute') {
           if (group.label === 'College') return true;
        }
        return false;
      });

  // Transform hrefs to include role prefix
  return groups.map(group => ({
    ...group,
    items: group.items
      .filter(item => !item.role || item.role === role)
      .map(item => {
        // Special case: if href already has the prefix, don't add it again
        let href = item.href;
        if (href.startsWith('/admin/dashboard')) {
            href =
              role === 'superAdmin'
                ? `${prefix}/dashboard`
                : getPartnerDashboardPath(institutionType);
        } else if (href.startsWith('/admin/approvals')) {
            href = `${prefix}/approvals`;
        } else if (href.startsWith('/admin/faq')) {
            href = href.replace('/admin/faq', `${prefix}/faq`);
        } else {
            // Standard replacement: /admin/xyz -> /admin/super/xyz
            href = href.replace('/admin/', `${prefix}/`);
        }
        
        return { ...item, href };
      })
  }));
}

export function getAdminPrefix(role: 'superAdmin' | 'institutionAdmin' | null) {
  if (!role) return '/admin';
  return role === 'superAdmin' ? '/admin/super' : '/admin/partner';
}

export const adminQuickLinks = (role: any) => {
  const prefix = getAdminPrefix(role);
  return {
    profile: {
      href: `${prefix}/admin/profile`,
      label: 'Profile',
      icon: UserCog
    },
    logout: {
      href: '#logout',
      label: 'Logout',
      icon: LogOut
    }
  }
}

export const adminOverviewCards = [
  {
    label: 'Total Schools',
    endpoint: '/api/schools',
    href: '/admin/school/schools',
    icon: School
  },
  {
    label: 'Total Colleges',
    endpoint: '/api/colleges',
    href: '/admin/college/colleges',
    icon: Building2
  },
  {
    label: 'Total Courses',
    endpoint: '/api/courses',
    href: '/admin/college/courses',
    icon: BookOpen
  },
  {
    label: 'Total Exams',
    endpoint: '/api/exams',
    href: '/admin/exam/exams',
    icon: GraduationCap
  },
  {
    label: 'Total Users',
    endpoint: '/api/users?limit=500',
    href: '/admin/users/users',
    icon: Users
  },
  {
    label: 'Total FAQs',
    endpoint: '/api/faqs',
    href: '/admin/faq',
    icon: CircleHelp
  }
] as const

export const adminOverviewLists = [
  {
    title: 'Latest Colleges',
    endpoint: '/api/colleges',
    icon: Building2,
    render: (item: Record<string, any>) => `${item.name} ${item.city?.name ? `- ${item.city.name}` : ''}`
  },
  {
    title: 'Latest Schools',
    endpoint: '/api/schools',
    icon: School,
    render: (item: Record<string, any>) => `${item.name} ${item.city?.name ? `- ${item.city.name}` : ''}`
  },
  {
    title: 'Latest Contact Requests',
    endpoint: '/api/contact-requests',
    icon: FileClock,
    render: (item: Record<string, any>) => `${item.name} ${item.subject ? `- ${item.subject}` : ''}`
  }
] as const

export const adminUserSectionMeta = [
  { label: 'Comments', href: '/admin/users/comments', icon: MessageSquare },
  { label: 'Ratings', href: '/admin/users/ratings', icon: Tags },
  { label: 'Search History', href: '/admin/users/search-history', icon: Search }
]
