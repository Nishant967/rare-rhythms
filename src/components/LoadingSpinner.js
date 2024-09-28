import React from 'react';

/**
 * LoadingSpinner component to display a loading animation.
 * 
 * @returns {JSX.Element} The loading spinner element.
 */
const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-full">
    {/* Spinner element with animation */}
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

export default LoadingSpinner; // Export the LoadingSpinner component