'use client'

import { useRef, useState } from 'react'

import { Check, ChevronsUpDown, Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import {
  type CompanySearchResult,
  type RegisterPurchaseResponse,
  SessionExpiredError,
  registerPurchase,
  searchCompanies,
} from '@/lib/api'
import { cn } from '@/lib/utils'

const DEBOUNCE_MS = 300

export function BuyStockForm() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [options, setOptions] = useState<CompanySearchResult[]>([])
  const [searching, setSearching] = useState(false)
  const [selected, setSelected] = useState<CompanySearchResult | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegisterPurchaseResponse | null>(null)

  async function fetchOptions(q: string) {
    setSearching(true)
    try {
      setOptions(await searchCompanies(q))
    } catch {
      setOptions([])
    } finally {
      setSearching(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // Preload a default list the first time the dropdown opens.
    if (next && options.length === 0) fetchOptions('')
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => fetchOptions(value), DEBOUNCE_MS)
  }

  function handleSelect(company: CompanySearchResult) {
    setSelected(company)
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    const qty = parseInt(quantity, 10)
    if (!selected || isNaN(qty) || qty < 1) {
      setError('Elegí un ticker y una cantidad mayor a cero.')
      return
    }

    setLoading(true)
    try {
      const res = await registerPurchase({ ticker: selected.ticker, quantity: qty })
      setResult(res)
      setSelected(null)
      setQuantity('')
    } catch (err) {
      if (err instanceof SessionExpiredError) return
      setError(err instanceof Error ? err.message : 'Error al registrar la compra.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="buy-ticker">Ticker</Label>
          <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                id="buy-ticker"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={loading}
                className="w-full justify-between font-normal"
              >
                {selected ? (
                  <span className="flex items-baseline gap-2 truncate">
                    <span className="font-semibold">{selected.ticker}</span>
                    <span className="truncate text-muted-foreground">{selected.name}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Elegí un ticker</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Buscar por ticker o nombre..."
                  value={query}
                  onValueChange={handleQueryChange}
                />
                <CommandList>
                  {searching && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                    </div>
                  )}
                  {!searching && <CommandEmpty>No se encontraron resultados.</CommandEmpty>}
                  {!searching && (
                    <CommandGroup>
                      {options.map((company) => (
                        <CommandItem
                          key={company.cik}
                          value={company.ticker}
                          onSelect={() => handleSelect(company)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected?.cik === company.cik ? 'opacity-100' : 'opacity-0',
                            )}
                            aria-hidden
                          />
                          <span className="font-semibold">{company.ticker}</span>
                          <span className="ml-2 truncate text-muted-foreground">
                            {company.name}
                          </span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="buy-quantity">Cantidad</Label>
          <Input
            id="buy-quantity"
            type="number"
            min={1}
            placeholder="Ej: 10"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Comprando...' : 'Comprar'}
      </Button>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {result && (
        <div className="rounded-md border border-[#d4e64d]/40 bg-[#d4e64d]/10 p-3 text-sm">
          <p className="font-semibold text-foreground">
            Compraste {result.quantity} {result.quantity === 1 ? 'acción' : 'acciones'} de{' '}
            {result.ticker}
          </p>
          <p className="mt-0.5 text-muted-foreground">
            Precio de referencia: $
            {result.priceUsed.toLocaleString('es-AR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>
        </div>
      )}
    </form>
  )
}
