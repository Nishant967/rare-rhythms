import { getTrackRecommendation } from '../api/spotifyApi';
import { getStorageItem, setStorageItem } from './storageService';

const MAX_HISTORY_SIZE = 50; // Adjust this number based on your needs

export async function getNewRecommendation(accessToken) {
  let recommendation;
  let history = await getStorageItem('recommendationHistory') || [];
  
  // Try to get a unique recommendation up to 5 times
  for (let i = 0; i < 5; i++) {
    recommendation = await getTrackRecommendation(accessToken);
    if (!history.includes(recommendation.id)) {
      break;
    }
  }

  // If we couldn't get a unique recommendation, use the last one we got
  if (history.includes(recommendation.id)) {
    console.log('Warning: Couldn\'t find a unique recommendation after 5 attempts');
  }

  // Add the new recommendation to the history
  history.unshift(recommendation.id);

  // Keep only the last MAX_HISTORY_SIZE items
  if (history.length > MAX_HISTORY_SIZE) {
    history = history.slice(0, MAX_HISTORY_SIZE);
  }

  // Update the history in storage
  await setStorageItem('recommendationHistory', history);

  return recommendation;
}