'use client';

import { ArrowLeft } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { TransactionRow } from '@/components/transaction-row';
import { type Transaction } from '@/lib/mock-data';

interface TransactionHistoryScreenProps {
  onBack: () => void;
}

export function TransactionHistoryScreen({ onBack }: TransactionHistoryScreenProps) {
  const { state } = useApp();

  // Gather all transactions from all positions
  const allTransactions: Transaction[] = state.positions.flatMap((position) =>
    position.transactions.map((tx) => ({ ...tx, ticker: position.ticker }))
  );

  // Sort by date descending
  const sortedTransactions = allTransactions.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-4 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={onBack}
            className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
            aria-label="Go back"
          >
            <ArrowLeft className="h-6 w-6 text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">Transaction History</h1>
        </div>
      </div>

      {/* Transactions list */}
      <div className="px-4 py-4">
        {sortedTransactions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-muted-foreground">No transactions yet</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Add positions to see your transaction history
            </p>
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-card p-4">
            {sortedTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                showTicker
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
