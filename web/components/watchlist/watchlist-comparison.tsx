'use client'

import { useEffect, useState } from 'react'
import { Loader2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { getCompanyMetrics, type CompanyMetrics, type WatchlistItemResponse } from '@/lib/api'

interface WatchlistComparisonProps {
  ciks: string[]
  watchlistItems: WatchlistItemResponse[]
}

interface CompanyComparisonState {
  cik: string
  ticker: string
  name: string
  metrics: CompanyMetrics | null
  loading: boolean
  error: string | null
}

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

export function WatchlistComparison({ ciks, watchlistItems }: WatchlistComparisonProps) {
  const [data, setData] = useState<CompanyComparisonState[]>([])

  useEffect(() => {
    if (ciks.length === 0) {
      setData([])
      return
    }

    let cancelled = false

    // Initialize states
    const initialStates = ciks.map((cik) => {
      const item = watchlistItems.find((i) => i.cik === cik)
      return {
        cik,
        ticker: item?.ticker ?? 'Unknown',
        name: item?.name ?? 'Unknown Company',
        metrics: null,
        loading: true,
        error: null,
      }
    })
    setData(initialStates)

    // Parallel fetches
    ciks.forEach(async (cik) => {
      try {
        const metrics = await getCompanyMetrics(cik)
        if (!cancelled) {
          setData((prev) =>
            prev.map((item) =>
              item.cik === cik
                ? { ...item, metrics, loading: false, error: null }
                : item
            )
          )
        }
      } catch (err: any) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : 'Error de carga'
          const readableError = message.includes('404')
            ? 'No disponible en EDGAR'
            : 'Error del servidor EDGAR'
          setData((prev) =>
            prev.map((item) =>
              item.cik === cik
                ? { ...item, metrics: null, loading: false, error: readableError }
                : item
            )
          )
        }
      }
    })

    return () => {
      cancelled = true
    }
  }, [ciks, watchlistItems])

  if (ciks.length === 0) return null

  // Helper to render metric cell
  const renderCell = (
    item: CompanyComparisonState,
    value: number | null | undefined,
    formatter: (v: number) => string
  ) => {
    if (item.loading) {
      return (
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground inline" />
      )
    }
    if (item.error) {
      return (
        <span className="text-xs text-amber-600 font-medium" title={item.error}>
          No disponible
        </span>
      )
    }
    if (value === null || value === undefined) {
      return <span className="text-muted-foreground font-normal">N/A</span>
    }
    return <span className="tabular-nums">{formatter(value)}</span>
  }

  return (
    <Card data-testid="watchlist-comparison-panel" className="w-full border-l-4 border-l-[#d4e64d]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground flex items-center gap-2">
          <span>Comparación de Empresas</span>
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
                  <div className="text-xs font-normal text-muted-foreground truncate max-w-[200px] ml-auto">
                    {item.name}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Revenue Row */}
            <TableRow data-testid="comparison-row-revenue" className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Ingresos</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.revenue, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>

            {/* Net Income Row */}
            <TableRow data-testid="comparison-row-netIncome" className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Utilidad Neta</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.netIncome, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>

            {/* EPS Row */}
            <TableRow data-testid="comparison-row-eps" className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">EPS</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.eps, formatEPS)}
                </TableCell>
              ))}
            </TableRow>

            {/* Total Assets Row */}
            <TableRow data-testid="comparison-row-totalAssets" className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Activos Totales</TableCell>
              {data.map((item) => (
                <TableCell key={item.cik} className="text-right font-semibold">
                  {renderCell(item, item.metrics?.totalAssets, formatCompactUSD)}
                </TableCell>
              ))}
            </TableRow>

            {/* Total Liabilities Row */}
            <TableRow data-testid="comparison-row-totalLiabilities" className="hover:bg-muted/30">
              <TableCell className="font-medium text-sm">Pasivos Totales</TableCell>
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
