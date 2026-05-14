'use client';

import { Briefcase, Eye, Search, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

type TabId = 'portfolio' | 'watchlist' | 'search' | 'settings';

interface TabBarProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

const tabs: { id: TabId; label: string; icon: typeof Briefcase }[] = [
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'watchlist', label: 'Watchlist', icon: Eye },
  { id: 'search', label: 'Markets', icon: Search },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export function TabBar({ activeTab, onTabChange }: TabBarProps) {
  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-40',
        'border-t border-border bg-card',
        'pb-[env(safe-area-inset-bottom)]'
      )}
      role="tablist"
      aria-label="Main navigation"
    >
      <div className="flex h-16">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex flex-1 flex-col items-center justify-center gap-1 min-h-[44px]',
                'transition-colors duration-200',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              role="tab"
              aria-selected={isActive}
              aria-label={tab.label}
            >
              <Icon className="h-6 w-6" strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
