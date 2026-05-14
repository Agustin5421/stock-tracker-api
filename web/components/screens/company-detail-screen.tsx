'use client';

import { useState } from 'react';
import { ArrowLeft, Plus, Check, Eye, EyeOff } from 'lucide-react';
import { STOCKS, formatCurrency, formatLargeNumber } from '@/lib/mock-data';
import { useApp } from '@/lib/app-context';
import { PnlBadge } from '@/components/pnl-badge';
import { Sparkline } from '@/components/sparkline';
import { StatCard } from '@/components/stat-card';
import { MetricChart } from '@/components/metric-chart';
import { FilingItem } from '@/components/filing-item';
import { BottomSheet } from '@/components/bottom-sheet';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface CompanyDetailScreenProps {
  ticker: string;
  onBack: () => void;
}

type TabId = 'overview' | 'financials' | 'filings';
type MetricType = 'revenue' | 'netIncome' | 'eps' | 'totalAssets' | 'totalLiabilities';

const metricLabels: Record<MetricType, string> = {
  revenue: 'Revenue',
  netIncome: 'Net Income',
  eps: 'EPS',
  totalAssets: 'Total Assets',
  totalLiabilities: 'Total Liabilities',
};

export function CompanyDetailScreen({ ticker, onBack }: CompanyDetailScreenProps) {
  const { state, dispatch } = useApp();
  const [activeTab, setActiveTab] = useState<TabId>('overview');
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('revenue');
  const [selectedFiling, setSelectedFiling] = useState<typeof stock.filings[0] | null>(null);

  const stock = STOCKS[ticker];
  if (!stock) return null;

  const isWatching = state.watchlist.some((w) => w.ticker === ticker);

  const toggleWatchlist = () => {
    if (isWatching) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: { ticker } });
    } else {
      dispatch({ type: 'ADD_TO_WATCHLIST', payload: { ticker } });
    }
  };

  // Prepare chart data
  const chartData = stock.financials.slice().reverse().map((f) => ({
    quarter: f.quarter.replace('Q', '').replace(' 20', "'"),
    value: f[selectedMetric],
  }));

  // Key stats for overview
  const latestFinancial = stock.financials[0];
  const marketCap = stock.currentPrice * 1e9 * (Math.random() * 2 + 1); // Mock market cap
  const high52w = Math.max(...stock.priceHistory) * 1.15;
  const low52w = Math.min(...stock.priceHistory) * 0.85;
  const volume = Math.floor(Math.random() * 50 + 10) * 1e6;

  const tabs: { id: TabId; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'financials', label: 'Financials' },
    { id: 'filings', label: 'Filings' },
  ];

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-4 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
              aria-label="Go back"
            >
              <ArrowLeft className="h-6 w-6 text-foreground" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-foreground">{stock.name}</h1>
              <p className="text-sm text-muted-foreground">{ticker}</p>
            </div>
          </div>
          <button
            onClick={toggleWatchlist}
            className={cn(
              'flex h-11 w-11 items-center justify-center rounded-full',
              isWatching ? 'bg-primary/15 text-primary' : 'bg-muted text-muted-foreground'
            )}
            aria-label={isWatching ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isWatching ? <Check className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
          </button>
        </div>

        {/* Price */}
        <div className="mt-4">
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold text-foreground">
              {formatCurrency(stock.currentPrice)}
            </span>
            <PnlBadge value={stock.dailyChange} size="md" />
          </div>
        </div>

        {/* Tabs */}
        <div className="mt-4 flex gap-1 rounded-xl bg-muted p-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 rounded-lg py-2 text-sm font-medium transition-colors min-h-[44px]',
                activeTab === tab.id
                  ? 'bg-card text-foreground shadow-sm'
                  : 'text-muted-foreground'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 px-4 py-4">
        {activeTab === 'overview' && (
          <div className="flex flex-col gap-4">
            {/* Sparkline */}
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="mb-2 text-sm text-muted-foreground">30-Day Price</p>
              <Sparkline
                data={stock.priceHistory}
                width={300}
                height={80}
                strokeWidth={2}
              />
            </div>

            {/* Key stats */}
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Market Cap" value={formatLargeNumber(marketCap)} />
              <StatCard label="P/E Ratio" value={(stock.currentPrice / latestFinancial.eps).toFixed(2)} />
              <StatCard label="52W High" value={formatCurrency(high52w)} />
              <StatCard label="52W Low" value={formatCurrency(low52w)} />
              <StatCard label="Volume" value={formatLargeNumber(volume).replace('$', '')} />
              <StatCard label="EPS" value={`$${latestFinancial.eps.toFixed(2)}`} />
            </div>
          </div>
        )}

        {activeTab === 'financials' && (
          <div className="flex flex-col gap-4">
            {/* Metric selector */}
            <div className="flex flex-wrap gap-2">
              {(Object.keys(metricLabels) as MetricType[]).map((metric) => (
                <button
                  key={metric}
                  onClick={() => setSelectedMetric(metric)}
                  className={cn(
                    'rounded-full px-3 py-1.5 text-sm font-medium min-h-[36px]',
                    selectedMetric === metric
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {metricLabels[metric]}
                </button>
              ))}
            </div>

            {/* Chart */}
            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="mb-4 text-sm font-semibold text-muted-foreground">
                {metricLabels[selectedMetric]} by Quarter
              </h3>
              <MetricChart data={chartData} />
            </div>

            {/* Data table */}
            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">
                      Quarter
                    </th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">
                      Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {stock.financials.map((f, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 text-sm text-foreground">{f.quarter}</td>
                      <td className="px-4 py-3 text-right text-sm font-medium text-foreground">
                        {selectedMetric === 'eps'
                          ? `$${f[selectedMetric].toFixed(2)}`
                          : formatLargeNumber(f[selectedMetric])}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'filings' && (
          <div className="flex flex-col gap-3">
            {stock.filings.map((filing, i) => (
              <FilingItem
                key={i}
                filing={filing}
                onClick={() => setSelectedFiling(filing)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Filing detail sheet */}
      <BottomSheet
        isOpen={!!selectedFiling}
        onClose={() => setSelectedFiling(null)}
        title="Filing Details"
      >
        {selectedFiling && (
          <div className="flex flex-col gap-4 pb-4">
            <div className="flex items-center gap-3">
              <span
                className={cn(
                  'rounded-md px-3 py-1 text-sm font-semibold',
                  selectedFiling.formType === '10-K'
                    ? 'bg-primary/15 text-primary'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {selectedFiling.formType}
              </span>
              <span className="text-muted-foreground">{selectedFiling.date}</span>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="mt-1 text-foreground">{selectedFiling.description}</p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Accession Number</p>
              <p className="mt-1 font-mono text-sm text-foreground">
                {selectedFiling.accessionNumber}
              </p>
            </div>

            <div>
              <p className="text-sm text-muted-foreground">Form Type</p>
              <p className="mt-1 text-foreground">
                {selectedFiling.formType === '10-K'
                  ? 'Annual Report - Comprehensive overview of company business and financial condition'
                  : 'Quarterly Report - Unaudited financial statements and company updates'}
              </p>
            </div>

            <Button variant="outline" className="mt-2 min-h-[44px]">
              View Full Filing (Mock)
            </Button>
          </div>
        )}
      </BottomSheet>
    </div>
  );
}
