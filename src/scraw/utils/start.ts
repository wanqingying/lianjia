export class ObjectStore {
  private readonly name: string;
  private readonly keyPath: string;
  private psm: {
    read: IDBTransactionMode;
    write: IDBTransactionMode;
    change: IDBTransactionMode;
  } = {
    read: 'readonly',
    write: 'readwrite',
    change: 'versionchange',
  };
  constructor(props: { name: string; keyPath?: string }) {
    this.name = props.name;
    this.keyPath = props.keyPath || 'key';
    this.deleteIndex = this.deleteIndex.bind(this);
    this.getAllKeys = this.getAllKeys.bind(this);
  }
  startTransaction = (
    permission: IDBTransactionMode
  ): Promise<IDBObjectStore> => {
    let name = this.name;
    let keyPath = this.keyPath;
    return new Promise((resolve, reject) => {
      let indexedDB = window.indexedDB;
      let request = indexedDB.open('slardar', 1);
      request.onsuccess = function(event: any) {
        let db: IDBDatabase = event?.target?.result;
        if (db.objectStoreNames.contains(name)) {
          // 将数据保存到新创建的对象仓库
          let customerObjectStore = db
            .transaction(name, permission)
            .objectStore(name);
          resolve(customerObjectStore);
        } else {
          reject(2);
        }
      };
      request.onupgradeneeded = function(event: any) {
        let db: IDBDatabase = event?.target?.result;
        if (!db.objectStoreNames.contains(name)) {
          db.createObjectStore(name, { keyPath });
        }
      };
    });
  };
  add = (value: any, key?: IDBValidKey): Promise<IDBValidKey> => {
    return this.startTransaction(this.psm.write).then(db => {
      return this.getResult(db.add(value, key));
    });
  };
  put = (value: any, key?: IDBValidKey): Promise<IDBValidKey> => {
    return this.startTransaction(this.psm.write).then(db => {
      return this.getResult(db.put(value, key));
    });
  };
  get = (query: IDBValidKey | IDBKeyRange): Promise<any | undefined> => {
    return this.startTransaction(this.psm.read).then(db => {
      return this.getResult(db.get(query));
    });
  };
  count = (key?: IDBValidKey | IDBKeyRange): Promise<number> => {
    return this.startTransaction(this.psm.read).then(db => {
      return this.getResult(db.count(key));
    });
  };
  createIndex = (
    name: string,
    keyPath: string | string[],
    options?: IDBIndexParameters
  ): Promise<IDBIndex> => {
    return this.startTransaction(this.psm.write).then(db => {
      return db.createIndex(name, keyPath, options);
    });
  };
  deleteIndex(name: string): void {
    this.startTransaction(this.psm.write).then(db => db.deleteIndex(name));
  }
  delete = key => {
    return this.startTransaction(this.psm.write).then(db => {
      return this.getResult(db.delete(key));
    });
  };
  clear = (): Promise<undefined> => {
    return this.startTransaction(this.psm.write).then(db => {
      return this.getResult(db.clear());
    });
  };
  getAll = (
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<any[]> => {
    return this.startTransaction(this.psm.read).then(db => {
      let q = db.getAll(query, count);
      return this.getResult(q);
    });
  };
  getAllKeys(
    query?: IDBValidKey | IDBKeyRange | null,
    count?: number
  ): Promise<IDBValidKey[]> {
    return this.startTransaction(this.psm.read).then(db => {
      let q = db.getAllKeys(query, count);
      return this.getResult(q);
    });
  }
  getResult<T>(q: IDBRequest): Promise<T> {
    return new Promise((resolve, reject) => {
      q.onsuccess = function() {
        resolve(q.result);
      };
      q.onerror = reject;
    });
  }
  openCursor(
    query?: IDBValidKey | IDBKeyRange | null,
    direction?: IDBCursorDirection
  ): Promise<IDBCursorWithValue | null> {
    return this.startTransaction(this.psm.write).then(db => {
      return this.getResult(db.openCursor(query, direction));
    });
  }
}
