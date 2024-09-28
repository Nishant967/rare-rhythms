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
  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary> {/* Wrapping the app in ErrorBoundary for error handling */}
        <AppProvider> {/* Providing context to the app */}
          <SongRecommendation /> {/* Main component of the application */}
        </AppProvider>
      </ErrorBoundary>
    </React.StrictMode>,
    document.getElementById('app') // Targeting the 'app' div in the HTML
  );
};

// Call the render function
renderApp();