import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../stores/finance';

export function Transfer() {
  const nav = useNavigate();
  const { accounts, transfer } = useFinance();

  const [fromAccId, setFromAccId] = useState(accounts[0]?._id || '');
  const [toAccId, setToAccId] = useState(accounts[1]?._id || '');
  const [amountStr, setAmountStr] = useState('2000');
  const [notes, setNotes] = useState('Monthly Savings Transfer');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const fromAcc = accounts.find((a) => a._id === fromAccId);
  const toAcc = accounts.find((a) => a._id === toAccId);

  const handleSwap = () => {
    setFromAccId(toAccId);
    setToAccId(fromAccId);
  };

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amountStr);
    if (!val || val <= 0) return;
    if (!fromAccId || !toAccId) { setError('Select both accounts.'); return; }
    if (fromAccId === toAccId) { setError('Source and destination must differ.'); return; }
    setError('');
    setSubmitted(true);
    try {
      await transfer(fromAccId, toAccId, val, notes);
      nav('/accounts');
    } catch (err: any) {
      setSubmitted(false);
      setError(err.response?.data?.message || 'Transfer failed. Try again.');
    }
  };

  if (!accounts.length) {
    return (
      <div className="max-w-2xl mx-auto card text-center space-y-3">
        <h1 className="font-headline-lg text-headline-lg">Transfer Capital</h1>
        <p className="text-on-surface-variant">You need at least two accounts before transferring.</p>
        <button onClick={() => nav('/accounts')} className="px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-semibold">Go to Accounts</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-space-lg text-on-surface">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-md">
        <div className="flex items-center gap-space-sm">
          <button onClick={() => nav(-1)} className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:text-primary-fixed transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">INTERNAL REALLOCATION</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">Transfer Capital</h1>
          </div>
        </div>
      </div>

      {/* Banner */}
      <div className="bg-secondary-container/20 rounded-xl p-space-md flex items-start gap-space-sm border border-secondary-container/30">
        <div className="w-7 h-7 rounded-lg bg-secondary-container flex items-center justify-center shrink-0 text-on-secondary-container">
          <span className="material-symbols-outlined text-[18px]">info</span>
        </div>
        <div className="flex flex-col">
          <span className="font-label-md text-label-md text-secondary font-semibold uppercase tracking-wider">Non-Expense Transfer</span>
          <p className="font-body-sm text-body-sm text-on-secondary-container/90 mt-0.5">
            Moving funds between internal accounts does not impact your budget envelope or burn metrics.
          </p>
        </div>
      </div>

      <form onSubmit={handleTransfer} className="space-y-space-lg">
        {/* Source -> Destination Card */}
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col gap-space-sm border border-surface-variant/30 relative">
          {/* From */}
          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-surface-variant/40">
            <label className="font-label-xs text-label-xs uppercase text-outline">From Source Account</label>
            <select
              value={fromAccId}
              onChange={(e) => setFromAccId(e.target.value)}
              className="bg-transparent text-on-surface font-body-md font-semibold focus:outline-none cursor-pointer"
            >
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} (Bal: ₹{a.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center -my-3 z-10">
            <button
              type="button"
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-primary-container text-on-primary-fixed flex items-center justify-center shadow-lg active:scale-90 transition-transform"
              title="Swap From and To"
            >
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </button>
          </div>

          {/* To */}
          <div className="bg-surface-container p-space-md rounded-lg flex flex-col gap-1 border border-surface-variant/40">
            <label className="font-label-xs text-label-xs uppercase text-outline">To Destination Account</label>
            <select
              value={toAccId}
              onChange={(e) => setToAccId(e.target.value)}
              className="bg-transparent text-on-surface font-body-md font-semibold focus:outline-none cursor-pointer"
            >
              {accounts.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name} (Bal: ₹{a.balance.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Transfer Amount Card */}
        <div className="bg-surface-container-low rounded-xl p-space-lg border border-surface-variant/30 flex flex-col items-center gap-space-sm">
          <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Transfer Volume</span>
          <div className="flex items-baseline gap-space-xs my-space-xs">
            <span className="font-headline-lg text-headline-lg text-primary-fixed">₹</span>
            <input
              type="number"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="bg-transparent font-display-xl text-display-xl text-on-surface font-semibold text-center focus:outline-none w-48"
              placeholder="0"
              required
            />
          </div>

          {/* Quick Increment Chips */}
          <div className="flex gap-space-xs flex-wrap justify-center">
            <button type="button" onClick={() => setAmountStr('500')} className="px-3 py-1 rounded bg-surface-container font-label-xs text-label-xs text-on-surface">
              ₹500
            </button>
            <button type="button" onClick={() => setAmountStr('1000')} className="px-3 py-1 rounded bg-surface-container font-label-xs text-label-xs text-on-surface">
              ₹1,000
            </button>
            <button type="button" onClick={() => setAmountStr('5000')} className="px-3 py-1 rounded bg-surface-container font-label-xs text-label-xs text-on-surface">
              ₹5,000
            </button>
            <button type="button" onClick={() => setAmountStr('10000')} className="px-3 py-1 rounded bg-surface-container font-label-xs text-label-xs text-on-surface">
              ₹10,000
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-xs text-label-xs text-outline uppercase">Transfer Reference Note</label>
          <input
            type="text"
            placeholder="e.g. Monthly Savings Sweep..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="p-space-sm rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
          />
        </div>

        {error && <p className="text-error font-semibold text-center">{error}</p>}

        <button
          type="submit"
          disabled={submitted}
          className="w-full py-space-md rounded-xl bg-primary-container text-on-primary-fixed font-label-lg text-label-lg font-semibold hover:bg-primary-fixed-dim transition-all flex items-center justify-center gap-2 shadow-md"
        >
          <span className="material-symbols-outlined">swap_horiz</span>
          <span>{submitted ? 'Executing Transfer...' : `Confirm Transfer of ₹${amountStr}`}</span>
        </button>
      </form>
    </div>
  );
}
