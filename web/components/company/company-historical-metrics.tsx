'use client'

import { useEffect, useState } from 'react'

import { AlertCircle, Loader2, WifiOff } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { type MetricDataPoint, type MetricType, getCompanyHistoricalMetrics } from '@/lib/api'

// ---- Metric options ----

const METRIC_OPTIONS: { value: MetricType; label: string }[] = [
  { value: 'revenue', label: 'Ingresos' },
  { value: 'netIncome', label: 'Utilidad Neta' },
  { value: 'eps', label: 'Ganancias por Acción' },
  { value: 'totalAssets', label: 'Activos Totales' },
  { value: 'totalLiabilities', label: 'Pasivos Totales' },
]

// ---- Formatting ----

function formatPeriod(period: string): string {
  const date = new Date(period + 'T00:00:00')
  return date.toLocaleDateString('es-AR', { month: 'short', year: 'numeric' })
}

function formatCompactValue(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(1)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  return `$${value.toFixed(2)}`
}

// ---- Error states ----

function NotFoundState() {
  return (
    <div
      data-testid="company-historical-metrics-not-found"
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
      data-testid="company-historical-metrics-service-error"
      className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
      <p className="text-sm text-red-700">Servicio de EDGAR no disponible temporalmente</p>
    </div>
  )
}

function NoDataState() {
  return (
    <div
      data-testid="company-historical-metrics-no-data"
      className="flex items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 px-4 py-4"
    >
      <AlertCircle className="h-4 w-4 shrink-0 text-gray-500" aria-hidden />
      <p className="text-sm text-gray-600">Datos insuficientes para mostrar la evolución</p>
    </div>
  )
}

// ---- Main component ----

type ErrorKind = 'not-found' | 'service-error'

interface CompanyHistoricalMetricsProps {
  cik: string
}

export function CompanyHistoricalMetrics({ cik }: CompanyHistoricalMetricsProps) {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue')
  const [data, setData] = useState<MetricDataPoint[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null)

  useEffect(() => {
    if (!cik) return

    let cancelled = false

    async function fetchHistory() {
      setLoading(true)
      setData(null)
      setErrorKind(null)

      try {
        const result = await getCompanyHistoricalMetrics(cik, selectedMetric)
        if (!cancelled) setData(result)
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : ''
          if (message.includes('404') || message.toLowerCase().includes('not found')) {
            setErrorKind('not-found')
          } else {
            setErrorKind('service-error')
          }
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchHistory()

    return () => {
      cancelled = true
    }
  }, [cik, selectedMetric])

  const chartData = data?.map((pt) => ({
    period: formatPeriod(pt.period),
    value: pt.value,
  }))

  return (
    <Card
      data-testid="company-historical-metrics-panel"
      className="w-full border-l-4 border-l-[#7ec8e3]"
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4">
          <CardTitle className="text-base font-semibold text-foreground">
            Evolución Histórica
          </CardTitle>
          <Select value={selectedMetric} onValueChange={(v) => setSelectedMetric(v as MetricType)}>
            <SelectTrigger
              className="w-[200px] text-sm"
              data-testid="company-historical-metrics-selector"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {METRIC_OPTIONS.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading && (
          <div
            data-testid="company-historical-metrics-loading"
            className="flex items-center justify-center py-8"
          >
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando" />
          </div>
        )}

        {!loading && errorKind === 'not-found' && <NotFoundState />}

        {!loading && errorKind === 'service-error' && <ServiceErrorState />}

        {!loading && !errorKind && data !== null && data.length === 0 && <NoDataState />}

        {!loading && !errorKind && chartData && chartData.length > 0 && (
          <div data-testid="company-historical-metrics-content" className="pt-2">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis
                  dataKey="period"
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatCompactValue}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip
                  formatter={(value: number) => [formatCompactValue(value), '']}
                  contentStyle={{
                    fontSize: 12,
                    borderRadius: 8,
                    border: '1px solid hsl(var(--border))',
                  }}
                />
                <Bar dataKey="value" fill="#7ec8e3" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
