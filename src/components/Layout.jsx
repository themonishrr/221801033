import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

/**
 * Layout component
 * Wraps the application with a header and footer
 */
const Layout = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      <Header />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 4,
        }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;