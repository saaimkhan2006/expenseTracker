import { useMemo, useState } from 'react';
import { useFinance } from '../stores/finance';
import { inr } from '../utils/finance';

export function Calendar() {
  const { transactions } = useFinance();
  const now = new Date();
  const [ym, setYm] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [sel, setSel] = useState<string | null>(null);

  const days = useMemo(() => {
    const first = new Date(ym.y, ym.m, 1);
    const startPad = (first.getDay() + 6) % 7; // Mon-first
    const count = new Date(ym.y, ym.m + 1, 0).getDate();
    return { startPad, count };
  }, [ym]);

  const byDay = useMemo(() => {
    const m: Record<number, { income: number; expense: number; list: any[] }> = {};
    for (const t of transactions) {
      const d = new Date(t.date);
      if (d.getFullYear() === ym.y && d.getMonth() === ym.m) {
        const k = d.getDate();
        m[k] ||= { income: 0, expense: 0, list: [] };
        if (t.type === 'income') m[k].income += t.amount; else m[k].expense += t.amount;
        m[k].list.push(t);
      }
    }
    return m;
  }, [transactions, ym]);

  const selData = sel ? byDay[Number(sel.split('-')[2])] : null;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <button className="card !p-3" onClick={() => setYm({ y: ym.m === 0 ? ym.y - 1 : ym.y, m: ym.m === 0 ? 11 : ym.m - 1 })}>←</button>
        <h1 className="text-3xl font-extrabold">{new Date(ym.y, ym.m, 1).toLocaleString('en-IN', { month: 'long', year: 'numeric' })}</h1>
        <button className="card !p-3" onClick={() => setYm({ y: ym.m === 11 ? ym.y + 1 : ym.y, m: ym.m === 11 ? 0 : ym.m + 1 })}>→</button>
      </div>
      <div className="card">
        <div className="grid grid-cols-7 text-white/40 text-sm mb-2">{['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => <div key={i} className="text-center">{d}</div>)}</div>
        <div className="grid grid-cols-7 gap-1">
          {Array.from({ length: days.startPad }).map((_, i) => <div key={'p' + i} />)}
          {Array.from({ length: days.count }).map((_, i) => {
            const d = i + 1;
            const info = byDay[d];
            const key = `${ym.y}-${ym.m}-${d}`;
            return (
              <button key={key} onClick={() => setSel(key)}
                className={`aspect-square rounded-2xl text-lg font-bold ${sel === key ? 'bg-accent text-ink' : 'bg-white/5'}`}>
                {d}
                {info && <div className="flex justify-center gap-1">{info.expense > 0 && <span className="w-1.5 h-1.5 rounded-full bg-coral" />}{info.income > 0 && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}</div>}
              </button>
            );
          })}
        </div>
      </div>
      {selData && (
        <div className="card">
          <p className="text-white/50">Income <span className="text-accent font-bold">+{inr(selData.income)}</span> · Expenses <span className="text-coral font-bold">−{inr(selData.expense)}</span></p>
          {selData.list.map((t: any) => <p key={t.clientId} className="py-1 font-semibold">{t.category} · {inr(t.amount)}</p>)}
        </div>
      )}
    </div>
  );
}
