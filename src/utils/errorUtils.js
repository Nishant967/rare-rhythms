/**
 * Handles API errors by logging relevant information.
 * @param {Object} error - The error object from the API call.
 * @returns {Error} - Returns a new Error with a user-friendly message.
 */
export function handleApiError(error) {
    console.error('API Error:', error); // Log the main error

    // Check if the error has a response from the server
    if (error.response) {
        console.error('Response data:', error.response.data); // Log response data
        console.error('Response status:', error.response.status); // Log response status
        console.error('Response headers:', error.response.headers); // Log response headers
    } 
    // Check if the error was due to no response being received
    else if (error.request) {
        console.error('No response received:', error.request); // Log request details
    } 
    // Log any other error messages
    else {
        console.error('Error message:', error.message); // Log error message
    }

    // Return a user-friendly error message
    return new Error('An unexpected error occurred. Please try again later.');
}