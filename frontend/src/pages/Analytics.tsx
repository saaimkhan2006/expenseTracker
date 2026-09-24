import { useState } from 'react';
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

export function Analytics() {
  const [timeframe, setTimeframe] = useState<'month' | 'quarter' | 'year'>('month');

  // Chart data for Cash Flow Trends
  const trendData = [
    { day: 'Oct 1', income: 45000, expense: 1200 },
    { day: 'Oct 5', income: 0, expense: 4500 },
    { day: 'Oct 10', income: 0, expense: 2100 },
    { day: 'Oct 15', income: 15000, expense: 1290 },
    { day: 'Oct 20', income: 0, expense: 3800 },
    { day: 'Oct 24', income: 0, expense: 1850 },
    { day: 'Oct 28', income: 0, expense: 5400 },
  ];

  // Category breakdown pie data
  const categoryData = [
    { name: 'Food & Dining', value: 6850, color: '#c3f400' },
    { name: 'Operations', value: 4200, color: '#adc6ff' },
    { name: 'Utilities', value: 3500, color: '#ffb4ab' },
    { name: 'Transport', value: 2400, color: '#ffdad7' },
    { name: 'Subscriptions', value: 1770, color: '#abd600' },
    { name: 'Shopping', value: 1430, color: '#8e9379' },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header & Filter Controls */}
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-space-lg pb-space-sm border-b border-surface-variant/40">
        <div className="space-y-space-xs max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-primary-container/10 text-primary-fixed font-label-xs text-label-xs uppercase tracking-widest font-semibold">
              Terminal Analytics
            </span>
            <span className="font-label-xs text-label-xs text-outline">LIVE TELEMETRY</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg lg:font-display-lg lg:text-display-lg text-on-surface tracking-tight font-semibold">
            Financial Analytics & Capital Velocity
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant">
            Audited burn patterns, multi-period category breakdown, and net surplus forecasting.
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
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Monthly Outflow</span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              ₹20,150
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-primary-fixed font-medium">
            ↓ 8.4% vs previous cycle
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Income Retention</span>
            <div className="font-display-lg text-display-lg text-primary-fixed font-semibold tracking-tight">
              55.2%
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            ₹24,850 liquid surplus
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Daily Burn Rate</span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              ₹671<span className="text-body-sm font-normal text-outline">/day</span>
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-primary-fixed">
            Well under ₹750/day cap
          </div>
        </div>

        <div className="p-space-lg bg-surface-container rounded-xl flex flex-col justify-between border border-surface-variant/30">
          <div>
            <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline block mb-1">Projected Runway</span>
            <div className="font-display-lg text-display-lg text-on-surface font-semibold tracking-tight">
              14.2 <span className="text-body-sm font-normal text-outline">Mo</span>
            </div>
          </div>
          <div className="pt-space-md font-label-xs text-label-xs text-outline">
            Safe threshold met
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
                <XAxis dataKey="day" stroke="#8e9379" fontSize={12} tickLine={false} />
                <YAxis stroke="#8e9379" fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v / 1000}k`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1d2023', borderColor: '#323538', borderRadius: '8px', color: '#e1e2e6' }}
                  formatter={(val: number) => `₹${val.toLocaleString('en-IN')}`}
                />
                <Area type="monotone" dataKey="income" stroke="#c3f400" fillOpacity={1} fill="url(#incomeGrad)" strokeWidth={2} />
                <Area type="monotone" dataKey="expense" stroke="#ffb4ab" fillOpacity={1} fill="url(#expenseGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
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
            </div>
          </div>

          <div className="space-y-space-xs pt-space-xs">
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
