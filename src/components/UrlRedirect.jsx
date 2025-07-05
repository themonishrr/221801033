import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Paper } from '@mui/material';
import { useUrlShortener } from '../context/UrlShortenerContext';

/**
 * URL Redirect component
 * Handles redirecting users when they access a shortened URL
 */
const UrlRedirect = () => {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  const { getShortenedUrl, recordClick } = useUrlShortener();
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(3);
  
  useEffect(() => {
    if (!shortcode) {
      navigate('/');
      return;
    }
    
    // Get the shortened URL
    const shortenedUrl = getShortenedUrl(shortcode);
    
    if (!shortenedUrl) {
      setError('The requested short URL was not found.');
      return;
    }
    
    if (shortenedUrl.expired) {
      setError('This short URL has expired.');
      return;
    }
    
    // Record the click with referrer information
    const referrer = document.referrer || 'direct';
    recordClick(shortcode, referrer);
    
    // Start countdown for redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to the original URL
          window.location.href = shortenedUrl.originalUrl;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [shortcode, getShortenedUrl, recordClick, navigate]);
  
  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
        <Paper elevation={3} sx={{ p: 4, maxWidth: 500, textAlign: 'center' }}>
          <Typography variant="h5" color="error" gutterBottom>
            Error
          </Typography>
          <Typography variant="body1">
            {error}
          </Typography>
          <Typography variant="body2" sx={{ mt: 2 }}>
            <a href="/">Return to homepage</a>
          </Typography>
        </Paper>
      </Box>
    );
  }
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '70vh' }}>
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h5" sx={{ mt: 3 }}>
        Redirecting...
      </Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        You will be redirected in {countdown} seconds.
      </Typography>
    </Box>
  );
};

export default UrlRedirect;