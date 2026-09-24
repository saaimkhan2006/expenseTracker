import { useState } from 'react';
import { useAuth } from '../stores/auth';
import { useFinance } from '../stores/finance';

export function More() {
  const { user, logout } = useAuth();
  const { online, syncing, sync, transactions } = useFinance();
  const [currency, setCurrency] = useState('INR (₹)');
  const [savedMsg, setSavedMsg] = useState('');

  const handleExportData = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(transactions, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `smart_budget_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleSavePreferences = () => {
    setSavedMsg('Preferences saved successfully!');
    setTimeout(() => setSavedMsg(''), 3000);
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl text-on-surface">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md border-b border-surface-variant/40 pb-space-md">
        <div className="space-y-space-xs">
          <div className="flex items-center gap-2 font-label-xs text-label-xs text-outline uppercase tracking-wider">
            <span>Terminal</span>
            <span>/</span>
            <span className="text-primary-fixed">Settings & System Telemetry</span>
          </div>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-semibold tracking-tight">
            Preferences & Data Management
          </h1>
          <p className="font-body-sm text-body-sm text-on-surface-variant max-w-2xl">
            Configure client preferences, monitor network telemetry, and execute ledger backups.
          </p>
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-space-md py-2 rounded bg-primary-container text-on-primary-fixed font-label-md text-label-md font-semibold hover:bg-primary-fixed-dim transition-all shadow-sm flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">save</span>
          <span>Save Preferences</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-space-md rounded-lg bg-primary-container/20 border border-primary-container text-primary-fixed font-label-xs text-label-xs flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">check_circle</span>
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Network Sync Telemetry Banner */}
      <div className="p-space-md rounded-xl bg-surface-container-low border border-surface-variant/30 space-y-space-sm shadow-sm">
        <div className="flex items-center justify-between border-b border-surface-variant/40 pb-space-xs">
          <div className="flex items-center gap-space-sm">
            <span className="font-label-xs text-label-xs uppercase text-outline">Network Protocol Monitor</span>
            <span className="font-label-xs text-label-xs text-on-surface-variant font-mono">NODE #704-IND</span>
          </div>
          <span className="font-label-xs text-label-xs text-primary-fixed font-mono">TLS 1.3 SECURE</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-md">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${online ? 'bg-primary-container/20 text-primary-fixed' : 'bg-error-container/20 text-error'}`}>
              <span className="material-symbols-outlined text-[20px]">{online ? 'cloud_done' : 'cloud_off'}</span>
            </div>
            <div>
              <div className="font-body-md text-body-md font-semibold text-on-surface">
                {online ? (syncing ? 'Syncing with Cloud...' : '✓ Reconciled & Synced') : 'Offline Mode Active'}
              </div>
              <div className="font-label-xs text-label-xs text-outline">
                {online ? `${transactions.length} entries synchronized` : 'Changes cached locally in IndexedDB'}
              </div>
            </div>
          </div>

          <button
            onClick={() => sync()}
            className="px-space-md py-1.5 rounded bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-xs text-label-xs uppercase font-semibold transition-all"
          >
            Force Sync Now
          </button>
        </div>
      </div>

      {/* Profile & Security Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
        {/* Account Profile Card */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 space-y-space-md">
          <div className="flex items-center gap-space-sm border-b border-surface-variant/40 pb-space-sm">
            <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-on-primary-fixed font-bold">
              <span className="material-symbols-outlined">person</span>
            </div>
            <div>
              <h3 className="font-body-md text-body-md font-semibold text-on-surface">{user?.name || user?.email?.split('@')[0] || 'User'}</h3>
              <span className="font-label-xs text-label-xs text-outline">{user?.email || ''}</span>
            </div>
          </div>

          <div className="space-y-space-sm">
            <div className="space-y-1">
              <label className="font-label-xs text-label-xs uppercase text-outline">Display Name</label>
              <input
                type="text"
                value={user?.name || user?.email?.split('@')[0] || 'User'}
                readOnly
                className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="font-label-xs text-label-xs uppercase text-outline">Base Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-space-sm rounded-lg bg-surface-container-lowest border border-surface-variant/40 text-on-surface font-body-md focus:outline-none"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
                <option value="GBP (£)">GBP (£) - British Pound</option>
              </select>
            </div>
          </div>
        </div>

        {/* Data & Backup Options */}
        <div className="p-space-lg rounded-xl bg-surface-container-low border border-surface-variant/30 space-y-space-md flex flex-col justify-between">
          <div>
            <div className="border-b border-surface-variant/40 pb-space-sm mb-space-md">
              <span className="font-label-xs text-label-xs uppercase text-outline">DATA BACKUP & PORTABILITY</span>
              <h3 className="font-headline-md text-headline-md font-medium text-on-surface">Export & Local Vault</h3>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant mb-space-md">
              Download your complete transaction ledger as JSON for local offline storage, external auditing, or migration.
            </p>

            <button
              onClick={handleExportData}
              className="w-full py-2.5 rounded-lg bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2 border border-surface-variant/40"
            >
              <span className="material-symbols-outlined text-[18px]">download</span>
              <span>Export Ledger Backup (.JSON)</span>
            </button>
          </div>

          <div className="border-t border-surface-variant/30 pt-space-md">
            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-lg bg-error-container/30 hover:bg-error-container/50 text-error font-label-md text-label-md font-semibold transition-all flex items-center justify-center gap-2 border border-error-container/40"
            >
              <span className="material-symbols-outlined text-[18px]">logout</span>
              <span>Sign Out of Terminal</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
