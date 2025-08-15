
import { createTheme } from '@mui/material/styles';
import globalTheme from '../../theme'; 

export const rtlTheme = createTheme({
  ...globalTheme,
  direction: 'rtl',
});

