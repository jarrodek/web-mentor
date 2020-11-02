import 'faker/dist/faker.js';

/* global faker */

export const STORE_NAME = 'WebWorkers';
export const STORE_VERSION = 1;

/**
 * Creates a database schema when is newly created.
 * @param {Event} e Database create request event
 */
export function createSchema(e) {
  const evTarget = /** @type IDBOpenDBRequest */ (e.target);
  const db = evTarget.result;
  const store = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement: true });
  store.createIndex('starred', 'starred', { unique: false });
  store.createIndex('name', 'name', { unique: false });
  store.createIndex('email', 'email', { unique: false });
  store.createIndex('phone', 'phone', { unique: false });
}

export class DataStore {
  /**
   * @type {IDBDatabase}
   */
  #db = undefined;

  /**
   * Opens the data store
   * @returns {Promise<IDBDatabase>}
   */
  async open() {
    if (this.#db) {
      return this.#db;
    }
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(STORE_NAME, STORE_VERSION);
      request.onsuccess = (e) => {
        const evTarget = /** @type IDBOpenDBRequest */ (e.target);
        const { result } = evTarget;
        result.onclose = () => {
          this.#db = undefined;
        };
        this.#db = result;
        resolve(result);
      };
      request.onerror = () => {
        reject(new Error('Unable to open the store'));
      };
      request.onupgradeneeded = createSchema;
    });
  }

  /**
   * Closes the connection to the data store
   */
  close() {
    if (!this.#db) {
      return;
    }
    this.#db.close();
  }

  /**
   * Generates random contacts data.
   * @param {number} size Sample size
   */
  populateData(size=4096) {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      let error = false;
      tx.oncomplete = () => {
        resolve();
      };
      tx.onerror = () => {
        if (error) {
          return;
        }
        reject(new Error('Unable to populate the data'));
      };
      new Array(size).fill(0).forEach(() => {
        if (error) {
          return;
        }
        const item = {
          name: faker.name.findName(),
          email: faker.internet.email(),
          phone: faker.phone.phoneNumber(),
          starred: faker.random.boolean(),
        };
        store.put(item);
      });
    });
  }

  /**
   * Removes all data from the store
   */
  clearData() {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const tx = db.transaction('contacts', 'readwrite');
      const store = tx.objectStore('contacts');
      tx.oncomplete = () => {
        resolve();
      };
      tx.onerror = () => {
        reject(new Error('Unable to clear the data'));
      };
      store.clear();
    });
  }

  /**
   * Removes all data from the store
   * @returns {Promise<number>}
   */
  countData() {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const tx = db.transaction('contacts', 'readonly');
      const store = tx.objectStore('contacts');
      tx.onerror = () => {
        reject(new Error('Unable to populate the data'));
      };
      tx.oncomplete = () => {
        resolve();
      };
      const request = store.count();
      request.onsuccess = () => {
        resolve(request.result);
      };
    });
  }

  /**
   * Reads all data in a single transaction
   * @returns {Promise<object[]>}
   */
  readAll() {
    return new Promise(async (resolve, reject) => {
      const db = await this.open();
      const tx = db.transaction('contacts', 'readonly');
      const store = tx.objectStore('contacts');
      const cursorRequest = store.openCursor();
      const result = [];
      tx.onerror = () => {
        reject(new Error('Unable to read the data'));
      };
      tx.oncomplete = () => {
        resolve(result);
      };
      cursorRequest.onsuccess = (e) => {
        const request = /** @type IDBRequest<IDBCursorWithValue> */ (e.target);
        const cursor = /** @type IDBCursorWithValue */ (request.result);
        if (!cursor) {
          // no more results
          return;
        }
        const record = cursor.value;
        if (record) {
          result.push(record);
        }
        cursor.continue();
      };
    });
  }
}