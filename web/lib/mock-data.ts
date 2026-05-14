// Mock stock data for US Stock Portfolio Tracker
// All values are realistic as of early 2026

export interface StockData {
  ticker: string;
  name: string;
  currentPrice: number;
  dailyChange: number; // percentage
  priceHistory: number[]; // 30-day history
  financials: {
    quarter: string;
    revenue: number;
    netIncome: number;
    eps: number;
    totalAssets: number;
    totalLiabilities: number;
  }[];
  filings: {
    formType: string;
    date: string;
    description: string;
    accessionNumber: string;
  }[];
}

export interface Position {
  id: string;
  ticker: string;
  shares: number;
  avgCost: number;
  transactions: Transaction[];
}

export interface Transaction {
  id: string;
  ticker: string;
  type: 'BUY' | 'SELL';
  quantity: number;
  price: number;
  date: string;
}

export interface WatchlistItem {
  ticker: string;
  addedAt: string;
}

// Generate realistic 30-day price history
function generatePriceHistory(basePrice: number, volatility: number = 0.02): number[] {
  const history: number[] = [];
  let price = basePrice * (1 - volatility * 15);
  for (let i = 0; i < 30; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, price * 0.95);
    history.push(Math.round(price * 100) / 100);
  }
  // Ensure last price matches current
  history[29] = basePrice;
  return history;
}

export const STOCKS: Record<string, StockData> = {
  AAPL: {
    ticker: 'AAPL',
    name: 'Apple Inc.',
    currentPrice: 198.45,
    dailyChange: 1.24,
    priceHistory: generatePriceHistory(198.45),
    financials: [
      { quarter: 'Q1 2026', revenue: 124500000000, netIncome: 33200000000, eps: 2.18, totalAssets: 352000000000, totalLiabilities: 287000000000 },
      { quarter: 'Q4 2025', revenue: 119800000000, netIncome: 30100000000, eps: 1.97, totalAssets: 348000000000, totalLiabilities: 283000000000 },
      { quarter: 'Q3 2025', revenue: 85700000000, netIncome: 21500000000, eps: 1.40, totalAssets: 345000000000, totalLiabilities: 280000000000 },
      { quarter: 'Q2 2025', revenue: 94800000000, netIncome: 24100000000, eps: 1.57, totalAssets: 341000000000, totalLiabilities: 276000000000 },
      { quarter: 'Q1 2025', revenue: 117200000000, netIncome: 31000000000, eps: 2.02, totalAssets: 338000000000, totalLiabilities: 273000000000 },
      { quarter: 'Q4 2024', revenue: 111400000000, netIncome: 28700000000, eps: 1.87, totalAssets: 335000000000, totalLiabilities: 270000000000 },
      { quarter: 'Q3 2024', revenue: 81800000000, netIncome: 19900000000, eps: 1.29, totalAssets: 331000000000, totalLiabilities: 267000000000 },
      { quarter: 'Q2 2024', revenue: 90800000000, netIncome: 23600000000, eps: 1.54, totalAssets: 328000000000, totalLiabilities: 264000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2025-10-30', description: 'Annual Report for fiscal year 2025', accessionNumber: '0000320193-25-000106' },
      { formType: '10-Q', date: '2025-08-01', description: 'Quarterly Report for Q3 2025', accessionNumber: '0000320193-25-000078' },
      { formType: '10-Q', date: '2025-05-02', description: 'Quarterly Report for Q2 2025', accessionNumber: '0000320193-25-000052' },
      { formType: '10-Q', date: '2025-02-01', description: 'Quarterly Report for Q1 2025', accessionNumber: '0000320193-25-000018' },
      { formType: '10-K', date: '2024-10-31', description: 'Annual Report for fiscal year 2024', accessionNumber: '0000320193-24-000108' },
    ],
  },
  MSFT: {
    ticker: 'MSFT',
    name: 'Microsoft Corporation',
    currentPrice: 445.80,
    dailyChange: 0.87,
    priceHistory: generatePriceHistory(445.80),
    financials: [
      { quarter: 'Q1 2026', revenue: 65200000000, netIncome: 24800000000, eps: 3.33, totalAssets: 512000000000, totalLiabilities: 198000000000 },
      { quarter: 'Q4 2025', revenue: 62400000000, netIncome: 23100000000, eps: 3.10, totalAssets: 498000000000, totalLiabilities: 192000000000 },
      { quarter: 'Q3 2025', revenue: 59800000000, netIncome: 21500000000, eps: 2.89, totalAssets: 485000000000, totalLiabilities: 187000000000 },
      { quarter: 'Q2 2025', revenue: 56500000000, netIncome: 19800000000, eps: 2.66, totalAssets: 472000000000, totalLiabilities: 182000000000 },
      { quarter: 'Q1 2025', revenue: 52900000000, netIncome: 18200000000, eps: 2.45, totalAssets: 460000000000, totalLiabilities: 178000000000 },
      { quarter: 'Q4 2024', revenue: 50100000000, netIncome: 16800000000, eps: 2.26, totalAssets: 448000000000, totalLiabilities: 174000000000 },
      { quarter: 'Q3 2024', revenue: 48200000000, netIncome: 15700000000, eps: 2.11, totalAssets: 436000000000, totalLiabilities: 170000000000 },
      { quarter: 'Q2 2024', revenue: 46200000000, netIncome: 14500000000, eps: 1.95, totalAssets: 424000000000, totalLiabilities: 166000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2025-07-31', description: 'Annual Report for fiscal year 2025', accessionNumber: '0000789019-25-000089' },
      { formType: '10-Q', date: '2025-04-30', description: 'Quarterly Report for Q3 2025', accessionNumber: '0000789019-25-000056' },
      { formType: '10-Q', date: '2025-01-31', description: 'Quarterly Report for Q2 2025', accessionNumber: '0000789019-25-000023' },
      { formType: '10-Q', date: '2024-10-31', description: 'Quarterly Report for Q1 2025', accessionNumber: '0000789019-24-000112' },
      { formType: '10-K', date: '2024-07-31', description: 'Annual Report for fiscal year 2024', accessionNumber: '0000789019-24-000087' },
    ],
  },
  GOOGL: {
    ticker: 'GOOGL',
    name: 'Alphabet Inc.',
    currentPrice: 178.90,
    dailyChange: -0.56,
    priceHistory: generatePriceHistory(178.90),
    financials: [
      { quarter: 'Q1 2026', revenue: 92400000000, netIncome: 26100000000, eps: 2.12, totalAssets: 432000000000, totalLiabilities: 112000000000 },
      { quarter: 'Q4 2025', revenue: 88700000000, netIncome: 24500000000, eps: 1.99, totalAssets: 418000000000, totalLiabilities: 108000000000 },
      { quarter: 'Q3 2025', revenue: 84200000000, netIncome: 22800000000, eps: 1.85, totalAssets: 405000000000, totalLiabilities: 104000000000 },
      { quarter: 'Q2 2025', revenue: 80500000000, netIncome: 21200000000, eps: 1.72, totalAssets: 392000000000, totalLiabilities: 100000000000 },
      { quarter: 'Q1 2025', revenue: 77100000000, netIncome: 19800000000, eps: 1.61, totalAssets: 380000000000, totalLiabilities: 96000000000 },
      { quarter: 'Q4 2024', revenue: 73800000000, netIncome: 18500000000, eps: 1.50, totalAssets: 368000000000, totalLiabilities: 92000000000 },
      { quarter: 'Q3 2024', revenue: 70200000000, netIncome: 17100000000, eps: 1.39, totalAssets: 356000000000, totalLiabilities: 88000000000 },
      { quarter: 'Q2 2024', revenue: 66900000000, netIncome: 15800000000, eps: 1.28, totalAssets: 344000000000, totalLiabilities: 84000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-05', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001652044-26-000012' },
      { formType: '10-Q', date: '2025-10-29', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001652044-25-000098' },
      { formType: '10-Q', date: '2025-07-29', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001652044-25-000067' },
      { formType: '10-Q', date: '2025-04-29', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001652044-25-000034' },
      { formType: '10-K', date: '2025-02-06', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001652044-25-000011' },
    ],
  },
  AMZN: {
    ticker: 'AMZN',
    name: 'Amazon.com, Inc.',
    currentPrice: 215.30,
    dailyChange: 2.15,
    priceHistory: generatePriceHistory(215.30),
    financials: [
      { quarter: 'Q1 2026', revenue: 168500000000, netIncome: 14200000000, eps: 1.35, totalAssets: 562000000000, totalLiabilities: 342000000000 },
      { quarter: 'Q4 2025', revenue: 172300000000, netIncome: 15800000000, eps: 1.50, totalAssets: 548000000000, totalLiabilities: 334000000000 },
      { quarter: 'Q3 2025', revenue: 152100000000, netIncome: 12100000000, eps: 1.15, totalAssets: 534000000000, totalLiabilities: 326000000000 },
      { quarter: 'Q2 2025', revenue: 148700000000, netIncome: 11200000000, eps: 1.06, totalAssets: 520000000000, totalLiabilities: 318000000000 },
      { quarter: 'Q1 2025', revenue: 143500000000, netIncome: 10500000000, eps: 1.00, totalAssets: 506000000000, totalLiabilities: 310000000000 },
      { quarter: 'Q4 2024', revenue: 158400000000, netIncome: 13100000000, eps: 1.24, totalAssets: 492000000000, totalLiabilities: 302000000000 },
      { quarter: 'Q3 2024', revenue: 138600000000, netIncome: 9900000000, eps: 0.94, totalAssets: 478000000000, totalLiabilities: 294000000000 },
      { quarter: 'Q2 2024', revenue: 134800000000, netIncome: 9200000000, eps: 0.87, totalAssets: 464000000000, totalLiabilities: 286000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-02', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001018724-26-000008' },
      { formType: '10-Q', date: '2025-11-01', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001018724-25-000102' },
      { formType: '10-Q', date: '2025-08-02', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001018724-25-000071' },
      { formType: '10-Q', date: '2025-05-03', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001018724-25-000038' },
      { formType: '10-K', date: '2025-02-01', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001018724-25-000007' },
    ],
  },
  TSLA: {
    ticker: 'TSLA',
    name: 'Tesla, Inc.',
    currentPrice: 312.75,
    dailyChange: -1.89,
    priceHistory: generatePriceHistory(312.75, 0.035),
    financials: [
      { quarter: 'Q1 2026', revenue: 28500000000, netIncome: 3200000000, eps: 0.91, totalAssets: 112000000000, totalLiabilities: 42000000000 },
      { quarter: 'Q4 2025', revenue: 31200000000, netIncome: 3800000000, eps: 1.08, totalAssets: 108000000000, totalLiabilities: 40000000000 },
      { quarter: 'Q3 2025', revenue: 26800000000, netIncome: 2900000000, eps: 0.82, totalAssets: 104000000000, totalLiabilities: 38000000000 },
      { quarter: 'Q2 2025', revenue: 25400000000, netIncome: 2600000000, eps: 0.74, totalAssets: 100000000000, totalLiabilities: 36000000000 },
      { quarter: 'Q1 2025', revenue: 23100000000, netIncome: 2200000000, eps: 0.62, totalAssets: 96000000000, totalLiabilities: 34000000000 },
      { quarter: 'Q4 2024', revenue: 25700000000, netIncome: 2500000000, eps: 0.71, totalAssets: 92000000000, totalLiabilities: 32000000000 },
      { quarter: 'Q3 2024', revenue: 24300000000, netIncome: 2300000000, eps: 0.65, totalAssets: 88000000000, totalLiabilities: 30000000000 },
      { quarter: 'Q2 2024', revenue: 22600000000, netIncome: 2000000000, eps: 0.57, totalAssets: 84000000000, totalLiabilities: 28000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-01-29', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001318605-26-000006' },
      { formType: '10-Q', date: '2025-10-24', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001318605-25-000094' },
      { formType: '10-Q', date: '2025-07-25', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001318605-25-000063' },
      { formType: '10-Q', date: '2025-04-25', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001318605-25-000032' },
      { formType: '10-K', date: '2025-01-30', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001318605-25-000005' },
    ],
  },
  META: {
    ticker: 'META',
    name: 'Meta Platforms, Inc.',
    currentPrice: 578.20,
    dailyChange: 0.45,
    priceHistory: generatePriceHistory(578.20),
    financials: [
      { quarter: 'Q1 2026', revenue: 42800000000, netIncome: 15200000000, eps: 5.92, totalAssets: 245000000000, totalLiabilities: 72000000000 },
      { quarter: 'Q4 2025', revenue: 45600000000, netIncome: 16800000000, eps: 6.54, totalAssets: 238000000000, totalLiabilities: 69000000000 },
      { quarter: 'Q3 2025', revenue: 40200000000, netIncome: 14100000000, eps: 5.49, totalAssets: 231000000000, totalLiabilities: 66000000000 },
      { quarter: 'Q2 2025', revenue: 38500000000, netIncome: 13200000000, eps: 5.14, totalAssets: 224000000000, totalLiabilities: 63000000000 },
      { quarter: 'Q1 2025', revenue: 36100000000, netIncome: 12100000000, eps: 4.71, totalAssets: 217000000000, totalLiabilities: 60000000000 },
      { quarter: 'Q4 2024', revenue: 40100000000, netIncome: 14000000000, eps: 5.45, totalAssets: 210000000000, totalLiabilities: 57000000000 },
      { quarter: 'Q3 2024', revenue: 34100000000, netIncome: 11400000000, eps: 4.44, totalAssets: 203000000000, totalLiabilities: 54000000000 },
      { quarter: 'Q2 2024', revenue: 32200000000, netIncome: 10500000000, eps: 4.09, totalAssets: 196000000000, totalLiabilities: 51000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-03', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001326801-26-000010' },
      { formType: '10-Q', date: '2025-10-31', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001326801-25-000096' },
      { formType: '10-Q', date: '2025-07-31', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001326801-25-000065' },
      { formType: '10-Q', date: '2025-04-30', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001326801-25-000033' },
      { formType: '10-K', date: '2025-02-04', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001326801-25-000009' },
    ],
  },
  NVDA: {
    ticker: 'NVDA',
    name: 'NVIDIA Corporation',
    currentPrice: 892.40,
    dailyChange: 3.21,
    priceHistory: generatePriceHistory(892.40, 0.03),
    financials: [
      { quarter: 'Q1 2026', revenue: 38500000000, netIncome: 19200000000, eps: 7.72, totalAssets: 82000000000, totalLiabilities: 28000000000 },
      { quarter: 'Q4 2025', revenue: 35200000000, netIncome: 17400000000, eps: 6.99, totalAssets: 78000000000, totalLiabilities: 26000000000 },
      { quarter: 'Q3 2025', revenue: 32100000000, netIncome: 15800000000, eps: 6.35, totalAssets: 74000000000, totalLiabilities: 24000000000 },
      { quarter: 'Q2 2025', revenue: 28500000000, netIncome: 13800000000, eps: 5.55, totalAssets: 70000000000, totalLiabilities: 22000000000 },
      { quarter: 'Q1 2025', revenue: 26000000000, netIncome: 12500000000, eps: 5.02, totalAssets: 66000000000, totalLiabilities: 20000000000 },
      { quarter: 'Q4 2024', revenue: 22100000000, netIncome: 10200000000, eps: 4.10, totalAssets: 62000000000, totalLiabilities: 18000000000 },
      { quarter: 'Q3 2024', revenue: 18100000000, netIncome: 8100000000, eps: 3.26, totalAssets: 58000000000, totalLiabilities: 16000000000 },
      { quarter: 'Q2 2024', revenue: 13500000000, netIncome: 5800000000, eps: 2.33, totalAssets: 54000000000, totalLiabilities: 14000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-28', description: 'Annual Report for fiscal year 2026', accessionNumber: '0001045810-26-000015' },
      { formType: '10-Q', date: '2025-11-22', description: 'Quarterly Report for Q3 2026', accessionNumber: '0001045810-25-000108' },
      { formType: '10-Q', date: '2025-08-22', description: 'Quarterly Report for Q2 2026', accessionNumber: '0001045810-25-000076' },
      { formType: '10-Q', date: '2025-05-23', description: 'Quarterly Report for Q1 2026', accessionNumber: '0001045810-25-000042' },
      { formType: '10-K', date: '2025-02-27', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001045810-25-000014' },
    ],
  },
  JPM: {
    ticker: 'JPM',
    name: 'JPMorgan Chase & Co.',
    currentPrice: 218.65,
    dailyChange: 0.32,
    priceHistory: generatePriceHistory(218.65),
    financials: [
      { quarter: 'Q1 2026', revenue: 45200000000, netIncome: 14800000000, eps: 5.12, totalAssets: 4200000000000, totalLiabilities: 3920000000000 },
      { quarter: 'Q4 2025', revenue: 43800000000, netIncome: 14100000000, eps: 4.88, totalAssets: 4150000000000, totalLiabilities: 3875000000000 },
      { quarter: 'Q3 2025', revenue: 42100000000, netIncome: 13400000000, eps: 4.64, totalAssets: 4100000000000, totalLiabilities: 3830000000000 },
      { quarter: 'Q2 2025', revenue: 40800000000, netIncome: 12800000000, eps: 4.43, totalAssets: 4050000000000, totalLiabilities: 3785000000000 },
      { quarter: 'Q1 2025', revenue: 39500000000, netIncome: 12200000000, eps: 4.22, totalAssets: 4000000000000, totalLiabilities: 3740000000000 },
      { quarter: 'Q4 2024', revenue: 38200000000, netIncome: 11600000000, eps: 4.01, totalAssets: 3950000000000, totalLiabilities: 3695000000000 },
      { quarter: 'Q3 2024', revenue: 37100000000, netIncome: 11100000000, eps: 3.84, totalAssets: 3900000000000, totalLiabilities: 3650000000000 },
      { quarter: 'Q2 2024', revenue: 36000000000, netIncome: 10600000000, eps: 3.67, totalAssets: 3850000000000, totalLiabilities: 3605000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-25', description: 'Annual Report for fiscal year 2025', accessionNumber: '0000019617-26-000018' },
      { formType: '10-Q', date: '2025-11-05', description: 'Quarterly Report for Q3 2025', accessionNumber: '0000019617-25-000112' },
      { formType: '10-Q', date: '2025-08-07', description: 'Quarterly Report for Q2 2025', accessionNumber: '0000019617-25-000078' },
      { formType: '10-Q', date: '2025-05-08', description: 'Quarterly Report for Q1 2025', accessionNumber: '0000019617-25-000044' },
      { formType: '10-K', date: '2025-02-26', description: 'Annual Report for fiscal year 2024', accessionNumber: '0000019617-25-000017' },
    ],
  },
  'BRK.B': {
    ticker: 'BRK.B',
    name: 'Berkshire Hathaway Inc.',
    currentPrice: 472.30,
    dailyChange: 0.18,
    priceHistory: generatePriceHistory(472.30, 0.015),
    financials: [
      { quarter: 'Q1 2026', revenue: 92500000000, netIncome: 12800000000, eps: 5.82, totalAssets: 1080000000000, totalLiabilities: 485000000000 },
      { quarter: 'Q4 2025', revenue: 95200000000, netIncome: 14200000000, eps: 6.46, totalAssets: 1065000000000, totalLiabilities: 478000000000 },
      { quarter: 'Q3 2025', revenue: 88700000000, netIncome: 11500000000, eps: 5.23, totalAssets: 1050000000000, totalLiabilities: 471000000000 },
      { quarter: 'Q2 2025', revenue: 86200000000, netIncome: 10800000000, eps: 4.91, totalAssets: 1035000000000, totalLiabilities: 464000000000 },
      { quarter: 'Q1 2025', revenue: 84500000000, netIncome: 10200000000, eps: 4.64, totalAssets: 1020000000000, totalLiabilities: 457000000000 },
      { quarter: 'Q4 2024', revenue: 91800000000, netIncome: 13500000000, eps: 6.14, totalAssets: 1005000000000, totalLiabilities: 450000000000 },
      { quarter: 'Q3 2024', revenue: 82100000000, netIncome: 9800000000, eps: 4.46, totalAssets: 990000000000, totalLiabilities: 443000000000 },
      { quarter: 'Q2 2024', revenue: 79800000000, netIncome: 9200000000, eps: 4.18, totalAssets: 975000000000, totalLiabilities: 436000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2026-02-24', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001067983-26-000008' },
      { formType: '10-Q', date: '2025-11-04', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001067983-25-000089' },
      { formType: '10-Q', date: '2025-08-05', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001067983-25-000058' },
      { formType: '10-Q', date: '2025-05-06', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001067983-25-000027' },
      { formType: '10-K', date: '2025-02-25', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001067983-25-000007' },
    ],
  },
  V: {
    ticker: 'V',
    name: 'Visa Inc.',
    currentPrice: 312.85,
    dailyChange: 0.92,
    priceHistory: generatePriceHistory(312.85),
    financials: [
      { quarter: 'Q1 2026', revenue: 9800000000, netIncome: 5200000000, eps: 2.62, totalAssets: 92000000000, totalLiabilities: 52000000000 },
      { quarter: 'Q4 2025', revenue: 9500000000, netIncome: 5000000000, eps: 2.52, totalAssets: 90000000000, totalLiabilities: 51000000000 },
      { quarter: 'Q3 2025', revenue: 9200000000, netIncome: 4800000000, eps: 2.42, totalAssets: 88000000000, totalLiabilities: 50000000000 },
      { quarter: 'Q2 2025', revenue: 8900000000, netIncome: 4600000000, eps: 2.32, totalAssets: 86000000000, totalLiabilities: 49000000000 },
      { quarter: 'Q1 2025', revenue: 8600000000, netIncome: 4400000000, eps: 2.22, totalAssets: 84000000000, totalLiabilities: 48000000000 },
      { quarter: 'Q4 2024', revenue: 8300000000, netIncome: 4200000000, eps: 2.12, totalAssets: 82000000000, totalLiabilities: 47000000000 },
      { quarter: 'Q3 2024', revenue: 8000000000, netIncome: 4000000000, eps: 2.02, totalAssets: 80000000000, totalLiabilities: 46000000000 },
      { quarter: 'Q2 2024', revenue: 7700000000, netIncome: 3800000000, eps: 1.92, totalAssets: 78000000000, totalLiabilities: 45000000000 },
    ],
    filings: [
      { formType: '10-K', date: '2025-11-15', description: 'Annual Report for fiscal year 2025', accessionNumber: '0001403161-25-000115' },
      { formType: '10-Q', date: '2025-08-01', description: 'Quarterly Report for Q3 2025', accessionNumber: '0001403161-25-000082' },
      { formType: '10-Q', date: '2025-05-02', description: 'Quarterly Report for Q2 2025', accessionNumber: '0001403161-25-000049' },
      { formType: '10-Q', date: '2025-02-01', description: 'Quarterly Report for Q1 2025', accessionNumber: '0001403161-25-000016' },
      { formType: '10-K', date: '2024-11-14', description: 'Annual Report for fiscal year 2024', accessionNumber: '0001403161-24-000113' },
    ],
  },
};

// All available tickers for search
export const ALL_TICKERS = Object.keys(STOCKS);

// Default mock portfolio with pre-loaded positions
export const DEFAULT_POSITIONS: Position[] = [
  {
    id: 'pos-1',
    ticker: 'AAPL',
    shares: 50,
    avgCost: 175.20,
    transactions: [
      { id: 'tx-1', ticker: 'AAPL', type: 'BUY', quantity: 30, price: 168.50, date: '2024-06-15' },
      { id: 'tx-2', ticker: 'AAPL', type: 'BUY', quantity: 20, price: 185.25, date: '2024-11-20' },
    ],
  },
  {
    id: 'pos-2',
    ticker: 'MSFT',
    shares: 25,
    avgCost: 398.80,
    transactions: [
      { id: 'tx-3', ticker: 'MSFT', type: 'BUY', quantity: 15, price: 385.40, date: '2024-03-10' },
      { id: 'tx-4', ticker: 'MSFT', type: 'BUY', quantity: 15, price: 412.20, date: '2024-08-05' },
      { id: 'tx-5', ticker: 'MSFT', type: 'SELL', quantity: 5, price: 425.00, date: '2025-01-15' },
    ],
  },
  {
    id: 'pos-3',
    ticker: 'NVDA',
    shares: 15,
    avgCost: 520.30,
    transactions: [
      { id: 'tx-6', ticker: 'NVDA', type: 'BUY', quantity: 10, price: 480.00, date: '2024-04-22' },
      { id: 'tx-7', ticker: 'NVDA', type: 'BUY', quantity: 5, price: 600.90, date: '2024-12-01' },
    ],
  },
  {
    id: 'pos-4',
    ticker: 'GOOGL',
    shares: 40,
    avgCost: 155.60,
    transactions: [
      { id: 'tx-8', ticker: 'GOOGL', type: 'BUY', quantity: 40, price: 155.60, date: '2024-07-18' },
    ],
  },
];

// Default watchlist
export const DEFAULT_WATCHLIST: WatchlistItem[] = [
  { ticker: 'AMZN', addedAt: '2024-09-01' },
  { ticker: 'META', addedAt: '2024-10-15' },
  { ticker: 'TSLA', addedAt: '2025-01-02' },
];

// Helper functions
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatLargeNumber(value: number): string {
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return `$${value.toFixed(2)}`;
}

export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
