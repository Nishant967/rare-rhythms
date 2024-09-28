import { getTrackRecommendation } from '../api/spotifyApi';
import { getStorageItem, setStorageItem } from './storageService';

const MAX_HISTORY_SIZE = 50; // Adjust this number based on your needs

/**
 * Fetches a new track recommendation while ensuring uniqueness in the history.
 * 
 * @param {string} accessToken - The access token for Spotify API authentication.
 * @returns {Promise<Object>} The new track recommendation object.
 */
export async function getNewRecommendation(accessToken) {
  let recommendation;
  
  // Retrieve recommendation history from storage or initialize as an empty array
  let history = await getStorageItem('recommendationHistory') || [];
  
  // Try to get a unique recommendation up to 5 times
  for (let i = 0; i < 5; i++) {
    recommendation = await getTrackRecommendation(accessToken);
    
    // Check if the recommendation is unique
    if (!history.includes(recommendation.id)) {
      break; // Exit loop if a unique recommendation is found
    }
  }

  // Log a warning if no unique recommendation was found
  if (history.includes(recommendation.id)) {
    console.log('Warning: Couldn\'t find a unique recommendation after 5 attempts');
  }

  // Add the new recommendation to the history
  history.unshift(recommendation.id);

  // Keep only the last MAX_HISTORY_SIZE items
  if (history.length > MAX_HISTORY_SIZE) {
    history = history.slice(0, MAX_HISTORY_SIZE); // Trim history to max size
  }

  // Update the history in storage
  await setStorageItem('recommendationHistory', history);

  return recommendation; // Return the new recommendation
}