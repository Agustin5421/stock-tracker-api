'use client'

import { useState } from 'react'

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
  type LatestPrice,
  type RegisterPurchaseResponse,
  SessionExpiredError,
  getAvailablePrices,
  registerPurchase,
} from '@/lib/api'
import { cn } from '@/lib/utils'

function formatPrice(value: number): string {
  return `$${value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface BuyStockFormProps {
  // Called after a purchase is registered successfully (e.g. to refresh the portfolio).
  onSuccess?: () => void
}

export function BuyStockForm({ onSuccess }: BuyStockFormProps = {}) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<LatestPrice[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [selected, setSelected] = useState<LatestPrice | null>(null)

  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegisterPurchaseResponse | null>(null)

  async function fetchOptions() {
    setLoadingOptions(true)
    try {
      setOptions(await getAvailablePrices())
    } catch {
      setOptions([])
    } finally {
      setLoadingOptions(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // Refresh the buyable-ticker list each time the dropdown opens.
    if (next) fetchOptions()
  }

  function handleSelect(price: LatestPrice) {
    setSelected(price)
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
      onSuccess?.()
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
                    <span className="text-muted-foreground">{formatPrice(selected.price)}</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Elegí un ticker</span>
                )}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" aria-hidden />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
              <Command>
                <CommandInput placeholder="Buscar ticker..." />
                <CommandList>
                  {loadingOptions && (
                    <div className="flex items-center justify-center py-6">
                      <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" aria-hidden />
                    </div>
                  )}
                  {!loadingOptions && (
                    <CommandEmpty>
                      No hay tickers con precio disponible. Actualizá los precios primero.
                    </CommandEmpty>
                  )}
                  {!loadingOptions && (
                    <CommandGroup>
                      {options.map((price) => (
                        <CommandItem
                          key={price.ticker}
                          value={price.ticker}
                          onSelect={() => handleSelect(price)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected?.ticker === price.ticker ? 'opacity-100' : 'opacity-0',
                            )}
                            aria-hidden
                          />
                          <span className="font-semibold">{price.ticker}</span>
                          <span className="ml-auto text-muted-foreground">
                            {formatPrice(price.price)}
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
            Precio de referencia: {formatPrice(result.priceUsed)}
          </p>
        </div>
      )}
    </form>
  )
}
