export interface StoreOption {
  name: string
  keyPath: string
  expired?: number
}

export interface DatabaseOptions {
  name: string
  version: number
  stores: StoreOption[]
}

export class Database {
  private db: IDBDatabase
  private stores: Map<string, StoreOption>

  private static instances: Map<string, Database> = new Map()
  public static async instance(options: DatabaseOptions) {
    const { name, version, stores } = options
    if (this.instances.has(name)) return this.instances.get(name) as Database
    const req = indexedDB.open(name, version)
    return new Promise<Database>((resolve, reject) => {
      req.onerror = () => {
        reject(req.error)
      }
      req.onsuccess = () => {
        const db = new Database(req.result, stores)
        this.instances.set(name, db)
        resolve(db)
      }
      req.onupgradeneeded = () => {
        const idb = req.result
        for (const store of stores)
          if (!idb.objectStoreNames.contains(store.name))
            idb.createObjectStore(store.name, { keyPath: store.keyPath })
      }
    })
  }

  constructor(db: IDBDatabase, stores: StoreOption[]) {
    this.db = db
    this.stores = new Map()
    stores.forEach((store) => {
      this.stores.set(store.name, store)
    })
  }

  private getStore(name: string, mode: IDBTransactionMode = 'readonly') {
    if (!this.stores.has(name)) return null
    if (this.db.objectStoreNames.contains(name))
      return this.db.transaction(name, mode).objectStore(name)
    return null
  }

  public async get<T>(name: string, key: string): Promise<T | null> {
    const store = this.getStore(name)
    if (!store) return null
    const { expired } = this.stores.get(name) as StoreOption
    return new Promise((resolve, reject) => {
      const req = store.get(key)
      req.onsuccess = () =>
        resolve(
          !req.result ||
            (expired && req.result.timestamp + expired < Date.now())
            ? null
            : req.result.value
        )
      req.onerror = () => reject(req.error)
    })
  }

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  public async set(name: string, key: string, value: any) {
    const store = this.getStore(name, 'readwrite')
    if (!store) return false
    return new Promise((resolve, reject) => {
      const { expired, keyPath } = this.stores.get(name) as StoreOption
      const putItem = { [keyPath]: key, value }
      if (expired) putItem.timestamp = Date.now()
      const req = store.put(putItem)
      req.onsuccess = () => resolve(true)
      req.onerror = () => reject(req.error)
    })
  }
}
