import { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Tooltip,
  CircularProgress
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { useUrlShortener } from '../context/UrlShortenerContext';
import { validateUrl, validateShortcode, validateValidityPeriod } from '../utils/urlUtils';


const UrlShortenerForm = () => {
  // Get the createShortenedUrl function from context
  const { createShortenedUrl } = useUrlShortener();
  
  // Form state
  const [originalUrl, setOriginalUrl] = useState('');
  const [customShortcode, setCustomShortcode] = useState('');
  const [validityPeriod, setValidityPeriod] = useState('30');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [shortenedUrl, setShortenedUrl] = useState(null);
  const [copied, setCopied] = useState(false);
  
  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Reset states
    setError('');
    setSuccess(false);
    setShortenedUrl(null);
    setCopied(false);
    
    // Validate URL
    if (!validateUrl(originalUrl)) {
      setError('Please enter a valid URL');
      return;
    }
    
    // Validate shortcode if provided
    if (customShortcode && !validateShortcode(customShortcode)) {
      setError('Shortcode must be 3-20 alphanumeric characters');
      return;
    }
    
    // Validate validity period
    const validityPeriodNumber = parseInt(validityPeriod, 10);
    if (!validateValidityPeriod(validityPeriodNumber)) {
      setError('Validity period must be a positive integer');
      return;
    }
    
    // Create shortened URL
    setLoading(true);
    try {
      const newShortenedUrl = createShortenedUrl(
        originalUrl,
        validityPeriodNumber,
        customShortcode || null
      );
      
      // Set success state
      setShortenedUrl(newShortenedUrl);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle copy to clipboard
  const handleCopy = () => {
    const shortUrl = `${window.location.origin}/${shortenedUrl.shortcode}`;
    navigator.clipboard.writeText(shortUrl)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
      });
  };
  
  return (
    <Card elevation={3} sx={{ mb: 4 }}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          Shorten Your URL
        </Typography>
        
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 2 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert severity="success" sx={{ mb: 2 }}>
              URL shortened successfully!
            </Alert>
          )}
          
          <TextField
            fullWidth
            label="Original URL"
            variant="outlined"
            margin="normal"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            placeholder="https://example.com/long-url"
            required
            inputProps={{ maxLength: 2000 }}
          />
          
          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <TextField
              label="Custom Shortcode (Optional)"
              variant="outlined"
              value={customShortcode}
              onChange={(e) => setCustomShortcode(e.target.value)}
              placeholder="e.g., mylink"
              sx={{ flex: 1 }}
              inputProps={{ maxLength: 20 }}
            />
            
            <TextField
              label="Validity (minutes)"
              variant="outlined"
              type="number"
              value={validityPeriod}
              onChange={(e) => setValidityPeriod(e.target.value)}
              sx={{ width: '200px' }}
              inputProps={{ min: 1 }}
            />
          </Box>
          
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading || !originalUrl}
          >
            {loading ? <CircularProgress size={24} /> : 'Shorten URL'}
          </Button>
        </Box>
        
        {shortenedUrl && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
            <Typography variant="subtitle1" gutterBottom>
              Your shortened URL:
            </Typography>
            
            <TextField
              fullWidth
              variant="outlined"
              value={`${window.location.origin}/${shortenedUrl.shortcode}`}
              InputProps={{
                readOnly: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                      <IconButton onClick={handleCopy} edge="end">
                        <ContentCopyIcon />
                      </IconButton>
                    </Tooltip>
                  </InputAdornment>
                ),
              }}
            />
            
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Expires: {new Date(shortenedUrl.expiryTimestamp).toLocaleString()}
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlShortenerForm;