'use client'

import { LogOut, TrendingUp } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { clearToken } from '@/lib/api'
import { navigate } from '@/lib/routing'

export function HomeView() {
  function handleLogout() {
    clearToken()
    navigate('login')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#d4e64d]">
              <TrendingUp className="h-4 w-4 text-[#2d2d2d]" aria-hidden />
            </div>
            <span className="text-base font-bold text-foreground tracking-tight">
              Portfolio Tracker
            </span>
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            className="gap-1.5"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            <span>Cerrar sesion</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col items-center justify-center gap-6 px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-foreground">Bienvenido!</h1>
          <p className="text-sm text-muted-foreground">
            Sesion iniciada. El dashboard de tu portfolio estara disponible pronto.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-[#d4e64d]/50 bg-[#d4e64d]/10 px-4 py-3">
          <TrendingUp className="h-4 w-4 shrink-0 text-[#c38f42]" aria-hidden />
          <p className="text-sm text-foreground">
            La autenticacion funciona correctamente. Las funcionalidades del portfolio estaran disponibles pronto.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-4">
        <p className="text-center text-xs text-muted-foreground">
          Kiwii Portfolio Tracker &mdash; solo con fines informativos
        </p>
      </footer>
    </div>
  )
}
