import { DataStore } from './scripts/DataStore.js';

const store = new DataStore();

/**
 * @param {string} message 
 */
function log(message) {
  document.getElementById('out').innerText = message;
}

/**
 * Shows / hides the progress element
 * @param {boolean} enabled Whether the progress should be visible or not
 */
function progress(enabled) {
  const element = document.querySelector('progress');
  element.toggleAttribute('hidden', !enabled);
}

document.getElementById('populate').addEventListener('click', async () => {
  log('Populating the data store with a random data...');
  progress(true);
  try {
    await store.populateData();
    log('Data ready!');
  } catch (e) {
    log(e.message);
    console.error(e);
  }
  progress(false);
});

document.getElementById('clear').addEventListener('click', async () => {
  log('Clearing the data store...');
  progress(true);
  await store.clearData();
  log('Data store cleared!');
  progress(false);
});

document.getElementById('count').addEventListener('click', async () => {
  log('Counting the data store entries...');
  progress(true);
  const result = await store.countData();
  log(`The data store has ${result} items.`);
  progress(false);
});

document.getElementById('run').addEventListener('click', async () => {
  log('Querying for the data...');
  progress(true);
  const start = performance.now();
  const result = await store.readAll();
  const end = performance.now();
  const time = end - start;
  log(`Query complete with ${result.length} items read in ${time}ms.`);
  progress(false);
});
