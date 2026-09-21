// Minimal IndexedDB wrapper (no external dep). Stores: transactions, accounts, queue meta.
const DB = 'smart-budget';
const VERSION = 1;

function open(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const r = indexedDB.open(DB, VERSION);
    r.onupgradeneeded = () => {
      const db = r.result;
      if (!db.objectStoreNames.contains('transactions')) {
        const s = db.createObjectStore('transactions', { keyPath: 'clientId' });
        s.createIndex('date', 'date', { unique: false });
      }
      if (!db.objectStoreNames.contains('accounts')) db.createObjectStore('accounts', { keyPath: '_id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    r.onsuccess = () => resolve(r.result);
    r.onerror = () => reject(r.error);
  });
}

async function tx<T>(store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T>): Promise<T> {
  const db = await open();
  return new Promise((resolve, reject) => {
    const t = db.transaction(store, mode);
    const req = fn(t.objectStore(store));
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

export const idb = {
  async put(store: string, value: any) { return tx(store, 'readwrite', (s) => s.put(value)); },
  async all(store: string): Promise<any[]> {
    const db = await open();
    return new Promise((resolve, reject) => {
      const out: any[] = [];
      const cur = db.transaction(store, 'readonly').objectStore(store).openCursor();
      cur.onsuccess = () => {
        const c = cur.result;
        if (c) { out.push(c.value); c.continue(); } else resolve(out);
      };
      cur.onerror = () => reject(cur.error);
    });
  },
  async clear(store: string) { return tx(store, 'readwrite', (s) => s.clear()); },
  async del(store: string, key: string) { return tx(store, 'readwrite', (s) => s.delete(key)); },
};
