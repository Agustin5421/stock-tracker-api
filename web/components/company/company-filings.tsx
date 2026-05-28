'use client'

import { useEffect, useState } from 'react'

import { AlertCircle, Loader2, WifiOff } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { type Filing, getCompanyFilings } from '@/lib/api'

// ---- Formatting helpers ----

function formatFilingDate(dateStr: string): string {
  const date = new Date(`${dateStr}T00:00:00`)
  return date.toLocaleDateString('es-AR', { day: '2-digit', month: 'short', year: 'numeric' })
}

// ---- Filing row ----

interface FilingRowProps {
  filing: Filing
}

function FilingRow({ filing }: FilingRowProps) {
  const is10K = filing.type === '10-K'

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-muted/30 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <Badge
          variant="outline"
          className={
            is10K
              ? 'border-[#7ec8e3]/60 bg-[#7ec8e3]/10 text-[#2a7a9b] font-semibold'
              : 'border-blue-200 bg-blue-50 text-blue-700 font-semibold'
          }
        >
          {filing.type}
        </Badge>
        <span className="text-sm text-foreground">{formatFilingDate(filing.filingDate)}</span>
      </div>
      <span className="font-mono text-xs text-muted-foreground">{filing.accessionNumber}</span>
    </div>
  )
}

// ---- Error states ----

function NotFoundState() {
  return (
    <div
      data-testid="company-filings-not-found"
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
      data-testid="company-filings-service-error"
      className="flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-4"
    >
      <WifiOff className="h-4 w-4 shrink-0 text-red-600" aria-hidden />
      <p className="text-sm text-red-700">Servicio de EDGAR no disponible temporalmente</p>
    </div>
  )
}

// ---- Main component ----

type ErrorKind = 'not-found' | 'service-error'

interface CompanyFilingsProps {
  cik: string
}

export function CompanyFilings({ cik }: CompanyFilingsProps) {
  const [filings, setFilings] = useState<Filing[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [errorKind, setErrorKind] = useState<ErrorKind | null>(null)

  useEffect(() => {
    if (!cik) return

    let cancelled = false

    async function fetchFilings() {
      setLoading(true)
      setFilings(null)
      setErrorKind(null)

      try {
        const data = await getCompanyFilings(cik)
        if (!cancelled) {
          setFilings(data)
        }
      } catch (err: unknown) {
        if (!cancelled) {
          const message = err instanceof Error ? err.message : ''
          // 404 → company not in EDGAR; 503 or anything else → service error
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

    fetchFilings()

    return () => {
      cancelled = true
    }
  }, [cik])

  return (
    <Card data-testid="company-filings-panel" className="w-full border-l-4 border-l-[#7ec8e3]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">Filings Recientes</CardTitle>
      </CardHeader>

      <CardContent className="space-y-2">
        {loading && (
          <div
            data-testid="company-filings-loading"
            className="flex items-center justify-center py-8"
          >
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" aria-label="Cargando" />
          </div>
        )}

        {!loading && errorKind === 'not-found' && <NotFoundState />}

        {!loading && errorKind === 'service-error' && <ServiceErrorState />}

        {!loading && filings !== null && (
          <div data-testid="company-filings-content" className="space-y-2">
            {filings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No se encontraron filings recientes.</p>
            ) : (
              filings.map((filing) => <FilingRow key={filing.accessionNumber} filing={filing} />)
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
