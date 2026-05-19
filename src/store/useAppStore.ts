import { create } from 'zustand';
import {
  getTokenBalance,
  getXOFBalance,
  getLiveRate,
  executeTransfer as blockchainExecuteTransfer,
  fetchTransferHistory,
} from '@/lib/blockchain';
import { CONTRACT_ADDRESSES } from '@/config/contracts';

export type Transaction = {
  id: string;
  amount: string;
  recipient: string;
  sourceCurrency: 'XOF' | 'USD' | 'EUR';
  targetCurrency: 'XOF' | 'USD' | 'EUR';
  rate: number;
  status: string;
  date: string;
  txHash?: string;
};

type AppState = {
  account: string;
  transactions: Transaction[];
  status: string;
  xofBalance: string;
  eurBalance: string;
  usdBalance: string;
  isPending: boolean;
  lastTxHash: string;
  rates: { EUR: number; USD: number };
  pollingInterval?: NodeJS.Timeout;
  connectWallet: () => Promise<void>;
  executeTransfer: (params: {
    amount: string;
    recipient: string;
    targetCurrency: 'EUR' | 'USD';
  }) => Promise<void>;
  fetchHistory: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshRates: () => Promise<void>;
  setupPolling: () => void;
  clearPolling: () => void;
};

export const useAppStore = create<AppState>((set, get) => ({
  account: '',
  transactions: [],
  status: 'Prêt à explorer',
  xofBalance: '0',
  eurBalance: '0',
  usdBalance: '0',
  isPending: false,
  lastTxHash: '',
  rates: { EUR: 655.957, USD: 598 },

  connectWallet: async () => {
    if (!window.ethereum?.request) {
      set({ status: 'MetaMask non détecté' });
      return;
    }
    try {
      const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const account = accounts[0];
      set({ account, status: 'MetaMask connecté' });
      await Promise.all([
        get().refreshBalance(),
        get().refreshRates(),
        get().fetchHistory(),
      ]);
      get().setupPolling();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ status: msg.includes('Sepolia') ? msg : 'Connexion annulée' });
    }
  },

  refreshBalance: async () => {
    const { account } = get();
    if (!account) return;
    try {
      const [xof, eur, usd] = await Promise.all([
        getXOFBalance(account),
        getTokenBalance(CONTRACT_ADDRESSES.EURToken, account),
        getTokenBalance(CONTRACT_ADDRESSES.USDToken, account),
      ]);
      set({ xofBalance: xof, eurBalance: eur, usdBalance: usd });
    } catch (err: unknown) {
      console.error('refreshBalance failed', err);
    }
  },

  refreshRates: async () => {
    try {
      const [eurRate, usdRate] = await Promise.all([getLiveRate('EUR'), getLiveRate('USD')]);
      set({ rates: { EUR: eurRate, USD: usdRate } });
    } catch {
      // keep fallback rates
    }
  },

  fetchHistory: async () => {
    const { account } = get();
    if (!account) return;
    try {
      const txns = await fetchTransferHistory(account);
      set({ transactions: txns });
    } catch {
      // silently ignore
    }
  },

  executeTransfer: async ({ amount, recipient, targetCurrency }) => {
    const { account } = get();
    if (!account) {
      set({ status: "Connectez d'abord votre portefeuille" });
      return;
    }
    set({ isPending: true, status: 'Transaction en attente de confirmation…' });
    try {
      const txHash = await blockchainExecuteTransfer(recipient, amount, targetCurrency);
      const date = new Date().toLocaleString('fr-FR', {
        hour: '2-digit', minute: '2-digit',
        day: '2-digit', month: '2-digit', year: 'numeric',
      });
      const newTx: Transaction = {
        id: txHash,
        amount,
        recipient,
        sourceCurrency: 'XOF',
        targetCurrency,
        rate: get().rates[targetCurrency],
        status: 'Confirmé',
        date,
        txHash,
      };
      set((state) => ({
        transactions: [newTx, ...state.transactions],
        lastTxHash: txHash,
        status: 'Transfert confirmé sur Sepolia',
        isPending: false,
      }));
      await get().refreshBalance();
    } catch (err: unknown) {
      const raw = err instanceof Error ? err.message : String(err);
      const msg = raw.includes('user rejected')
        ? 'Transaction annulée par l\'utilisateur'
        : raw.includes('insufficient')
        ? 'Solde XOF insuffisant'
        : raw.includes('Sepolia')
        ? raw
        : 'Erreur lors du transfert';
      set({ isPending: false, status: msg });
      throw new Error(msg);
    }
  },

  setupPolling: () => {
    const state = get();
    if (state.pollingInterval) return; // already polling

    const interval = setInterval(() => {
      get().refreshBalance();
      get().fetchHistory();
    }, 15000); // refresh every 15 seconds

    set({ pollingInterval: interval });
    console.log('polling started');
  },

  clearPolling: () => {
    const state = get();
    if (state.pollingInterval) {
      clearInterval(state.pollingInterval);
      set({ pollingInterval: undefined });
      console.log('polling stopped');
    }
  },
}));
