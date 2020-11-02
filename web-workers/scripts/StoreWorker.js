import { DataStore } from './DataStore.js';
const store = new DataStore();

self.onmessage = 
/**
 * @param {MessageEvent} e 
 */
async (e) => {
  const { data } = e;
  const promise = store[data.topic](...data.args);
  const response = {
    id: data.id,
  };
  try {
    response.result = await promise;
  } catch (e) {
    response.error = true;
    response.message = e.message;
  }
  console.log(response);
  self.postMessage(response);
}