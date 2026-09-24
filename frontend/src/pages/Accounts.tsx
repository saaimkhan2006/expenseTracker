import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../stores/finance';

export function Accounts() {
  const nav = useNavigate();
  const { accounts, createAccount } = useFinance();
  const [showAddModal, setShowAddModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccBalance, setNewAccBalance] = useState('10000');
  const [creating, setCreating] = useState(false);

  // Fallback demo accounts if empty
  const displayAccounts = accounts.length
    ? accounts
    : [
        { _id: 'acc1', name: 'HDFC Main Checking', type: 'Checking Rail', balance: 18450, accountNum: '•••• 4921', status: 'Primary' },
        { _id: 'acc2', name: 'ICICI Wealth Savings', type: 'Savings Reserve', balance: 6400, accountNum: '•••• 8812', status: 'Active' },
        { _id: 'acc3', name: 'Axis Rewards Credit', type: 'Credit Line', balance: -2400, accountNum: '•••• 3109', status: 'Unbilled' },
        { _id: 'acc4', name: 'Physical Cash Reserve', type: 'Vault', balance: 2400, accountNum: 'Liquid Vault', status: 'Offline' },
      ];

  const totalLiquid = displayAccounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);
  const totalLiabilities = displayAccounts.filter((a) => a.balance < 0).reduce((s, a) => s + Math.abs(a.balance), 0);
  const netPosition = totalLiquid - totalLiabilities;

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccName.trim()) return;
    setCreating(true);
    await createAccount(newAccName.trim(), parseFloat(newAccBalance) || 0);
    setCreating(false);
    setNewAccName('');
    setNewAccBalance('10000');
    setShowAddModal(false);
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header Bar */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-md pt-2 border-b border-surface-variant/40 pb-space-md">
        <div className="flex flex-col gap-space-xs">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span className="font-label-xs text-label-xs tracking-widest text-outline uppercase">TREASURY / LIQUIDITY OVERVIEW</span>
            <span className="px-2 py-0.5 rounded bg-surface-container-high font-label-xs text-label-xs text-on-surface-variant font-mono">NODE #704-IND</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface">Capital Reserves & Synced Rails</h1>
        </div>

        <div className="flex flex-wrap items-center gap-space-sm">
          <button onClick={() => nav('/transfer')} className="px-3.5 py-2 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-label-md text-label-md transition-all flex items-center gap-2 border border-surface-variant/40">
            <span className="material-symbols-outlined text-[18px] text-secondary">swap_horiz</span>
            <span>Transfer Funds</span>
          </button>

          <button onClick={() => setShowAddModal(true)} className="px-4 py-2 rounded bg-primary-container hover:bg-primary-fixed-dim text-on-primary-fixed font-label-md text-label-md font-semibold transition-all flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[18px]">add</span>
            <span>Add Account</span>
          </button>
        </div>
      </div>

      {/* Hero Metric Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-md items-stretch">
        <div className="lg:col-span-7 bg-surface-container-low p-space-lg rounded-xl border border-surface-variant/30 flex flex-col justify-between shadow-md relative overflow-hidden">
          <div className="flex items-center justify-between pb-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-label-xs text-label-xs tracking-wider uppercase text-outline">CONSOLIDATED NET POSITION</span>
              <span className="px-1.5 py-0.5 rounded bg-surface-container-highest text-primary-fixed-dim font-label-xs text-label-xs">AUDITED LIVE</span>
            </div>
            <span className="font-label-xs text-label-xs text-outline font-mono">BASE: INR (₹)</span>
          </div>

          <div className="my-space-md">
            <div className="font-label-xs text-label-xs text-outline tracking-wider uppercase mb-1">TOTAL NET ASSETS</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display-xl text-display-xl text-on-surface font-semibold tracking-tight">
                ₹{netPosition.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-md bg-surface-container/60 p-space-sm rounded-lg">
            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-lowest/80 border border-surface-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Liquid Assets</span>
              </div>
              <span className="font-label-lg text-label-lg font-semibold text-primary-fixed">
                ₹{totalLiquid.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-lowest/80 border border-surface-variant/30">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                <span className="font-body-sm text-body-sm text-on-surface-variant">Liabilities</span>
              </div>
              <span className="font-label-lg text-label-lg font-semibold text-error">
                −₹{totalLiabilities.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-surface-container-low p-space-lg rounded-xl border border-surface-variant/30 flex flex-col justify-between shadow-md">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs text-outline tracking-widest uppercase">SOLVENCY TELEMETRY</span>
            <span className="font-label-xs text-label-xs text-primary-fixed font-mono bg-primary-container/10 px-2 py-0.5 rounded font-semibold">
              92.5% LIQUID
            </span>
          </div>

          <div className="py-space-md flex flex-col gap-space-sm">
            <div className="flex items-center justify-between">
              <span className="font-body-sm text-body-sm text-on-surface-variant">Available vs Committed</span>
              <span className="font-label-sm text-label-sm text-on-surface font-mono">
                ₹{netPosition.toLocaleString('en-IN')} / ₹{totalLiquid.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden flex">
              <div className="bg-primary-container h-full" style={{ width: '92.5%' }}></div>
              <div className="bg-error h-full" style={{ width: '7.5%' }}></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-sm bg-surface-container-lowest/60 px-3 py-2 rounded border border-surface-variant/30">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] text-primary-container">shield</span>
              <span className="font-body-sm text-body-sm text-on-surface">Emergency Buffer</span>
            </div>
            <span className="font-label-md text-label-md text-on-surface font-mono">3.4 Months Runway</span>
          </div>
        </div>
      </div>

      {/* Account Vault Cards */}
      <div className="space-y-space-md">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
          <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Synchronized Account Vaults</h2>
          <span className="font-label-xs text-label-xs text-outline">{displayAccounts.length} Connected Rails</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {displayAccounts.map((acc) => {
            const isNegative = acc.balance < 0;

            return (
              <div key={acc._id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between space-y-space-md shadow-sm hover:border-surface-variant transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isNegative ? 'bg-error-container/30 text-error' : 'bg-surface-container-high text-primary-fixed'}`}>
                      <span className="material-symbols-outlined text-[22px]">
                        {isNegative ? 'credit_card' : 'account_balance'}
                      </span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">{acc.name}</div>
                      <div className="font-label-xs text-label-xs text-outline">{acc.type || 'Account Rail'} • {acc.accountNum || 'Active'}</div>
                    </div>
                  </div>

                  <span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-surface-container-high text-on-surface-variant border border-surface-variant/30 uppercase font-semibold">
                    {acc.status || 'Active'}
                  </span>
                </div>

                <div className="flex items-baseline justify-between border-t border-surface-variant/30 pt-space-sm">
                  <span className="font-label-xs text-label-xs uppercase text-outline">Current Balance</span>
                  <span className={`font-headline-md text-headline-md font-bold ${isNegative ? 'text-error' : 'text-on-surface'}`}>
                    ₹{acc.balance.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowAddModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Add Account Rail</h3>
              <button onClick={() => setShowAddModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateAccount} className="space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Account Name</label>
                <input
                  type="text"
                  placeholder="e.g. Axis Checking, SBI Savings..."
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Opening Balance (₹)</label>
                <input
                  type="number"
                  placeholder="10000"
                  value={newAccBalance}
                  onChange={(e) => setNewAccBalance(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={creating}
                className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all"
              >
                {creating ? 'Saving...' : 'Add Account'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
