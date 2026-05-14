'use client';

import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/app-context';

interface LoginScreenProps {
  onNavigateToRegister: () => void;
}

export function LoginScreen({ onNavigateToRegister }: LoginScreenProps) {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setIsLoading(true);

    // Mock login - always succeeds with non-empty credentials
    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch({ type: 'LOGIN', payload: { email } });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-6 py-12">
      {/* Logo and title */}
      <div className="mb-12 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <TrendingUp className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Portfolio Tracker</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Track your US stock investments
        </p>
      </div>

      {/* Login form */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email" className="text-foreground">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="min-h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="min-h-[44px]"
            />
          </div>

          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 min-h-[44px] w-full"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </div>

        {/* Register link */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-muted-foreground">
            {"Don't have an account?"}{' '}
            <button
              type="button"
              onClick={onNavigateToRegister}
              className="font-semibold text-primary hover:underline"
            >
              Create account
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
