'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { formatCurrency, STOCKS, type Position } from '@/lib/mock-data';
import { PnlBadge } from '@/components/pnl-badge';
import { StatCard } from '@/components/stat-card';
import { TransactionRow } from '@/components/transaction-row';
import { ConfirmSheet } from '@/components/confirm-sheet';
import { AddPositionSheet } from './add-position-sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PositionDetailScreenProps {
  position: Position;
  onBack: () => void;
}

export function PositionDetailScreen({ position, onBack }: PositionDetailScreenProps) {
  const { dispatch } = useApp();
  const [isAddTransactionOpen, setIsAddTransactionOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  const stock = STOCKS[position.ticker];
  if (!stock) return null;

  const currentValue = stock.currentPrice * position.shares;
  const costBasis = position.avgCost * position.shares;
  const unrealizedGain = currentValue - costBasis;
  const unrealizedGainPercent = costBasis > 0 ? (unrealizedGain / costBasis) * 100 : 0;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...position.transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const handleDelete = () => {
    dispatch({ type: 'DELETE_POSITION', payload: { positionId: position.id } });
    onBack();
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-6 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{position.ticker}</h1>
            <p className="text-sm text-muted-foreground">{stock.name}</p>
          </div>
        </div>
      </div>

      {/* Price info */}
      <div className="px-4 py-4">
        <div className="grid grid-cols-2 gap-3">
          <StatCard
            label="Current Price"
            value={formatCurrency(stock.currentPrice)}
            delta={stock.dailyChange}
          />
          <StatCard
            label="Avg Cost"
            value={formatCurrency(position.avgCost)}
          />
          <StatCard
            label="Shares Held"
            value={position.shares.toString()}
          />
          <StatCard
            label="Total Value"
            value={formatCurrency(currentValue)}
          />
        </div>
      </div>

      {/* P&L section */}
      <div className="mx-4 rounded-xl border border-border bg-card p-4">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
          Unrealized Gain/Loss
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <span
            className={cn(
              'text-2xl font-bold',
              unrealizedGain >= 0 ? 'text-gain' : 'text-loss'
            )}
          >
            {unrealizedGain >= 0 ? '+' : ''}
            {formatCurrency(unrealizedGain)}
          </span>
          <PnlBadge value={unrealizedGainPercent} size="lg" />
        </div>
      </div>

      {/* Transaction history */}
      <div className="mt-6 px-4">
        <div className="flex items-center justify-between pb-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Transaction History
          </h3>
          <button
            onClick={() => setIsAddTransactionOpen(true)}
            className="flex items-center gap-1 text-sm font-medium text-primary"
          >
            <Plus className="h-4 w-4" />
            Add
          </button>
        </div>

        <div className="rounded-xl border border-border bg-card p-4">
          {sortedTransactions.length === 0 ? (
            <p className="py-4 text-center text-muted-foreground">No transactions</p>
          ) : (
            sortedTransactions.map((transaction) => (
              <TransactionRow key={transaction.id} transaction={transaction} />
            ))
          )}
        </div>
      </div>

      {/* Remove position button */}
      <div className="mt-auto px-4 pt-6">
        <Button
          variant="destructive"
          onClick={() => setIsDeleteConfirmOpen(true)}
          className="min-h-[44px] w-full gap-2"
        >
          <Trash2 className="h-4 w-4" />
          Remove Position
        </Button>
      </div>

      {/* Add Transaction Sheet */}
      <AddPositionSheet
        isOpen={isAddTransactionOpen}
        onClose={() => setIsAddTransactionOpen(false)}
        editingPosition={position}
      />

      {/* Delete Confirmation */}
      <ConfirmSheet
        isOpen={isDeleteConfirmOpen}
        onClose={() => setIsDeleteConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Remove Position"
        description={`Are you sure you want to remove ${stock.name} from your portfolio? All transaction history will be lost.`}
        confirmLabel="Remove Position"
        isDestructive
      />
    </div>
  );
}
