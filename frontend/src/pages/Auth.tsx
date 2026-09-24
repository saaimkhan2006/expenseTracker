import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../stores/auth';

export function AuthPage({ mode = 'login' }: { mode?: 'login' | 'register' }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [email, setEmail] = useState('demo@smartbudget.io');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('Alex Mercer');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();
  const nav = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await login(email, password);
      } else {
        await register(name, email, password);
      }
      nav('/');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoAccess = async () => {
    setLoading(true);
    try {
      await login('demo@smartbudget.io', 'demo12345').catch(() => {
        // Fallback store hydration if offline
        useAuth.setState({
          token: 'demo_token_xyz',
          user: { id: 'u1', email: 'demo@smartbudget.io', name: 'Alex Mercer' },
        });
        localStorage.setItem('sb_token', 'demo_token_xyz');
      });
      nav('/');
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
            onClick={() => setIsLogin(true)}
            className="px-space-md py-space-xs font-label-md text-label-md text-on-surface hover:text-primary-fixed transition-colors"
          >
            Sign In
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className="px-space-md py-space-xs rounded bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold transition-transform active:scale-95 shadow-md"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="w-full max-w-5xl flex flex-col items-center text-center my-auto py-space-lg">
        <div className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high mb-space-lg shadow-sm border border-surface-variant/30">
          <span className="w-1.5 h-1.5 rounded-full bg-primary-container animate-pulse"></span>
          <span className="font-label-xs text-label-xs tracking-widest text-primary-fixed uppercase font-semibold">
            Financial Intelligence • Refined
          </span>
        </div>

        <h1 className="font-display-xl text-display-xl tracking-tight max-w-4xl text-on-surface font-semibold mb-space-md">
          The terminal for your <span className="text-primary-container underline decoration-primary-container/40 underline-offset-8">personal capital.</span>
        </h1>

        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mb-space-xl leading-relaxed">
          A calm, hyper-precise personal finance engine built without noise or bloated ads. Track balances, predict runway, and automate cashflow with surgical accuracy.
        </p>

        {/* Live Telemetry Terminal Card & Form Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl w-full text-left">
          {/* Left Telemetry Card */}
          <div className="lg:col-span-7 bg-surface-container-low rounded-xl p-space-lg shadow-xl border border-surface-variant/30 flex flex-col justify-between">
            <div className="flex items-center justify-between pb-space-md mb-space-md border-b border-surface-variant/40">
              <div className="flex items-center gap-space-sm">
                <div className="w-3 h-3 rounded-full bg-error"></div>
                <div className="w-3 h-3 rounded-full bg-surface-bright"></div>
                <div className="w-3 h-3 rounded-full bg-primary-container"></div>
                <span className="font-label-xs text-label-xs text-on-surface-variant ml-space-xs uppercase tracking-wider">Telemetry // Live Ledger</span>
              </div>
              <span className="font-label-xs text-label-xs text-primary-fixed font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-primary-container"></span> Synchronized
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md mb-space-lg">
              <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between border border-surface-variant/30">
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">Available Balance</span>
                <div className="my-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">₹24,850.00</span>
                </div>
                <span className="font-label-xs text-label-xs text-primary-fixed">+8.4% this month</span>
              </div>

              <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between border border-surface-variant/30">
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">Savings Rate</span>
                <div className="my-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">55.2%</span>
                </div>
                <div className="w-full bg-surface-container-high h-1.5 rounded-full overflow-hidden mt-1">
                  <div className="bg-primary-container h-full" style={{ width: '55.2%' }}></div>
                </div>
              </div>

              <div className="bg-surface-container p-space-md rounded-lg flex flex-col justify-between border border-surface-variant/30">
                <span className="font-label-xs text-label-xs text-on-surface-variant uppercase tracking-wider">Projected Runway</span>
                <div className="my-space-xs">
                  <span className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">14.2 Mo</span>
                </div>
                <span className="font-label-xs text-label-xs text-on-surface-variant">Safe horizon</span>
              </div>
            </div>

            <div className="bg-surface-container-lowest p-space-md rounded-lg border border-surface-variant/30 space-y-2">
              <div className="flex items-center justify-between text-on-surface-variant font-label-xs text-label-xs">
                <span>Recent Dispatches</span>
                <span>Real-Time Ingestion</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-medium text-on-surface">AWS Cloud Infrastructure</span>
                <span className="text-error font-mono font-medium">-₹4,200.00</span>
              </div>
              <div className="flex items-center justify-between font-body-sm text-body-sm">
                <span className="font-medium text-on-surface">Stripe Client Payout</span>
                <span className="text-primary-fixed font-mono font-medium">+₹18,500.00</span>
              </div>
            </div>
          </div>

          {/* Right Auth Form */}
          <div className="lg:col-span-5 bg-surface-container rounded-xl p-space-lg border border-surface-variant/40 shadow-xl flex flex-col justify-between space-y-space-md">
            <div>
              <div className="border-b border-surface-variant/40 pb-space-sm mb-space-md">
                <span className="font-label-xs text-label-xs uppercase text-outline">{isLogin ? 'ACCOUNT ACCESS' : 'CREATE ACCOUNT'}</span>
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
                      placeholder="Alex Mercer"
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
                    placeholder="alex@smartbudget.io"
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
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-lg bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-md active:scale-[0.99]"
                >
                  {loading ? 'Authenticating...' : isLogin ? 'Sign In to Terminal' : 'Create Account'}
                </button>
              </form>
            </div>

            <div className="space-y-space-sm border-t border-surface-variant/40 pt-space-md text-center">
              <button
                type="button"
                onClick={handleDemoAccess}
                className="w-full py-2 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-xs text-label-xs uppercase tracking-wider transition-all border border-surface-variant/30"
              >
                ⚡ Explore Live Demo Sandbox
              </button>

              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="font-label-xs text-label-xs text-outline hover:text-on-surface transition-colors"
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
