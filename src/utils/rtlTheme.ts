// Alternative approach - you can use this approach instead
// Import the global theme and extend it for RTL components

import { createTheme } from '@mui/material/styles';
import globalTheme from '../../theme'; // Adjust path as needed

// This extends the global theme while adding RTL direction
export const rtlTheme = createTheme({
  ...globalTheme,
  direction: 'rtl',
});

// Usage in components:
// import { rtlTheme } from './rtlTheme';
// <ThemeProvider theme={rtlTheme}>
