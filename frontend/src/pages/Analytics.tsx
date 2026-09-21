import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useFinance } from '../stores/finance';
import { inr, summarize } from '../utils/finance';

const COLORS = ['#3dff8f', '#38bdf8', '#fb7185', '#c084fc', '#fb923c', '#facc15', '#34d399'];

export function Analytics() {
  const { transactions } = useFinance();
  const perCat = useMemo(() => {
    const m: Record<string, number> = {};
    for (const t of transactions.filter((t) => t.type === 'expense')) m[t.category] = (m[t.category] || 0) + t.amount;
    return Object.entries(m).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value).slice(0, 7);
  }, [transactions]);

  const last6 = useMemo(() => {
    const now = new Date();
    return Array.from({ length: 6 }).map((_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const txs = transactions.filter((t) => {
        const x = new Date(t.date);
        return x.getMonth() === d.getMonth() && x.getFullYear() === d.getFullYear();
      });
      const s = summarize(txs);
      return { name: d.toLocaleString('en-IN', { month: 'short' }), spent: s.expenses, income: s.income };
    });
  }, [transactions]);

  return (
    <div className="space-y-5">
      <h1 className="text-4xl font-extrabold">Insights</h1>
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Income vs spending (6 mo)</h2>
        <div className="h-64"><ResponsiveContainer><BarChart data={last6}><XAxis dataKey="name" stroke="#fff" opacity={0.5} /><YAxis hide /><Tooltip formatter={(v: any) => inr(Number(v))} /><Bar dataKey="income" fill="#3dff8f" radius={[8, 8, 0, 0]} /><Bar dataKey="spent" fill="#fb7185" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer></div>
      </div>
      <div className="card">
        <h2 className="text-xl font-bold mb-2">Where money goes</h2>
        <div className="h-64"><ResponsiveContainer><PieChart><Pie data={perCat} dataKey="value" nameKey="name" innerRadius={60} outerRadius={100} paddingAngle={3}>{perCat.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v: any) => inr(Number(v))} /></PieChart></ResponsiveContainer></div>
        {perCat.map((c, i) => <p key={c.name} className="py-1"><span style={{ color: COLORS[i % COLORS.length] }}>●</span> {c.name} — <b>{inr(c.value)}</b></p>)}
      </div>
    </div>
  );
}
