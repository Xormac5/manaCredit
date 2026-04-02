import type { Wallet, Transaction } from '../types';

const MOCK_KEY = 'manacredit_mock_data';

export interface MockData {
  wallets: Record<string, Wallet & { id: string }>;
  transactions: Record<string, Transaction & { id: string }>;
}

const defaultData: MockData = {
  wallets: {
    'CUST_001': {
      id: 'CUST_001',
      customerName: 'Alex Rossi',
      nickname: 'Mage',
      phone: '3331234567',
      balance: 45.5,
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date(),
    },
    'CUST_002': {
      id: 'CUST_002',
      customerName: 'Giulia Bianchi',
      nickname: 'Collector',
      balance: 120.0,
      createdAt: new Date('2024-02-15'),
      updatedAt: new Date(),
    },
    'CUST_999': {
      id: 'CUST_999',
      customerName: 'Marco User',
      balance: 0.0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  },
  transactions: {},
};

export function getMockData(): MockData {
  const stored = localStorage.getItem(MOCK_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Ripristino delle date ISO come oggetti Date
      for (const w of Object.values(parsed.wallets) as any) {
        if (w.createdAt) w.createdAt = new Date(w.createdAt);
        if (w.updatedAt) w.updatedAt = new Date(w.updatedAt);
      }
      for (const t of Object.values(parsed.transactions) as any) {
        if (t.createdAt) t.createdAt = new Date(t.createdAt);
      }
      return parsed;
    } catch {
      return defaultData;
    }
  }
  return defaultData;
}

export function saveMockData(data: MockData) {
  localStorage.setItem(MOCK_KEY, JSON.stringify(data));
}

// Emula latenza di rete fittizia per rendere il testing realistico
export function delay<T>(ms: number, value: T): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}
