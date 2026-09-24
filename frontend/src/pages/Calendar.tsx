import { useState } from 'react';
import { useFinance } from '../stores/finance';

export function Calendar() {
  const { transactions } = useFinance();
  const [selectedDay, setSelectedDay] = useState<number | null>(24);
  const [currentMonth, setCurrentMonth] = useState('October 2024');

  // Days in month matrix (31 days for October)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  // Sample data map for month days
  const dayDataMap: Record<number, { expense: number; income: number; txs: string[] }> = {
    1: { expense: 1200, income: 0, txs: ['Grocery Store - ₹1,200'] },
    5: { expense: 4500, income: 0, txs: ['Tata Power Electricity - ₹3,500', 'Uber Transit - ₹1,000'] },
    10: { expense: 0, income: 45000, txs: ['Salary Direct Deposit - ₹45,000'] },
    15: { expense: 1290, income: 0, txs: ['Figma Software License - ₹1,290'] },
    18: { expense: 4200, income: 0, txs: ['AWS Cloud Servers - ₹4,200'] },
    22: { expense: 480, income: 0, txs: ['Blue Tokai Coffee - ₹480'] },
    24: { expense: 1850, income: 0, txs: ['Nature Basket - ₹1,850'] },
    28: { expense: 0, income: 15000, txs: ['Stripe Client Payout - ₹15,000'] },
  };

  const dayInfo = selectedDay ? dayDataMap[selectedDay] : null;

  return (
    <div className="flex flex-col w-full text-on-surface space-y-space-lg">
      {/* Header Controls */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md border-b border-surface-variant/40 pb-space-md">
        <div className="flex flex-wrap items-center gap-space-md">
          <div className="flex items-center bg-surface-container rounded-lg p-1 border border-surface-variant/40">
            <button onClick={() => setCurrentMonth('September 2024')} className="w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high rounded transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_left</span>
            </button>
            <div className="px-space-md flex items-center gap-space-xs">
              <span className="font-headline-md text-headline-md tracking-tight uppercase text-on-surface font-semibold">{currentMonth}</span>
            </div>
            <button onClick={() => setCurrentMonth('November 2024')} className="w-8 h-8 flex items-center justify-center text-outline hover:text-on-surface hover:bg-surface-container-high rounded transition-all">
              <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>

          <div className="hidden xl:flex items-center gap-space-sm">
            <span className="font-label-xs text-label-xs uppercase tracking-widest text-outline">Heatmap:</span>
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-low rounded border border-surface-variant/30">
              <span className="w-2 h-2 rounded-full bg-surface-bright"></span>
              <span className="font-label-xs text-label-xs text-on-surface-variant">&lt;₹1k</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-low rounded border border-surface-variant/30">
              <span className="w-2 h-2 rounded-full bg-error"></span>
              <span className="font-label-xs text-label-xs text-error">₹1k-₹5k</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 bg-surface-container-low rounded border border-surface-variant/30">
              <span className="w-2 h-2 rounded-full bg-primary-container"></span>
              <span className="font-label-xs text-label-xs text-primary-fixed">Inflow Day</span>
            </div>
          </div>
        </div>

        <span className="font-label-xs text-label-xs uppercase tracking-wider text-outline">
          Fiscal Q4 • Real-Time Financial Calendar
        </span>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-space-md">
        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Total Month Inflow</span>
          <div className="font-headline-lg text-headline-lg text-primary-fixed font-semibold mt-1">+₹60,000</div>
          <span className="font-label-xs text-label-xs text-outline mt-1">2 Deposit events</span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Total Month Outflow</span>
          <div className="font-headline-lg text-headline-lg text-error font-semibold mt-1">−₹13,520</div>
          <span className="font-label-xs text-label-xs text-outline mt-1">12 Debit events</span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Net Retained</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">+₹46,480</div>
          <span className="font-label-xs text-label-xs text-primary-fixed mt-1">77.4% Retention</span>
        </div>

        <div className="bg-surface-container-low rounded-xl p-space-md flex flex-col justify-between border border-surface-variant/30">
          <span className="font-label-xs text-label-xs uppercase text-outline">Selected Day</span>
          <div className="font-headline-lg text-headline-lg text-on-surface font-semibold mt-1">Day {selectedDay || '--'}</div>
          <span className="font-label-xs text-label-xs text-outline mt-1">{dayInfo ? `${dayInfo.txs.length} entries` : 'No dispatches'}</span>
        </div>
      </div>

      {/* Calendar Grid & Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl">
        {/* Calendar Matrix */}
        <div className="lg:col-span-8 rounded-xl bg-surface-container p-space-md lg:p-space-lg border border-surface-variant/30">
          <div className="grid grid-cols-7 gap-1 mb-space-xs text-center font-label-xs text-label-xs text-outline uppercase tracking-wider">
            <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysInMonth.map((day) => {
              const info = dayDataMap[day];
              const isSelected = selectedDay === day;
              const hasIncome = info?.income > 0;
              const hasExpense = info?.expense > 0;

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`min-h-[70px] p-2 rounded-lg border text-left flex flex-col justify-between transition-all ${
                    isSelected
                      ? 'bg-surface-container-high border-primary-container ring-1 ring-primary-container'
                      : 'bg-surface-container-lowest border-surface-variant/30 hover:border-surface-variant'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-label-xs text-label-xs font-semibold ${isSelected ? 'text-primary-fixed' : 'text-on-surface'}`}>
                      {day}
                    </span>
                    {hasIncome && <span className="w-2 h-2 rounded-full bg-primary-container"></span>}
                    {!hasIncome && hasExpense && <span className="w-2 h-2 rounded-full bg-error"></span>}
                  </div>

                  {info && (
                    <div className="space-y-0.5 mt-1">
                      {info.income > 0 && (
                        <div className="font-label-xs text-[10px] text-primary-fixed truncate">
                          +₹{info.income >= 1000 ? `${(info.income / 1000).toFixed(0)}k` : info.income}
                        </div>
                      )}
                      {info.expense > 0 && (
                        <div className="font-label-xs text-[10px] text-error truncate">
                          -₹{info.expense >= 1000 ? `${(info.expense / 1000).toFixed(0)}k` : info.expense}
                        </div>
                      )}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Day Inspector */}
        <div className="lg:col-span-4 rounded-xl bg-surface-container p-space-lg border border-surface-variant/30 flex flex-col justify-between gap-space-md">
          <div className="space-y-space-md">
            <div className="border-b border-surface-variant/40 pb-space-sm flex items-center justify-between">
              <div>
                <span className="font-label-xs text-label-xs uppercase text-outline">DAY INSPECTOR</span>
                <h3 className="font-headline-md text-headline-md font-medium text-on-surface">October {selectedDay}, 2024</h3>
              </div>
              <span className="font-label-xs text-label-xs px-2 py-0.5 rounded bg-primary-container/10 text-primary-fixed font-semibold">
                Audit Verified
              </span>
            </div>

            {dayInfo ? (
              <div className="space-y-space-md">
                <div className="space-y-1">
                  <span className="font-label-xs text-label-xs uppercase text-outline">Day Cashflow</span>
                  <div className="flex justify-between items-center font-label-lg text-label-lg">
                    <span className="text-primary-fixed">+₹{dayInfo.income.toLocaleString('en-IN')}</span>
                    <span className="text-error">-₹{dayInfo.expense.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <div className="space-y-space-xs">
                  <span className="font-label-xs text-label-xs uppercase text-outline">Ledger Entries ({dayInfo.txs.length})</span>
                  <div className="space-y-2">
                    {dayInfo.txs.map((t, idx) => (
                      <div key={idx} className="p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 font-body-sm text-body-sm text-on-surface">
                        {t}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="py-space-xl text-center text-outline font-body-sm">
                No financial dispatches recorded for October {selectedDay}.
              </div>
            )}
          </div>

          <button onClick={() => setSelectedDay(null)} className="w-full py-2 rounded bg-surface-container-high text-on-surface font-label-xs text-label-xs uppercase tracking-wider">
            Clear Selection
          </button>
        </div>
      </div>
    </div>
  );
}
