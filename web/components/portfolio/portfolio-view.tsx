'use client'

import { useEffect, useState } from 'react'

import { AlertCircle, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type Portfolio, SessionExpiredError, getPortfolio } from '@/lib/api'

function formatCurrency(value: number): string {
  return `$${value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface PortfolioViewProps {
  // When this value changes, the portfolio is re-fetched (e.g. after a purchase).
  refreshSignal?: number
}

export function PortfolioView({ refreshSignal = 0 }: PortfolioViewProps) {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Bumped by the retry button to force a re-fetch.
  const [retrySignal, setRetrySignal] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchPortfolio() {
      setLoading(true)
      setError(null)
      try {
        const data = await getPortfolio()
        if (!cancelled) setPortfolio(data)
      } catch (err) {
        if (cancelled || err instanceof SessionExpiredError) return
        setError(err instanceof Error ? err.message : 'Error al cargar el portfolio.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchPortfolio()

    return () => {
      cancelled = true
    }
  }, [refreshSignal, retrySignal])

  if (loading) {
    return (
      <div data-testid="portfolio-loading" className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="portfolio-error"
        className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4"
      >
        <div className="flex items-center gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
          <p className="text-sm text-red-700">{error}</p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setRetrySignal((n) => n + 1)}>
          Reintentar
        </Button>
      </div>
    )
  }

  if (!portfolio || portfolio.positions.length === 0) {
    return (
      <p data-testid="portfolio-empty" className="py-6 text-sm text-muted-foreground">
        Todavía no tenés posiciones. Registrá una compra para empezar.
      </p>
    )
  }

  return (
    <div data-testid="portfolio-content" className="space-y-4">
      <div className="overflow-hidden rounded-lg border border-border">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>Ticker</TableHead>
              <TableHead className="text-right">Cantidad</TableHead>
              <TableHead className="text-right">Último precio</TableHead>
              <TableHead className="text-right">Valor actual</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {portfolio.positions.map((position) => {
              const hasPrice = position.latestPrice !== null && position.currentValue !== null
              return (
                <TableRow key={position.ticker} data-testid="portfolio-position">
                  <TableCell className="font-semibold">{position.ticker}</TableCell>
                  <TableCell className="text-right tabular-nums">{position.quantity}</TableCell>
                  <TableCell className="text-right tabular-nums">
                    {hasPrice ? (
                      formatCurrency(position.latestPrice as number)
                    ) : (
                      <span className="text-muted-foreground">Sin precio actualizado</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium tabular-nums">
                    {hasPrice ? (
                      formatCurrency(position.currentValue as number)
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between rounded-lg border border-[#d4e64d]/40 bg-[#d4e64d]/10 px-4 py-3">
        <span className="text-sm font-medium text-muted-foreground">Valor total del portfolio</span>
        <span
          data-testid="portfolio-total-value"
          className="text-xl font-bold text-foreground tabular-nums"
        >
          {formatCurrency(portfolio.totalValue)}
        </span>
      </div>
    </div>
  )
}
