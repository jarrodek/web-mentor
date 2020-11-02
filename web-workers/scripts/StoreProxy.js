export class StoreProxy {
  /**
   * The request id
   */
  #id = 0;
  /**
   * @type {Map<number, {resolve: (value?: any) => void, reject: (reason?: any) => void}>}
   */
  #queue = new Map();

  #worker = new Worker('./scripts/StoreWorker.js', {
    type: "module",
  });

  constructor() {
    this.#worker.addEventListener('message', this.responseHandler.bind(this));
    this.#worker.addEventListener('error', this.errorHandler.bind(this));
  }

  /**
   * @param {MessageEvent} e 
   */
  responseHandler(e) {
    const { id, result, error, message } = e.data;
    if (!this.#queue.has(id)) {
      return;
    }
    const promise = this.#queue.get(id);
    this.#queue.delete(id);
    if (error) {
      promise.reject(new Error(message));
    } else {
      promise.resolve(result);
    }
  }

  errorHandler() {
    console.error('An error occurred in the worker')
  }

  /**
   * Returns unique request id.
   */
  getRequestId() {
    const id = this.#id;
    this.#id++;
    return id;
  }

  populateData() {
    return this.sendMessage('populateData');
  }

  clearData() {
    return this.sendMessage('clearData');
  }

  countData() {
    return this.sendMessage('countData');
  }

  readAll() {
    return this.sendMessage('readAll');
  }

  /**
   * Sends the message to the worker.
   * @param {string} topic The function to execute
   * @param {...any} args A list of optional arguments.
   */
  sendMessage(topic, ...args) {
    const id = this.getRequestId();
    const result = this.createResponsePromise(id);
    const message = {
      id,
      topic,
      args,
    };
    this.#worker.postMessage(message);
    return result;
  }

  /**
   * Creates a promise returned by all action functions and adds it to the queue.
   * @param {number} id The id of the message.
   */
  createResponsePromise(id) {
    return new Promise((resolve, reject) => {
      this.#queue.set(id, {
        resolve,
        reject,
      });
    });
  }
}