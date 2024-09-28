/**
 * Sets an item in local storage.
 * 
 * @param {string} key - The key under which the value is stored.
 * @param {any} value - The value to be stored.
 * @returns {Promise<void>} A promise that resolves when the item is set.
 */
export function setStorageItem(key, value) {
    return new Promise((resolve) => {
        // Set the item in chrome local storage
        chrome.storage.local.set({ [key]: value }, resolve);
    });
}

/**
 * Retrieves an item from local storage.
 * 
 * @param {string} key - The key of the item to retrieve.
 * @returns {Promise<any>} A promise that resolves with the retrieved value.
 */
export function getStorageItem(key) {
    return new Promise((resolve) => {
        // Retrieve the item from chrome local storage
        chrome.storage.local.get(key, (result) => resolve(result[key]));
    });
}