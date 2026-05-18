import { create } from 'zustand';
import {
  getXOFBalance,
  getLiveRate,
  executeTransfer as blockchainExecuteTransfer,
  fetchTransferHistory,
} from '@/lib/blockchain';

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
  isPending: boolean;
  lastTxHash: string;
  rates: { EUR: number; USD: number };
  connectWallet: () => Promise<void>;
  executeTransfer: (params: {
    amount: string;
    recipient: string;
    targetCurrency: 'EUR' | 'USD';
  }) => Promise<void>;
  fetchHistory: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  refreshRates: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  account: '',
  transactions: [],
  status: 'Prêt à explorer',
  xofBalance: '0',
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
      // load balance, rates and history after connecting
      const [balance] = await Promise.all([
        getXOFBalance(account),
        get().refreshRates(),
        get().fetchHistory(),
      ]);
      set({ xofBalance: balance });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      set({ status: msg.includes('Sepolia') ? msg : 'Connexion annulée' });
    }
  },

  refreshBalance: async () => {
    const { account } = get();
    if (!account) return;
    try {
      const balance = await getXOFBalance(account);
      set({ xofBalance: balance });
    } catch {
      // silently ignore read errors
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
}));
