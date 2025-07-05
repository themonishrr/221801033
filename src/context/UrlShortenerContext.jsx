import { createContext, useContext, useState, useEffect } from 'react';
import { generateShortcode, calculateExpiryTimestamp, hasExpired } from '../utils/urlUtils';

// Create the context
const UrlShortenerContext = createContext();

// Custom hook to use the context
export const useUrlShortener = () => {
  const context = useContext(UrlShortenerContext);
  if (!context) {
    throw new Error('useUrlShortener must be used within a UrlShortenerProvider');
  }
  return context;
};

// Provider component
export const UrlShortenerProvider = ({ children }) => {
  // State for storing shortened URLs
  const [shortenedUrls, setShortenedUrls] = useState([]);
  
  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      const storedUrls = localStorage.getItem('shortenedUrls');
      if (storedUrls) {
        setShortenedUrls(JSON.parse(storedUrls));
      }
    } catch (error) {
    }
  }, []);
  
  // Save data to localStorage whenever shortenedUrls changes
  useEffect(() => {
    try {
      localStorage.setItem('shortenedUrls', JSON.stringify(shortenedUrls));
    } catch (error) {
    }
  }, [shortenedUrls]);
  
  // Function to create a shortened URL
  const createShortenedUrl = (originalUrl, validityPeriod = 30, customShortcode = null) => {
    // Check if custom shortcode is already in use
    if (customShortcode) {
      const shortcodeExists = shortenedUrls.some(url => url.shortcode === customShortcode);
      if (shortcodeExists) {
        throw new Error('This shortcode is already in use. Please choose another one.');
      }
    }
    
    // Generate a shortcode if not provided
    const shortcode = customShortcode || generateShortcode();
    
    // Calculate expiry timestamp
    const expiryTimestamp = calculateExpiryTimestamp(validityPeriod);
    
    // Create the new shortened URL object
    const newShortenedUrl = {
      id: Date.now().toString(),
      originalUrl,
      shortcode,
      createdAt: Date.now(),
      expiryTimestamp,
      clicks: [],
    };
    
    // Add to state
    setShortenedUrls(prevUrls => [newShortenedUrl, ...prevUrls]);
    
    return newShortenedUrl;
  };
  
  // Function to get a shortened URL by shortcode
  const getShortenedUrl = (shortcode) => {
    const url = shortenedUrls.find(url => url.shortcode === shortcode);
    
    if (!url) {
      return null;
    }
    
    if (hasExpired(url.expiryTimestamp)) {
      return { ...url, expired: true };
    }
    
    return url;
  };
  
  // Function to record a click on a shortened URL
  const recordClick = (shortcode, referrer = null) => {
    
    setShortenedUrls(prevUrls => {
      return prevUrls.map(url => {
        if (url.shortcode === shortcode) {
          // Get approximate location based on IP (in a real app, this would use a geolocation service)
          const clickData = {
            timestamp: Date.now(),
            referrer: referrer || 'direct',
            location: 'Unknown' // In a real app, this would be determined from IP
          };
          
          return {
            ...url,
            clicks: [...url.clicks, clickData]
          };
        }
        return url;
      });
    });
  };
  
  // Function to get all shortened URLs
  const getAllShortenedUrls = () => {
    return shortenedUrls;
  };
  
  // Function to get statistics for a specific shortened URL
  const getUrlStatistics = (shortcode) => {
    
    const url = shortenedUrls.find(url => url.shortcode === shortcode);
    
    if (!url) {
      return null;
    }
    
    // Calculate statistics
    const totalClicks = url.clicks.length;
    const clicksByDate = {};
    const clicksByReferrer = {};
    const clicksByLocation = {};
    
    url.clicks.forEach(click => {
      // Group by date
      const date = new Date(click.timestamp).toLocaleDateString();
      clicksByDate[date] = (clicksByDate[date] || 0) + 1;
      
      // Group by referrer
      clicksByReferrer[click.referrer] = (clicksByReferrer[click.referrer] || 0) + 1;
      
      // Group by location
      clicksByLocation[click.location] = (clicksByLocation[click.location] || 0) + 1;
    });
    
    return {
      shortcode: url.shortcode,
      originalUrl: url.originalUrl,
      createdAt: url.createdAt,
      expiryTimestamp: url.expiryTimestamp,
      expired: hasExpired(url.expiryTimestamp),
      totalClicks,
      clicksByDate,
      clicksByReferrer,
      clicksByLocation,
      clicks: url.clicks
    };
  };
  
  // The value to be provided to consumers of this context
  const value = {
    shortenedUrls,
    createShortenedUrl,
    getShortenedUrl,
    recordClick,
    getAllShortenedUrls,
    getUrlStatistics
  };
  
  return (
    <UrlShortenerContext.Provider value={value}>
      {children}
    </UrlShortenerContext.Provider>
  );
};