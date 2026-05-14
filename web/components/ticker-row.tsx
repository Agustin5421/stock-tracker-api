'use client';

import { useRef, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PnlBadge } from './pnl-badge';
import { formatCurrency, STOCKS } from '@/lib/mock-data';

interface TickerRowProps {
  ticker: string;
  shares?: number;
  avgCost?: number;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  showPnl?: boolean;
  showPrice?: boolean;
  variant?: 'portfolio' | 'watchlist' | 'search';
  className?: string;
}

export function TickerRow({
  ticker,
  shares,
  avgCost,
  onClick,
  onEdit,
  onDelete,
  showPnl = true,
  showPrice = true,
  variant = 'portfolio',
  className,
}: TickerRowProps) {
  const stock = STOCKS[ticker];
  const [swipeOffset, setSwipeOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const rowRef = useRef<HTMLDivElement>(null);

  if (!stock) return null;

  const currentValue = shares ? stock.currentPrice * shares : stock.currentPrice;
  const costBasis = shares && avgCost ? avgCost * shares : 0;
  const gainLoss = shares ? currentValue - costBasis : 0;
  const gainLossPercent = costBasis > 0 ? (gainLoss / costBasis) * 100 : stock.dailyChange;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (!onEdit && !onDelete) return;
    startX.current = e.touches[0].clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping || (!onEdit && !onDelete)) return;
    const diff = startX.current - e.touches[0].clientX;
    const newOffset = Math.max(0, Math.min(diff, 160));
    setSwipeOffset(newOffset);
  };

  const handleTouchEnd = () => {
    setIsSwiping(false);
    if (swipeOffset > 80) {
      setSwipeOffset(160);
    } else {
      setSwipeOffset(0);
    }
  };

  const handleClick = () => {
    if (swipeOffset > 0) {
      setSwipeOffset(0);
      return;
    }
    onClick?.();
  };

  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Action buttons (revealed on swipe) */}
      {(onEdit || onDelete) && (
        <div className="absolute inset-y-0 right-0 flex">
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSwipeOffset(0);
                onEdit();
              }}
              className="flex h-full w-20 items-center justify-center bg-primary text-primary-foreground"
              aria-label="Edit position"
            >
              <Pencil className="h-5 w-5" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSwipeOffset(0);
                onDelete();
              }}
              className="flex h-full w-20 items-center justify-center bg-destructive text-destructive-foreground"
              aria-label="Delete position"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          )}
        </div>
      )}

      {/* Row content */}
      <div
        ref={rowRef}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={cn(
          'relative flex min-h-[72px] cursor-pointer items-center gap-3 bg-card px-4 py-3 transition-transform',
          'active:bg-muted/50'
        )}
        style={{
          transform: `translateX(-${swipeOffset}px)`,
          transition: isSwiping ? 'none' : 'transform 0.2s ease-out',
        }}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
        aria-label={`${stock.name} - ${ticker}`}
      >
        {/* Ticker info */}
        <div className="flex min-w-0 flex-1 flex-col">
          <span className="text-base font-semibold text-foreground">{ticker}</span>
          <span className="truncate text-sm text-muted-foreground">{stock.name}</span>
          {variant === 'portfolio' && shares && (
            <span className="text-xs text-muted-foreground">
              {shares} shares @ {formatCurrency(avgCost || 0)}
            </span>
          )}
        </div>

        {/* Price and P&L */}
        <div className="flex flex-col items-end gap-1">
          {showPrice && (
            <span className="text-base font-semibold text-foreground">
              {variant === 'portfolio' && shares
                ? formatCurrency(currentValue)
                : formatCurrency(stock.currentPrice)}
            </span>
          )}
          {showPnl && (
            <div className="flex items-center gap-2">
              {variant === 'portfolio' && shares && (
                <span
                  className={cn(
                    'text-sm font-medium',
                    gainLoss >= 0 ? 'text-gain' : 'text-loss'
                  )}
                >
                  {gainLoss >= 0 ? '+' : ''}
                  {formatCurrency(gainLoss)}
                </span>
              )}
              <PnlBadge
                value={gainLossPercent}
                size="sm"
                showIcon={variant !== 'search'}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
