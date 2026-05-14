'use client';

import { useState } from 'react';
import { TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApp } from '@/lib/app-context';

interface RegisterScreenProps {
  onNavigateToLogin: () => void;
}

export function RegisterScreen({ onNavigateToLogin }: RegisterScreenProps) {
  const { dispatch } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      newErrors.push('Email is required');
    } else if (!emailRegex.test(email)) {
      newErrors.push('Please enter a valid email address');
    }

    // Password validation
    if (!password) {
      newErrors.push('Password is required');
    } else if (password.length < 8) {
      newErrors.push('Password must be at least 8 characters');
    }

    // Confirm password
    if (!confirmPassword) {
      newErrors.push('Please confirm your password');
    } else if (password !== confirmPassword) {
      newErrors.push('Passwords do not match');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    // Mock registration - always succeeds
    await new Promise((resolve) => setTimeout(resolve, 800));

    dispatch({ type: 'LOGIN', payload: { email } });
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[100dvh] flex-col bg-background px-6 py-6">
      {/* Back button */}
      <button
        onClick={onNavigateToLogin}
        className="mb-4 flex h-11 w-11 items-center justify-center rounded-full hover:bg-muted"
        aria-label="Go back to login"
      >
        <ArrowLeft className="h-6 w-6 text-foreground" />
      </button>

      {/* Logo and title */}
      <div className="mb-8 flex flex-col items-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
          <TrendingUp className="h-8 w-8 text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-bold text-foreground">Create Account</h1>
        <p className="mt-2 text-center text-muted-foreground">
          Start tracking your portfolio today
        </p>
      </div>

      {/* Register form */}
      <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Label htmlFor="reg-email" className="text-foreground">
              Email
            </Label>
            <Input
              id="reg-email"
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
            <Label htmlFor="reg-password" className="text-foreground">
              Password
            </Label>
            <Input
              id="reg-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 8 characters"
              className="min-h-[44px]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password" className="text-foreground">
              Confirm Password
            </Label>
            <Input
              id="confirm-password"
              type="password"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="min-h-[44px]"
            />
          </div>

          {errors.length > 0 && (
            <div className="rounded-lg bg-destructive/10 p-3" role="alert">
              <ul className="flex flex-col gap-1 text-sm text-destructive">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="mt-4 min-h-[44px] w-full"
          >
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </div>

        {/* Login link */}
        <div className="mt-auto pt-8 text-center">
          <p className="text-muted-foreground">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onNavigateToLogin}
              className="font-semibold text-primary hover:underline"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
