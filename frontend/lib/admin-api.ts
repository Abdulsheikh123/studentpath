export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

export function buildAdminUrl(path: string) {
  const normalizedBase = API_BASE.replace(/\/+$/, '')
  const normalizedPath = path.startsWith('/') ? path : `/${path}`

  if (normalizedBase.endsWith('/api') && normalizedPath.startsWith('/api/')) {
    return `${normalizedBase}${normalizedPath.slice(4)}`
  }

  return `${normalizedBase}${normalizedPath}`
}

async function parseJson(response: Response) {
  const contentType = response.headers.get('content-type')

  if (contentType?.includes('application/json')) {
    return response.json()
  }

  return null
}

export async function adminRequest<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const isFormData = init?.body instanceof FormData

  const response = await fetch(buildAdminUrl(path), {
    ...init,
    credentials: 'include',
    headers: {
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...(init?.headers || {})
    },
    cache: 'no-store'
  })

  const data = await parseJson(response)

  if (!response.ok) {
    const responseCode = (data as any)?.code as string | undefined

    if (
      (response.status === 401 || response.status === 403) &&
      !path.endsWith('/me') &&
      responseCode !== 'READ_ONLY'
    ) {
      // Only force logout on data-modifying requests (POST, PUT, DELETE) OR if specifically critical
      const isSensitiveRequest = init?.method && init.method !== 'GET';
      
      if (isSensitiveRequest && typeof window !== 'undefined' && !window.location.pathname.endsWith('/admin')) {
        window.location.href = '/admin?session=expired'
      }
    }
    throw new Error(data?.message || 'Request failed')
  }

  return data as T
}

export function getListData<T>(response: {
  data?: T[]
  items?: T[]
  pagination?: {
    total: number
    page?: number
    limit?: number
    totalPages?: number
  }
}) {
  return response.data || response.items || []
}
