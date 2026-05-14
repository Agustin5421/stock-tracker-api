'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, Clock, X } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { STOCKS, ALL_TICKERS } from '@/lib/mock-data';
import { TickerRow } from '@/components/ticker-row';
import { cn } from '@/lib/utils';

interface SearchScreenProps {
  onViewCompany: (ticker: string) => void;
}

export function SearchScreen({ onViewCompany }: SearchScreenProps) {
  const { state, dispatch } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto-focus search input on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    if (query.length > 0) {
      const searchTerm = query.toUpperCase();
      const filtered = ALL_TICKERS.filter((ticker) => {
        const stock = STOCKS[ticker];
        return (
          ticker.includes(searchTerm) ||
          stock.name.toUpperCase().includes(searchTerm)
        );
      });
      setResults(filtered);
    } else {
      setResults([]);
    }
  }, [query]);

  const handleSelect = (ticker: string) => {
    dispatch({ type: 'ADD_RECENT_SEARCH', payload: { ticker } });
    onViewCompany(ticker);
  };

  const clearRecentSearches = () => {
    // For now, we'll just navigate away - the recent searches are managed in context
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-4 pt-[env(safe-area-inset-top)]">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Markets</h1>
        </div>

        {/* Search input */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search stocks..."
            inputMode="text"
            autoCapitalize="characters"
            autoComplete="off"
            autoCorrect="off"
            spellCheck={false}
            className={cn(
              'h-12 w-full rounded-xl border border-border bg-muted pl-10 pr-10',
              'text-foreground placeholder:text-muted-foreground',
              'focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary',
              'min-h-[44px]'
            )}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {query.length > 0 ? (
          // Search results
          <div className="divide-y divide-border border-y border-border bg-card">
            {results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <p className="text-muted-foreground">No results found</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try a different search term
                </p>
              </div>
            ) : (
              results.map((ticker) => (
                <TickerRow
                  key={ticker}
                  ticker={ticker}
                  onClick={() => handleSelect(ticker)}
                  variant="search"
                  showPnl
                />
              ))
            )}
          </div>
        ) : (
          // Recent searches and popular stocks
          <div>
            {/* Recent searches */}
            {state.recentSearches.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between px-4 py-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    Recent Searches
                  </div>
                </div>
                <div className="divide-y divide-border border-y border-border bg-card">
                  {state.recentSearches.slice(0, 5).map((ticker) => (
                    <TickerRow
                      key={ticker}
                      ticker={ticker}
                      onClick={() => handleSelect(ticker)}
                      variant="search"
                      showPnl
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Popular / All stocks */}
            <div>
              <div className="px-4 py-2">
                <span className="text-sm text-muted-foreground">Popular Stocks</span>
              </div>
              <div className="divide-y divide-border border-y border-border bg-card">
                {ALL_TICKERS.slice(0, 6).map((ticker) => (
                  <TickerRow
                    key={ticker}
                    ticker={ticker}
                    onClick={() => handleSelect(ticker)}
                    variant="search"
                    showPnl
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
