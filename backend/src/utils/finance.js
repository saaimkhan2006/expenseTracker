// Centralized financial calculations. All balance/stats must go through here.
export function monthRange(year, month /* 1-12 */) {
  const start = new Date(year, month - 1, 1, 0, 0, 0, 0);
  const end = new Date(year, month, 0, 23, 59, 59, 999);
  return { start, end };
}

export function summarize(transactions) {
  let income = 0;
  let expenses = 0;
  for (const t of transactions) {
    if (t.type === 'income') income += t.amount;
    else if (t.type === 'expense') expenses += t.amount;
    // transfers/lending/borrowing excluded from income/expense stats (Phase 2 ready)
  }
  const savings = income - expenses;
  const savingsRate = income > 0 ? (savings / income) * 100 : 0;
  return { income, expenses, savings, savingsRate };
}

// Balance = opening + income - expenses +/- transfers - lending + borrowing + repayments
export function applyToBalance(balance, tx, sign = 1) {
  const a = tx.amount * sign;
  switch (tx.type) {
    case 'income':
      return balance + a;
    case 'expense':
      return balance - a;
    default:
      return balance; // transfers/lending handled explicitly in controllers
  }
}
