'use client'

import { LogOut, TrendingUp } from 'lucide-react'

import { CompanySearch } from '@/components/company/company-search'
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

          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-1.5">
            <LogOut className="h-4 w-4" aria-hidden />
            <span>Cerrar sesion</span>
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 px-4 py-12 sm:px-6 lg:px-8">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground">Bienvenido!</h1>
          <p className="text-sm text-muted-foreground">
            Busca empresas para analizar tu portfolio.
          </p>
        </div>

        <CompanySearch />
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
