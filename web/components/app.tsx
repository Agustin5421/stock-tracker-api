'use client';

import { useState, useEffect } from 'react';
import { useApp } from '@/lib/app-context';
import { type Position } from '@/lib/mock-data';

// Screens
import { LoginScreen } from './screens/login-screen';
import { RegisterScreen } from './screens/register-screen';
import { PortfolioScreen } from './screens/portfolio-screen';
import { PositionDetailScreen } from './screens/position-detail-screen';
import { TransactionHistoryScreen } from './screens/transaction-history-screen';
import { WatchlistScreen } from './screens/watchlist-screen';
import { CompanyDetailScreen } from './screens/company-detail-screen';
import { CompareScreen } from './screens/compare-screen';
import { SearchScreen } from './screens/search-screen';
import { SettingsScreen } from './screens/settings-screen';

// Components
import { TabBar } from './tab-bar';
import { SkeletonRow } from './skeleton-row';

type AuthScreen = 'login' | 'register';
type MainTab = 'portfolio' | 'watchlist' | 'search' | 'settings';
type Screen =
  | { type: 'auth'; screen: AuthScreen }
  | { type: 'main'; tab: MainTab }
  | { type: 'position-detail'; position: Position }
  | { type: 'transaction-history' }
  | { type: 'company-detail'; ticker: string }
  | { type: 'compare' };

export function App() {
  const { state } = useApp();
  const [currentScreen, setCurrentScreen] = useState<Screen>({ type: 'auth', screen: 'login' });
  const [activeTab, setActiveTab] = useState<MainTab>('portfolio');

  // Handle authentication state
  useEffect(() => {
    if (state.isLoading) return;

    if (state.isAuthenticated) {
      // Parse hash for initial route (Capacitor compatibility)
      const hash = window.location.hash.slice(1) || 'portfolio';
      if (['portfolio', 'watchlist', 'search', 'settings'].includes(hash)) {
        setActiveTab(hash as MainTab);
        setCurrentScreen({ type: 'main', tab: hash as MainTab });
      } else {
        setCurrentScreen({ type: 'main', tab: 'portfolio' });
      }
    } else {
      setCurrentScreen({ type: 'auth', screen: 'login' });
    }
  }, [state.isAuthenticated, state.isLoading]);

  // Update hash when tab changes
  useEffect(() => {
    if (currentScreen.type === 'main') {
      window.location.hash = currentScreen.tab;
    }
  }, [currentScreen]);

  // Handle tab change
  const handleTabChange = (tab: MainTab) => {
    setActiveTab(tab);
    setCurrentScreen({ type: 'main', tab });
  };

  // Loading state
  if (state.isLoading) {
    return (
      <div className="flex min-h-[100dvh] flex-col bg-background">
        <div className="animate-pulse p-4 pt-[env(safe-area-inset-top)]">
          <div className="h-8 w-48 rounded bg-muted" />
          <div className="mt-4 h-16 rounded-xl bg-muted" />
        </div>
        <div className="p-4">
          {[1, 2, 3].map((i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      </div>
    );
  }

  // Auth screens
  if (currentScreen.type === 'auth') {
    if (currentScreen.screen === 'register') {
      return (
        <RegisterScreen
          onNavigateToLogin={() => setCurrentScreen({ type: 'auth', screen: 'login' })}
        />
      );
    }
    return (
      <LoginScreen
        onNavigateToRegister={() => setCurrentScreen({ type: 'auth', screen: 'register' })}
      />
    );
  }

  // Position detail screen
  if (currentScreen.type === 'position-detail') {
    return (
      <PositionDetailScreen
        position={currentScreen.position}
        onBack={() => setCurrentScreen({ type: 'main', tab: 'portfolio' })}
      />
    );
  }

  // Transaction history screen
  if (currentScreen.type === 'transaction-history') {
    return (
      <TransactionHistoryScreen
        onBack={() => setCurrentScreen({ type: 'main', tab: 'portfolio' })}
      />
    );
  }

  // Company detail screen
  if (currentScreen.type === 'company-detail') {
    return (
      <CompanyDetailScreen
        ticker={currentScreen.ticker}
        onBack={() => setCurrentScreen({ type: 'main', tab: activeTab })}
      />
    );
  }

  // Compare screen
  if (currentScreen.type === 'compare') {
    return (
      <CompareScreen
        onBack={() => setCurrentScreen({ type: 'main', tab: 'watchlist' })}
      />
    );
  }

  // Main tabbed interface
  return (
    <div className="flex min-h-[100dvh] flex-col bg-background">
      {/* Tab content */}
      {activeTab === 'portfolio' && (
        <PortfolioScreen
          onViewPosition={(position) =>
            setCurrentScreen({ type: 'position-detail', position })
          }
        />
      )}
      {activeTab === 'watchlist' && (
        <WatchlistScreen
          onViewCompany={(ticker) =>
            setCurrentScreen({ type: 'company-detail', ticker })
          }
          onCompare={() => setCurrentScreen({ type: 'compare' })}
        />
      )}
      {activeTab === 'search' && (
        <SearchScreen
          onViewCompany={(ticker) =>
            setCurrentScreen({ type: 'company-detail', ticker })
          }
        />
      )}
      {activeTab === 'settings' && <SettingsScreen />}

      {/* Bottom tab bar */}
      <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
}
