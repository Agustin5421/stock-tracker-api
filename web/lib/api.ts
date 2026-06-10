const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'

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

// ---- Prices ----

export interface LatestPrice {
  ticker: string
  price: number
  fetchedAt: string
}

// Tickers that currently have a stored price (i.e. are buyable). Public endpoint.
export async function getAvailablePrices(): Promise<LatestPrice[]> {
  return request<LatestPrice[]>('/api/prices', { method: 'GET' })
}

// ---- Portfolio ----

export interface RegisterPurchaseRequest {
  ticker: string
  quantity: number
}

export interface RegisterPurchaseResponse {
  ticker: string
  quantity: number
  priceUsed: number
}

export async function registerPurchase(
  data: RegisterPurchaseRequest,
): Promise<RegisterPurchaseResponse> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/api/portfolio/purchases`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })
  if (res.status === 401) handleUnauthorized()
  if (res.status === 422) {
    throw new Error('No hay precio disponible para este ticker. Actualizá los precios primero.')
  }
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((body as ApiError)?.error ?? `HTTP ${res.status}: ${res.statusText}`)
  }
  return body as RegisterPurchaseResponse
}

// ---- Sales ----

export interface RegisterSaleRequest {
  ticker: string
  quantity: number
}

export interface RegisterSaleResponse {
  ticker: string
  // Remaining quantity in the position after the sale.
  quantity: number
  priceUsed: number
}

export async function registerSale(data: RegisterSaleRequest): Promise<RegisterSaleResponse> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/api/portfolio/sales`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(data),
  })
  if (res.status === 401) handleUnauthorized()
  const body = await res.json().catch(() => null)
  if (res.status === 422) {
    // 422 can mean either no stored price or insufficient shares / no position.
    // Prefer the API's message; fall back to a generic Spanish one.
    throw new Error(
      (body as ApiError)?.error ??
        'No se pudo registrar la venta (precio no disponible o acciones insuficientes).',
    )
  }
  if (!res.ok) {
    throw new Error((body as ApiError)?.error ?? `HTTP ${res.status}: ${res.statusText}`)
  }
  return body as RegisterSaleResponse
}

// ---- Portfolio state ----

export interface PortfolioPosition {
  ticker: string
  quantity: number
  // null when the ticker has no stored price yet.
  latestPrice: number | null
  currentValue: number | null
}

export interface Portfolio {
  positions: PortfolioPosition[]
  totalValue: number
}

export async function getPortfolio(): Promise<Portfolio> {
  const token = getToken()
  const res = await fetch(`${API_BASE_URL}/api/portfolio`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
  if (res.status === 401) handleUnauthorized()
  const body = await res.json().catch(() => null)
  if (!res.ok) {
    throw new Error((body as ApiError)?.error ?? `HTTP ${res.status}: ${res.statusText}`)
  }
  return body as Portfolio
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

export class SessionExpiredError extends Error {
  readonly isSessionExpired = true
  constructor() {
    super('Tu sesión expiró. Por favor iniciá sesión nuevamente.')
  }
}

export function handleUnauthorized(): never {
  clearToken()
  import('sonner').then(({ toast }) => {
    toast.error('Tu sesión expiró', {
      description: 'Por favor iniciá sesión nuevamente.',
      duration: 3000,
    })
  })
  setTimeout(() => {
    window.location.hash = '#/login'
  }, 3000)
  throw new SessionExpiredError()
}
