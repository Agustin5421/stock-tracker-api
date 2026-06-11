'use client'

import { useEffect, useMemo, useState } from 'react'

import { Loader2 } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type CompanyMetrics, type WatchlistItemResponse, getCompanyMetrics } from '@/lib/api'

interface WatchlistComparisonProps {
  ciks: string[]
  watchlistItems: WatchlistItemResponse[]
}

interface FetchResult {
  metrics: CompanyMetrics | null
  loading: boolean
  error: string | null
}

function formatCompactUSD(value: number): string {
  if (Math.abs(value) >= 1e12) return `$${(value / 1e12).toFixed(1)}T`
  if (Math.abs(value) >= 1e9) return `$${(value / 1e9).toFixed(1)}B`
  if (Math.abs(value) >= 1e6) return `$${(value / 1e6).toFixed(1)}M`
  return `$${value.toLocaleString('en-US')}`
}

function formatEPS(value: number): string {
  return `$${value.toFixed(2)}`
}

export function WatchlistComparison({ ciks, watchlistItems }: WatchlistComparisonProps) {
  const [results, setResults] = useState<Record<string, FetchResult>>({})

  useEffect(() => {
    if (ciks.length === 0) return

    let cancelled = false

    ciks.forEach(async (cik) => {
      try {
        const metrics = await getCompanyMetrics(cik)
        if (!cancelled) {
          setResults((prev) => ({
            ...prev,
            [cik]: { metrics, loading: false, error: null },
          }))
        }
      } catch (err) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error de carga'
          const readableError = message.includes('404')
            ? 'No disponible en EDGAR'
            : 'Error del servidor EDGAR'
          setResults((prev) => ({
            ...prev,
            [cik]: { metrics: null, loading: false, error: readableError },
          }))
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [ciks])

  const data = useMemo(
    () =>
      ciks.map((cik) => {
        const item = watchlistItems.find((i) => i.cik === cik)
        const result = results[cik] ?? { metrics: null, loading: true, error: null }
        return {
          cik,
          ticker: item?.ticker ?? 'Unknown',
          name: item?.name ?? 'Unknown Company',
          ...result,
        }
      }),
    [ciks, watchlistItems, results],
  )

  if (ciks.length === 0) return null

  const renderCell = (
    item: (typeof data)[number],
    value: number | null | undefined,
    formatter: (v: number) => string,
  ) => {
    if (item.loading)
      return <Loader2 className="inline h-4 w-4 animate-spin text-muted-foreground" />
    if (item.error)
      return (
        <span className="text-xs font-medium text-amber-600" title={item.error}>
          No disponible
        </span>
      )
    if (value === null || value === undefined)
      return <span className="font-normal text-muted-foreground">N/A</span>
    return <span className="tabular-nums">{formatter(value)}</span>
  }

  return (
    <Card data-testid="watchlist-comparison-panel" className="w-full border-l-4 border-l-[#d4e64d]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Comparación de Empresas
        </CardTitle>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[180px]">Métrica</TableHead>
              {data.map((item) => (
                <TableHead
                  key={item.cik}
                  data-testid={`comparison-header-${item.ticker}`}
                  className="min-w-[140px] text-right font-bold"
                >
                  <div>{item.ticker}</div>
                  <div className="ml-auto max-w-[200px] truncate text-xs font-normal text-muted-foreground">
                    {item.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow data-testid="comparison-row-revenue" className="hover:bg-muted/30">
              <TableCell className="text-sm font-medium">Ingresos</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.revenue, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-testid="comparison-row-netIncome" className="hover:bg-muted/30">
              <TableCell className="text-sm font-medium">Utilidad Neta</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.netIncome, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-testid="comparison-row-eps" className="hover:bg-muted/30">
              <TableCell className="text-sm font-medium">EPS</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.eps, formatEPS)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-testid="comparison-row-totalAssets" className="hover:bg-muted/30">
              <TableCell className="text-sm font-medium">Activos Totales</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.totalAssets, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>
            <TableRow data-testid="comparison-row-totalLiabilities" className="hover:bg-muted/30">
              <TableCell className="text-sm font-medium">Pasivos Totales</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.totalLiabilities, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
