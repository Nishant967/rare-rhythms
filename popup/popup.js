import React from 'react'; // Importing React library
import ReactDOM from 'react-dom'; // Importing ReactDOM for rendering
import { AppProvider } from '../src/context/AppContext'; // Importing AppProvider for context
import SongRecommendation from '../src/components/SongRecommendation'; // Importing SongRecommendation component
import ErrorBoundary from '../src/components/ErrorBoundary'; // Importing ErrorBoundary component

/**
 * Renders the application within the 'app' div.
 * @function renderApp
 */
const renderApp = () => {
  const root = ReactDOM.createRoot(document.getElementById('root')); // Create a root
  root.render( // Use the new render method
    <React.StrictMode>
      <ErrorBoundary> {/* Wrapping the app in ErrorBoundary for error handling */}
        <AppProvider> {/* Providing context to the app */}
          <SongRecommendation /> {/* Main component of the application */}
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Call the render function
renderApp();