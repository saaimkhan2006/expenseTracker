import { create } from 'zustand';
import { api } from '../services/api';
import { idb } from '../offline/idb';
import { uid, deviceId } from '../utils/finance';

export type Tx = {
  _id?: string; clientId: string; type: 'expense' | 'income';
  amount: number; category: string; accountId: string;
  date: string; description?: string; syncStatus: 'pending' | 'synced' | 'failed';
};

export type Goal = {
  _id: string;
  name: string;
  target: number;
  current: number;
  deadline?: string;
  monthlyCommitment?: number;
  icon?: string;
  color?: string;
  status?: 'active' | 'completed';
};

export const useFinance = create<{
  transactions: Tx[]; accounts: any[]; categories: any[];
  budgets: any[]; budgetMonth: string;
  loans: any[]; receivable: number; payable: number;
  subscriptions: any[]; subsMonthly: number; subsAnnual: number;
  goals: Goal[];
  online: boolean; syncing: boolean;
  setOnline: (v: boolean) => void;
  load: () => Promise<void>;
  loadPhase2: () => Promise<void>;
  loadGoals: () => Promise<void>;
  addTx: (t: Omit<Tx, 'clientId' | 'syncStatus'>) => Promise<void>;
  deleteTx: (idOrClientId: string) => Promise<void>;
  sync: () => Promise<void>;
  createAccount: (name: string, openingBalance: number) => Promise<void>;
  updateAccount: (id: string, updates: { name?: string; balance?: number; type?: string; icon?: string; color?: string }) => Promise<any>;
  transfer: (fromAccountId: string, toAccountId: string, amount: number, description?: string) => Promise<void>;
  createBudget: (category: string, cap: number) => Promise<void>;
  createLoan: (kind: 'lent' | 'borrowed', person: string, amount: number, accountId: string, dueDate?: string, description?: string) => Promise<void>;
  repayLoan: (id: string, amount: number) => Promise<void>;
  createSubscription: (s: { name: string; amount: number; cycle: string; accountId: string; nextBilling?: string; category?: string }) => Promise<void>;
  createGoal: (g: { name: string; target: number; current?: number; deadline?: string; monthlyCommitment?: number; icon?: string; color?: string }) => Promise<void>;
  depositToGoal: (id: string, amount: number, accountId?: string) => Promise<void>;
  deleteGoal: (id: string) => Promise<void>;
}>((set, get) => ({
  transactions: [], accounts: [], categories: [],
  budgets: [], budgetMonth: '', loans: [], receivable: 0, payable: 0,
  subscriptions: [], subsMonthly: 0, subsAnnual: 0, goals: [],
  online: navigator.onLine, syncing: false,
  setOnline: (v) => set({ online: v }),

  async load() {
    // 1. Show cache instantly (offline-first)
    const cached = await idb.all('transactions').catch(() => []);
    const cachedAcc = await idb.all('accounts').catch(() => []);
    const cachedGoals = await idb.all('goals').catch(() => []);
    if (cached.length) set({ transactions: cached.sort((a, b) => +new Date(b.date) - +new Date(a.date)) });
    if (cachedAcc.length) set({ accounts: cachedAcc });
    if (cachedGoals.length) set({ goals: cachedGoals });

    // 2. Refresh from network when online
    if (!navigator.onLine) return;
    try {
      const [{ data: t }, { data: a }, { data: c }] = await Promise.all([
        api.get('/transactions?limit=200'), api.get('/accounts'), api.get('/categories'),
      ]);
      const txs = t.transactions.map((x: any) => ({ ...x, clientId: x.clientId || x._id, syncStatus: 'synced' as const }));
      set({ transactions: txs, accounts: a.accounts, categories: c.categories });
      await idb.clear('accounts').catch(() => {});
      for (const acc of a.accounts) await idb.put('accounts', acc).catch(() => {});
    } catch { /* stay on cache */ }
    await get().sync();
    await get().loadPhase2();
  },

  async loadGoals() {
    if (!navigator.onLine) {
      const cachedGoals = await idb.all('goals').catch(() => []);
      if (cachedGoals.length) set({ goals: cachedGoals });
      return;
    }
    try {
      const { data } = await api.get('/goals');
      set({ goals: data.goals || [] });
      await idb.clear('goals').catch(() => {});
      for (const g of (data.goals || [])) await idb.put('goals', g).catch(() => {});
    } catch { /* keep cache */ }
  },

  async loadPhase2() {
    if (!navigator.onLine) return;
    try {
      const [{ data: b }, { data: l }, { data: s }] = await Promise.all([
        api.get('/budgets'), api.get('/loans'), api.get('/subscriptions'),
      ]);
      set({
        budgets: b.budgets, budgetMonth: b.month,
        loans: l.loans, receivable: l.receivable, payable: l.payable,
        subscriptions: s.subscriptions, subsMonthly: s.monthly, subsAnnual: s.annual,
      });
      await get().loadGoals();
    } catch { /* phase-2 pages show empty state */ }
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
    await idb.clear('accounts').catch(() => {});
    for (const acc of accs) await idb.put('accounts', acc).catch(() => {});
    await get().sync();
  },

  async deleteTx(idOrClientId) {
    const target = get().transactions.find((t) => t._id === idOrClientId || t.clientId === idOrClientId);
    if (!target) return;

    // Optimistically remove from state
    set({ transactions: get().transactions.filter((t) => t !== target) });
    await idb.del('transactions', target.clientId).catch(() => {});

    // Reverse balance effect optimistically
    if (target.accountId) {
      const accs = get().accounts.map((a) =>
        a._id === target.accountId ? { ...a, balance: a.balance + (target.type === 'income' ? -target.amount : target.amount) } : a
      );
      set({ accounts: accs });
      await idb.clear('accounts').catch(() => {});
      for (const acc of accs) await idb.put('accounts', acc).catch(() => {});
    }

    if (navigator.onLine && target._id) {
      try {
        await api.delete(`/transactions/${target._id}`);
      } catch { /* balance reconciled on next load */ }
    }
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
      // Re-fetch fresh accounts to sync balances with server
      const { data: aData } = await api.get('/accounts');
      if (aData?.accounts?.length) {
        set({ accounts: aData.accounts });
        await idb.clear('accounts').catch(() => {});
        for (const acc of aData.accounts) await idb.put('accounts', acc).catch(() => {});
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

  async updateAccount(id, updates) {
    const { data } = await api.put(`/accounts/${id}`, updates);
    const accs = get().accounts.map((a) => (a._id === id ? data.account : a));
    set({ accounts: accs });
    await idb.put('accounts', data.account).catch(() => {});
    return data.account;
  },

  async transfer(fromAccountId, toAccountId, amount, description = '') {
    const { data } = await api.post('/transfers', { fromAccountId, toAccountId, amount, description });
    const [{ data: a }, { data: t }] = await Promise.all([
      api.get('/accounts'), api.get('/transactions?limit=200'),
    ]);
    set({
      accounts: a.accounts,
      transactions: t.transactions.map((x: any) => ({ ...x, clientId: x.clientId || x._id, syncStatus: 'synced' as const })),
    });
    return data.transaction;
  },

  async createBudget(category, cap) {
    const { data } = await api.post('/budgets', { category, cap });
    await get().loadPhase2();
    return data.budget;
  },

  async createLoan(kind, person, amount, accountId, dueDate, description = '') {
    const { data } = await api.post('/loans', { kind, person, amount, accountId, dueDate, description });
    await get().loadPhase2();
    const { data: a } = await api.get('/accounts');
    set({ accounts: a.accounts });
    return data.loan;
  },

  async repayLoan(id, amount) {
    const { data } = await api.post(`/loans/${id}/repay`, { amount });
    await get().loadPhase2();
    const { data: a } = await api.get('/accounts');
    const { data: t } = await api.get('/transactions?limit=200');
    set({
      accounts: a.accounts,
      transactions: t.transactions.map((x: any) => ({ ...x, clientId: x.clientId || x._id, syncStatus: 'synced' as const })),
    });
    return data.loan;
  },

  async createSubscription(s) {
    const { data } = await api.post('/subscriptions', s);
    await get().loadPhase2();
    return data.subscription;
  },

  async createGoal(g) {
    const { data } = await api.post('/goals', g);
    await get().loadPhase2();
    return data.goal;
  },

  async depositToGoal(id, amount, accountId) {
    const { data } = await api.post(`/goals/${id}/deposit`, { amount, accountId });
    await get().loadPhase2();
    if (accountId) {
      const { data: a } = await api.get('/accounts');
      set({ accounts: a.accounts });
    }
    return data.goal;
  },

  async deleteGoal(id) {
    await api.delete(`/goals/${id}`);
    set({ goals: get().goals.filter((g) => g._id !== id) });
    await idb.del('goals', id).catch(() => {});
  },
}));
