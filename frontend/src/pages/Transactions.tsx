import { useState } from 'react';
import { useFinance } from '../stores/finance';
import { inr } from '../utils/finance';

export function Transactions() {
  const { transactions } = useFinance();
  const [q, setQ] = useState('');
  const [type, setType] = useState('');
  const list = transactions.filter((t) =>
    (!type || t.type === type) &&
    (!q || `${t.category} ${t.description}`.toLowerCase().includes(q.toLowerCase()))
  );
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-extrabold">Activity</h1>
      <input className="input" placeholder="Search food, uber, salary..." value={q} onChange={(e) => setQ(e.target.value)} />
      <div className="flex gap-2">
        {['', 'expense', 'income'].map((t) => (
          <button key={t} onClick={() => setType(t)} className={`px-4 py-2 rounded-full font-bold ${type === t ? 'bg-accent text-ink' : 'bg-white/5'}`}>{t || 'all'}</button>
        ))}
      </div>
      <div className="card !p-2">
        {list.map((t) => (
          <div key={t.clientId} className="flex justify-between px-3 py-3 border-b border-white/5 last:border-0">
            <div><p className="font-bold text-lg">{t.category}</p><p className="text-white/50 text-sm">{t.description}</p></div>
            <p className={`font-extrabold text-lg ${t.type === 'income' ? 'text-accent' : 'text-coral'}`}>{t.type === 'income' ? '+' : '−'}{inr(t.amount)}</p>
          </div>
        ))}
        {!list.length && <p className="p-4 text-white/50">Nothing found.</p>}
      </div>
    </div>
  );
}
