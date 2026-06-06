'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { type RegisterPurchaseResponse, registerPurchase } from '@/lib/api'

export function BuyStockForm() {
  const [ticker, setTicker] = useState('')
  const [quantity, setQuantity] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<RegisterPurchaseResponse | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setResult(null)

    const qty = parseInt(quantity, 10)
    if (!ticker.trim() || isNaN(qty) || qty < 1) {
      setError('Ingresá un ticker válido y una cantidad mayor a cero.')
      return
    }

    setLoading(true)
    try {
      const res = await registerPurchase({ ticker: ticker.trim().toUpperCase(), quantity: qty })
      setResult(res)
      setTicker('')
      setQuantity('')
    } catch (err) {
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
          <Input
            id="buy-ticker"
            placeholder="Ej: AAPL"
            value={ticker}
            onChange={(e) => setTicker(e.target.value.toUpperCase())}
            disabled={loading}
          />
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
