import { create } from 'zustand';

export type Transaction = {
  id: string;
  amount: string;
  recipient: string;
  sourceCurrency: 'XOF' | 'USD' | 'EUR';
  targetCurrency: 'XOF' | 'USD' | 'EUR';
  rate: number;
  status: string;
  date: string;
};

type AppState = {
  account: string;
  transactions: Transaction[];
  status: string;
  connectWallet: () => Promise<void>;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date' | 'status'>) => void;
};

const initialHistory: Transaction[] = [
  {
    id: 'tx-001',
    amount: '12500',
    recipient: '0xB2a4...98A1',
    sourceCurrency: 'XOF',
    targetCurrency: 'EUR',
    rate: 0.0015,
    status: 'Finalisé',
    date: '2026-05-11 14:28',
  },
  {
    id: 'tx-002',
    amount: '8200',
    recipient: '0xD3f6...21Cd',
    sourceCurrency: 'XOF',
    targetCurrency: 'USD',
    rate: 0.0017,
    status: 'Finalisé',
    date: '2026-05-09 09:12',
  },
  {
    id: 'tx-003',
    amount: '50',
    recipient: '0xE4a1...71Fb',
    sourceCurrency: 'USD',
    targetCurrency: 'XOF',
    rate: 588.23,
    status: 'Finalisé',
    date: '2026-05-09 09:12',
  },
];

export const useAppStore = create<AppState>((set) => ({
  account: '',
  transactions: initialHistory,
  status: 'Prêt à explorer',
  connectWallet: async () => {
    if (window.ethereum && window.ethereum.request) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        set({ account: accounts[0], status: 'MetaMask connecté' });
      } catch {
        set({ status: 'Connexion annulée. Utilisation d’une adresse de démonstration.' });
      }
    } else {
      set({ account: '0xF4a7...C9d2', status: 'Adresse de démonstration active' });
    }
  },
  addTransaction: ({ amount, sourceCurrency, targetCurrency, recipient, rate }) => {
    const next: Transaction = {
      id: `tx-${Date.now()}`,
      amount,
      sourceCurrency,
      targetCurrency,
      recipient,
      rate,
      status: 'Transfert simulé',
      date: new Date().toLocaleString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    };
    set((state) => ({
      transactions: [next, ...state.transactions],
      status: 'Nouveau transfert simulé ajouté',
    }));
  },
}));
