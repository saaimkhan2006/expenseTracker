import { useState } from 'react';
import { useFinance } from '../stores/finance';

const STATUS_LABEL: Record<string, string> = { pending: 'PENDING', partial: 'PARTIAL', overdue: 'OVERDUE', paid: 'SETTLED' };

export function MoneyOwed() {
  const { loans, receivable, payable, accounts, createLoan, repayLoan } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [personName, setPersonName] = useState('');
  const [amountStr, setAmountStr] = useState('1000');
  const [recordType, setRecordType] = useState<'lent' | 'borrowed'>('lent');
  const [notes, setNotes] = useState('Dinner split');
  const [accountId, setAccountId] = useState('');
  const [dueDate, setDueDate] = useState(() => new Date(Date.now() + 7 * 864e5).toISOString().slice(0, 10));
  const [error, setError] = useState('');
  const [busy, setBusy] = useState<string | null>(null);

  const netDelta = receivable - payable;
  const active = loans.filter((l) => l.status !== 'paid');

  const handleSettle = async (id: string, remaining: number) => {
    setBusy(id);
    try {
      await repayLoan(id, remaining);
    } catch (e: any) {
      setError(e.response?.data?.message || 'Repayment failed. Try again.');
    } finally {
      setBusy(null);
    }
  };

  const handleAddRecord = async (e: React.FormEvent) => {
    e.preventDefault();
    const acc = accountId || accounts[0]?._id;
    if (!personName.trim() || !acc) { setError('Enter a name and select an account.'); return; }
    setError('');
    try {
      await createLoan(recordType, personName.trim(), parseFloat(amountStr) || 0, acc, dueDate || undefined, notes);
      setPersonName('');
      setShowModal(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Could not save. Try again.');
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg border-b border-surface-variant/40 pb-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-space-xs font-label-xs text-label-xs text-outline uppercase tracking-wider">
            <span className="w-2 h-2 rounded-full bg-primary-container"></span>
            <span>Capital Allocation Protocol</span>
            <span>/</span>
            <span className="text-primary-fixed">Peer Ledger</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            Peer Ledger & Money Owed
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Track informal loans, shared splits, and counterparty settlements. Non-expense balance sheet.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="bg-primary-container text-on-primary-fixed hover:bg-primary-fixed-dim transition-all px-space-md py-2 rounded font-label-md text-label-md font-semibold flex items-center gap-2 shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">add_circle</span>
          <span>+ Add Peer Entry</span>
        </button>
      </div>

      {error && <p className="text-error font-semibold">{error}</p>}

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
        <div className="p-space-lg bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Net Receivable (Lent)</span>
            <span className="font-label-xs text-label-xs text-primary-fixed bg-primary-container/10 px-2 py-0.5 rounded font-semibold">ASSETS</span>
          </div>
          <div className="my-space-md font-display-lg text-display-lg text-primary-fixed font-semibold tracking-tight">
            ₹{receivable.toLocaleString('en-IN')}
          </div>
          <span className="font-label-xs text-label-xs text-outline">Owed to you by peers</span>
        </div>

        <div className="p-space-lg bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Net Payable (Borrowed)</span>
            <span className="font-label-xs text-label-xs text-secondary bg-secondary-container/20 px-2 py-0.5 rounded font-semibold">DEBT</span>
          </div>
          <div className="my-space-md font-display-lg text-display-lg text-secondary font-semibold tracking-tight">
            ₹{payable.toLocaleString('en-IN')}
          </div>
          <span className="font-label-xs text-label-xs text-outline">To be paid back by you</span>
        </div>

        <div className="p-space-lg bg-surface-container-low rounded-xl border border-surface-variant/30 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Net Peer Delta</span>
            <span className="material-symbols-outlined text-primary-fixed text-[20px]">balance</span>
          </div>
          <div className={`my-space-md font-display-lg text-display-lg font-semibold tracking-tight ${netDelta >= 0 ? 'text-primary-fixed' : 'text-error'}`}>
            {netDelta >= 0 ? '+' : '-'}₹{Math.abs(netDelta).toLocaleString('en-IN')}
          </div>
          <span className="font-label-xs text-label-xs text-outline">Overall peer spread</span>
        </div>
      </div>

      {/* Peer Ledger Table */}
      <div className="rounded-xl bg-surface-container-low border border-surface-variant/30 overflow-hidden">
        <div className="p-space-md border-b border-surface-variant/40 flex items-center justify-between">
          <h2 className="font-headline-md text-headline-md font-medium text-on-surface">Active Counterparties</h2>
          <span className="font-label-xs text-label-xs text-outline">{active.length} Peer Records</span>
        </div>

        <div className="divide-y divide-surface-variant/30">
          {active.map((r: any) => {
            const remaining = r.amount - (r.paidAmount || 0);
            return (
              <div key={r._id} className="p-space-md flex items-center justify-between gap-space-md hover:bg-surface-container/30 transition-colors">
                <div className="flex items-center gap-space-sm">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${r.kind === 'lent' ? 'bg-primary-container/15 text-primary-fixed' : 'bg-secondary-container/20 text-secondary'}`}>
                    <span className="material-symbols-outlined text-[20px]">
                      {r.kind === 'lent' ? 'arrow_outward' : 'arrow_downward'}
                    </span>
                  </div>
                  <div>
                    <div className="font-body-md text-body-md font-semibold text-on-surface">{r.person}</div>
                    <div className="font-label-xs text-label-xs text-outline">
                      {r.description || '—'} • Due: {r.dueDate ? new Date(r.dueDate).toLocaleDateString('en-IN') : '—'}
                      {r.paidAmount > 0 && ` • Paid ₹${r.paidAmount.toLocaleString('en-IN')}`}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-space-md">
                  <div className="text-right">
                    <div className={`font-label-lg text-label-lg font-bold ${r.kind === 'lent' ? 'text-primary-fixed' : 'text-secondary'}`}>
                      {r.kind === 'lent' ? '+' : '-'}₹{remaining.toLocaleString('en-IN')}
                    </div>
                    <span className={`font-label-xs text-label-xs uppercase ${r.status === 'overdue' ? 'text-error font-semibold' : 'text-outline'}`}>
                      {STATUS_LABEL[r.status] || r.status}
                    </span>
                  </div>

                  <button
                    onClick={() => handleSettle(r._id, remaining)}
                    disabled={busy === r._id}
                    className="px-3 py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-xs text-label-xs uppercase font-semibold transition-all disabled:opacity-50"
                  >
                    {busy === r._id ? '...' : 'Settle'}
                  </button>
                </div>
              </div>
            );
          })}
          {!active.length && (
            <p className="p-space-lg text-center text-outline">No active peer records. Add your first entry above.</p>
          )}
        </div>
      </div>

      {/* Add Peer Entry Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-space-md" onClick={() => setShowModal(false)}>
          <div className="w-full max-w-md bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 space-y-space-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Record Peer Transaction</h3>
              <button onClick={() => setShowModal(false)} className="text-outline hover:text-on-surface">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={handleAddRecord} className="space-y-space-md">
              <div className="flex items-center p-1 rounded-lg bg-surface-container-lowest border border-surface-variant/40">
                <button
                  type="button"
                  onClick={() => setRecordType('lent')}
                  className={`flex-1 py-1.5 rounded-md font-label-xs text-label-xs uppercase font-semibold ${
                    recordType === 'lent' ? 'bg-primary-container text-on-primary-fixed' : 'text-on-surface-variant'
                  }`}
                >
                  I Lent Money
                </button>
                <button
                  type="button"
                  onClick={() => setRecordType('borrowed')}
                  className={`flex-1 py-1.5 rounded-md font-label-xs text-label-xs uppercase font-semibold ${
                    recordType === 'borrowed' ? 'bg-secondary-container text-on-secondary-container' : 'text-on-surface-variant'
                  }`}
                >
                  I Borrowed Money
                </button>
              </div>

              <div className="space-y-1">
                <label className="font-label-xs text-label-xs uppercase text-outline">Counterparty Name</label>
                <input
                  type="text"
                  placeholder="e.g. Rahul Sharma..."
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
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
                  <label className="font-label-xs text-label-xs uppercase text-outline">Account</label>
                  <select
                    value={accountId || accounts[0]?._id || ''}
                    onChange={(e) => setAccountId(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  >
                    {accounts.map((a) => <option key={a._id} value={a._id}>{a.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-space-sm">
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Notes / Context</label>
                  <input
                    type="text"
                    placeholder="e.g. Dinner split..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                  />
                </div>
              </div>

              <button type="submit" className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all">
                Save Peer Entry
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
