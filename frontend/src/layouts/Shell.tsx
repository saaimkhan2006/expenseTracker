import { NavLink, Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../stores/auth';
import { useFinance } from '../stores/finance';

export default function Shell() {
  const { user, token, logout } = useAuth();
  const { online, syncing, load, setOnline, sync } = useFinance();
  const nav = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const on = () => { setOnline(true); sync(); };
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    if (token) load();
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, [token]);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (!token) {
    return <Navigate to="/welcome" replace />;
  }

  const overviewLinks = [
    { to: '/', label: 'Home', icon: 'space_dashboard' },
    { to: '/transactions', label: 'Transactions', icon: 'receipt_long' },
    { to: '/calendar', label: 'Calendar', icon: 'calendar_today' },
  ];

  const moneyLinks = [
    { to: '/budget', label: 'Budget', icon: 'account_balance_wallet' },
    { to: '/analytics', label: 'Analytics', icon: 'monitoring' },
    { to: '/money-owed', label: 'Money Owed', icon: 'request_quote' },
    { to: '/accounts', label: 'Accounts', icon: 'account_balance' },
  ];

  const planLinks = [
    { to: '/goals', label: 'Goals', icon: 'flag' },
    { to: '/subscriptions', label: 'Subscriptions', icon: 'repeat' },
    { to: '/transfer', label: 'Transfer Money', icon: 'swap_horiz' },
  ];

  const userName = user?.name || user?.email?.split('@')[0] || 'User';
  const userRole = 'Pro Portfolio';

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    nav(searchQuery.trim() ? `/transactions?q=${encodeURIComponent(searchQuery.trim())}` : '/transactions');
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md selection:bg-primary-container selection:text-on-primary-container">
      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-[260px] bg-surface border-r border-surface-variant flex flex-col justify-between z-50 select-none hidden lg:flex">
        <div className="flex flex-col flex-1 min-h-0">
          {/* Header Branding */}
          <div className="h-16 px-space-md flex items-center justify-between border-b border-surface-variant/40">
            <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => nav('/')}>
              <div className="w-7 h-7 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
                <div className="w-3 h-3 bg-primary-container rotate-45 rounded-[1px]"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md tracking-widest uppercase text-on-surface font-semibold">Smart Budget</span>
                <span className="font-label-xs text-label-xs tracking-wider text-outline uppercase">Terminal v2.4</span>
              </div>
            </div>
            <div className={`w-2 h-2 rounded-full ${online ? 'bg-primary-container animate-pulse' : 'bg-error'}`}></div>
          </div>

          {/* Navigation Groups */}
          <div className="flex-1 overflow-y-auto px-space-sm py-space-md space-y-space-md">
            {/* Overview */}
            <div className="space-y-space-xs">
              <div className="px-space-sm py-space-xs font-label-xs text-label-xs tracking-wider uppercase text-outline">Overview</div>
              <nav className="space-y-0.5">
                {overviewLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      `flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all text-body-sm font-body-sm ${
                        isActive
                          ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Money */}
            <div className="space-y-space-xs">
              <div className="px-space-sm py-space-xs font-label-xs text-label-xs tracking-wider uppercase text-outline">Money</div>
              <nav className="space-y-0.5">
                {moneyLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all text-body-sm font-body-sm ${
                        isActive
                          ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Plan */}
            <div className="space-y-space-xs">
              <div className="px-space-sm py-space-xs font-label-xs text-label-xs tracking-wider uppercase text-outline">Plan</div>
              <nav className="space-y-0.5">
                {planLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all text-body-sm font-body-sm ${
                        isActive
                          ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-medium'
                          : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Footer Settings & Sync */}
        <div className="border-t border-surface-variant p-space-sm space-y-space-xs bg-surface-dim">
          <nav className="space-y-0.5">
            <NavLink
              to="/more"
              className={({ isActive }) =>
                `flex items-center gap-space-sm px-space-sm py-2 rounded-lg transition-all text-body-sm font-body-sm ${
                  isActive
                    ? 'bg-surface-container-high text-primary-fixed border-l-2 border-primary-container font-medium'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-[18px]">settings</span>
              <span>Settings</span>
            </NavLink>
          </nav>

          <div className="flex items-center justify-between px-space-sm py-1.5 rounded-lg bg-surface-container-lowest/60 border border-surface-variant/40">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${online ? 'bg-primary-fixed-dim' : 'bg-error'}`}></span>
                <span className={`relative inline-flex rounded-full h-2 w-2 ${online ? 'bg-primary-container' : 'bg-error'}`}></span>
              </span>
              <span className="font-label-xs text-label-xs text-on-surface-variant">
                {!online ? 'Offline mode' : syncing ? 'Syncing...' : 'Cloud synced'}
              </span>
            </div>
            <span className="font-label-xs text-label-xs text-outline">Live</span>
          </div>

          <div className="flex items-center justify-between pt-1 px-space-sm">
            <div className="flex items-center gap-space-sm">
              <div className="w-8 h-8 rounded-full bg-primary-container flex items-center justify-center">
                <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
              </div>
              <div className="flex flex-col">
                <span className="font-body-sm text-body-sm font-medium text-on-surface leading-tight">{userName}</span>
                <span className="font-label-xs text-label-xs text-outline truncate max-w-[110px]">{userRole}</span>
              </div>
            </div>
            <button onClick={() => { logout(); nav('/welcome'); }} className="text-outline hover:text-on-surface transition-colors p-1" title="Sign out">
              <span className="material-symbols-outlined text-[18px]">logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Desktop Header */}
      <header className="fixed top-0 left-0 lg:left-[260px] right-0 h-16 bg-surface/80 backdrop-blur-xl border-b border-surface-variant/40 z-40 px-space-md lg:px-space-xl flex items-center justify-between">
        <div className="flex items-center gap-space-md">
          {/* Mobile Menu Trigger */}
          <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="lg:hidden text-on-surface p-1">
            <span className="material-symbols-outlined text-[24px]">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>

          {/* Search Bar */}
          <form
            onSubmit={submitSearch}
            className="flex items-center gap-space-xs px-space-sm py-1 rounded bg-surface-container-lowest border border-surface-variant"
          >
            <span className="material-symbols-outlined text-outline text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search transactions, accounts, rules..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-on-surface placeholder:text-outline font-body-sm text-body-sm focus:outline-none w-44 md:w-64"
            />
            <span className="hidden md:inline-block font-label-xs text-label-xs text-outline border border-surface-variant px-1 rounded">⌘K</span>
          </form>
        </div>

        <div className="flex items-center gap-space-sm md:gap-space-md">
          <div className="hidden sm:flex items-center gap-space-xs font-label-xs text-label-xs text-on-surface-variant border border-surface-variant px-space-sm py-1 rounded bg-surface-container">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span>
            <span>PRIMARY LEDGER • INR</span>
          </div>

          <button onClick={() => nav('/add')} className="px-space-sm md:px-space-md py-1.5 rounded bg-primary-container text-on-primary font-label-xs text-label-xs uppercase tracking-wider font-semibold hover:bg-primary-fixed-dim transition-all flex items-center gap-1 shadow-sm">
            <span className="material-symbols-outlined text-[16px]">add</span>
            <span className="hidden sm:inline">Add Entry</span>
          </button>

          <button className="text-outline hover:text-on-surface transition-colors relative p-1">
            <span className="material-symbols-outlined text-[20px]">notifications</span>
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary-container"></span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden flex" onClick={() => setMobileMenuOpen(false)}>
          <div className="w-[280px] bg-surface h-full p-space-md flex flex-col justify-between overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="space-y-space-md">
              <div className="flex items-center justify-between pb-space-sm border-b border-surface-variant">
                <div className="flex items-center gap-space-sm">
                  <div className="w-7 h-7 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
                    <div className="w-3 h-3 bg-primary-container rotate-45 rounded-[1px]"></div>
                  </div>
                  <span className="font-label-md text-label-md uppercase text-on-surface font-semibold">Smart Budget</span>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-outline">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              <div className="space-y-space-xs">
                <div className="font-label-xs text-label-xs uppercase text-outline px-2">Overview</div>
                {[...overviewLinks, ...moneyLinks, ...planLinks].map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center gap-space-sm px-space-sm py-2.5 rounded-lg text-body-sm ${
                        isActive ? 'bg-surface-container-high text-primary-fixed font-medium' : 'text-on-surface-variant'
                      }`
                    }
                  >
                    <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>

            <div className="pt-space-md border-t border-surface-variant">
              <button onClick={() => { logout(); nav('/welcome'); }} className="flex items-center gap-space-sm text-error px-2 py-2">
                <span className="material-symbols-outlined">logout</span>
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content Viewport */}
      <main className="lg:pl-[260px] pt-16 min-h-screen pb-24 lg:pb-12">
        <div className="w-full p-space-md lg:p-space-xl">
          {!online && (
            <div className="mb-space-md rounded-lg bg-error-container/40 border border-error-container p-space-md text-on-error-container font-label-xs text-label-xs flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">wifi_off</span>
              <span>Working offline. Transactions will sync automatically when connection restores.</span>
            </div>
          )}
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Bar Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-surface/90 backdrop-blur-lg border-t border-surface-variant flex items-center justify-around z-40 px-space-xs">
        <NavLink to="/" end className={({ isActive }) => `flex flex-col items-center gap-0.5 text-label-xs ${isActive ? 'text-primary-fixed font-semibold' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">space_dashboard</span>
          <span>Home</span>
        </NavLink>
        <NavLink to="/transactions" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-label-xs ${isActive ? 'text-primary-fixed font-semibold' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">receipt_long</span>
          <span>Activity</span>
        </NavLink>
        <NavLink to="/add" className="w-12 h-12 rounded-full bg-primary-container text-on-primary flex items-center justify-center shadow-lg -mt-6">
          <span className="material-symbols-outlined text-[28px]">add</span>
        </NavLink>
        <NavLink to="/budget" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-label-xs ${isActive ? 'text-primary-fixed font-semibold' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
          <span>Budget</span>
        </NavLink>
        <NavLink to="/more" className={({ isActive }) => `flex flex-col items-center gap-0.5 text-label-xs ${isActive ? 'text-primary-fixed font-semibold' : 'text-on-surface-variant'}`}>
          <span className="material-symbols-outlined text-[22px]">settings</span>
          <span>More</span>
        </NavLink>
      </nav>
    </div>
  );
}
