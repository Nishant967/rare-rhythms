import React, { createContext, useReducer, useEffect } from 'react';
import { getNewRecommendation } from '../services/recommendationService';
import { authenticateSpotify, addToLikedSongs } from '../api/spotifyApi';
import { setStorageItem, getStorageItem } from '../services/storageService';

// Initial state for the context
const initialState = {
  song: null,
  isPlaying: false,
  isLiked: false,
  isLoading: true,
  error: null,
  accessToken: null,
};

/**
 * Reducer function to manage state updates.
 * 
 * @param {Object} state - Current state of the context.
 * @param {Object} action - Action to be processed.
 * @returns {Object} Updated state after applying the action.
 */
function reducer(state, action) {
  switch (action.type) {
    case 'SET_SONG':
      return { ...state, song: action.payload, isLoading: false };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: !state.isPlaying };
    case 'TOGGLE_LIKE':
      return { ...state, isLiked: !state.isLiked };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'SET_ACCESS_TOKEN':
      return { ...state, accessToken: action.payload };
    case 'REFRESH_SONG':
      return { ...state, isLoading: true };
    default:
      return state;
  }
}

// Create context
export const AppContext = createContext();

/**
 * Provider component to wrap the application and provide context.
 * 
 * @param {Object} props - Component props.
 * @param {React.ReactNode} props.children - Child components.
 * @returns {JSX.Element} The AppProvider component.
 */
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load initial data on component mount
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const accessToken = await authenticateSpotify();
        dispatch({ type: 'SET_ACCESS_TOKEN', payload: accessToken });

        const storedSong = await getStorageItem('currentRecommendation');
        if (storedSong) {
          console.log('Stored song:', storedSong);
          dispatch({ type: 'SET_SONG', payload: storedSong });
        } else {
          const newSong = await getNewRecommendation(accessToken);
          console.log('New song:', newSong);
          dispatch({ type: 'SET_SONG', payload: newSong });
          await setStorageItem('currentRecommendation', newSong);
        }
      } catch (error) {
        console.error('Error loading initial data:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
      }
    };

    loadInitialData();
  }, []);

  // Effect to handle adding song to liked list
  useEffect(() => {
    if (state.isLiked && state.accessToken && state.song) {
      addToLikedSongs(state.song.id, state.accessToken).catch(error => {
        console.error('Failed to add song to liked list:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
      });
    }
  }, [state.isLiked, state.accessToken, state.song]);

  /**
   * Function to refresh the current song.
   */
  const refreshSong = async () => {
    try {
      dispatch({ type: 'REFRESH_SONG' });
      const newSong = await getNewRecommendation(state.accessToken);
      dispatch({ type: 'SET_SONG', payload: newSong });
      await setStorageItem('currentRecommendation', newSong);
    } catch (error) {
      console.error('Error refreshing song:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  /**
   * Function to clear recommendation history.
   */
  const clearHistory = async () => {
    try {
      await setStorageItem('recommendationHistory', []);
      console.log('Recommendation history cleared');
      refreshSong();
    } catch (error) {
      console.error('Error clearing history:', error);
      dispatch({ type: 'SET_ERROR', payload: error });
    }
  };

  // Provide context values to children
  return (
    <AppContext.Provider value={{ state, dispatch, refreshSong, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
};