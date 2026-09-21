import { useAuth } from '../stores/auth';
import { useFinance } from '../stores/finance';
import { Link } from 'react-router-dom';

export function More() {
  const { user, logout } = useAuth();
  const { categories } = useFinance();
  return (
    <div className="space-y-4">
      <h1 className="text-4xl font-extrabold">More</h1>
      <div className="card"><p className="text-xl font-bold">{user?.name}</p><p className="text-white/50">{user?.email}</p></div>
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Categories ({categories.length})</h2>
        <div className="flex flex-wrap gap-2">{categories.map((c: any) => <span key={c._id} className="bg-white/5 px-3 py-1 rounded-full">{c.icon} {c.name}</span>)}</div>
      </div>
      <Link to="/accounts" className="card block font-bold text-lg">🏦 Accounts →</Link>
      <div className="card opacity-70"><p className="font-bold">Coming in Phase 2–4</p><p className="text-white/50">Budgets · Lending · Subscriptions · Goals · Net worth · Notifications</p></div>
      <button className="btn-primary w-full !bg-coral" onClick={logout}>Log out</button>
    </div>
  );
}
