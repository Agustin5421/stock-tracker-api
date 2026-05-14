'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { STOCKS, ALL_TICKERS } from '@/lib/mock-data';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (ticker: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
  showDropdown?: boolean;
  className?: string;
}

export function SearchInput({
  value,
  onChange,
  onSelect,
  placeholder = 'Search stocks...',
  autoFocus = false,
  showDropdown = true,
  className,
}: SearchInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.length > 0) {
      const searchTerm = value.toUpperCase();
      const filtered = ALL_TICKERS.filter((ticker) => {
        const stock = STOCKS[ticker];
        return (
          ticker.includes(searchTerm) ||
          stock.name.toUpperCase().includes(searchTerm)
        );
      }).slice(0, 8);
      setResults(filtered);
      setIsOpen(showDropdown && filtered.length > 0);
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [value, showDropdown]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (ticker: string) => {
    onSelect(ticker);
    onChange('');
    setIsOpen(false);
  };

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
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
        {value && (
          <button
            onClick={() => onChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-muted-foreground hover:text-foreground"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Dropdown results */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-80 overflow-y-auto rounded-xl border border-border bg-card shadow-lg">
          {results.map((ticker) => {
            const stock = STOCKS[ticker];
            return (
              <button
                key={ticker}
                onClick={() => handleSelect(ticker)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-muted min-h-[44px]"
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">{ticker}</span>
                  <span className="text-sm text-muted-foreground">{stock.name}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
