'use client'

import { useEffect, useState } from 'react'

import { AlertCircle, Loader2, WifiOff } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type CompanyMetrics, getCompanyMetrics } from '@/lib/api'

// ---- Formatting helpers ----

function formatCompactUSD(value: number): string {
  if (Math.abs(value) >= 1e12) {
    return `$${(value / 1e12).toFixed(1)}T`
  }
  if (Math.abs(value) >= 1e9) {
    return `$${(value / 1e9).toFixed(1)}B`
  }
  if (Math.abs(value) >= 1e6) {
    return `$${(value / 1e6).toFixed(1)}M`
  }
  return `$${value.toLocaleString('en-US')}`
}

function formatEPS(value: number): string {
  return `$${value.toFixed(2)}`
}

// ---- Metric row ----

interface MetricRowProps {
  label: string
  value: number | null
  formatter: (v: number) => string
}

function MetricRow({ label, value, formatter }: MetricRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-lg bg-muted/30 px-4 py-3">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="font-semibold text-foreground tabular-nums">
        {value !== null ? formatter(value) : <span className="text-muted-foreground">N/A</span>}
      </span>
    </div>
  )
}

// ---- Error states ----

function NotFoundState() {
  return (
    <div
      data-testid="company-metrics-not-found"
      className="flex items-center gap-3 rounded-lg border border-amber-200 bg-amber-50 px-4 py-4"
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-amber-600" aria-hidden />
      <p className="text-sm text-amber-700">Información no disponible en EDGAR</p>
    </div>
  )
}

function ServiceErrorState() {
  return (
    <div
      data-testid="company-metrics-service-error"
      className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
      <p className="text-sm text-red-700">Servicio de EDGAR no disponible temporalmente</p>
    </div>
  )
}

// ---- Main component ----

type ErrorKind = 'not-found' | 'service-error'

interface CompanyMetricsProps {
  cik: string
}

export function CompanyMetrics({ cik }: CompanyMetricsProps) {
  const [metrics, setMetrics] = useState<CompanyMetrics | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null)

  useEffect(() => {
    if (!cik) return

    let cancelled = false

    async function fetchMetrics() {
      setLoading(true)
      setMetrics(null)
      setErrorKind(null)

      try {
        const data = await getCompanyMetrics(cik)
        if (!cancelled) {
          setMetrics(data)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : ''
          // 404 → company not in EDGAR; anything else → service error
          if (message.includes('404') || message.toLowerCase().includes('not found')) {
            setErrorKind('not-found')
          } else {
            setErrorKind('service-error')
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    fetchMetrics()

    return () => {
      cancelled = true
    }
  }, [cik])

  return (
    <Card data-testid="company-metrics-panel" className="w-full border-l-4 border-l-[#c38f42]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Métricas Financieras
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading && (
          <div
            data-testid="company-metrics-loading"
            className="flex items-center justify-center py-8"
          >
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando" />
          </div>
        )}

        {!loading && errorKind === 'not-found' && <NotFoundState />}

        {!loading && errorKind === 'service-error' && <ServiceErrorState />}

        {!loading && metrics && (
          <div data-testid="company-metrics-content" className="space-y-2">
            <MetricRow label="Ingresos" value={metrics.revenue} formatter={formatCompactUSD} />
            <MetricRow
              label="Utilidad Neta"
              value={metrics.netIncome}
              formatter={formatCompactUSD}
            />
            <MetricRow label="Ganancias por Acción" value={metrics.eps} formatter={formatEPS} />
            <MetricRow
              label="Activos Totales"
              value={metrics.totalAssets}
              formatter={formatCompactUSD}
            />
            <MetricRow
              label="Pasivos Totales"
              value={metrics.totalLiabilities}
              formatter={formatCompactUSD}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
