import { Link } from 'react-router-dom';
import { useFinance } from '../stores/finance';
import { inr, summarize } from '../utils/finance';

export function Dashboard() {
  const { transactions, accounts } = useFinance();
  const now = new Date();
  const monthly = transactions.filter((t) => {
    const d = new Date(t.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const s = summarize(monthly);
  const balance = accounts.reduce((sum, a) => sum + (a.balance || 0), 0);

  return (
    <div className="space-y-5">
      <h1 className="text-4xl md:text-5xl font-extrabold">Your money,<br />at a glance.</h1>

      <div className="card bg-gradient-to-br from-panel to-[#0e2a1c]">
        <p className="text-white/50 uppercase tracking-widest text-sm">Current Balance</p>
        <p className="big-num text-accent">{inr(balance)}</p>
        <div className="grid grid-cols-3 gap-3 mt-5">
          <div><p className="text-white/50 text-sm">Income</p><p className="text-2xl font-extrabold text-accent">+{inr(s.income)}</p></div>
          <div><p className="text-white/50 text-sm">Spent</p><p className="text-2xl font-extrabold text-coral">-{inr(s.expenses)}</p></div>
          <div><p className="text-white/50 text-sm">Saved · {s.savingsRate.toFixed(0)}%</p><p className="text-2xl font-extrabold text-sky">{inr(s.savings)}</p></div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[['Expense', '−', '/add?type=expense', 'text-coral'], ['Income', '+', '/add?type=income', 'text-accent']].map(([l, sym, to, cls]) => (
          <Link key={l as string} to={to as string} className="card text-center !p-4">
            <span className={`text-3xl font-black ${cls}`}>{sym}</span>
            <p className="font-bold mt-1">{l}</p>
          </Link>
        ))}
        <div className="card text-center !p-4 opacity-60"><p className="font-bold mt-4 text-white/50">Lent · soon</p></div>
        <div className="card text-center !p-4 opacity-60"><p className="font-bold mt-4 text-white/50">Borrow · soon</p></div>
        <div className="card text-center !p-4 opacity-60"><p className="font-bold mt-4 text-white/50">Transfer · soon</p></div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-2xl font-extrabold">Recent transactions</h2>
          <Link to="/transactions" className="text-accent font-bold">See all →</Link>
        </div>
        {transactions.slice(0, 8).map((t) => (
          <div key={t.clientId} className="flex justify-between items-center py-3 border-b border-white/5 last:border-0">
            <div>
              <p className="font-bold text-lg">{t.category} {t.syncStatus === 'pending' && <span className="text-xs text-borrow">• pending</span>}</p>
              <p className="text-white/50">{t.description || new Date(t.date).toLocaleDateString('en-IN')}</p>
            </div>
            <p className={`text-xl font-extrabold ${t.type === 'income' ? 'text-accent' : 'text-coral'}`}>
              {t.type === 'income' ? '+' : '−'}{inr(t.amount)}
            </p>
          </div>
        ))}
        {!transactions.length && <p className="text-white/50 text-lg">No transactions yet. Tap + to add your first one.</p>}
      </div>
    </div>
  );
}
