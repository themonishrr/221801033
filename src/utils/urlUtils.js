/**
 * URL utility functions for the URL Shortener application
 */

/**
 * Validates a URL
 * @param {string} url - The URL to validate
 * @returns {boolean} - Whether the URL is valid
 */
export const validateUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates a custom shortcode
 * @param {string} shortcode - The shortcode to validate
 * @returns {boolean} - Whether the shortcode is valid
 */
export const validateShortcode = (shortcode) => {
  // Shortcode should be alphanumeric and of reasonable length
  const isValid = /^[a-zA-Z0-9-_]{3,20}$/.test(shortcode);
  
  if (!isValid && shortcode) {
  }
  
  return isValid;
};

/**
 * Validates the validity period (in minutes)
 * @param {number} validityPeriod - The validity period in minutes
 * @returns {boolean} - Whether the validity period is valid
 */
export const validateValidityPeriod = (validityPeriod) => {
  const isValid = Number.isInteger(validityPeriod) && validityPeriod > 0;
  
  if (!isValid && validityPeriod !== undefined) {
  }
  
  return isValid;
};

/**
 * Generates a random shortcode
 * @returns {string} - A random shortcode
 */
export const generateShortcode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const length = 6;
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  
  return result;
};

/**
 * Gets the current timestamp
 * @returns {number} - The current timestamp in milliseconds
 */
export const getCurrentTimestamp = () => {
  return Date.now();
};

/**
 * Calculates the expiry timestamp based on the validity period
 * @param {number} validityPeriod - The validity period in minutes
 * @returns {number} - The expiry timestamp in milliseconds
 */
export const calculateExpiryTimestamp = (validityPeriod) => {
  // Default to 30 minutes if not specified
  const minutes = validityPeriod || 30;
  return getCurrentTimestamp() + (minutes * 60 * 1000);
};

/**
 * Checks if a URL has expired
 * @param {number} expiryTimestamp - The expiry timestamp in milliseconds
 * @returns {boolean} - Whether the URL has expired
 */
export const hasExpired = (expiryTimestamp) => {
  return getCurrentTimestamp() > expiryTimestamp;
};

/**
 * Formats a timestamp to a human-readable date string
 * @param {number} timestamp - The timestamp in milliseconds
 * @returns {string} - The formatted date string
 */
export const formatTimestamp = (timestamp) => {
  return new Date(timestamp).toLocaleString();
};