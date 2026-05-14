'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { format } from 'date-fns';
import { useApp } from '@/lib/app-context';
import { formatCurrency, STOCKS, type Position } from '@/lib/mock-data';
import { TickerRow } from '@/components/ticker-row';
import { PnlBadge } from '@/components/pnl-badge';
import { ConfirmSheet } from '@/components/confirm-sheet';
import { AddPositionSheet } from './add-position-sheet';
import { cn } from '@/lib/utils';

interface PortfolioScreenProps {
  onViewPosition: (position: Position) => void;
}

export function PortfolioScreen({ onViewPosition }: PortfolioScreenProps) {
  const { state, dispatch, totalPortfolioValue, totalGainLoss, totalGainLossPercentage } = useApp();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [editingPosition, setEditingPosition] = useState<Position | null>(null);
  const [deletingPosition, setDeletingPosition] = useState<Position | null>(null);

  const handleDeletePosition = () => {
    if (deletingPosition) {
      dispatch({ type: 'DELETE_POSITION', payload: { positionId: deletingPosition.id } });
      setDeletingPosition(null);
    }
  };

  return (
    <div className="flex flex-col pb-20">
      {/* Header with portfolio summary */}
      <div className="bg-card px-4 pb-6 pt-[env(safe-area-inset-top)]">
        <div className="pt-4">
          <p className="text-sm text-muted-foreground">Total Portfolio Value</p>
          <h1 className="mt-1 text-3xl font-bold text-foreground">
            {formatCurrency(totalPortfolioValue)}
          </h1>

          <div className="mt-2 flex items-center gap-3">
            <span
              className={cn(
                'text-lg font-semibold',
                totalGainLoss >= 0 ? 'text-gain' : 'text-loss'
              )}
            >
              {totalGainLoss >= 0 ? '+' : ''}
              {formatCurrency(totalGainLoss)}
            </span>
            <PnlBadge value={totalGainLossPercentage} size="md" />
          </div>

          <p className="mt-3 text-xs text-muted-foreground">
            Prices last updated: {format(new Date(state.lastPriceUpdate), 'MMM d, yyyy HH:mm')}
          </p>
        </div>
      </div>

      {/* Holdings list */}
      <div className="mt-4">
        <div className="px-4 pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Holdings ({state.positions.length})
          </h2>
        </div>

        <div className="divide-y divide-border border-y border-border bg-card">
          {state.positions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">No positions yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Tap the button below to add your first stock
              </p>
            </div>
          ) : (
            state.positions.map((position) => (
              <TickerRow
                key={position.id}
                ticker={position.ticker}
                shares={position.shares}
                avgCost={position.avgCost}
                onClick={() => onViewPosition(position)}
                onEdit={() => setEditingPosition(position)}
                onDelete={() => setDeletingPosition(position)}
                variant="portfolio"
              />
            ))
          )}
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsAddSheetOpen(true)}
        className={cn(
          'fixed bottom-24 right-4 z-30',
          'flex h-14 w-14 items-center justify-center rounded-full',
          'bg-primary text-primary-foreground shadow-lg',
          'active:scale-95 transition-transform'
        )}
        aria-label="Add position"
      >
        <Plus className="h-6 w-6" />
      </button>

      {/* Add Position Sheet */}
      <AddPositionSheet
        isOpen={isAddSheetOpen}
        onClose={() => setIsAddSheetOpen(false)}
      />

      {/* Edit Position Sheet */}
      {editingPosition && (
        <AddPositionSheet
          isOpen={!!editingPosition}
          onClose={() => setEditingPosition(null)}
          editingPosition={editingPosition}
        />
      )}

      {/* Delete Confirmation */}
      <ConfirmSheet
        isOpen={!!deletingPosition}
        onClose={() => setDeletingPosition(null)}
        onConfirm={handleDeletePosition}
        title="Remove Position"
        description={`Are you sure you want to remove ${deletingPosition?.ticker ? STOCKS[deletingPosition.ticker]?.name : ''} from your portfolio? This action cannot be undone.`}
        confirmLabel="Remove Position"
        isDestructive
      />
    </div>
  );
}
