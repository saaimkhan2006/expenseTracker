import { useState } from 'react';

type Goal = {
  id: string;
  name: string;
  target: number;
  current: number;
  deadline: string;
  monthlyCommitment: number;
  icon: string;
};

export function Goals() {
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState('');
  const [targetStr, setTargetStr] = useState('100000');
  const [currentStr, setCurrentStr] = useState('25000');
  const [monthlyStr, setMonthlyStr] = useState('5000');
  const [deadline, setDeadline] = useState('2025-06-30');

  const [goals, setGoals] = useState<Goal[]>([
    { id: 'g1', name: 'Emergency Capital Reserve', target: 300000, current: 180000, deadline: 'Dec 2024', monthlyCommitment: 15000, icon: 'shield' },
    { id: 'g2', name: 'EV Car Downpayment', target: 200000, current: 85000, deadline: 'Mar 2025', monthlyCommitment: 10000, icon: 'directions_car' },
    { id: 'g3', name: 'Tokyo Tech Conference', target: 120000, current: 45000, deadline: 'May 2025', monthlyCommitment: 5000, icon: 'flight_takeoff' },
    { id: 'g4', name: 'Home Office Workstation', target: 80000, current: 62000, deadline: 'Nov 2024', monthlyCommitment: 6000, icon: 'desktop_windows' },
  ]);

  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalAccumulated = goals.reduce((acc, g) => acc + g.current, 0);
  const totalMonthly = goals.reduce((acc, g) => acc + g.monthlyCommitment, 0);
  const overallPct = totalTarget > 0 ? Math.round((totalAccumulated / totalTarget) * 100) : 0;

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setGoals([
      ...goals,
      {
        id: Date.now().toString(),
        name: name.trim(),
        target: parseFloat(targetStr) || 100000,
        current: parseFloat(currentStr) || 0,
        monthlyCommitment: parseFloat(monthlyStr) || 5000,
        deadline,
        icon: 'flag',
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
          <div className="flex items-center gap-space-xs font-label-xs text-label-xs text-outline uppercase tracking-wider">
            <span className="text-primary-fixed">PLAN</span>
            <span>/</span>
            <span>CAPITAL ACCUMULATION PROTOCOL</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-semibold">
            Financial Goals & Capital Vaults
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Target accumulation trajectories, horizon pacing buffers, and automated allocation protocols.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-space-md py-2 rounded bg-primary-container text-on-primary-fixed transition-all font-label-md text-label-md flex items-center gap-space-xs font-semibold shadow-md active:scale-95"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Create Goal Vault</span>
        </button>
      </div>

      {/* Overview Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-space-sm bg-surface-container-lowest p-space-sm rounded-xl border border-surface-variant/30">
        <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Total Target Capital</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
            ₹{totalTarget.toLocaleString('en-IN')}
          </div>
          <span className="font-label-xs text-label-xs text-outline mt-1">{goals.length} Goal Vaults</span>
        </div>

        <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Accumulated Capital</span>
          <div className="font-headline-lg text-headline-lg text-primary-fixed font-semibold mt-1">
            ₹{totalAccumulated.toLocaleString('en-IN')}
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed mt-1 font-semibold">{overallPct}% Funded</span>
        </div>

        <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Monthly Allocation</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
            ₹{totalMonthly.toLocaleString('en-IN')}<span className="text-body-sm font-normal text-outline">/mo</span>
          </div>
          <span className="font-label-xs text-label-xs text-outline mt-1">Auto-deposit pacing</span>
        </div>

        <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Active Vaults</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
            {goals.length} <span className="text-body-sm font-normal text-outline">Targets</span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed mt-1">All On-Track</span>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));

          return (
            <div key={g.id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between space-y-space-md shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined text-[22px]">{g.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">{g.name}</h3>
                    <span className="font-label-xs text-label-xs text-outline">Deadline: {g.deadline}</span>
                  </div>
                </div>

                <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-fixed font-label-xs text-label-xs font-semibold">
                  {pct}% Funded
                </span>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-label-xs text-label-xs">
                  <span className="text-on-surface-variant font-semibold">Saved: ₹{g.current.toLocaleString('en-IN')}</span>
                  <span className="text-outline">Target: ₹{g.target.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full transition-all" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-outline font-label-xs text-label-xs pt-1">
                  <span>Commitment: ₹{g.monthlyCommitment.toLocaleString('en-IN')}/mo</span>
                  <span className="text-primary-fixed">₹{(g.target - g.current).toLocaleString('en-IN')} remaining</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Create Financial Goal</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleCreateGoal} className="space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Goal Name</label>
                <input
                  type="text"
                  placeholder="e.g. Vacation Fund, House Downpayment..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Target Amount (₹)</label>
                  <input
                    type="number"
                    value={targetStr}
                    onChange={(e) => setTargetStr(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Initial Saved (₹)</label>
                  <input
                    type="number"
                    value={currentStr}
                    onChange={(e) => setCurrentStr(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Monthly Deposit (₹)</label>
                <input
                  type="number"
                  value={monthlyStr}
                  onChange={(e) => setMonthlyStr(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                />
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all">
                Create Goal Vault
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
