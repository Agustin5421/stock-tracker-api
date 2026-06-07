'use client'

import { useEffect, useState } from 'react'

import { AlertCircle, ArrowDownLeft, ArrowUpRight, Loader2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { type OperationHistoryItem, SessionExpiredError, getOperationHistory } from '@/lib/api'

function formatCurrency(value: string | number): string {
  const n = typeof value === 'number' ? value : Number(value)
  if (Number.isNaN(n)) return String(value)
  return `$${n.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function formatDate(executedAt: string): string {
  const date = new Date(executedAt)
  if (Number.isNaN(date.getTime())) return executedAt
  return date.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

interface OperationHistoryProps {
  // When this value changes, the history is re-fetched (e.g. after a buy/sell).
  refreshSignal?: number
}

export function OperationHistory({ refreshSignal = 0 }: OperationHistoryProps) {
  const [operations, setOperations] = useState<OperationHistoryItem[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Bumped by the retry button to force a re-fetch.
  const [retrySignal, setRetrySignal] = useState(0)

  useEffect(() => {
    let cancelled = false

    async function fetchHistory() {
      setLoading(true)
      setError(null)
      try {
        const data = await getOperationHistory()
        if (!cancelled) setOperations(data)
      } catch (err) {
        if (cancelled || err instanceof SessionExpiredError) return
        setError(
          err instanceof Error ? err.message : 'Error al cargar el historial de operaciones.',
        )
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchHistory()

    return () => {
      cancelled = true
    }
  }, [refreshSignal, retrySignal])

  if (loading) {
    return (
      <div data-testid="operations-loading" className="flex items-center justify-center py-8">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando" />
      </div>
    )
  }

  if (error) {
    return (
      <div
        data-testid="operations-error"
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

  if (!operations || operations.length === 0) {
    return (
      <p data-testid="operations-empty" className="py-6 text-sm text-muted-foreground">
        Todavía no registraste operaciones. Tus compras y ventas aparecerán acá.
      </p>
    )
  }

  return (
    <div
      data-testid="operations-content"
      className="overflow-hidden rounded-lg border border-border"
    >
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead>Tipo</TableHead>
            <TableHead>Ticker</TableHead>
            <TableHead className="text-right">Cantidad</TableHead>
            <TableHead className="text-right">Precio</TableHead>
            <TableHead className="text-right">Fecha</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operations.map((op, index) => {
            const isBuy = op.type === 'BUY'
            return (
              <TableRow key={`${op.ticker}-${op.executedAt}-${index}`} data-testid="operation-row">
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      isBuy
                        ? 'border-green-200 bg-green-50 text-green-700'
                        : 'border-red-200 bg-red-50 text-red-700'
                    }
                  >
                    {isBuy ? (
                      <ArrowDownLeft className="h-3 w-3" aria-hidden />
                    ) : (
                      <ArrowUpRight className="h-3 w-3" aria-hidden />
                    )}
                    {isBuy ? 'Compra' : 'Venta'}
                  </Badge>
                </TableCell>
                <TableCell className="font-semibold">{op.ticker}</TableCell>
                <TableCell className="text-right tabular-nums">{op.quantity}</TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatCurrency(op.price)}
                </TableCell>
                <TableCell className="text-right tabular-nums text-muted-foreground">
                  {formatDate(op.executedAt)}
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
