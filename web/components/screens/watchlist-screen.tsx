'use client';

import { useState } from 'react';
import { Plus, BarChart2 } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { STOCKS } from '@/lib/mock-data';
import { TickerRow } from '@/components/ticker-row';
import { BottomSheet } from '@/components/bottom-sheet';
import { SearchInput } from '@/components/search-input';
import { ConfirmSheet } from '@/components/confirm-sheet';
import { Button } from '@/components/ui/button';

interface WatchlistScreenProps {
  onViewCompany: (ticker: string) => void;
  onCompare: () => void;
}

export function WatchlistScreen({ onViewCompany, onCompare }: WatchlistScreenProps) {
  const { state, dispatch } = useApp();
  const [isAddSheetOpen, setIsAddSheetOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingTicker, setDeletingTicker] = useState<string | null>(null);

  const handleAddToWatchlist = (ticker: string) => {
    dispatch({ type: 'ADD_TO_WATCHLIST', payload: { ticker } });
    setSearchQuery('');
    setIsAddSheetOpen(false);
  };

  const handleRemoveFromWatchlist = () => {
    if (deletingTicker) {
      dispatch({ type: 'REMOVE_FROM_WATCHLIST', payload: { ticker: deletingTicker } });
      setDeletingTicker(null);
    }
  };

  return (
    <div className="flex flex-col pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-4 pt-[env(safe-area-inset-top)]">
        <div className="flex items-center justify-between pt-4">
          <h1 className="text-2xl font-bold text-foreground">Watchlist</h1>
          {state.watchlist.length >= 2 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCompare}
              className="gap-2"
            >
              <BarChart2 className="h-4 w-4" />
              Compare
            </Button>
          )}
        </div>
      </div>

      {/* Watchlist */}
      <div className="mt-4">
        <div className="divide-y divide-border border-y border-border bg-card">
          {state.watchlist.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-muted-foreground">Your watchlist is empty</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add stocks to track their performance
              </p>
            </div>
          ) : (
            state.watchlist.map((item) => {
              const stock = STOCKS[item.ticker];
              if (!stock) return null;

              return (
                <TickerRow
                  key={item.ticker}
                  ticker={item.ticker}
                  onClick={() => onViewCompany(item.ticker)}
                  onDelete={() => setDeletingTicker(item.ticker)}
                  variant="watchlist"
                />
              );
            })
          )}
        </div>
      </div>

      {/* Add to watchlist button */}
      <div className="px-4 pt-4">
        <Button
          variant="outline"
          onClick={() => setIsAddSheetOpen(true)}
          className="min-h-[44px] w-full gap-2"
        >
          <Plus className="h-5 w-5" />
          Add to Watchlist
        </Button>
      </div>

      {/* Add to Watchlist Sheet */}
      <BottomSheet
        isOpen={isAddSheetOpen}
        onClose={() => {
          setIsAddSheetOpen(false);
          setSearchQuery('');
        }}
        title="Add to Watchlist"
      >
        <div className="pb-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            onSelect={handleAddToWatchlist}
            placeholder="Search ticker or company..."
            autoFocus
          />

          {/* Already watching hint */}
          {state.watchlist.length > 0 && (
            <p className="mt-4 text-sm text-muted-foreground">
              Currently watching: {state.watchlist.map((w) => w.ticker).join(', ')}
            </p>
          )}
        </div>
      </BottomSheet>

      {/* Remove Confirmation */}
      <ConfirmSheet
        isOpen={!!deletingTicker}
        onClose={() => setDeletingTicker(null)}
        onConfirm={handleRemoveFromWatchlist}
        title="Remove from Watchlist"
        description={`Remove ${deletingTicker ? STOCKS[deletingTicker]?.name : ''} from your watchlist?`}
        confirmLabel="Remove"
        isDestructive
      />
    </div>
  );
}
