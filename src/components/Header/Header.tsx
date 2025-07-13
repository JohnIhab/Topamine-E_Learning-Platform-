import { Box, Stack, Typography } from '@mui/material';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const theme = createTheme({
  direction: 'rtl',
});
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const DashboardSummary: React.FC = () => {
  return (
    <Box sx={{ position: 'static', top: 0, right: 0, left: 0 }}>
     <CacheProvider value={cacheRtl}>
                 <ThemeProvider theme={theme}>
    <Box sx={{ backgroundColor: 'white', pb: 2, pt: 7, direction: 'rtl', }}>
      <Box sx={{ display: 'flex', alignItems: 'flex-start'  ,width:"80vw"}}>
        <Stack
          direction="row"
          // spacing={5}
          sx={{
            width: '77vw',
            justifyContent: 'space-around',
            alignItems: 'flex-end',
            display: 'flex',
            // border:'1px solid black',
            mr:10
          }}
        >
        
          <Box
            sx={{
              width: 335,
              height: 80,
              borderRadius: 2,
              // backgroundColor: rgba(243, 244, 255,0.5),
                  backgroundColor: '#e8eaf6',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              boxShadow: 1,
              fontFamily:'Tajawal'
             
             
             
            }}
          >
            <Box sx={{ }}>
              <Typography variant="subtitle1" fontWeight="bold">
                مجموع الكورسات
              </Typography>
              <Typography variant="h5" color="black">
                ١٢
              </Typography>
            </Box>
            <AutoStoriesIcon sx={{ fontSize: 40, color: 'blue' }} />
          </Box>

       
          <Box
            sx={{
              width: 335,
              height: 80,
              borderRadius: 2,
              backgroundColor: '#f1f8e9',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              boxShadow: 1,
              fontFamily:'Tajawal'
              
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                مجموع المدفوعات
              </Typography>
              <Typography variant="h5" color="black">
                $١٢,٤٥٠
              </Typography>
            </Box>
            <MonetizationOnIcon sx={{ fontSize: 40, color: 'green' }} />
          </Box>

       
          <Box
            sx={{
              width: 335,
              height: 80,
              borderRadius: 2,
              backgroundColor: '#fff3e0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              p: 2,
              boxShadow: 1,
              fontFamily:'Tajawal'
            
             
            }}
          >
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                مجموع الطلاب
              </Typography>
              <Typography variant="h5" color="black">
                ٢٤٨
              </Typography>
            </Box>
            <PeopleAltIcon sx={{ fontSize: 40, color: '#fbc02d' }} />
          </Box>
        </Stack>
      </Box>
    </Box>
         </ThemeProvider>
      </CacheProvider>
    </Box>
  );
}

export default DashboardSummary; 