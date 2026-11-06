import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function AuthPage({ mode = 'login' }: { mode?: 'login' | 'register' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    if (!isLogin && !name.trim()) {
      setError('Please provide your full name.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email.trim(), password);
      } else {
        await register(name.trim(), email.trim(), password);
      }
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-surface-container-lowest text-on-surface font-body-md antialiased flex flex-col items-center justify-between p-space-md lg:p-space-xl selection:bg-primary-container selection:text-on-primary-container">
      {/* Landing Top Header */}
      <header className="w-full max-w-6xl flex items-center justify-between py-space-md mb-space-lg">
        <div className="flex items-center gap-space-sm cursor-pointer" onClick={() => nav('/')}>
          <div className="w-8 h-8 rounded-lg bg-surface-container-high border border-outline-variant flex items-center justify-center">
            <div className="w-3.5 h-3.5 bg-primary-container rotate-45 rounded-[1px]"></div>
          </div>
          <span className="font-headline-md text-headline-md tracking-tight text-on-surface font-semibold">Smart Budget</span>
        </div>

        <div className="flex items-center gap-space-sm">
          <button
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`px-space-md py-space-xs font-label-md text-label-md transition-colors ${
              isLogin ? 'text-primary-fixed font-semibold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setIsLogin(false); setError(''); }}
            className="px-space-md py-space-xs rounded bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold transition-transform active:scale-95 shadow-md"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col items-center text-center my-auto py-space-md">
        <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high mb-space-md shadow-sm border border-surface-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-xs text-label-xs tracking-widest text-primary-fixed uppercase font-semibold">
            Enterprise Capital Ledger • Production Grade
          </span>
        </div>

        <h1 className="font-display-xl text-display-xl tracking-tight max-w-4xl text-on-surface font-semibold mb-space-md">
          The terminal for your <span className="text-primary-container underline decoration-primary-container/40 underline-offset-8">personal capital.</span>
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-xl leading-relaxed">
          A calm, hyper-precise personal finance engine built without noise or data harvesting. Track balances, predict runway, and automate cashflow with surgical accuracy.
        </p>

        {/* Production Pillar Card & Auth Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl w-full text-left items-stretch">
          {/* Left: Production Architecture Pillar Card */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg shadow-xl border border-surface-variant/30 flex flex-col justify-between space-y-space-md">
            <div>
              <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant/40">
                <div className="flex items-center gap-space-sm">
                  <div className="w-3 h-3 rounded-full bg-error"></div>
                  <div className="w-3 h-3 rounded-full bg-surface-bright"></div>
                  <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                  <span className="font-label-xs text-label-xs text-on-surface-variant ml-space-xs uppercase tracking-wider font-semibold">
                    Core Protocol Specifications
                  </span>
                </div>
                <span className="font-label-xs text-label-xs text-primary-fixed font-mono font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> SECURE RAILS
                </span>
              </div>

              <div className="space-y-space-md">
                <div className="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container/60 border border-surface-variant/30">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[20px]">offline_pin</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">Local-First Resilience</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Encrypted local storage via IndexedDB guarantees instantaneous writes and full functionality offline, automatically reconciling when connectivity returns.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container/60 border border-surface-variant/30">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[20px]">shield_lock</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">Zero Data Brokering</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Your ledger is strictly segregated and protected with industry-standard cryptographic primitives. No advertising scripts, third-party analytics, or surveillance telemetry.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-space-md p-space-md rounded-lg bg-surface-container/60 border border-surface-variant/30">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/15 flex items-center justify-center text-primary-fixed shrink-0">
                    <span className="material-symbols-outlined text-[20px]">speed</span>
                  </div>
                  <div>
                    <h3 className="font-body-md text-body-md font-semibold text-on-surface">High-Precision Cashflow Pacing</h3>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Audited multi-rail envelopes, bilateral peer ledger settlements, and live capital runway forecasting calculated directly from actual cleared entries.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-outline font-label-xs text-label-xs pt-space-xs border-t border-surface-variant/30">
              <span>NODE: #704-IND</span>
              <span>TLS 1.3 • AES SECURE</span>
              <span>RESTful JSON API</span>
            </div>
          </div>

          {/* Right: Auth Form */}
          <div className="lg:col-span-5 bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 shadow-xl flex flex-col justify-between space-y-space-md">
            <div>
              <div className="border-b border-surface-variant/40 pb-space-sm mb-space-md">
                <span className="font-label-xs text-label-xs uppercase text-outline">
                  {isLogin ? 'ACCOUNT ACCESS' : 'CREATE ACCOUNT'}
                </span>
                <h2 className="font-headline-md text-headline-md font-semibold text-on-surface">
                  {isLogin ? 'Sign In to Terminal' : 'Initialize Terminal Access'}
                </h2>
              </div>

              {error && (
                <div className="mb-space-md p-space-sm rounded bg-error-container/30 border border-error-container text-error text-label-xs font-label-xs">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-space-md">
                {!isLogin && (
                  <div className="space-y-1">
                    <label className="font-label-xs text-label-xs uppercase text-outline">Full Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Alex Mercer"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                      required
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Email Address</label>
                  <input
                    type="email"
                    placeholder="name@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-label-xs text-label-xs uppercase text-outline">Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-md active:scale-[0.99] mt-2"
                >
                  {loading ? 'Authenticating...' : isLogin ? 'Sign In to Terminal' : 'Create Account'}
                </button>
              </form>
            </div>

            <div className="border-t border-surface-variant/40 pt-space-md text-center">
              <button
                type="button"
                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                className="font-label-xs text-label-xs text-outline hover:text-primary-fixed transition-colors"
              >
                {isLogin ? "Don't have an account? Register" : 'Already registered? Sign In'}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl text-center font-label-xs text-label-xs text-outline py-space-md border-t border-surface-variant/30">
        Smart Budget Terminal v2.4 • Non-surveillance personal capital engine • Encrypted local cache
      </footer>
    </div>
  );
}
