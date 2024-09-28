import { getNewRecommendation } from '../src/services/recommendationService';
import { setStorageItem, getStorageItem } from '../src/services/storageService';
import { authenticateSpotify } from '../src/api/spotifyApi';
import { isSameDay } from '../src/utils/dateUtils';

chrome.runtime.onInstalled.addListener(() => {
  updateDailyRecommendation();
});

chrome.runtime.onStartup.addListener(() => {
  updateDailyRecommendation();
});

async function updateDailyRecommendation() {
  const lastUpdate = await getStorageItem('lastUpdate');
  const currentDate = new Date();

  if (!lastUpdate || !isSameDay(new Date(lastUpdate), currentDate)) {
    try {
      const accessToken = await authenticateSpotify();
      const newRecommendation = await getNewRecommendation(accessToken);
      await setStorageItem('currentRecommendation', newRecommendation);
      await setStorageItem('lastUpdate', currentDate.toISOString());
    } catch (error) {
      console.error('Error updating daily recommendation:', error);
    }
  }
}