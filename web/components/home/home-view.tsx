'use client'

import { useState } from 'react'

import { LogOut, TrendingUp } from 'lucide-react'

import { CompanyFilings } from '@/components/company/company-filings'
import { CompanyHistoricalMetrics } from '@/components/company/company-historical-metrics'
import { CompanyMetrics } from '@/components/company/company-metrics'
import { CompanySearch } from '@/components/company/company-search'
import { BuyStockForm } from '@/components/portfolio/buy-stock-form'
import { OperationHistory } from '@/components/portfolio/operation-history'
import { PortfolioView } from '@/components/portfolio/portfolio-view'
import { SellStockForm } from '@/components/portfolio/sell-stock-form'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { type CompanySearchResult, clearToken } from '@/lib/api'
import { navigate } from '@/lib/routing'

export function HomeView() {
  const [selectedCompany, setSelectedCompany] = useState<CompanySearchResult | null>(null)
  // Bumped after a successful purchase so the portfolio re-fetches.
  const [portfolioRefresh, setPortfolioRefresh] = useState(0)

  function handleLogout() {
    clearToken()
    navigate('login')
  }

  function handleSelect(company: CompanySearchResult) {
    setSelectedCompany((prev) => (prev?.cik === company.cik ? null : company))
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
              Kiwii - Portfolio Tracker
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

        {/* Portfolio — buy / sell forms */}
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-l-4 border-l-[#d4e64d]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Registrar Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <BuyStockForm onSuccess={() => setPortfolioRefresh((n) => n + 1)} />
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-[#d4e64d]">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Registrar Venta
              </CardTitle>
            </CardHeader>
            <CardContent>
              <SellStockForm onSuccess={() => setPortfolioRefresh((n) => n + 1)} />
            </CardContent>
          </Card>
        </div>

        {/* Portfolio — current state */}
        <Card className="border-l-4 border-l-[#d4e64d]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">Mi Portfolio</CardTitle>
          </CardHeader>
          <CardContent>
            <PortfolioView refreshSignal={portfolioRefresh} />
          </CardContent>
        </Card>

        {/* Portfolio — operation history */}
        <Card className="border-l-4 border-l-[#d4e64d]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-foreground">
              Historial de Operaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <OperationHistory refreshSignal={portfolioRefresh} />
          </CardContent>
        </Card>

        {/* Dashboard widgets — asymmetric 30/70 split on large screens */}
        <div className="grid gap-6 lg:grid-cols-[30%_1fr]">
          {/* Left column: company search (~30%) */}
          <Card className="border-l-4 border-l-[#d4e64d] self-start">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold text-foreground">
                Buscar Empresa
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CompanySearch selectedCik={selectedCompany?.cik ?? null} onSelect={handleSelect} />
            </CardContent>
          </Card>

          {/* Right column: detail panel (~70%) — only visible when a company is selected */}
          {selectedCompany && (
            <div className="flex flex-col gap-3">
              <p className="text-xs text-muted-foreground px-1">
                <span className="font-semibold text-foreground">{selectedCompany.ticker}</span>
                {' — '}
                {selectedCompany.name}
              </p>

              <Tabs defaultValue="metrics" className="w-full">
                <TabsList>
                  <TabsTrigger value="metrics">Métricas Financieras</TabsTrigger>
                  <TabsTrigger value="filings">Filings Recientes</TabsTrigger>
                  <TabsTrigger value="historical">Histórico</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics">
                  <CompanyMetrics cik={selectedCompany.cik} />
                </TabsContent>

                <TabsContent value="filings">
                  <CompanyFilings cik={selectedCompany.cik} />
                </TabsContent>

                <TabsContent value="historical">
                  <CompanyHistoricalMetrics cik={selectedCompany.cik} />
                </TabsContent>
              </Tabs>
            </div>
          )}
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
