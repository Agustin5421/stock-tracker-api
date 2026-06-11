'use client'

import { useState } from 'react'
import { Star } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { addToWatchlist, removeFromWatchlist } from '@/lib/api'

interface WatchlistToggleProps {
  ticker: string
  name: string
  cik: string
  isSaved: boolean
  onChanged?: () => void
}

export function WatchlistToggle({ ticker, name, cik, isSaved, onChanged }: WatchlistToggleProps) {
  const [loading, setLoading] = useState(false)

  async function handleToggle() {
    if (loading) return
    setLoading(true)
    try {
      if (isSaved) {
        await removeFromWatchlist(ticker)
        toast.success(`Eliminada`, {
          description: `${ticker} (${name}) fue eliminada de tu watchlist.`,
        })
      } else {
        await addToWatchlist(ticker, name, cik)
        toast.success(`Guardada`, {
          description: `${ticker} (${name}) fue agregada a tu watchlist.`,
        })
      }
      if (onChanged) {
        onChanged()
      }
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'No se pudo realizar la acción en la watchlist.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={(e) => {
        e.stopPropagation()
        handleToggle()
      }}
      disabled={loading}
      data-testid="watchlist-toggle"
      data-saved={isSaved.toString()}
      className={`h-9 w-9 rounded-full transition-transform active:scale-95 ${
        isSaved
          ? 'text-[#d4e64d] hover:text-[#d4e64d]/90'
          : 'text-muted-foreground hover:text-foreground'
      }`}
      aria-label={isSaved ? `Quitar ${ticker} de la watchlist` : `Agregar ${ticker} a la watchlist`}
    >
      <Star className={`h-4.5 w-4.5 ${isSaved ? 'fill-[#d4e64d]' : 'fill-none'}`} aria-hidden />
    </Button>
  )
}
