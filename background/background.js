// Import necessary services and utilities
import { getNewRecommendation } from '../src/services/recommendationService';
import { setStorageItem, getStorageItem } from '../src/services/storageService';
import { authenticateSpotify } from '../src/api/spotifyApi';
import { isSameDay } from '../src/utils/dateUtils';

/**
 * Listener for when the extension is installed.
 * Triggers the daily recommendation update.
 */
chrome.runtime.onInstalled.addListener(() => {
  updateDailyRecommendation(); // Update recommendation on install
});

/**
 * Listener for when the extension is started.
 * Triggers the daily recommendation update.
 */
chrome.runtime.onStartup.addListener(() => {
  updateDailyRecommendation(); // Update recommendation on startup
});

/**
 * Updates the daily recommendation if it hasn't been updated today.
 * @async
 * @function updateDailyRecommendation
 * @returns {Promise<void>} 
 */
async function updateDailyRecommendation() {
  // Get the last update date from storage
  const lastUpdate = await getStorageItem('lastUpdate');
  const currentDate = new Date();

  // Check if the last update was not today
  if (!lastUpdate || !isSameDay(new Date(lastUpdate), currentDate)) {
    try {
      // Authenticate and get a new recommendation
      const accessToken = await authenticateSpotify();
      const newRecommendation = await getNewRecommendation(accessToken);
      
      // Store the new recommendation and update the last update date
      await setStorageItem('currentRecommendation', newRecommendation);
      await setStorageItem('lastUpdate', currentDate.toISOString());
    } catch (error) {
      // Log any errors that occur during the update process
      console.error('Error updating daily recommendation:', error);
    }
  }
}