import { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Divider,
  Grid
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useUrlShortener } from '../context/UrlShortenerContext';
import { formatTimestamp, hasExpired } from '../utils/urlUtils';

/**
 * URL Statistics component to display analytics for shortened URLs
 */
const UrlStatistics = () => {
  const { getAllShortenedUrls, getUrlStatistics } = useUrlShortener();
  const [urls, setUrls] = useState([]);
  const [selectedUrl, setSelectedUrl] = useState(null);
  const [statistics, setStatistics] = useState(null);
  
  // Load all shortened URLs
  useEffect(() => {
    const allUrls = getAllShortenedUrls();
    setUrls(allUrls);
  }, [getAllShortenedUrls]);
  
  // Load statistics when a URL is selected
  useEffect(() => {
    if (selectedUrl) {
      const stats = getUrlStatistics(selectedUrl.shortcode);
      setStatistics(stats);
    } else {
      setStatistics(null);
    }
  }, [selectedUrl, getUrlStatistics]);
  
  // Prepare chart data
  const prepareChartData = () => {
    if (!statistics || !statistics.clicksByDate) return [];
    
    return Object.entries(statistics.clicksByDate).map(([date, count]) => ({
      date,
      clicks: count
    }));
  };
  
  // Handle URL selection
  const handleUrlSelect = (url) => {
    setSelectedUrl(url);
  };
  
  return (
    <Card elevation={3}>
      <CardContent>
        <Typography variant="h5" component="h2" gutterBottom>
          URL Statistics
        </Typography>
        
        {urls.length === 0 ? (
          <Typography variant="body1" color="text.secondary">
            No shortened URLs available yet. Create one to see statistics.
          </Typography>
        ) : (
          <Box>
            <Typography variant="subtitle1" gutterBottom>
              Select a URL to view its statistics:
            </Typography>
            
            <TableContainer component={Paper} variant="outlined" sx={{ mb: 4 }}>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Shortcode</TableCell>
                    <TableCell>Original URL</TableCell>
                    <TableCell>Created</TableCell>
                    <TableCell>Expires</TableCell>
                    <TableCell>Clicks</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {urls.map((url) => (
                    <TableRow 
                      key={url.id} 
                      hover 
                      onClick={() => handleUrlSelect(url)}
                      selected={selectedUrl?.id === url.id}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>{url.shortcode}</TableCell>
                      <TableCell>
                        <Typography noWrap sx={{ maxWidth: 200 }}>
                          {url.originalUrl}
                        </Typography>
                      </TableCell>
                      <TableCell>{formatTimestamp(url.createdAt)}</TableCell>
                      <TableCell>{formatTimestamp(url.expiryTimestamp)}</TableCell>
                      <TableCell>{url.clicks.length}</TableCell>
                      <TableCell>
                        <Chip 
                          size="small" 
                          label={hasExpired(url.expiryTimestamp) ? 'Expired' : 'Active'}
                          color={hasExpired(url.expiryTimestamp) ? 'error' : 'success'}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            
            {statistics && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Statistics for: {statistics.shortcode}
                </Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        URL Details
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      <Typography variant="body2" paragraph>
                        <strong>Original URL:</strong> {statistics.originalUrl}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Created:</strong> {formatTimestamp(statistics.createdAt)}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Expires:</strong> {formatTimestamp(statistics.expiryTimestamp)}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Status:</strong> {statistics.expired ? 'Expired' : 'Active'}
                      </Typography>
                      <Typography variant="body2" paragraph>
                        <strong>Total Clicks:</strong> {statistics.totalClicks}
                      </Typography>
                    </Paper>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Paper variant="outlined" sx={{ p: 2, height: '100%' }}>
                      <Typography variant="subtitle1" gutterBottom>
                        Click Analytics
                      </Typography>
                      <Divider sx={{ mb: 2 }} />
                      
                      {statistics.totalClicks > 0 ? (
                        <ResponsiveContainer width="100%" height={200}>
                          <BarChart data={prepareChartData()}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="clicks" fill="#8884d8" name="Clicks" />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No clicks recorded yet.
                        </Typography>
                      )}
                    </Paper>
                  </Grid>
                  
                  {statistics.totalClicks > 0 && (
                    <Grid item xs={12}>
                      <Paper variant="outlined" sx={{ p: 2 }}>
                        <Typography variant="subtitle1" gutterBottom>
                          Detailed Click Data
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Timestamp</TableCell>
                                <TableCell>Referrer</TableCell>
                                <TableCell>Location</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {statistics.clicks.map((click, index) => (
                                <TableRow key={index}>
                                  <TableCell>{formatTimestamp(click.timestamp)}</TableCell>
                                  <TableCell>{click.referrer}</TableCell>
                                  <TableCell>{click.location}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export default UrlStatistics;