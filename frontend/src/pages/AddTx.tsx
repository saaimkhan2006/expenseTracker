import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useFinance } from '../stores/finance';

const EXPENSE_CATS = ['Food', 'Transport', 'Shopping', 'Rent', 'Bills', 'Education', 'Health', 'Entertainment', 'Travel', 'Technology', 'Clothing', 'Subscriptions', 'Other'];
const INCOME_CATS = ['Salary', 'Freelancing', 'Business', 'Scholarship', 'Allowance', 'Investment', 'Gift', 'Other'];

export function AddTx() {
  const [sp] = useSearchParams();
  const [type, setType] = useState<'expense' | 'income'>((sp.get('type') as any) || 'expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [accountId, setAccountId] = useState('');
  const [description, setDescription] = useState('');
  const { accounts, addTx, load } = useFinance();
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    if (!accountId && accounts.length > 0) {
      setAccountId(accounts[0]._id);
    }
  }, [accounts, accountId]);

  const cats = type === 'expense' ? EXPENSE_CATS : INCOME_CATS;

  const save = async () => {
    const acc = accountId || accounts[0]?._id;
    if (!amount || !acc) return alert('Enter amount and select an account');
    await addTx({
      type, amount: Number(amount), category,
      accountId: acc, date: new Date().toISOString(), description,
    });
    nav('/');
  };

  return (
    <div className="max-w-lg mx-auto space-y-4">
      <h1 className="text-4xl font-extrabold">Add {type}</h1>
      <div className="grid grid-cols-2 gap-3">
        {(['expense', 'income'] as const).map((t) => (
          <button key={t} onClick={() => { setType(t); setCategory(t === 'expense' ? 'Food' : 'Salary'); }}
            className={`rounded-2xl py-4 text-xl font-extrabold ${type === t ? (t === 'expense' ? 'bg-coral text-ink' : 'bg-accent text-ink') : 'bg-white/5'}`}>
            {t}
          </button>
        ))}
      </div>
      <div><span className="label">Amount</span><input className="input !text-4xl font-extrabold" inputMode="decimal" placeholder="₹0" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
      <div><span className="label">Category</span>
        <div className="flex flex-wrap gap-2">{cats.map((c) => (
          <button key={c} onClick={() => setCategory(c)} className={`px-4 py-2 rounded-full font-bold ${category === c ? 'bg-sky text-ink' : 'bg-white/5'}`}>{c}</button>
        ))}</div>
      </div>
      <div><span className="label">Account</span>
        <select className="input" value={accountId || accounts[0]?._id || ''} onChange={(e) => setAccountId(e.target.value)}>
          {accounts.map((a) => <option key={a._id} value={a._id}>{a.name} · ₹{a.balance}</option>)}
        </select>
      </div>
      <div><span className="label">Note</span><input className="input" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Dinner with friends" /></div>
      <button className="btn-primary w-full" onClick={save}>Save {type} ✓</button>
    </div>
  );
}
