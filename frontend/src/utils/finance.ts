export const inr = (n: number) =>
  '₹' + Number(n || 0).toLocaleString('en-IN', { maximumFractionDigits: 0 });

export function uid() {
  return (crypto as any).randomUUID ? (crypto as any).randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function deviceId() {
  let id: string | null = null;
  try { id = localStorage.getItem('sb_device'); } catch { id = null; }
  if (!id) { const fresh: string = uid(); try { localStorage.setItem('sb_device', fresh); } catch { /* ignore */ } return fresh; }
  return id;
}

// Centralized client-side summary (mirrors backend utils/finance.js)
export function summarize(txs: { type: string; amount: number }[]) {
  let income = 0, expenses = 0;
  for (const t of txs) {
    if (t.type === 'income') income += t.amount;
    else if (t.type === 'expense') expenses += t.amount;
  }
  const savings = income - expenses;
  return { income, expenses, savings, savingsRate: income > 0 ? (savings / income) * 100 : 0 };
}
