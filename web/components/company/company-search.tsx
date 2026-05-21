'use client'

import { useEffect, useRef, useState } from 'react'

import { Loader2, Search } from 'lucide-react'

import { Input } from '@/components/ui/input'
import { type CompanySearchResult, searchCompanies } from '@/lib/api'

const MIN_QUERY_LENGTH = 2
const DEBOUNCE_MS = 300

export function CompanySearch() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<CompanySearchResult[] | null>(null)
  const [loading, setLoading] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)
    if (value.length < MIN_QUERY_LENGTH) {
      setResults(null)
    }
  }

  useEffect(() => {
    if (query.length < MIN_QUERY_LENGTH) return

    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const data = await searchCompanies(query)
        setResults(data)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, DEBOUNCE_MS)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

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

      {results !== null && (
        <div data-testid="company-search-results">
          {results.length === 0 ? (
            <p className="py-4 text-center text-sm text-muted-foreground">
              No se encontraron resultados.
            </p>
          ) : (
            <ul className="space-y-2">
              {results.map((company) => (
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
          )}
        </div>
      )}
    </div>
  )
}
