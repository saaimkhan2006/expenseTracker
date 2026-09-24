import { useState } from 'react';
import { useFinance } from '../stores/finance';

type BudgetEnvelope = {
  id: string;
  category: string;
  spent: number;
  cap: number;
  icon: string;
};

export function Budget() {
  const { budgets, createBudget } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newCap, setNewCap] = useState('5000');
  const [error, setError] = useState('');

  // Real envelopes: caps from the API, spend computed server-side from transactions.
  const envelopes: BudgetEnvelope[] = budgets.map((b: any) => ({
    id: b._id, category: b.category, spent: b.spent || 0, cap: b.cap, icon: 'account_balance_wallet',
  }));

  const totalCap = envelopes.reduce((acc, e) => acc + e.cap, 0);
  const totalSpent = envelopes.reduce((acc, e) => acc + e.spent, 0);
  const now = new Date();
  const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const daysElapsed = Math.max(1, Math.min(now.getDate(), daysInMonth));
  const dailyAvg = Math.round(totalSpent / daysElapsed);
  const dailyCap = Math.round(totalCap / daysInMonth);
  const utilizationPct = totalCap > 0 ? ((totalSpent / totalCap) * 100).toFixed(0) : '0';
  const remaining = totalCap - totalSpent;

  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim() || !newCap) return;
    setError('');
    try {
      await createBudget(newCategory.trim(), parseFloat(newCap));
      setNewCategory('');
      setNewCap('5000');
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save budget. Try again.');
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header Bar */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-primary-fixed bg-surface-container-high px-space-sm py-0.5 rounded">
              Terminal Module 04
            </span>
            <span className="font-label-xs text-label-xs text-outline">v2.4 // LEDGER PACING</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            Budget Envelopes & Pacing
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            Real-time dynamic burn telemetry, envelope allocations, and automated threshold alerts.
          </p>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-space-xs bg-primary-container text-on-primary-fixed px-space-md py-2 rounded font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px]">add_circle</span>
            <span>Create Budget</span>
          </button>
        </div>
      </div>

      {/* Master Budget Velocity Hero Panel */}
      <div className="bg-surface-container-low rounded-xl p-space-lg shadow-xl border border-surface-variant/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-fixed/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-space-lg relative z-10">
          <div className="space-y-space-sm max-w-2xl">
            <div className="flex items-center gap-space-sm">
              <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Master Cap Status</span>
              <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
              <span className="font-label-xs text-label-xs text-primary-fixed uppercase tracking-wider font-semibold">Healthy Velocity Track</span>
            </div>
            <div className="flex flex-wrap items-baseline gap-x-space-md gap-y-1">
              <span className="font-label-lg text-label-lg text-outline">₹</span>
              <span className="font-display-xl text-display-xl font-bold tracking-tight text-on-surface">
                {totalSpent.toLocaleString('en-IN')}
              </span>
              <span className="font-headline-md text-headline-md text-outline">/ ₹{totalCap.toLocaleString('en-IN')}</span>
              <span className="bg-primary-container/10 text-primary-fixed font-label-md text-label-md px-space-sm py-1 rounded font-semibold">
                {utilizationPct}% Utilized
              </span>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-2">
              <span className="text-primary-fixed font-medium">₹{remaining.toLocaleString('en-IN')} Remaining</span>
              <span>— Under dynamic ceiling threshold for current fiscal period.</span>
            </p>
          </div>

          {/* Burn Rate Dual Gauges */}
          <div className="grid grid-cols-2 gap-space-md min-w-[280px]">
            <div className="bg-surface-container p-space-md rounded-lg border border-surface-variant/30">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Current Daily Avg</span>
              <div className="flex items-baseline gap-1">
                <span className="font-label-md text-label-md text-outline">₹</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">{dailyAvg.toLocaleString('en-IN')}</span>
                <span className="font-label-xs text-label-xs text-outline">/day</span>
              </div>
              <span className="font-label-xs text-label-xs text-primary-fixed mt-1 block">Optimal Pace</span>
            </div>
            <div className="bg-surface-container p-space-md rounded-lg border border-surface-variant/30">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Allowed Burn Cap</span>
              <div className="flex items-baseline gap-1">
                <span className="font-label-md text-label-md text-outline">₹</span>
                <span className="font-headline-md text-headline-md font-bold text-on-surface">{dailyCap.toLocaleString('en-IN')}</span>
                <span className="font-label-xs text-label-xs text-outline">/day</span>
              </div>
              <span className="font-label-xs text-label-xs text-on-surface-variant mt-1 block">Safe Limit</span>
            </div>
          </div>
        </div>

        {/* Master Progress Bar */}
        <div className="mt-space-lg space-y-space-xs">
          <div className="flex justify-between items-center font-label-xs text-label-xs text-outline">
            <span className="uppercase tracking-wider">Overall Envelope Burn</span>
            <span className="text-primary-fixed font-semibold">Positive Delta: +₹{remaining.toLocaleString('en-IN')} Buffer</span>
          </div>
          <div className="w-full bg-surface-container h-3.5 rounded-full overflow-hidden p-0.5 border border-surface-variant/50">
            <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${utilizationPct}%` }}></div>
          </div>
        </div>
      </div>

      {/* Category Envelope Cards Grid */}
      <div className="space-y-space-md">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
          <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Category Allocation Envelopes</h2>
          <span className="font-label-xs text-label-xs text-outline">{envelopes.length} Active Envelopes</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-md">
          {!envelopes.length && (
            <p className="text-outline col-span-full text-center py-space-lg">
              No budgets for this month yet. Create your first envelope above.
            </p>
          )}
          {envelopes.map((env) => {
            const pct = Math.min(100, Math.round((env.spent / env.cap) * 100));
            const isWarning = pct >= 80 && pct < 100;
            const isExceeded = pct >= 100;

            return (
              <div key={env.id} className="rounded-xl bg-surface-container-low p-space-md border border-surface-variant/30 flex flex-col justify-between space-y-space-md">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-space-sm">
                    <div className="w-9 h-9 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed">
                      <span className="material-symbols-outlined text-[20px]">{env.icon}</span>
                    </div>
                    <div>
                      <div className="font-body-md text-body-md font-semibold text-on-surface">{env.category}</div>
                      <div className="font-label-xs text-label-xs text-outline">Cap: ₹{env.cap.toLocaleString('en-IN')}</div>
                    </div>
                  </div>

                  <span className={`font-label-xs text-label-xs px-2 py-0.5 rounded font-semibold uppercase ${
                    isExceeded
                      ? 'bg-error-container text-on-error-container'
                      : isWarning
                      ? 'bg-tertiary-container text-on-tertiary-container'
                      : 'bg-primary-container/10 text-primary-fixed'
                  }`}>
                    {isExceeded ? 'Exceeded' : isWarning ? 'Near Limit' : 'On Track'}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between font-label-xs text-label-xs">
                    <span className="text-on-surface-variant">Spent: ₹{env.spent.toLocaleString('en-IN')}</span>
                    <span className="text-on-surface font-semibold">{pct}%</span>
                  </div>
                  <div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isExceeded ? 'bg-error' : isWarning ? 'bg-tertiary-fixed-dim' : 'bg-primary-container'}`} style={{ width: `${pct}%` }}></div>
                  </div>
                  <div className="text-right font-label-xs text-label-xs text-outline pt-0.5">
                    ₹{(env.cap - env.spent).toLocaleString('en-IN')} remaining
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create Budget Envelope Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Create Budget Envelope</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateBudget} className="space-y-space-md">
              {error && <p className="text-error font-semibold">{error}</p>}
              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Category Name</label>
                <input
                  type="text"
                  placeholder="e.g. Dining, Travel, Gaming..."
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Monthly Allocation Cap (₹)</label>
                <input
                  type="number"
                  placeholder="5000"
                  value={newCap}
                  onChange={(e) => setNewCap(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all">
                Save Envelope
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
