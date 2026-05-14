import { cn } from '@/lib/utils';
import { formatCurrency, type Transaction } from '@/lib/mock-data';
import { format } from 'date-fns';

interface TransactionRowProps {
  transaction: Transaction;
  showTicker?: boolean;
  className?: string;
}

export function TransactionRow({
  transaction,
  showTicker = false,
  className,
}: TransactionRowProps) {
  const totalValue = transaction.price * transaction.quantity;

  return (
    <div
      className={cn(
        'flex items-center justify-between py-3 border-b border-border last:border-0',
        className
      )}
    >
      <div className="flex items-center gap-3">
        {/* Type badge */}
        <span
          className={cn(
            'flex h-8 items-center rounded-full px-2.5 text-xs font-semibold',
            transaction.type === 'BUY'
              ? 'bg-gain/15 text-gain'
              : 'bg-loss/15 text-loss'
          )}
        >
          {transaction.type}
        </span>

        <div className="flex flex-col">
          {showTicker && (
            <span className="font-semibold text-foreground">
              {transaction.ticker}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            {format(new Date(transaction.date), 'MMM d, yyyy')}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end">
        <span className="font-medium text-foreground">
          {transaction.quantity} @ {formatCurrency(transaction.price)}
        </span>
        <span className="text-sm text-muted-foreground">
          {formatCurrency(totalValue)}
        </span>
      </div>
    </div>
  );
}
