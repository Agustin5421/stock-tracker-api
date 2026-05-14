'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import { User, RefreshCw, LogOut, Moon, Sun, Info } from 'lucide-react';
import { useApp } from '@/lib/app-context';
import { Button } from '@/components/ui/button';
import { ConfirmSheet } from '@/components/confirm-sheet';
import { cn } from '@/lib/utils';

export function SettingsScreen() {
  const { state, dispatch } = useApp();
  const [isUpdatingPrices, setIsUpdatingPrices] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);

  const handleUpdatePrices = async () => {
    setIsUpdatingPrices(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    dispatch({ type: 'UPDATE_PRICES' });
    setIsUpdatingPrices(false);
  };

  const handleLogout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  const handleToggleTheme = () => {
    dispatch({ type: 'TOGGLE_THEME' });
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background pb-20">
      {/* Header */}
      <div className="bg-card px-4 pb-4 pt-[env(safe-area-inset-top)]">
        <div className="pt-4">
          <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-6 px-4 py-4">
        {/* User info */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15">
              <User className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{state.userEmail}</p>
              <p className="text-sm text-muted-foreground">Logged in</p>
            </div>
          </div>
        </div>

        {/* Price update */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Price Data</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Last updated: {format(new Date(state.lastPriceUpdate), 'MMM d, yyyy HH:mm')}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleUpdatePrices}
              disabled={isUpdatingPrices}
              className="gap-2 min-h-[44px]"
            >
              <RefreshCw
                className={cn('h-4 w-4', isUpdatingPrices && 'animate-spin')}
              />
              {isUpdatingPrices ? 'Updating...' : 'Update'}
            </Button>
          </div>
        </div>

        {/* Theme toggle */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {state.theme === 'dark' ? (
                <Moon className="h-5 w-5 text-muted-foreground" />
              ) : (
                <Sun className="h-5 w-5 text-muted-foreground" />
              )}
              <div>
                <p className="font-medium text-foreground">Theme</p>
                <p className="text-sm text-muted-foreground">
                  {state.theme === 'dark' ? 'Dark mode' : 'Light mode'}
                </p>
              </div>
            </div>
            <button
              onClick={handleToggleTheme}
              className={cn(
                'relative h-7 w-12 rounded-full transition-colors min-h-[44px] min-w-[44px]',
                state.theme === 'dark' ? 'bg-primary' : 'bg-muted'
              )}
              role="switch"
              aria-checked={state.theme === 'dark'}
              aria-label="Toggle theme"
            >
              <span
                className={cn(
                  'absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform',
                  state.theme === 'dark' ? 'left-6' : 'left-1'
                )}
              />
            </button>
          </div>
        </div>

        {/* App info */}
        <div className="rounded-xl border border-border bg-card p-4">
          <div className="flex items-center gap-3">
            <Info className="h-5 w-5 text-muted-foreground" />
            <div>
              <p className="font-medium text-foreground">Portfolio Tracker</p>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Universidad Austral - ACS 2026
              </p>
            </div>
          </div>
        </div>

        {/* Sign out */}
        <div className="mt-auto">
          <Button
            variant="outline"
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="min-h-[44px] w-full gap-2 text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            <LogOut className="h-5 w-5" />
            Sign out
          </Button>
        </div>
      </div>

      {/* Logout confirmation */}
      <ConfirmSheet
        isOpen={isLogoutConfirmOpen}
        onClose={() => setIsLogoutConfirmOpen(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        description="Are you sure you want to sign out? Your portfolio data will be preserved for your next session."
        confirmLabel="Sign Out"
        isDestructive
      />
    </div>
  );
}
