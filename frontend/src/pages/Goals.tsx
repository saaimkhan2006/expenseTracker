import { useState } from 'react';
import { useFinance, Goal } from '../stores/finance';

export function Goals() {
  const { goals, accounts, createGoal, depositToGoal, deleteGoal } = useFinance();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);

  const [name, setName] = useState('');
  const [targetStr, setTargetStr] = useState('');
  const [currentStr, setCurrentStr] = useState('0');
  const [monthlyStr, setMonthlyStr] = useState('0');
  const [deadline, setDeadline] = useState('');
  const [icon, setIcon] = useState('flag');
  const [depositAmount, setDepositAmount] = useState('');
  const [depositAccountId, setDepositAccountId] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const totalTarget = goals.reduce((acc, g) => acc + g.target, 0);
  const totalAccumulated = goals.reduce((acc, g) => acc + g.current, 0);
  const totalMonthly = goals.reduce((acc, g) => acc + (g.monthlyCommitment || 0), 0);
  const overallPct = totalTarget > 0 ? Math.round((totalAccumulated / totalTarget) * 100) : 0;

  const handleCreateGoal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const target = parseFloat(targetStr);
    if (!target || target <= 0) {
      setError('Please enter a valid target amount.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await createGoal({
        name: name.trim(),
        target,
        current: parseFloat(currentStr) || 0,
        monthlyCommitment: parseFloat(monthlyStr) || 0,
        deadline: deadline || undefined,
        icon,
      });
      setName('');
      setTargetStr('');
      setCurrentStr('0');
      setMonthlyStr('0');
      setDeadline('');
      setShowCreateModal(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Could not save goal.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGoal) return;
    const amt = parseFloat(depositAmount);
    if (!amt || amt <= 0) {
      setError('Enter a valid deposit amount.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await depositToGoal(selectedGoal._id, amt, depositAccountId || undefined);
      setDepositAmount('');
      setShowDepositModal(false);
      setSelectedGoal(null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Deposit failed.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this goal vault?')) {
      try {
        await deleteGoal(id);
      } catch (err: any) {
        alert(err?.response?.data?.message || 'Failed to delete goal.');
      }
    }
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
          onClick={() => { setError(''); setShowCreateModal(true); }}
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
          <span className="font-label-xs text-label-xs text-outline mt-1">Target Monthly Contribution</span>
        </div>

        <div className="bg-surface-container-low p-space-md rounded flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Active Vaults</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">
            {goals.filter((g) => g.status !== 'completed').length} <span className="text-body-sm font-normal text-outline">Active</span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed mt-1">
            {goals.filter((g) => g.status === 'completed').length} Completed
          </span>
        </div>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {!goals.length && (
          <div className="col-span-full py-space-xl text-center flex flex-col items-center justify-center p-space-lg rounded-xl bg-surface-container border border-surface-variant/30">
            <span className="material-symbols-outlined text-[40px] text-outline mb-2">flag</span>
            <div className="font-headline-md text-headline-md text-on-surface font-medium">No goal vaults yet</div>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-md mt-1 mb-space-md">
              Create a capital accumulation goal to track savings progress, target milestones, and allocation pacing.
            </p>
            <button
              onClick={() => { setError(''); setShowCreateModal(true); }}
              className="px-4 py-2 rounded bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold"
            >
              + Create First Goal Vault
            </button>
          </div>
        )}

        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          const isCompleted = g.current >= g.target || g.status === 'completed';

          return (
            <div key={g._id} className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 flex flex-col justify-between space-y-space-md shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-fixed">
                    <span className="material-symbols-outlined text-[22px]">{g.icon || 'flag'}</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">{g.name}</h3>
                    <span className="font-label-xs text-label-xs text-outline">
                      {g.deadline ? `Target: ${g.deadline}` : 'No target date'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-label-xs text-label-xs font-semibold ${
                    isCompleted ? 'bg-primary-container text-on-primary-fixed' : 'bg-primary-container/10 text-primary-fixed'
                  }`}>
                    {pct}% Funded
                  </span>
                  <button onClick={() => handleDelete(g._id)} className="text-outline hover:text-error transition-colors p-1" title="Delete goal">
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between font-label-xs text-label-xs">
                  <span className="text-on-surface-variant font-semibold">Saved: ₹{g.current.toLocaleString('en-IN')}</span>
                  <span className="text-outline">Target: ₹{g.target.toLocaleString('en-IN')}</span>
                </div>
                <div className="w-full bg-surface-container-highest h-2.5 rounded-full overflow-hidden">
                  <div className="bg-primary-container h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }}></div>
                </div>
                <div className="flex justify-between items-center text-outline font-label-xs text-label-xs pt-1">
                  <span>Commitment: ₹{(g.monthlyCommitment || 0).toLocaleString('en-IN')}/mo</span>
                  <span className="text-primary-fixed">
                    {isCompleted ? 'Target Achieved! 🎉' : `₹${Math.max(0, g.target - g.current).toLocaleString('en-IN')} remaining`}
                  </span>
                </div>
              </div>

              <div className="border-t border-surface-variant/30 pt-space-xs flex justify-end">
                <button
                  onClick={() => { setSelectedGoal(g); setError(''); setShowDepositModal(true); }}
                  className="px-3 py-1 rounded bg-surface-container-high hover:bg-surface-bright text-primary-fixed font-label-xs text-label-xs uppercase font-semibold transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[14px]">add</span>
                  <span>Add Funds</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Create Goal Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowCreateModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Create Financial Goal</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && <p className="text-error font-semibold text-label-xs">{error}</p>}

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
                    placeholder="100000"
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
                    placeholder="0"
                    value={currentStr}
                    onChange={(e) => setCurrentStr(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Monthly Deposit (₹)</label>
                  <input
                    type="number"
                    placeholder="5000"
                    value={monthlyStr}
                    onChange={(e) => setMonthlyStr(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Target Date</label>
                  <input
                    type="date"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Icon</label>
                <select
                  value={icon}
                  onChange={(e) => setIcon(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                >
                  <option value="flag">🚩 Goal Flag</option>
                  <option value="shield">🛡️ Reserve / Emergency</option>
                  <option value="directions_car">🚗 Vehicle</option>
                  <option value="flight_takeoff">✈️ Travel</option>
                  <option value="desktop_windows">💻 Electronics</option>
                  <option value="home">🏠 Real Estate</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all"
              >
                {submitting ? 'Creating...' : 'Create Goal Vault'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Deposit to Goal Modal */}
      {showDepositModal && selectedGoal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowDepositModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Deposit to {selectedGoal.name}</h3>
              <button onClick={() => setShowDepositModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            {error && <p className="text-error font-semibold text-label-xs">{error}</p>}

            <form onSubmit={handleDeposit} className="space-y-space-md">
              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Deposit Amount (₹)</label>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  required
                />
              </div>

              {accounts.length > 0 && (
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Source Account (Optional)</label>
                  <select
                    value={depositAccountId}
                    onChange={(e) => setDepositAccountId(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  >
                    <option value="">None (Don't deduct from account)</option>
                    {accounts.map((a) => (
                      <option key={a._id} value={a._id}>
                        {a.name} (Bal: ₹{a.balance.toLocaleString('en-IN')})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all"
              >
                {submitting ? 'Depositing...' : 'Confirm Deposit'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
