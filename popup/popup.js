/**
 * @fileOverview Main entry point for the Popup application.
 * @module popup
 */

import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '../src/context/AppContext';
import SongRecommendation from '../src/components/SongRecommendation';
import ErrorBoundary from '../src/components/ErrorBoundary';

/**
 * Renders the main application component into the DOM.
 * 
 * @function
 * @returns {void}
 */
ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <SongRecommendation />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('app') // The DOM element where the app will be mounted
);