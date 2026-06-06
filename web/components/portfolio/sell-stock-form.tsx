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
  type PortfolioPosition,
  type RegisterSaleResponse,
  SessionExpiredError,
  getPortfolio,
  registerSale,
} from '@/lib/api'
import { cn } from '@/lib/utils'

function formatPrice(value: number): string {
  return `$${value.toLocaleString('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

interface SellStockFormProps {
  // Called after a sale is registered successfully (e.g. to refresh the portfolio).
  onSuccess?: () => void
}

interface SaleConfirmation {
  ticker: string
  // Quantity the user actually sold (what they entered), not the remaining quantity.
  quantitySold: number
  priceUsed: number
}

export function SellStockForm({ onSuccess }: SellStockFormProps = {}) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<PortfolioPosition[]>([])
  const [loadingOptions, setLoadingOptions] = useState(false)
  const [selected, setSelected] = useState<PortfolioPosition | null>(null)

  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<SaleConfirmation | null>(null)

  async function fetchOptions() {
    setLoadingOptions(true)
    try {
      const portfolio = await getPortfolio()
      setOptions(portfolio.positions)
    } catch (err) {
      if (err instanceof SessionExpiredError) return
      setOptions([])
    } finally {
      setLoadingOptions(false)
    }
  }

  function handleOpenChange(next: boolean) {
    setOpen(next)
    // Refresh the sellable-positions list each time the dropdown opens.
    if (next) fetchOptions()
  }

  function handleSelect(position: PortfolioPosition) {
    setSelected(position)
    setOpen(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    const qty = parseInt(quantity, 10)
    if (!selected || isNaN(qty) || qty < 1) {
      setError('Elegí una posición y una cantidad mayor a cero.')
      return
    }
    if (qty > selected.quantity) {
      setError(`No podés vender más de ${selected.quantity} acciones.`)
      return
    }

    setLoading(true)
    try {
      const res: RegisterSaleResponse = await registerSale({
        ticker: selected.ticker,
        quantity: qty,
      })
      setResult({ ticker: res.ticker, quantitySold: qty, priceUsed: res.priceUsed })
      setSelected(null)
      setQuantity('')
      onSuccess?.()
    } catch (err) {
      if (err instanceof SessionExpiredError) return
      setError(err instanceof Error ? err.message : 'Error al registrar la venta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="sell-stock-form">
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="sell-ticker">Ticker</Label>
          <Popover open={open} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
              <Button
                id="sell-ticker"
                type="button"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                disabled={loading}
                data-testid="sell-ticker-trigger"
                className="w-full justify-between font-normal"
              >
                {selected ? (
                  <span className="flex items-baseline gap-2 truncate">
                    <span className="font-semibold">{selected.ticker}</span>
                    <span className="text-muted-foreground">{selected.quantity} disp.</span>
                  </span>
                ) : (
                  <span className="text-muted-foreground">Elegí una posición</span>
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
                  {!loadingOptions && <CommandEmpty>No tenés posiciones para vender.</CommandEmpty>}
                  {!loadingOptions && (
                    <CommandGroup>
                      {options.map((position) => (
                        <CommandItem
                          key={position.ticker}
                          value={position.ticker}
                          data-testid="sell-position-option"
                          onSelect={() => handleSelect(position)}
                        >
                          <Check
                            className={cn(
                              'mr-2 h-4 w-4',
                              selected?.ticker === position.ticker ? 'opacity-100' : 'opacity-0',
                            )}
                            aria-hidden
                          />
                          <span className="font-semibold">{position.ticker}</span>
                          <span className="ml-auto text-muted-foreground">
                            {position.quantity} disp.
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
          <Label htmlFor="sell-quantity">Cantidad</Label>
          <Input
            id="sell-quantity"
            type="number"
            min={1}
            max={selected?.quantity}
            placeholder="Ej: 5"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            disabled={loading}
            data-testid="sell-quantity-input"
          />
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full" data-testid="sell-submit-button">
        {loading ? 'Vendiendo...' : 'Vender'}
      </Button>

      {error && (
        <p className="text-sm text-destructive" data-testid="sell-error">
          {error}
        </p>
      )}

      {result && (
        <div
          data-testid="sell-success"
          className="rounded-md border border-[#d4e64d]/40 bg-[#d4e64d]/10 p-3 text-sm"
        >
          <p className="font-semibold text-foreground">
            Vendiste {result.quantitySold} {result.quantitySold === 1 ? 'acción' : 'acciones'} de{' '}
            {result.ticker} a {formatPrice(result.priceUsed)}.
          </p>
        </div>
      )}
    </form>
  )
}
