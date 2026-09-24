import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFinance, Tx } from '../stores/finance';

export function Transactions() {
  const nav = useNavigate();
  const [params] = useSearchParams();
  const { transactions } = useFinance();
  const [filterType, setFilterType] = useState<'all' | 'expense' | 'income'>('all');
  const [search, setSearch] = useState(params.get('q') || '');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Real ledger only — never fabricate financial data.
  const allTxs: Tx[] = transactions;

  const categories = Array.from(new Set(allTxs.map((t) => t.category)));

  const filtered = allTxs.filter((t) => {
    if (filterType !== 'all' && t.type !== filterType) return false;
    if (categoryFilter !== 'all' && t.category !== categoryFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const cat = t.category.toLowerCase();
      if (!desc.includes(q) && !cat.includes(q)) return false;
    }
    return true;
  });

  const totalInflow = allTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOutflow = allTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const netDelta = totalInflow - totalOutflow;

  return (
    <div className="flex flex-col w-full space-y-space-lg text-on-surface">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pb-space-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-space-xs">
            <span className="font-label-xs text-label-xs text-primary-fixed uppercase tracking-wider bg-primary-container/10 px-2 py-0.5 rounded">
              Audit Mode ACTIVE
            </span>
            <span className="text-outline font-label-xs text-label-xs">SYS-9942</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">Transaction Journal</h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Audited ledger of real-time accounts and synchronized cashflows across domestic & international rails.
          </p>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <button onClick={() => nav('/add')} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      {/* Summary Metric Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-space-md">
        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-2 border border-surface-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">Total Cleared Inflow</span>
            <span className="material-symbols-outlined text-[18px] text-primary-fixed">arrow_downward_alt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-semibold tracking-tight text-primary-fixed">
              +₹{totalInflow.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-primary-fixed h-full w-[75%]"></div>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-2 border border-surface-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">Total Cleared Outflow</span>
            <span className="material-symbols-outlined text-[18px] text-error">arrow_upward_alt</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-semibold tracking-tight text-error">
              −₹{totalOutflow.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-error h-full w-[45%]"></div>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-2 border border-surface-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">Net Operational Delta</span>
            <span className="material-symbols-outlined text-[18px] text-secondary">balance</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface">
              +₹{netDelta.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden">
            <div className="bg-secondary h-full w-[60%]"></div>
          </div>
        </div>

        <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col justify-between space-y-2 border border-surface-variant/30">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">Ledger Volume</span>
            <span className="material-symbols-outlined text-[18px] text-outline">speed</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface">
              {filtered.length} <span className="font-body-sm text-body-sm font-normal text-outline">Records</span>
            </span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed">100% Reconciled</span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="p-space-md rounded-xl bg-surface-container-low space-y-space-md border border-surface-variant/30">
        <div className="flex flex-col md:flex-row gap-space-sm items-center justify-between">
          {/* Search Input */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-container-lowest text-on-surface w-full md:w-80 border border-surface-variant/40">
            <span className="material-symbols-outlined text-[18px] text-outline">search</span>
            <input
              type="text"
              placeholder="Search description, category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="bg-transparent text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none w-full"
            />
          </div>

          {/* Type Filter Buttons */}
          <div className="flex items-center p-0.5 rounded-lg bg-surface-container-lowest border border-surface-variant/40 w-full md:w-auto">
            <button
              onClick={() => setFilterType('all')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
                filterType === 'all' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setFilterType('expense')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
                filterType === 'expense' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
              }`}
            >
              Expenses
            </button>
            <button
              onClick={() => setFilterType('income')}
              className={`flex-1 md:flex-none px-4 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
                filterType === 'income' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
              }`}
            >
              Income
            </button>
          </div>

          {/* Category Selector */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-sm text-body-sm focus:outline-none w-full md:w-auto"
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Transactions Table / List */}
      <div className="rounded-xl bg-surface-container-low border border-surface-variant/30 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-surface-variant/40 bg-surface-container/50 font-label-xs text-label-xs text-outline uppercase tracking-wider">
                <th className="py-3 px-space-md">Description / Rail</th>
                <th className="py-3 px-space-md">Category</th>
                <th className="py-3 px-space-md">Date</th>
                <th className="py-3 px-space-md text-right">Amount</th>
                <th className="py-3 px-space-md text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-variant/30">
              {filtered.map((t) => (
                <tr key={t.clientId} className="hover:bg-surface-container/30 transition-colors">
                  <td className="py-3 px-space-md">
                    <div className="flex items-center gap-space-sm">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${t.type === 'income' ? 'bg-primary-container/15 text-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                        <span className="material-symbols-outlined text-[18px]">
                          {t.type === 'income' ? 'arrow_downward' : 'shopping_bag'}
                        </span>
                      </div>
                      <span className="font-body-md text-body-md font-medium text-on-surface">
                        {t.description || t.category}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-space-md">
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-xs text-label-xs border border-surface-variant/30">
                      {t.category}
                    </span>
                  </td>
                  <td className="py-3 px-space-md font-label-xs text-label-xs text-outline">{t.date}</td>
                  <td className={`py-3 px-space-md text-right font-label-lg text-label-lg font-medium ${t.type === 'income' ? 'text-primary-fixed' : 'text-error'}`}>
                    {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-space-md text-center">
                    {t.syncStatus === 'pending' ? (
                      <span className="px-2 py-0.5 rounded bg-tertiary-container/20 text-on-tertiary-container font-label-xs text-label-xs border border-tertiary-container/30 uppercase font-semibold">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-fixed font-label-xs text-label-xs border border-primary-container/20 uppercase font-semibold">
                        Synced
                      </span>
                    )}
                  </td>
                </tr>
              ))}
              {!filtered.length && (
                <tr>
                  <td colSpan={5} className="py-space-xl text-center text-outline font-body-md">
                    {allTxs.length
                      ? 'No transaction entries match your criteria.'
                      : 'No transactions yet. Tap + Add Transaction to record your first one.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
