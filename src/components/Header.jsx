import { AppBar, Toolbar, Typography, Box, Container } from '@mui/material';

/**
 * Header component for the URL Shortener application
 */
const Header = () => {
  return (
    <AppBar position="static" color="primary" elevation={0}>
      <Container maxWidth="lg">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            URL Shortener
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Typography variant="caption" color="inherit">
              © 2025 Rights Reserved by Monish Raja Rathinam M 221801033
            </Typography>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;