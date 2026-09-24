import { useState } from 'react';
import { useFinance } from '../stores/finance';

type Sub = {
  _id: string;
  name: string;
  category: string;
  amount: number;
  cycle: string;
  nextBilling: string;
  accountId: string;
  icon: string;
};

const CYCLE_LABEL: Record<string, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly', yearly: 'Annual' };

export function Subscriptions() {
  const { subscriptions, subsMonthly, subsAnnual, accounts, createSubscription } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('649');
  const [cycle, setCycle] = useState('monthly');
  const [category, setCategory] = useState('Entertainment');
  const [accountId, setAccountId] = useState('');
  const [error, setError] = useState('');
  const [nextBilling, setNextBilling] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1);
    return d.toISOString().slice(0, 10);
  });

  const subs: Sub[] = subscriptions;

  const monthlyTotal = subsMonthly;
  const annualTotal = subsAnnual;

  const upcoming = [...subs].sort(
    (a, b) => +new Date(a.nextBilling) - +new Date(b.nextBilling)
  )[0];
  const upcomingInDays = upcoming
    ? Math.max(0, Math.ceil((+new Date(upcoming.nextBilling) - Date.now()) / 864e5))
    : null;

  const handleAddSub = async (e: React.FormEvent) => {
    e.preventDefault();
    const acc = accountId || accounts[0]?._id;
    if (!name.trim() || !acc) { setError('Enter a name and select an account.'); return; }
    setError('');
    try {
      await createSubscription({
        name: name.trim(), amount: parseFloat(amountStr) || 0,
        cycle, accountId: acc, nextBilling, category,
      });
      setName('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-surface-variant/40 pb-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-2 font-label-xs text-label-xs text-outline uppercase tracking-wider">
            <span className="text-primary-fixed">PLAN</span>
            <span>/</span>
            <span>RECURRING COMMITMENTS & RUNWAY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">
            Subscriptions & Recurring Burn
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Audited monthly retainers, automated renewals, and scheduled SaaS liabilities.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          <span>+ Add Subscription</span>
        </button>
      </div>

      {/* Hero Telemetry Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between">
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Active Monthly Retainer</span>
          <div className="my-space-md font-display-lg text-display-lg font-semibold tracking-tight text-on-surface">
            ₹{Math.round(monthlyTotal).toLocaleString('en-IN')}<span className="text-body-sm text-outline font-normal">/mo</span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed font-semibold">Continuous Pacing</span>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between">
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Annualized Outflow</span>
          <div className="my-space-md font-display-lg text-display-lg font-semibold tracking-tight text-on-surface">
            ₹{Math.round(annualTotal).toLocaleString('en-IN')}<span className="text-body-sm text-outline font-normal">/yr</span>
          </div>
          <span className="font-label-xs text-label-xs text-outline">Projected Runway Drain</span>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between">
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Fleet Inventory</span>
          <div className="my-space-md font-display-lg text-display-lg font-semibold tracking-tight text-on-surface">
            {subs.length} <span className="text-body-sm text-outline font-normal">Services</span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed font-semibold">100% Active</span>
        </div>

        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between">
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-error">Next Renewal Event</span>
          {upcoming ? (
            <>
              <div className="my-space-md font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface">
                In {upcomingInDays} Day{upcomingInDays === 1 ? '' : 's'}
              </div>
              <span className="font-label-xs text-label-xs text-outline font-mono">
                {new Date(upcoming.nextBilling).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} • {upcoming.name} ₹{upcoming.amount.toLocaleString('en-IN')}
              </span>
            </>
          ) : (
            <div className="my-space-md font-body-md text-body-md text-outline">No active subscriptions.</div>
          )}
        </div>
      </div>

      {/* Subscription Cards List */}
      <div className="space-y-space-md">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
          <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Active Recurring Services</h2>
          <span className="font-label-xs text-label-xs text-outline">{subs.length} Subscriptions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {!subs.length && (
            <p className="text-outline col-span-full text-center py-space-lg">
              No subscriptions tracked yet. Add your first one above.
            </p>
          )}
          {subs.map((s) => (
            <div key={s._id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex items-center justify-between gap-space-md shadow-sm">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                </div>
                <div>
                  <h3 className="font-body-md text-body-md font-semibold text-on-surface">{s.name}</h3>
                  <div className="flex items-center gap-2 font-label-xs text-label-xs text-outline">
                    <span>{s.category}</span>
                    <span>•</span>
                    <span>Renews: {new Date(s.nextBilling).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-label-lg text-label-lg font-bold text-on-surface">
                  ₹{s.amount.toLocaleString('en-IN')}
                </div>
                <span className="font-label-xs text-label-xs text-outline uppercase">{CYCLE_LABEL[s.cycle] || s.cycle}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Subscription Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Add Subscription</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddSub} className="space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Service Name</label>
                <input
                  type="text"
                  placeholder="e.g. ChatGPT Plus, GitHub Copilot..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Amount (₹)</label>
                  <input
                    type="number"
                    value={amountStr}
                    onChange={(e) => setAmountStr(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Billing Cycle</label>
                  <select
                    value={cycle}
                    onChange={(e) => setCycle(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Annual</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Account</label>
                  <select
                    value={accountId || accounts[0]?._id || ''}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  >
                    {accounts.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Next Billing Date</label>
                <input
                  type="date"
                  value={nextBilling}
                  onChange={(e) => setNextBilling(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                />
              </div>
              </div>

              {error && <p className="text-error font-semibold">{error}</p>}

              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all">
                Save Subscription
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
