import { Box, Container, Typography, Grid } from '@mui/material';
import UrlShortenerForm from '../components/UrlShortenerForm';
import UrlStatistics from '../components/UrlStatistics';

/**
 * Home page component
 * Contains the URL shortener form and statistics
 */
const HomePage = () => {
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          URL Shortener
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Create shortened URLs with custom shortcodes and validity periods. Track usage statistics and analytics.
        </Typography>
      </Box>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <UrlShortenerForm />
        </Grid>
        <Grid item xs={12} md={6}>
          <UrlStatistics />
        </Grid>
      </Grid>
    </Container>
  );
};

export default HomePage;