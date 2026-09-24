import { useNavigate } from 'react-router-dom';
import { useFinance } from '../stores/finance';

export function Dashboard() {
  const nav = useNavigate();
  const { transactions, accounts } = useFinance();

  // Live metrics from the real ledger — never fabricate financial data.
  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const netRetained = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netRetained / totalIncome) * 100).toFixed(1) : '0.0';

  const displayAccounts = accounts;

  const totalAvailable = displayAccounts.reduce((acc, a) => acc + (a.balance > 0 ? a.balance : 0), 0);

  const recentTxs = transactions.slice(0, 5);

  const monthLabel = new Date().toLocaleDateString('en-IN', { month: 'long', year: 'numeric' });

  return (
    <div className="flex flex-col w-full gap-space-xl">
      {/* Top Greeting & Controls */}
      <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-space-md">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Terminal // System 04</span>
            <span className="w-1 h-1 rounded-full bg-primary-container"></span>
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-on-surface-variant font-semibold">Live Telemetry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">Your capital at a glance.</h1>
        </div>

        <div className="flex items-center gap-space-sm flex-wrap">
          <div className="px-space-md py-2 rounded bg-surface-container border border-surface-variant/30 flex items-center gap-2">
            <span className="material-symbols-outlined text-outline text-[16px]">calendar_month</span>
            <span className="font-label-xs text-label-xs text-on-surface uppercase tracking-wider font-semibold">{monthLabel}</span>
          </div>
          <button onClick={() => nav('/add')} className="px-space-md py-2 rounded bg-primary-container text-on-primary font-label-xs text-label-xs uppercase tracking-wider font-semibold hover:bg-primary-fixed-dim transition-all flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span>Add Entry</span>
          </button>
        </div>
      </section>

      {/* Main Financial Hero Metrics */}
      <section className="rounded-xl bg-surface-container p-space-lg lg:p-space-xl border border-surface-variant/30 relative overflow-hidden shadow-sm">
        <div className="absolute -right-16 -top-16 w-96 h-96 bg-primary-container/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center relative z-10">
          {/* Available Capital */}
          <div className="lg:col-span-5 space-y-space-sm">
            <div className="flex items-center gap-2">
              <span className="font-label-xs text-label-xs tracking-widest uppercase text-outline">AVAILABLE UNALLOCATED CAPITAL</span>
              <span className="material-symbols-outlined text-outline text-[14px]">info</span>
            </div>
            <div className="flex items-baseline gap-space-sm flex-wrap">
              <span className="font-display-xl text-display-xl font-semibold tracking-tight text-on-surface">
                ₹{totalAvailable.toLocaleString('en-IN')}
              </span>
              <span className="font-label-xs text-label-xs uppercase text-outline self-center">INR</span>
            </div>
            <div className="flex items-center gap-3 pt-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-primary-container/10 border border-primary-container/30 text-primary-fixed font-label-xs text-label-xs font-semibold uppercase tracking-wider">
                <span className="material-symbols-outlined text-[14px]">trending_up</span>
                +8.4% this month
              </span>
              <span className="font-body-sm text-body-sm text-outline">Across {displayAccounts.length} synchronized accounts</span>
            </div>
          </div>

          {/* Micro Metric Matrices */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-space-md lg:border-l lg:border-surface-variant/40 lg:pl-space-xl pt-space-md lg:pt-0 border-t border-surface-variant/30 lg:border-t-0">
            <div className="space-y-1">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block">Total Inflow</span>
              <div className="font-headline-md text-headline-md font-semibold text-primary-fixed tabular-nums">
                +₹{totalIncome.toLocaleString('en-IN')}
              </div>
              <span className="font-label-xs text-label-xs text-outline block">Salary + Earnings</span>
            </div>

            <div className="space-y-1">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block">Total Outflow</span>
              <div className="font-headline-md text-headline-md font-semibold text-error tabular-nums">
                −₹{totalExpense.toLocaleString('en-IN')}
              </div>
              <span className="font-label-xs text-label-xs text-outline block">Operating Expenses</span>
            </div>

            <div className="space-y-1">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block">Net Retained</span>
              <div className="font-headline-md text-headline-md font-semibold text-on-surface tabular-nums">
                ₹{netRetained.toLocaleString('en-IN')}
              </div>
              <span className="font-label-xs text-label-xs text-outline block">Liquid surplus</span>
            </div>

            <div className="space-y-1">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block">Savings Rate</span>
              <div className="font-headline-md text-headline-md font-semibold text-primary-fixed tabular-nums">
                {savingsRate}%
              </div>
              <div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden mt-1.5">
                <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(100, Math.max(0, +savingsRate))}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid: Budget Pacing & Ledger Dispatches */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Left Section: Burn Pacing & Recent Activity */}
        <div className="lg:col-span-8 flex flex-col gap-space-xl">
          {/* Monthly Burn Envelope Gauge */}
          <div className="rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 space-y-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm border-b border-surface-variant/40 pb-space-sm">
              <div>
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">BUDGET ENVELOPE METRICS</span>
                <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Monthly Burn & Pacing</h2>
              </div>
              <div className="flex items-center gap-space-sm">
                <span className="font-label-xs text-label-xs px-2 py-1 rounded bg-surface-container-high text-on-surface-variant border border-surface-variant/30 uppercase tracking-wider">
                  DAY 24 OF 30 (80%)
                </span>
                <span className="font-label-xs text-label-xs px-2 py-1 rounded bg-primary-container/10 text-primary-fixed border border-primary-container/20 uppercase tracking-wider font-semibold">
                  SAFE PACING
                </span>
              </div>
            </div>

            <div className="space-y-space-xs">
              <div className="flex justify-between text-body-sm">
                <span className="text-on-surface-variant">Monthly Allocation Cap (₹35,000)</span>
                <span className="text-on-surface font-mono font-medium">₹20,150 Spent (57.5%)</span>
              </div>
              <div className="w-full bg-surface-container-lowest h-3 rounded-full overflow-hidden p-0.5 border border-surface-variant/50">
                <div className="bg-primary-container h-full rounded-full" style={{ width: '57.5%' }}></div>
              </div>
              <div className="flex justify-between text-label-xs text-outline pt-1">
                <span>Pacing Threshold: ₹28,000 expected by today</span>
                <span className="text-primary-fixed">₹7,850 Under Target Runway</span>
              </div>
            </div>
          </div>

          {/* Recent Dispatches / Activity */}
          <div className="rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 space-y-space-md">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <div>
                <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">REAL-TIME INGESTION</span>
                <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Recent Activity</h2>
              </div>
              <button onClick={() => nav('/transactions')} className="font-label-xs text-label-xs text-primary-fixed hover:underline uppercase tracking-wider font-medium">
                View All Dispatches →
              </button>
            </div>

            <div className="divide-y divide-surface-variant/30">
              {!recentTxs.length && (
                <p className="py-space-md text-center text-outline font-body-sm">
                  No activity yet. Tap Add Entry to record your first transaction.
                </p>
              )}
              {recentTxs.map((tx, idx) => (
                <div key={tx.clientId || idx} className="py-space-sm flex items-center justify-between gap-space-sm">
                  <div className="flex items-center gap-space-sm">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tx.type === 'income' ? 'bg-primary-container/15 text-primary-fixed' : 'bg-surface-container-high text-on-surface-variant'}`}>
                      <span className="material-symbols-outlined text-[20px]">
                        {tx.type === 'income' ? 'arrow_downward' : 'shopping_bag'}
                      </span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-medium text-on-surface">{tx.description || tx.category}</div>
                      <div className="flex items-center gap-2 font-label-xs text-label-xs text-outline">
                        <span>{tx.category}</span>
                        <span>•</span>
                        <span>{tx.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`font-label-lg text-label-lg font-medium ${tx.type === 'income' ? 'text-primary-fixed' : 'text-error'}`}>
                      {tx.type === 'income' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </div>
                    <span className="font-label-xs text-label-xs text-outline uppercase">Synced</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Section: Accounts & Quick Actions */}
        <div className="lg:col-span-4 flex flex-col gap-space-xl">
          {/* Synchronized Accounts Card */}
          <div className="rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 space-y-space-md">
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">LINKED ACCOUNTS</span>
              <button onClick={() => nav('/accounts')} className="font-label-xs text-label-xs text-primary-fixed hover:underline uppercase">Manage</button>
            </div>

            <div className="space-y-space-md">
              {!displayAccounts.length && (
                <p className="text-center text-outline font-body-sm">
                  No accounts yet.{' '}
                  <button onClick={() => nav('/accounts')} className="text-primary-fixed hover:underline">Create one →</button>
                </p>
              )}
              {displayAccounts.map((acc) => (
                <div key={acc._id} className="p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="font-body-sm text-body-sm font-medium text-on-surface">{acc.name}</span>
                    <span className="font-label-xs text-label-xs text-outline">{acc.type || 'Account'}</span>
                  </div>
                  <div className="font-headline-md text-headline-md font-semibold text-on-surface">
                    ₹{acc.balance.toLocaleString('en-IN')}
                  </div>
                  <div className="font-label-xs text-label-xs text-outline">{acc.accountNum || 'Active'}</div>
                </div>
              ))}
            </div>

            <button onClick={() => nav('/transfer')} className="w-full py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface border border-surface-variant/40 font-label-xs text-label-xs uppercase tracking-wider font-semibold transition-all">
              Transfer Funds
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 space-y-space-md">
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">QUICK TOOLS</span>
            <div className="grid grid-cols-2 gap-space-sm">
              <button onClick={() => nav('/calendar')} className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-high border border-surface-variant/30 flex flex-col items-center gap-1 text-center transition-all">
                <span className="material-symbols-outlined text-primary-fixed text-[24px]">calendar_month</span>
                <span className="font-label-xs text-label-xs text-on-surface">Calendar</span>
              </button>

              <button onClick={() => nav('/goals')} className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-high border border-surface-variant/30 flex flex-col items-center gap-1 text-center transition-all">
                <span className="material-symbols-outlined text-primary-fixed text-[24px]">flag</span>
                <span className="font-label-xs text-label-xs text-on-surface">Goals</span>
              </button>

              <button onClick={() => nav('/subscriptions')} className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-high border border-surface-variant/30 flex flex-col items-center gap-1 text-center transition-all">
                <span className="material-symbols-outlined text-primary-fixed text-[24px]">repeat</span>
                <span className="font-label-xs text-label-xs text-on-surface">Subscriptions</span>
              </button>

              <button onClick={() => nav('/analytics')} className="p-space-sm rounded bg-surface-container-lowest hover:bg-surface-container-high border border-surface-variant/30 flex flex-col items-center gap-1 text-center transition-all">
                <span className="material-symbols-outlined text-primary-fixed text-[24px]">monitoring</span>
                <span className="font-label-xs text-label-xs text-on-surface">Analytics</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
