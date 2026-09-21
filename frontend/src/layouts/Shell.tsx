import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useAuth } from '../stores/auth';
import { useFinance } from '../stores/finance';

const links = [
  ['/', 'Home', '🏠'], ['/transactions', 'Activity', '🧾'], ['/calendar', 'Calendar', '📅'],
  ['/analytics', 'Insights', '📊'], ['/accounts', 'Accounts', '🏦'], ['/more', 'More', '⚙️'],
];

export default function Shell() {
  const { token } = useAuth();
  const { online, syncing, load, setOnline, sync } = useFinance();
  const nav = useNavigate();

  useEffect(() => {
    const on = () => { setOnline(true); sync(); };
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    if (token) load();
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, [token]);

  if (!token) { nav('/login'); return null; }

  return (
    <div className="min-h-screen md:flex">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex flex-col w-64 p-6 gap-2 border-r border-white/5">
        <h1 className="text-2xl font-extrabold mb-6">💸 Smart Budget</h1>
        {links.map(([to, label, icon]) => (
          <NavLink key={to} to={to} className={({ isActive }) =>
            `px-4 py-3 rounded-2xl text-lg ${isActive ? 'bg-accent text-ink font-bold' : 'text-white/70 hover:bg-white/5'}`}>
            {icon} {label}
          </NavLink>
        ))}
        <div className="mt-auto text-sm text-white/40">
          {!online ? '📴 Offline — will sync' : syncing ? '🔄 Syncing...' : '✓ Synced'}
        </div>
      </aside>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 pt-6 pb-32 md:pb-10">
        {!online && (
          <div className="mb-4 rounded-2xl bg-borrow/20 border border-borrow/40 px-4 py-3 text-borrow font-semibold">
            You're offline. Changes will sync automatically when you're back online.
          </div>
        )}
        <Outlet />
      </main>

      {/* Mobile bottom nav + FAB */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-ink/95 backdrop-blur border-t border-white/10 px-2 pb-[env(safe-area-inset-bottom)]">
        <div className="flex justify-around items-end py-2">
          {links.slice(0, 2).map(([to, label, icon]) => (
            <NavLink key={to} to={to} className="flex flex-col items-center text-xs text-white/70 px-3 py-1">
              <span className="text-2xl">{icon}</span>{label}
            </NavLink>
          ))}
          <NavLink to="/add" className="bg-accent text-ink text-3xl font-black w-16 h-16 -mt-8 rounded-full flex items-center justify-center shadow-lg shadow-accent/30">+</NavLink>
          {links.slice(2, 4).map(([to, label, icon]) => (
            <NavLink key={to} to={to} className="flex flex-col items-center text-xs text-white/70 px-3 py-1">
              <span className="text-2xl">{icon}</span>{label}
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  );
}
