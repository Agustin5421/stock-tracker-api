'use client';

import { useState } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { STOCKS, formatLargeNumber } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface CompareScreenProps {
  onBack: () => void;
}

const metrics = [
  { key: 'revenue', label: 'Revenue' },
  { key: 'netIncome', label: 'Net Income' },
  { key: 'eps', label: 'EPS' },
  { key: 'totalAssets', label: 'Total Assets' },
  { key: 'totalLiabilities', label: 'Total Liabilities' },
] as const;

export function CompareScreen({ onBack }: CompareScreenProps) {
  const { state } = useApp();
  const [selectedTickers, setSelectedTickers] = useState<string[]>(
    state.watchlist.slice(0, 4).map((w) => w.ticker)
  );

  const toggleTicker = (ticker: string) => {
    if (selectedTickers.includes(ticker)) {
      if (selectedTickers.length > 2) {
        setSelectedTickers(selectedTickers.filter((t) => t !== ticker));
      }
    } else if (selectedTickers.length < 4) {
      setSelectedTickers([...selectedTickers, ticker]);
    }
  };

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
          <h1 className="text-xl font-bold text-foreground">Compare Stocks</h1>
        </div>

        {/* Ticker selection */}
        <div className="mt-4 flex flex-wrap gap-2">
          {state.watchlist.map((item) => {
            const isSelected = selectedTickers.includes(item.ticker);
            return (
              <button
                key={item.ticker}
                onClick={() => toggleTicker(item.ticker)}
                className={cn(
                  'flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-medium min-h-[36px]',
                  isSelected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {item.ticker}
                {isSelected && selectedTickers.length > 2 && (
                  <X className="h-3 w-3" />
                )}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          Select 2-4 stocks to compare (currently {selectedTickers.length} selected)
        </p>
      </div>

      {/* Comparison table */}
      <div className="flex-1 overflow-x-auto px-4 py-4">
        <div className="rounded-xl border border-border bg-card overflow-hidden min-w-[600px]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="sticky left-0 bg-card px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                  Metric
                </th>
                {selectedTickers.map((ticker) => {
                  const stock = STOCKS[ticker];
                  return (
                    <th
                      key={ticker}
                      className="px-4 py-3 text-right text-sm font-medium text-foreground"
                    >
                      <div>{ticker}</div>
                      <div className="text-xs font-normal text-muted-foreground">
                        {stock?.name.slice(0, 15)}...
                      </div>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric) => (
                <tr key={metric.key} className="border-b border-border last:border-0">
                  <td className="sticky left-0 bg-card px-4 py-3 text-sm font-medium text-foreground">
                    {metric.label}
                  </td>
                  {selectedTickers.map((ticker) => {
                    const stock = STOCKS[ticker];
                    const latestFinancial = stock?.financials[0];
                    const value = latestFinancial?.[metric.key];

                    return (
                      <td
                        key={ticker}
                        className="px-4 py-3 text-right text-sm text-foreground"
                      >
                        {value !== undefined
                          ? metric.key === 'eps'
                            ? `$${value.toFixed(2)}`
                            : formatLargeNumber(value)
                          : '-'}
                      </td>
                    );
                  })}
                </tr>
              ))}
              {/* Price row */}
              <tr className="border-b border-border">
                <td className="sticky left-0 bg-card px-4 py-3 text-sm font-medium text-foreground">
                  Current Price
                </td>
                {selectedTickers.map((ticker) => {
                  const stock = STOCKS[ticker];
                  return (
                    <td
                      key={ticker}
                      className="px-4 py-3 text-right text-sm text-foreground"
                    >
                      ${stock?.currentPrice.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
              {/* Daily change row */}
              <tr>
                <td className="sticky left-0 bg-card px-4 py-3 text-sm font-medium text-foreground">
                  Daily Change
                </td>
                {selectedTickers.map((ticker) => {
                  const stock = STOCKS[ticker];
                  const change = stock?.dailyChange || 0;
                  return (
                    <td
                      key={ticker}
                      className={cn(
                        'px-4 py-3 text-right text-sm font-medium',
                        change >= 0 ? 'text-gain' : 'text-loss'
                      )}
                    >
                      {change >= 0 ? '+' : ''}
                      {change.toFixed(2)}%
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
