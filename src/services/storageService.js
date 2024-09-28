export function setStorageItem(key, value) {
    return new Promise((resolve) => {
      chrome.storage.local.set({ [key]: value }, resolve);
    });
  }
  
  export function getStorageItem(key) {
    return new Promise((resolve) => { 
        chrome.storage.local.get(key, (result) => resolve(result[key]));
    });
  }