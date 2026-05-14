'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { BottomSheet } from '@/components/bottom-sheet';
import { SearchInput } from '@/components/search-input';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/app-context';
import { STOCKS, type Position } from '@/lib/mock-data';
import { cn } from '@/lib/utils';

interface AddPositionSheetProps {
  isOpen: boolean;
  onClose: () => void;
  editingPosition?: Position;
}

export function AddPositionSheet({ isOpen, onClose, editingPosition }: AddPositionSheetProps) {
  const { dispatch } = useApp();
  const [ticker, setTicker] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [operationType, setOperationType] = useState<'BUY' | 'SELL'>('BUY');
  const [errors, setErrors] = useState<string[]>([]);

  // Reset form when sheet opens/closes or editing position changes
  useEffect(() => {
    if (isOpen) {
      if (editingPosition) {
        setTicker(editingPosition.ticker);
        setSearchQuery('');
        setQuantity('');
        setPrice(STOCKS[editingPosition.ticker]?.currentPrice.toString() || '');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setOperationType('BUY');
      } else {
        setTicker('');
        setSearchQuery('');
        setQuantity('');
        setPrice('');
        setDate(format(new Date(), 'yyyy-MM-dd'));
        setOperationType('BUY');
      }
      setErrors([]);
    }
  }, [isOpen, editingPosition]);

  const handleTickerSelect = (selectedTicker: string) => {
    setTicker(selectedTicker);
    setSearchQuery('');
    // Auto-fill current price
    const stock = STOCKS[selectedTicker];
    if (stock) {
      setPrice(stock.currentPrice.toString());
    }
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!ticker) {
      newErrors.push('Please select a ticker');
    }

    const qty = parseFloat(quantity);
    if (!quantity || isNaN(qty) || qty <= 0) {
      newErrors.push('Quantity must be greater than 0');
    }

    const priceNum = parseFloat(price);
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      newErrors.push('Price must be greater than 0');
    }

    if (!date) {
      newErrors.push('Date is required');
    }

    // Check if selling more than owned
    if (editingPosition && operationType === 'SELL') {
      const qty = parseFloat(quantity);
      if (qty > editingPosition.shares) {
        newErrors.push(`Cannot sell more than ${editingPosition.shares} shares owned`);
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const qty = parseFloat(quantity);
    const priceNum = parseFloat(price);

    if (editingPosition) {
      dispatch({
        type: 'EDIT_POSITION',
        payload: {
          positionId: editingPosition.id,
          ticker,
          quantity: qty,
          price: priceNum,
          date,
          operationType,
        },
      });
    } else {
      dispatch({
        type: 'ADD_POSITION',
        payload: {
          ticker,
          quantity: qty,
          price: priceNum,
          date,
        },
      });
    }

    onClose();
  };

  const stock = ticker ? STOCKS[ticker] : null;

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title={editingPosition ? 'Add Transaction' : 'Add Position'}
    >
      <div className="flex flex-col gap-5 pb-4">
        {/* Ticker search (only for new positions) */}
        {!editingPosition ? (
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Ticker</Label>
            {ticker ? (
              <button
                onClick={() => setTicker('')}
                className="flex items-center justify-between rounded-xl border border-border bg-muted p-3 text-left"
              >
                <div>
                  <span className="font-semibold text-foreground">{ticker}</span>
                  <span className="ml-2 text-muted-foreground">{stock?.name}</span>
                </div>
                <span className="text-sm text-primary">Change</span>
              </button>
            ) : (
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                onSelect={handleTickerSelect}
                placeholder="Search ticker or company..."
              />
            )}
          </div>
        ) : (
          <div className="rounded-xl border border-border bg-muted p-3">
            <span className="font-semibold text-foreground">{ticker}</span>
            <span className="ml-2 text-muted-foreground">{stock?.name}</span>
          </div>
        )}

        {/* Operation type toggle (only for editing) */}
        {editingPosition && (
          <div className="flex flex-col gap-2">
            <Label className="text-foreground">Operation Type</Label>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setOperationType('BUY')}
                className={cn(
                  'flex h-12 items-center justify-center rounded-xl border font-medium',
                  operationType === 'BUY'
                    ? 'border-gain bg-gain/15 text-gain'
                    : 'border-border bg-muted text-muted-foreground'
                )}
              >
                Buy
              </button>
              <button
                onClick={() => setOperationType('SELL')}
                className={cn(
                  'flex h-12 items-center justify-center rounded-xl border font-medium',
                  operationType === 'SELL'
                    ? 'border-loss bg-loss/15 text-loss'
                    : 'border-border bg-muted text-muted-foreground'
                )}
              >
                Sell
              </button>
            </div>
          </div>
        )}

        {/* Quantity */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="quantity" className="text-foreground">
            Quantity
          </Label>
          <Input
            id="quantity"
            type="number"
            inputMode="decimal"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Number of shares"
            min="0"
            step="any"
            className="min-h-[44px]"
          />
          {editingPosition && operationType === 'SELL' && (
            <p className="text-xs text-muted-foreground">
              You own {editingPosition.shares} shares
            </p>
          )}
        </div>

        {/* Price per share */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="price" className="text-foreground">
            Price per Share
          </Label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              $
            </span>
            <Input
              id="price"
              type="number"
              inputMode="decimal"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="min-h-[44px] pl-7"
            />
          </div>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-2">
          <Label htmlFor="date" className="text-foreground">
            Date of Operation
          </Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="min-h-[44px]"
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="rounded-lg bg-destructive/10 p-3" role="alert">
            <ul className="flex flex-col gap-1 text-sm text-destructive">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Submit button */}
        <Button
          onClick={handleSubmit}
          className="min-h-[44px] w-full"
        >
          Confirm
        </Button>
      </div>
    </BottomSheet>
  );
}
