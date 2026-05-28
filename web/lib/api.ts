const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL

// ---- DTOs ----

export interface RegisterRequest {
  email: string
  password: string
}

export interface RegisterResponse {
  id: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
}

export interface ApiError {
  error: string
}

// ---- HTTP helper ----

async function request<T>(path: string, options: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  })

  const body = await res.json().catch(() => null)

  if (!res.ok) {
    const message = (body as ApiError)?.error ?? `HTTP ${res.status}: ${res.statusText}`
    throw new Error(message)
  }

  return body as T
}

// ---- Auth endpoints ----

export async function register(data: RegisterRequest): Promise<RegisterResponse> {
  return request<RegisterResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  return request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ---- Company search ----

export interface CompanySearchResult {
  ticker: string
  name: string
  cik: string
}

export async function searchCompanies(q: string): Promise<CompanySearchResult[]> {
  return request<CompanySearchResult[]>(`/api/companies/search?q=${encodeURIComponent(q)}`, {
    method: 'GET',
  })
}

// ---- Company metrics ----

export interface CompanyMetrics {
  revenue: number | null
  netIncome: number | null
  eps: number | null
  totalAssets: number | null
  totalLiabilities: number | null
}

export async function getCompanyMetrics(cik: string): Promise<CompanyMetrics> {
  return request<CompanyMetrics>(`/api/companies/${encodeURIComponent(cik)}/metrics`, {
    method: 'GET',
  })
}

// ---- Company filings ----

export interface Filing {
  type: string
  filingDate: string
  accessionNumber: string
}

export async function getCompanyFilings(cik: string): Promise<Filing[]> {
  return request<Filing[]>(`/api/companies/${encodeURIComponent(cik)}/filings`, {
    method: 'GET',
  })
}

// ---- Historical metrics ----

export type MetricType = 'revenue' | 'netIncome' | 'eps' | 'totalAssets' | 'totalLiabilities'

export interface MetricDataPoint {
  period: string
  value: number
}

export async function getCompanyHistoricalMetrics(
  cik: string,
  metric: MetricType,
): Promise<MetricDataPoint[]> {
  return request<MetricDataPoint[]>(
    `/api/companies/${encodeURIComponent(cik)}/metrics/historical?metric=${metric}`,
    { method: 'GET' },
  )
}

// ---- Token helpers ----

const TOKEN_KEY = 'pt_token'

export function saveToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
