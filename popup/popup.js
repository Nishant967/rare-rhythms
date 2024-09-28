import React from 'react';
import ReactDOM from 'react-dom';
import { AppProvider } from '../src/context/AppContext';
import SongRecommendation from '../src/components/SongRecommendation';
import ErrorBoundary from '../src/components/ErrorBoundary';

ReactDOM.render(
  <React.StrictMode>
    <ErrorBoundary>
      <AppProvider>
        <SongRecommendation />
      </AppProvider>
    </ErrorBoundary>
  </React.StrictMode>,
  document.getElementById('app')
);