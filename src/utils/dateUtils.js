/**
 * Checks if two dates are the same day.
 * 
 * @param {Date} date1 - The first date to compare.
 * @param {Date} date2 - The second date to compare.
 * @returns {boolean} - Returns true if both dates are the same day, otherwise false.
 */
export function isSameDay(date1, date2) {
    // Check if the year, month, and date are the same
    return date1.getFullYear() === date2.getFullYear() && // Check year
           date1.getMonth() === date2.getMonth() &&     // Check month
           date1.getDate() === date2.getDate();         // Check date
}