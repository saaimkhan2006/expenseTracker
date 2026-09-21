import { create } from 'zustand';
import { api } from '../services/api';
import { idb } from '../offline/idb';
import { uid, deviceId } from '../utils/finance';

export type Tx = {
  _id?: string; clientId: string; type: 'expense' | 'income';
  amount: number; category: string; accountId: string;
  date: string; description?: string; syncStatus: 'pending' | 'synced' | 'failed';
};

export const useFinance = create<{
  transactions: Tx[]; accounts: any[]; categories: any[];
  online: boolean; syncing: boolean;
  setOnline: (v: boolean) => void;
  load: () => Promise<void>;
  addTx: (t: Omit<Tx, 'clientId' | 'syncStatus'>) => Promise<void>;
  sync: () => Promise<void>;
  createAccount: (name: string, openingBalance: number) => Promise<void>;
}>((set, get) => ({
  transactions: [], accounts: [], categories: [],
  online: navigator.onLine, syncing: false,
  setOnline: (v) => set({ online: v }),

  async load() {
    // 1. Show cache instantly (offline-first)
    const cached = await idb.all('transactions').catch(() => []);
    const cachedAcc = await idb.all('accounts').catch(() => []);
    if (cached.length) set({ transactions: cached.sort((a, b) => +new Date(b.date) - +new Date(a.date)) });
    if (cachedAcc.length) set({ accounts: cachedAcc });
    // 2. Refresh from network when online
    if (!navigator.onLine) return;
    try {
      const [{ data: t }, { data: a }, { data: c }] = await Promise.all([
        api.get('/transactions?limit=200'), api.get('/accounts'), api.get('/categories'),
      ]);
      const txs = t.transactions.map((x: any) => ({ ...x, clientId: x.clientId || x._id, syncStatus: 'synced' as const }));
      set({ transactions: txs, accounts: a.accounts, categories: c.categories });
      await idb.clear('accounts');
      for (const acc of a.accounts) await idb.put('accounts', acc);
    } catch { /* stay on cache */ }
    await get().sync();
  },

  async addTx(t) {
    // Local-first write: UI updates instantly, syncStatus pending
    const record: Tx = { ...t, clientId: uid(), syncStatus: 'pending' };
    set({ transactions: [record, ...get().transactions] });
    await idb.put('transactions', { ...record, deviceId: deviceId() });
    // Optimistic account balance
    const accs = get().accounts.map((a) =>
      a._id === t.accountId ? { ...a, balance: a.balance + (t.type === 'income' ? t.amount : -t.amount) } : a
    );
    set({ accounts: accs });
    await get().sync();
  },

  async sync() {
    if (!navigator.onLine || get().syncing) return;
    const pending = (await idb.all('transactions').catch(() => [])).filter((t) => t.syncStatus === 'pending');
    if (!pending.length) return;
    set({ syncing: true });
    try {
      const { data } = await api.post('/transactions/sync', {
        items: pending.map((p) => ({ ...p, deviceId: deviceId() })),
      });
      const okIds = new Set((data.results || []).filter((r: any) => r.id).map((r: any) => r.clientId));
      const txs = get().transactions.map((t) => (okIds.has(t.clientId) ? { ...t, syncStatus: 'synced' as const } : t));
      set({ transactions: txs });
      for (const c of [...okIds]) {
        const rec = txs.find((t) => t.clientId === c);
        if (rec) await idb.put('transactions', rec);
      }
    } catch {
      // keep pending, retry on next online event
    } finally {
      set({ syncing: false });
    }
  },

  async createAccount(name, openingBalance) {
    const { data } = await api.post('/accounts', { name, openingBalance });
    set({ accounts: [...get().accounts, data.account] });
    await idb.put('accounts', data.account);
  },
}));
