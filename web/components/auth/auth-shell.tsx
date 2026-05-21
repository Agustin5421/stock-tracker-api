'use client'

import { TrendingUp } from 'lucide-react'

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4e64d]">
              <TrendingUp className="h-4 w-4 text-[#2d2d2d]" aria-hidden />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              Portfolio Tracker
            </span>
          </div>
        </div>
      </header>

      {/* Centered form area */}
      <main className="flex flex-1 items-center justify-center px-4 py-12">{children}</main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          Kiwii Portfolio Tracker &mdash; solo con fines informativos
        </p>
      </footer>
    </div>
  )
}
