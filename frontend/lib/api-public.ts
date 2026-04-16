const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

async function safeFetch<T>(url: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(url, {
      cache: 'no-store',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (!res.ok) return fallback
    return (await res.json()) as T
  } catch {
    return fallback
  }
}

export async function fetchColleges(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  return safeFetch(`${API_URL}/colleges${query}`, { data: [] })
}

export async function fetchUniversities(params?: Record<string, string>) {
  const query = params ? `?${new URLSearchParams(params).toString()}` : ''
  return safeFetch(`${API_URL}/universities${query}`, { data: [] })
}

export async function fetchStates() {
  return safeFetch(`${API_URL}/locations/states`, { data: [] })
}

export async function fetchDistricts(stateId?: number) {
  const query = stateId ? `?stateId=${stateId}` : ''
  return safeFetch(`${API_URL}/locations/districts${query}`, { data: [] })
}

export async function fetchPopularCities() {
  return safeFetch(`${API_URL}/locations/popular-cities`, { data: [] })
}
