import { DataStore } from './DataStore.js';

const privateRun = Symbol();

export class DeferredRead {
  /**
   * @type {number}
   */
  #chunk = 200;
  /**
   * @type {Function}
   */
  #resolve = undefined;
  /**
   * @type {Function}
   */
  #reject = undefined;

  #store = new DataStore();
  /**
   * Restored data array
   * @type {object[]}
   */
  #data = [];
  /**
   * The number of records the cursor should advance when starting
   */
  #advance = 0;

  run() {
    return new Promise((resolve, reject) => {
      this.#resolve = resolve;
      this.#reject = reject;
      this[privateRun]();
    });
  }

  /**
   * Reads up to the limit of the data defined in the `this.#chunk` field.
   * 
   * @returns {Promise<void>}
   */
  async [privateRun]() {
    const db = await this.#store.open();
    const tx = db.transaction('contacts', 'readonly');
    const store = tx.objectStore('contacts');
    const cursorRequest = store.openCursor();
    let i = 0;
    tx.onerror = () => {
      this.#reject(new Error('Unable to read the data'));
    };
    cursorRequest.onsuccess = (e) => {
      const request = /** @type IDBRequest<IDBCursorWithValue> */ (e.target);
      const cursor = /** @type IDBCursorWithValue */ (request.result);
      if (!cursor) {
        // no more results
        this.#resolve(this.#data);
        return;
      }
      if (this.#advance) {
        cursor.advance(this.#advance);
        this.#advance = 0;
        return;
      }
      const record = cursor.value;
      if (record) {
        this.#data.push(record);
      }
      i++;
      if (i === this.#chunk) {
        this.#advance = this.#data.length;
        setTimeout(() => this[privateRun]());
        return;
      }
      cursor.continue();
    };
  }
}