'use client'

import { useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, Loader2, Search } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type CompanySearchResult, searchCompanies } from '@/lib/api'

const DEBOUNCE_MS = 300
const PAGE_SIZE = 15

export function CompanySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CompanySearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [page, setPage] = useState(1)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const totalPages = Math.max(1, Math.ceil(results.length / PAGE_SIZE))
  const pageItems = results.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  async function fetchResults(q: string) {
    setLoading(true)
    try {
      const data = await searchCompanies(q)
      setResults(data)
      setPage(1)
    } catch {
      setResults([])
      setPage(1)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchResults('')
  }, [])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchResults(value), DEBOUNCE_MS)
  }

  return (
    <div className="w-full max-w-2xl space-y-3">
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        />
        <Input
          data-testid="company-search-input"
          type="search"
          placeholder="Buscar empresa por ticker o nombre..."
          value={query}
          onChange={handleChange}
          className="pl-9"
        />
        {loading && (
          <Loader2
            className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
            aria-hidden
          />
        )}
      </div>

      <div data-testid="company-search-results">
        {results.length === 0 && !loading ? (
          <p className="py-4 text-center text-sm text-muted-foreground">
            No se encontraron resultados.
          </p>
        ) : (
          <>
            <ul className="space-y-2">
              {pageItems.map((company) => (
                <li
                  key={company.cik}
                  className="rounded-lg border border-l-4 border-l-[#d4e64d] bg-card px-4 py-3"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-foreground">{company.ticker}</span>
                    <span className="text-sm text-foreground">{company.name}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">CIK: {company.cik}</p>
                </li>
              ))}
            </ul>

            {totalPages > 1 && (
              <div className="flex items-center justify-between pt-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <span className="text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
