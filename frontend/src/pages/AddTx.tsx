import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useFinance } from '../stores/finance';

export function AddTx() {
  const nav = useNavigate();
  const { addTx, accounts } = useFinance();

  const [type, setType] = useState<'expense' | 'income'>('expense');
  const [amountStr, setAmountStr] = useState('500');
  const [category, setCategory] = useState('Food & Dining');
  const [accountId, setAccountId] = useState(accounts[0]?._id || '');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const expenseCategories = [
    { name: 'Food & Dining', icon: 'restaurant' },
    { name: 'Shopping', icon: 'shopping_bag' },
    { name: 'Transport', icon: 'directions_car' },
    { name: 'Operations', icon: 'dns' },
    { name: 'Utilities', icon: 'bolt' },
    { name: 'Subscriptions', icon: 'repeat' },
    { name: 'Entertainment', icon: 'movie' },
    { name: 'Healthcare', icon: 'medical_services' },
  ];

  const incomeCategories = [
    { name: 'Salary', icon: 'payments' },
    { name: 'Freelance', icon: 'work' },
    { name: 'Investments', icon: 'trending_up' },
    { name: 'Other Income', icon: 'account_balance_wallet' },
  ];

  const activeCategories = type === 'expense' ? expenseCategories : incomeCategories;

  const handleAdjustAmount = (delta: number) => {
    const val = (parseFloat(amountStr) || 0) + delta;
    setAmountStr(val.toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amountStr);
    if (!numericAmount || numericAmount <= 0) return;
    const acc = accountId || accounts[0]?._id;
    if (!acc) { setError('Create an account first — every entry needs a real account.'); return; }
    setError('');
    setSubmitting(true);
    await addTx({
      type,
      amount: numericAmount,
      category,
      accountId: acc,
      date,
      description: description || category,
    });
    setSubmitting(false);
    nav('/transactions');
  };

  if (!accounts.length) {
    return (
      <div className="max-w-2xl mx-auto flex flex-col gap-space-md text-on-surface text-center p-space-xl">
        <h1 className="font-headline-lg text-headline-lg font-medium">Add Entry</h1>
        <p className="text-on-surface-variant">Create your first account before recording transactions.</p>
        <button onClick={() => nav('/accounts')} className="mx-auto px-4 py-2 rounded-lg bg-primary-container text-on-primary-fixed font-semibold">Go to Accounts</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto flex flex-col gap-space-lg text-on-surface">
      {/* Header with Type Selector */}
      <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-md">
        <div className="flex items-center gap-space-sm">
          <button onClick={() => nav(-1)} className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center text-on-surface hover:text-primary-fixed transition-transform">
            <span className="material-symbols-outlined text-[20px]">arrow_back</span>
          </button>
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Ledger Dispatch</span>
            <h1 className="font-headline-lg text-headline-lg text-on-surface tracking-tight font-medium">Add Entry</h1>
          </div>
        </div>

        {/* Expense vs Income Toggle */}
        <div className="flex items-center p-1 rounded-xl bg-surface-container border border-surface-variant/40">
          <button
            type="button"
            onClick={() => { setType('expense'); setCategory('Food & Dining'); }}
            className={`px-4 py-1.5 rounded-lg font-label-xs text-label-xs uppercase tracking-wider font-semibold transition-all ${
              type === 'expense' ? 'bg-error-container text-on-error-container shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Expense
          </button>
          <button
            type="button"
            onClick={() => { setType('income'); setCategory('Salary'); }}
            className={`px-4 py-1.5 rounded-lg font-label-xs text-label-xs uppercase tracking-wider font-semibold transition-all ${
              type === 'income' ? 'bg-primary-container text-on-primary-fixed shadow-sm' : 'text-on-surface-variant'
            }`}
          >
            Income
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg">
        {/* Amount Input Card */}
        <div className="rounded-xl bg-surface-container-low p-space-lg border border-surface-variant/30 flex flex-col gap-space-sm relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="font-label-xs text-label-xs tracking-wider text-outline uppercase">
              {type === 'expense' ? 'Debit Amount' : 'Credit Amount'}
            </span>
            <span className="font-label-xs text-label-xs text-outline">INR Currency</span>
          </div>

          <div className="flex items-baseline gap-space-sm my-space-xs">
            <span className={`font-headline-lg text-headline-lg font-medium ${type === 'income' ? 'text-primary-fixed' : 'text-error'}`}>
              {type === 'income' ? '+' : '−'}
            </span>
            <span className="font-display-xl text-display-xl text-on-surface-variant font-light">₹</span>
            <input
              type="number"
              step="any"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              className="bg-transparent font-display-xl text-display-xl font-semibold text-on-surface focus:outline-none w-full tracking-tight"
              placeholder="0"
              required
            />
          </div>

          {/* Quick Increment Tray */}
          <div className="flex items-center gap-space-xs pt-space-xs flex-wrap">
            <button type="button" onClick={() => handleAdjustAmount(100)} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-label-xs text-label-xs transition-colors">
              <span className="text-primary-fixed font-bold">+</span>₹100
            </button>
            <button type="button" onClick={() => handleAdjustAmount(500)} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-label-xs text-label-xs transition-colors">
              <span className="text-primary-fixed font-bold">+</span>₹500
            </button>
            <button type="button" onClick={() => handleAdjustAmount(1000)} className="px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-bright text-on-surface font-label-xs text-label-xs transition-colors">
              <span className="text-primary-fixed font-bold">+</span>₹1,000
            </button>
            <button type="button" onClick={() => setAmountStr('0')} className="ml-auto px-3 py-1.5 rounded-lg bg-surface-container text-error font-label-xs text-label-xs">
              CLEAR
            </button>
          </div>
        </div>

        {/* Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
          {/* Account Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-xs text-label-xs text-outline uppercase tracking-wider">Account Rail</label>
            <select
              value={accountId || accounts[0]?._id || ''}
              onChange={(e) => setAccountId(e.target.value)}
              className="p-space-sm rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
            >
              {accounts.map((acc) => (
                <option key={acc._id} value={acc._id}>
                  {acc.name} (₹{acc.balance?.toLocaleString('en-IN')})
                </option>
              ))}
            </select>
          </div>

          {/* Date Picker */}
          <div className="flex flex-col gap-1.5">
            <label className="font-label-xs text-label-xs text-outline uppercase tracking-wider">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="p-space-sm rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
            />
          </div>
        </div>

        {/* Category Grid Selection */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-xs text-label-xs text-outline uppercase tracking-wider">Allocation Category</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-xs">
            {activeCategories.map((cat) => {
              const isSelected = category === cat.name;
              return (
                <button
                  type="button"
                  key={cat.name}
                  onClick={() => setCategory(cat.name)}
                  className={`flex flex-col items-center justify-center py-space-sm px-2 rounded-xl transition-all border ${
                    isSelected
                      ? 'bg-surface-container-high border-primary-container text-primary-fixed shadow-sm'
                      : 'bg-surface-container border-transparent text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1 ${isSelected ? 'bg-primary-container/20 text-primary-fixed' : 'bg-surface-container-lowest text-outline'}`}>
                    <span className="material-symbols-outlined text-[18px]">{cat.icon}</span>
                  </span>
                  <span className="font-label-xs text-label-xs font-medium text-center">{cat.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description / Notes Input */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label-xs text-label-xs text-outline uppercase tracking-wider">Description / Note</label>
          <input
            type="text"
            placeholder="e.g. AWS Cloud Invoice, Blue Tokai Coffee..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-space-sm rounded-xl bg-surface-container border border-surface-variant/40 text-on-surface placeholder:text-outline font-body-md focus:outline-none"
          />
        </div>

        {/* Submit Action Button */}
        {error && <p className="text-error font-semibold text-center">{error}</p>}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-space-md rounded-xl bg-primary-container text-on-primary-fixed font-label-lg text-label-lg font-semibold hover:bg-primary-fixed-dim transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2"
        >
          <span className="material-symbols-outlined">check_circle</span>
          <span>{submitting ? 'Recording Entry...' : `Dispatch ${type === 'expense' ? 'Expense' : 'Income'} Entry`}</span>
        </button>
      </form>
    </div>
  );
}
