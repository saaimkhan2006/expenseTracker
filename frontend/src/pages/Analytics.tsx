import { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useFinance } from '../stores/finance';

const PALETTE = ['#c3f400', '#adc6ff', '#ffb4ab', '#abd600', '#38bdf8', '#f472b6', '#a78bfa', '#facc15', '#22d3ee', '#fb923c'];

export function Analytics() {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const { transactions, accounts } = useFinance();

  const now = new Date();

  // Filter transactions within selected window
  const filteredTxs = useMemo(() => {
    return transactions.filter((t) => {
      const d = new Date(t.date);
      if (isNaN(d.getTime())) return false;
      if (timeframe === 'month') {
        return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth();
      } else if (timeframe === 'quarter') {
        const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
        return d >= threeMonthsAgo && d <= now;
      } else {
        const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), 1);
        return d >= oneYearAgo && d <= now;
      }
    });
  }, [transactions, timeframe]);

  // Aggregate Trends Chart Data
  const trendData = useMemo(() => {
    if (!filteredTxs.length) return [];

    if (timeframe === 'month') {
      const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
      const map: Record<number, { income: number; expense: number }> = {};
      for (let i = 1; i <= daysInMonth; i++) map[i] = { income: 0, expense: 0 };
      for (const t of filteredTxs) {
        const d = new Date(t.date).getDate();
        if (map[d]) {
          if (t.type === 'income') map[d].income += t.amount;
          else if (t.type === 'expense') map[d].expense += t.amount;
        }
      }
      return Object.entries(map).map(([day, val]) => ({
        label: `Day ${day}`,
        income: val.income,
        expense: val.expense,
      }));
    } else if (timeframe === 'quarter') {
      // Group by weeks
      const weekMap: Record<string, { income: number; expense: number }> = {};
      const sorted = [...filteredTxs].sort((a, b) => +new Date(a.date) - +new Date(b.date));
      for (const t of sorted) {
        const d = new Date(t.date);
        const k = `${d.toLocaleString('en-IN', { month: 'short' })} W${Math.ceil(d.getDate() / 7)}`;
        weekMap[k] ||= { income: 0, expense: 0 };
        if (t.type === 'income') weekMap[k].income += t.amount;
        else if (t.type === 'expense') weekMap[k].expense += t.amount;
      }
      return Object.entries(weekMap).map(([label, val]) => ({ label, ...val }));
    } else {
      // Group by month
      const monthMap: Record<string, { income: number; expense: number }> = {};
      for (let m = 0; m < 12; m++) {
        const d = new Date(now.getFullYear(), now.getMonth() - 11 + m, 1);
        const k = d.toLocaleDateString('en-IN', { month: 'short' });
        monthMap[k] = { income: 0, expense: 0 };
      }
      for (const t of filteredTxs) {
        const d = new Date(t.date);
        const k = d.toLocaleDateString('en-IN', { month: 'short' });
        if (monthMap[k]) {
          if (t.type === 'income') monthMap[k].income += t.amount;
          else if (t.type === 'expense') monthMap[k].expense += t.amount;
        }
      }
      return Object.entries(monthMap).map(([label, val]) => ({ label, ...val }));
    }
  }, [filteredTxs, timeframe]);

  // Aggregate Category Distribution
  const categoryData = useMemo(() => {
    const map: Record<string, number> = {};
    for (const t of filteredTxs) {
      if (t.type === 'expense') {
        map[t.category] = (map[t.category] || 0) + t.amount;
      }
    }
    return Object.entries(map)
      .map(([name, value], i) => ({
        name,
        value,
        color: PALETTE[i % PALETTE.length],
      }))
      .sort((a, b) => b.value - a.value);
  }, [filteredTxs]);

  // Telemetry Metrics
  const totalInflow = filteredTxs.filter((t) => t.type === 'income').reduce((s, t) => s + t.amount, 0);
  const totalOutflow = filteredTxs.filter((t) => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const liquidAssets = accounts.filter((a) => a.balance > 0).reduce((s, a) => s + a.balance, 0);

  const netSurplus = totalInflow - totalOutflow;
  const retentionRate = totalInflow > 0 ? ((netSurplus / totalInflow) * 100).toFixed(1) : '0.0';

  const daysInScope = timeframe === 'month' ? Math.max(1, now.getDate()) : timeframe === 'quarter' ? 90 : 365;
  const dailyBurn = Math.round(totalOutflow / daysInScope);
  const monthlyBurn = dailyBurn * 30;
  const runwayMonths = monthlyBurn > 0 ? (liquidAssets / monthlyBurn).toFixed(1) : '∞';

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header & Filter Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-surface-variant/40">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-fixed font-label-xs text-label-xs uppercase tracking-widest font-semibold">
              Terminal Analytics
            </span>
            <span className="font-label-xs text-label-xs text-outline">AUDITED TELEMETRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg lg:font-display-lg lg:text-display-lg text-on-surface tracking-tight font-semibold">
            Financial Analytics & Capital Velocity
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Live audited burn patterns, multi-period category breakdown, and net surplus forecasting.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex items-center p-1 bg-surface-container rounded-lg border border-surface-variant/40">
          <button
            onClick={() => setTimeframe('month')}
            className={`px-3 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
              timeframe === 'month' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeframe('quarter')}
            className={`px-3 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
              timeframe === 'quarter' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
            }`}
          >
            3 Months
          </button>
          <button
            onClick={() => setTimeframe('year')}
            className={`px-3 py-1.5 rounded-md font-label-xs text-label-xs uppercase tracking-wider transition-all ${
              timeframe === 'year' ? 'bg-primary-container text-on-primary-fixed font-semibold' : 'text-on-surface-variant'
            }`}
          >
            1 Year
          </button>
        </div>
      </section>

      {/* Top Telemetry Metric Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md">
        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">
              {timeframe === 'month' ? 'Monthly Outflow' : 'Period Outflow'}
            </span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              ₹{totalOutflow.toLocaleString('en-IN')}
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            {filteredTxs.filter((t) => t.type === 'expense').length} expense transactions
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Income Retention</span>
            <div className={`font-display-lg text-display-lg font-semibold tracking-tight ${+retentionRate >= 0 ? 'text-primary-fixed' : 'text-error'}`}>
              {retentionRate}%
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            ₹{netSurplus.toLocaleString('en-IN')} net surplus
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Daily Burn Rate</span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              ₹{dailyBurn.toLocaleString('en-IN')}<span className="text-body-sm font-normal text-outline">/day</span>
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            Calculated over {daysInScope} days
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Projected Runway</span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              {runwayMonths} <span className="text-body-sm font-normal text-outline">Mo</span>
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            Based on ₹{liquidAssets.toLocaleString('en-IN')} liquid reserves
          </div>
        </div>
      </section>

      {/* Main Charts Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Cash Flow Trends Chart */}
        <div className="lg:col-span-8 rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 space-y-space-md">
          <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-sm">
            <div>
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">CASHFLOW HORIZON</span>
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Income vs Expenses Trajectory</h3>
            </div>
            <div className="flex items-center gap-space-md font-label-xs text-label-xs">
              <span className="flex items-center gap-1 text-primary-fixed">
                <span className="w-2 h-2 rounded-full bg-primary-container"></span> Income
              </span>
              <span className="flex items-center gap-1 text-error">
                <span className="w-2 h-2 rounded-full bg-error"></span> Expense
              </span>
            </div>
          </div>

          <div className="h-72 w-full pt-4">
            {trendData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={trendData}>
                  <defs>
                    <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#c3f400" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#c3f400" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffb4ab" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#ffb4ab" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="label" stroke="#8e9379" fontSize={11} tickLine={false} />
                  <YAxis stroke="#8e9379" fontSize={11} tickLine={false} tickFormatter={(v) => `₹${v >= 1000 ? `${v / 1000}k` : v}`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1d2023', borderColor: '#323538', borderRadius: '8px', color: '#e1e2e6' }}
                    formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                  />
                  <Area type="monotone" dataKey="income" stroke="#c3f400" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2} />
                  <Area type="monotone" dataKey="expense" stroke="#ffb4ab" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-outline font-body-sm">
                <span className="material-symbols-outlined text-[32px] mb-2">monitoring</span>
                <span>No transaction activity recorded for this timeframe.</span>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown Donut */}
        <div className="lg:col-span-4 rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 flex flex-col justify-between space-y-space-md">
          <div>
            <div className="border-b border-surface-variant/40 pb-space-sm mb-space-md">
              <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">ALLOCATION SHARES</span>
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Category Distribution</h3>
            </div>

            <div className="h-44 w-full relative flex items-center justify-center">
              {categoryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={categoryData} innerRadius={55} outerRadius={75} paddingAngle={4} dataKey="value">
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#1d2023', borderColor: '#323538', borderRadius: '8px', color: '#e1e2e6' }}
                      formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                    />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex flex-col items-center justify-center text-outline font-body-sm text-center">
                  <span>No categorized expense data yet.</span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-space-xs pt-space-xs max-h-48 overflow-y-auto">
            {categoryData.map((cat) => (
              <div key={cat.name} className="flex items-center justify-between font-label-xs text-label-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: cat.color }}></span>
                  <span className="text-on-surface-variant">{cat.name}</span>
                </div>
                <span className="text-on-surface font-semibold">₹{cat.value.toLocaleString('en-IN')}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
