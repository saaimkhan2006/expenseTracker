import { useState } from 'react';

type Sub = {
  id: string;
  name: string;
  category: string;
  amount: number;
  cycle: 'Monthly' | 'Annual';
  nextBilling: string;
  cardName: string;
  icon: string;
};

export function Subscriptions() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [amountStr, setAmountStr] = useState('649');
  const [cycle, setCycle] = useState<'Monthly' | 'Annual'>('Monthly');
  const [category, setCategory] = useState('Entertainment');
  const [nextBilling, setNextBilling] = useState('2024-10-28');

  const [subs, setSubs] = useState<Sub[]>([
    { id: 's1', name: 'Netflix Premium 4K', category: 'Entertainment', amount: 649, cycle: 'Monthly', nextBilling: '28 Oct 2024', cardName: 'HDFC Checking', icon: 'tv' },
    { id: 's2', name: 'Spotify Duo Family', category: 'Media', amount: 149, cycle: 'Monthly', nextBilling: '02 Nov 2024', cardName: 'ICICI Savings', icon: 'music_note' },
    { id: 's3', name: 'Figma Pro Team', category: 'Software', amount: 1290, cycle: 'Monthly', nextBilling: '14 Nov 2024', cardName: 'Axis Credit Card', icon: 'palette' },
    { id: 's4', name: 'AWS Cloud Infrastructure', category: 'Infrastructure', amount: 4200, cycle: 'Monthly', nextBilling: '01 Nov 2024', cardName: 'HDFC Checking', icon: 'dns' },
  ]);

  const monthlyTotal = subs.reduce((acc, s) => acc + (s.cycle === 'Monthly' ? s.amount : s.amount / 12), 0);
  const annualTotal = monthlyTotal * 12;

  const handleAddSub = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubs([
      ...subs,
      {
        id: Date.now().toString(),
        name: name.trim(),
        category,
        amount: parseFloat(amountStr) || 499,
        cycle,
        nextBilling,
        cardName: 'HDFC Checking',
        icon: 'subscriptions',
      },
    ]);
    setName('');
    setShowModal(false);
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
          <div className="my-space-md font-headline-lg text-headline-lg font-semibold tracking-tight text-on-surface">
            In 4 Days
          </div>
          <span className="font-label-xs text-label-xs text-outline font-mono">28 Oct • Netflix ₹649</span>
        </div>
      </div>

      {/* Subscription Cards List */}
      <div className="space-y-space-md">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
          <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Active Recurring Services</h2>
          <span className="font-label-xs text-label-xs text-outline">{subs.length} Subscriptions</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {subs.map((s) => (
            <div key={s.id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex items-center justify-between gap-space-md shadow-sm">
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed shrink-0">
                  <span className="material-symbols-outlined text-[22px]">{s.icon}</span>
                </div>
                <div>
                  <h3 className="font-body-md text-body-md font-semibold text-on-surface">{s.name}</h3>
                  <div className="flex items-center gap-2 font-label-xs text-label-xs text-outline">
                    <span>{s.category}</span>
                    <span>•</span>
                    <span>Renews: {s.nextBilling}</span>
                  </div>
                </div>
              </div>

              <div className="text-right shrink-0">
                <div className="font-label-lg text-label-lg font-bold text-on-surface">
                  ₹{s.amount.toLocaleString('en-IN')}
                </div>
                <span className="font-label-xs text-label-xs text-outline uppercase">{s.cycle}</span>
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
                    onChange={(e) => setCycle(e.target.value as any)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  >
                    <option value="Monthly">Monthly</option>
                    <option value="Annual">Annual</option>
                  </select>
                </div>
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
