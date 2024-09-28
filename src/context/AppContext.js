import React, { createContext, useReducer, useEffect } from 'react';
import { getNewRecommendation } from '../services/recommendationService';
import { authenticateSpotify, addToLikedSongs } from '../api/spotifyApi';
import { setStorageItem, getStorageItem } from '../services/storageService';

const initialState = {
  song: null,
  isPlaying: false,
  isLiked: false,
  isLoading: true,
  error: null,
  accessToken: null,
};

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

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

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

  useEffect(() => {
    if (state.isLiked && state.accessToken && state.song) {
      addToLikedSongs(state.song.id, state.accessToken).catch(error => {
        console.error('Failed to add song to liked list:', error);
        dispatch({ type: 'SET_ERROR', payload: error });
      });
    }
  }, [state.isLiked, state.accessToken, state.song]);

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

  return (
    <AppContext.Provider value={{ state, dispatch, refreshSong, clearHistory }}>
      {children}
    </AppContext.Provider>
  );
};