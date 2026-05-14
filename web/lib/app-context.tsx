'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import {
  Position,
  Transaction,
  WatchlistItem,
  DEFAULT_POSITIONS,
  DEFAULT_WATCHLIST,
  generateId,
  STOCKS,
} from './mock-data';

// Storage keys
const STORAGE_KEYS = {
  AUTH: 'portfolio-auth',
  POSITIONS: 'portfolio-positions',
  WATCHLIST: 'portfolio-watchlist',
  RECENT_SEARCHES: 'portfolio-recent-searches',
  THEME: 'portfolio-theme',
  LAST_PRICE_UPDATE: 'portfolio-last-price-update',
};

// App State
interface AppState {
  isAuthenticated: boolean;
  userEmail: string | null;
  positions: Position[];
  watchlist: WatchlistItem[];
  recentSearches: string[];
  theme: 'dark' | 'light';
  lastPriceUpdate: string;
  isLoading: boolean;
}

// Actions
type AppAction =
  | { type: 'LOGIN'; payload: { email: string } }
  | { type: 'LOGOUT' }
  | { type: 'LOAD_STATE'; payload: Partial<AppState> }
  | { type: 'ADD_POSITION'; payload: { ticker: string; quantity: number; price: number; date: string } }
  | { type: 'EDIT_POSITION'; payload: { positionId: string; ticker: string; quantity: number; price: number; date: string; operationType: 'BUY' | 'SELL' } }
  | { type: 'DELETE_POSITION'; payload: { positionId: string } }
  | { type: 'ADD_TRANSACTION'; payload: { positionId: string; type: 'BUY' | 'SELL'; quantity: number; price: number; date: string } }
  | { type: 'ADD_TO_WATCHLIST'; payload: { ticker: string } }
  | { type: 'REMOVE_FROM_WATCHLIST'; payload: { ticker: string } }
  | { type: 'ADD_RECENT_SEARCH'; payload: { ticker: string } }
  | { type: 'TOGGLE_THEME' }
  | { type: 'UPDATE_PRICES' }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AppState = {
  isAuthenticated: false,
  userEmail: null,
  positions: [],
  watchlist: [],
  recentSearches: [],
  theme: 'dark',
  lastPriceUpdate: new Date().toISOString(),
  isLoading: true,
};

// Reducer
function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        isAuthenticated: true,
        userEmail: action.payload.email,
        positions: state.positions.length > 0 ? state.positions : DEFAULT_POSITIONS,
        watchlist: state.watchlist.length > 0 ? state.watchlist : DEFAULT_WATCHLIST,
      };

    case 'LOGOUT':
      return {
        ...initialState,
        isLoading: false,
        theme: state.theme,
      };

    case 'LOAD_STATE':
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };

    case 'ADD_POSITION': {
      const { ticker, quantity, price, date } = action.payload;
      const existingPosition = state.positions.find((p) => p.ticker === ticker);

      if (existingPosition) {
        // Add transaction to existing position
        const newTransaction: Transaction = {
          id: generateId(),
          ticker,
          type: 'BUY',
          quantity,
          price,
          date,
        };
        const updatedShares = existingPosition.shares + quantity;
        const totalCost = existingPosition.avgCost * existingPosition.shares + price * quantity;
        const newAvgCost = totalCost / updatedShares;

        return {
          ...state,
          positions: state.positions.map((p) =>
            p.id === existingPosition.id
              ? {
                  ...p,
                  shares: updatedShares,
                  avgCost: newAvgCost,
                  transactions: [...p.transactions, newTransaction],
                }
              : p
          ),
        };
      }

      // Create new position
      const newPosition: Position = {
        id: generateId(),
        ticker,
        shares: quantity,
        avgCost: price,
        transactions: [
          {
            id: generateId(),
            ticker,
            type: 'BUY',
            quantity,
            price,
            date,
          },
        ],
      };

      return {
        ...state,
        positions: [...state.positions, newPosition],
      };
    }

    case 'EDIT_POSITION': {
      const { positionId, quantity, price, date, operationType } = action.payload;
      const position = state.positions.find((p) => p.id === positionId);
      if (!position) return state;

      const newTransaction: Transaction = {
        id: generateId(),
        ticker: position.ticker,
        type: operationType,
        quantity,
        price,
        date,
      };

      if (operationType === 'BUY') {
        const updatedShares = position.shares + quantity;
        const totalCost = position.avgCost * position.shares + price * quantity;
        const newAvgCost = totalCost / updatedShares;

        return {
          ...state,
          positions: state.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  shares: updatedShares,
                  avgCost: newAvgCost,
                  transactions: [...p.transactions, newTransaction],
                }
              : p
          ),
        };
      } else {
        // SELL
        const updatedShares = position.shares - quantity;
        if (updatedShares <= 0) {
          // Remove position entirely
          return {
            ...state,
            positions: state.positions.filter((p) => p.id !== positionId),
          };
        }

        return {
          ...state,
          positions: state.positions.map((p) =>
            p.id === positionId
              ? {
                  ...p,
                  shares: updatedShares,
                  transactions: [...p.transactions, newTransaction],
                }
              : p
          ),
        };
      }
    }

    case 'DELETE_POSITION':
      return {
        ...state,
        positions: state.positions.filter((p) => p.id !== action.payload.positionId),
      };

    case 'ADD_TRANSACTION': {
      const { positionId, type, quantity, price, date } = action.payload;
      const position = state.positions.find((p) => p.id === positionId);
      if (!position) return state;

      const newTransaction: Transaction = {
        id: generateId(),
        ticker: position.ticker,
        type,
        quantity,
        price,
        date,
      };

      let updatedShares = position.shares;
      let updatedAvgCost = position.avgCost;

      if (type === 'BUY') {
        const totalCost = position.avgCost * position.shares + price * quantity;
        updatedShares = position.shares + quantity;
        updatedAvgCost = totalCost / updatedShares;
      } else {
        updatedShares = position.shares - quantity;
        if (updatedShares <= 0) {
          return {
            ...state,
            positions: state.positions.filter((p) => p.id !== positionId),
          };
        }
      }

      return {
        ...state,
        positions: state.positions.map((p) =>
          p.id === positionId
            ? {
                ...p,
                shares: updatedShares,
                avgCost: updatedAvgCost,
                transactions: [...p.transactions, newTransaction],
              }
            : p
        ),
      };
    }

    case 'ADD_TO_WATCHLIST': {
      const exists = state.watchlist.some((w) => w.ticker === action.payload.ticker);
      if (exists) return state;

      return {
        ...state,
        watchlist: [
          ...state.watchlist,
          { ticker: action.payload.ticker, addedAt: new Date().toISOString() },
        ],
      };
    }

    case 'REMOVE_FROM_WATCHLIST':
      return {
        ...state,
        watchlist: state.watchlist.filter((w) => w.ticker !== action.payload.ticker),
      };

    case 'ADD_RECENT_SEARCH': {
      const { ticker } = action.payload;
      const filtered = state.recentSearches.filter((t) => t !== ticker);
      return {
        ...state,
        recentSearches: [ticker, ...filtered].slice(0, 10),
      };
    }

    case 'TOGGLE_THEME':
      return {
        ...state,
        theme: state.theme === 'dark' ? 'light' : 'dark',
      };

    case 'UPDATE_PRICES':
      return {
        ...state,
        lastPriceUpdate: new Date().toISOString(),
      };

    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
}

// Context
const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
  // Computed values
  totalPortfolioValue: number;
  totalGainLoss: number;
  totalGainLossPercentage: number;
} | null>(null);

// Provider
export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const auth = localStorage.getItem(STORAGE_KEYS.AUTH);
      const positions = localStorage.getItem(STORAGE_KEYS.POSITIONS);
      const watchlist = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      const recentSearches = localStorage.getItem(STORAGE_KEYS.RECENT_SEARCHES);
      const theme = localStorage.getItem(STORAGE_KEYS.THEME);
      const lastPriceUpdate = localStorage.getItem(STORAGE_KEYS.LAST_PRICE_UPDATE);

      const loadedState: Partial<AppState> = {};

      if (auth) {
        const authData = JSON.parse(auth);
        loadedState.isAuthenticated = authData.isAuthenticated;
        loadedState.userEmail = authData.email;
      }

      if (positions) {
        loadedState.positions = JSON.parse(positions);
      }

      if (watchlist) {
        loadedState.watchlist = JSON.parse(watchlist);
      }

      if (recentSearches) {
        loadedState.recentSearches = JSON.parse(recentSearches);
      }

      if (theme === 'light' || theme === 'dark') {
        loadedState.theme = theme;
      }

      if (lastPriceUpdate) {
        loadedState.lastPriceUpdate = lastPriceUpdate;
      }

      dispatch({ type: 'LOAD_STATE', payload: loadedState });
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, []);

  // Save state to localStorage on changes
  useEffect(() => {
    if (state.isLoading) return;

    localStorage.setItem(
      STORAGE_KEYS.AUTH,
      JSON.stringify({ isAuthenticated: state.isAuthenticated, email: state.userEmail })
    );
    localStorage.setItem(STORAGE_KEYS.POSITIONS, JSON.stringify(state.positions));
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(state.watchlist));
    localStorage.setItem(STORAGE_KEYS.RECENT_SEARCHES, JSON.stringify(state.recentSearches));
    localStorage.setItem(STORAGE_KEYS.THEME, state.theme);
    localStorage.setItem(STORAGE_KEYS.LAST_PRICE_UPDATE, state.lastPriceUpdate);
  }, [state]);

  // Apply theme class to document
  useEffect(() => {
    if (state.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [state.theme]);

  // Computed values
  const totalPortfolioValue = state.positions.reduce((total, position) => {
    const stock = STOCKS[position.ticker];
    if (!stock) return total;
    return total + stock.currentPrice * position.shares;
  }, 0);

  const totalCostBasis = state.positions.reduce((total, position) => {
    return total + position.avgCost * position.shares;
  }, 0);

  const totalGainLoss = totalPortfolioValue - totalCostBasis;
  const totalGainLossPercentage = totalCostBasis > 0 ? (totalGainLoss / totalCostBasis) * 100 : 0;

  return (
    <AppContext.Provider
      value={{
        state,
        dispatch,
        totalPortfolioValue,
        totalGainLoss,
        totalGainLossPercentage,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

// Hook
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
