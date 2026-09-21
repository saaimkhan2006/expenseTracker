import { useState } from 'react';
import { useFinance } from '../stores/finance';
import { inr } from '../utils/finance';

export function Accounts() {
  const { accounts, createAccount } = useFinance();
  const [name, setName] = useState('');
  const [bal, setBal] = useState('');
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-extrabold">Accounts</h1>
      {accounts.map((a) => (
        <div key={a._id} className="card flex justify-between items-center">
          <div><p className="font-extrabold text-2xl">{a.icon || '🏦'} {a.name}</p><p className="text-white/50 capitalize">{a.type}</p></div>
          <p className="big-num !text-3xl">{inr(a.balance)}</p>
        </div>
      ))}
      <div className="card space-y-3">
        <h2 className="text-xl font-bold">New account</h2>
        <input className="input" placeholder="HDFC Bank" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="input" placeholder="Opening balance" inputMode="decimal" value={bal} onChange={(e) => setBal(e.target.value)} />
        <button className="btn-primary" onClick={() => { if (name) { createAccount(name, Number(bal) || 0); setName(''); setBal(''); } }}>Add account</button>
      </div>
    </div>
  );
}
