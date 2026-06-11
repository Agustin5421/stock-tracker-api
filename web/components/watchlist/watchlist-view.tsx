'use client'

import { useState } from 'react'
import { Trash2, BarChart2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { removeFromWatchlist, type WatchlistItemResponse } from '@/lib/api'

interface WatchlistViewProps {
  items: WatchlistItemResponse[]
  onRefresh: () => void
  onCompare: (ciks: string[]) => void
}

export function WatchlistView({ items, onRefresh, onCompare }: WatchlistViewProps) {
  const [selectedCiks, setSelectedCiks] = useState<string[]>([])
  const [removingTicker, setRemovingTicker] = useState<string | null>(null)

  function handleSelect(cik: string, checked: boolean) {
    setSelectedCiks((prev) =>
      checked ? [...prev, cik] : prev.filter((id) => id !== cik)
    )
  }

  async function handleRemove(ticker: string) {
    setRemovingTicker(ticker)
    try {
      await removeFromWatchlist(ticker)
      toast.success('Empresa eliminada', {
        description: `${ticker} fue eliminada de tu watchlist.`,
      })
      setSelectedCiks((prev) => {
        const item = items.find((i) => i.ticker === ticker)
        return item ? prev.filter((id) => id !== item.cik) : prev
      })
      onRefresh()
    } catch (err: any) {
      toast.error('Error', {
        description: err.message || 'No se pudo eliminar la empresa.',
      })
    } finally {
      setRemovingTicker(null)
    }
  }

  return (
    <div data-testid="watchlist-view" className="space-y-4">
      {items.length === 0 ? (
        <div
          data-testid="watchlist-empty-message"
          className="flex flex-col items-center justify-center py-8 text-center"
        >
          <p className="text-sm text-muted-foreground">
            No tienes empresas en seguimiento. Busca una empresa y haz clic en la estrella para agregarla.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]"></TableHead>
                  <TableHead>Ticker</TableHead>
                  <TableHead>Nombre</TableHead>
                  <TableHead className="w-[100px] text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => {
                  const isChecked = selectedCiks.includes(item.cik)
                  return (
                    <TableRow
                      key={item.ticker}
                      data-testid={`watchlist-item-${item.ticker}`}
                      className="transition-colors hover:bg-muted/40"
                    >
                      <TableCell>
                        <Checkbox
                          id={`select-${item.ticker}`}
                          checked={isChecked}
                          onCheckedChange={(checked) =>
                            handleSelect(item.cik, !!checked)
                          }
                          data-testid={`watchlist-item-${item.ticker}-checkbox`}
                          aria-label={`Seleccionar ${item.ticker} para comparar`}
                        />
                      </TableCell>
                      <TableCell className="font-semibold">{item.ticker}</TableCell>
                      <TableCell className="text-muted-foreground">{item.name}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemove(item.ticker)}
                          disabled={removingTicker === item.ticker}
                          data-testid={`watchlist-item-${item.ticker}-remove`}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive transition-colors"
                          aria-label={`Eliminar ${item.ticker} de la watchlist`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between px-1">
            <span className="text-xs text-muted-foreground">
              {selectedCiks.length} seleccionadas para comparar
            </span>
            <Button
              size="sm"
              onClick={() => onCompare(selectedCiks)}
              disabled={selectedCiks.length < 2}
              data-testid="watchlist-compare-button"
              className="gap-1.5 bg-[#d4e64d] text-[#2d2d2d] hover:bg-[#d4e64d]/90 font-semibold"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Comparar</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
