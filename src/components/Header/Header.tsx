import { Box, Stack, Typography } from '@mui/material';
// import AutoStoriesIcon from '@mui/icons-material/AutoStories';
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
// import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { createTheme, ThemeProvider } from '@mui/material/styles';
// import TextField from '@mui/material/TextField';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: `'Tajawal', 'sans-serif'`,
  },
});
const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const Header: React.FC = () => {
  return (
  
     <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
    <Box sx={{ backgroundColor: 'white', pb: 2, pt: 5, width: '100%' }}>
    
        <Stack
          direction="row"
          spacing={4}
          sx={{
            width: '100%',
            px: 3,
            flexWrap: { xs: 'wrap', md: 'nowrap' },
            justifyContent: { xs: 'center', md: 'flex-start' }
          }}
        >
         <Box
            sx={{
               width: { xs: '100%', sm: '260px' },
              height: "140px",
              borderRadius: 2,
              backgroundColor: '#F5F3FF',
               boxShadow: 1,
              fontFamily:'Tajawal'
              
            }}
          >
             <Stack direction={'column'} spacing={1} sx={{mt:3,ml:3}}>
               <img src='./images/doller.png' width="32px" height="32px" />
                  <Typography sx={{fontWeight:700,fontSize:'30px',lineHeight:"36px",color:'#111827'}}>
                ١٢,٤٥٠
              </Typography>
              <Typography sx={{fontWeight:500,fontSize:'16px',lineHeight:"24px",color:'#6B7280'}}>
                مجموع المدفوعات
              </Typography>
          
           
           
            
             </Stack>
              </Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '260px' },
              height: "140px",
              borderRadius: 2,
              
                  backgroundColor: '#FFF7ED',
            
              boxShadow: 1,
              fontFamily:'Tajawal',
              

             
             
             
            }}
          >
            <Stack direction={'column'} spacing={1} sx={{mt:3,ml:3}}>
               <img src='./images/SVG.png' width="32px" height="32px"  />
                 <Typography  sx={{fontWeight:700,fontSize:'30px',lineHeight:"36px",color:'#111827'}}>
                ١٢
              </Typography>
               
              <Typography sx={{fontWeight:500,fontSize:'16px',lineHeight:"24px",color:'#6B7280'}}>
                مجموع الكورسات
              </Typography>
            

            </Stack>
           
           </Box>
     
            
          
       
         
        
  <Box
            sx={{
              width: { xs: '100%', sm: '260px' },
              height: "140px",
              borderRadius: 2,
              backgroundColor: '#F0FDF4',
            
              boxShadow: 1,
              fontFamily:'Tajawal'
              
            }}
          >
            <Stack direction={'column'} spacing={1} sx={{mt:3,ml:3}}>
             
             <img src='./images/teacher.png'  width="32px" height="32px" />
               <Typography sx={{fontWeight:700,fontSize:'30px',lineHeight:"36px",color:'#111827'}}>
               126
              </Typography>
               <Typography sx={{fontWeight:500,fontSize:'16px',lineHeight:"24px",color:'#6B7280'}}>
                المدرسيين
              </Typography>
            </Stack>
             
            
            </Box>
       
          <Box
            sx={{
              width: { xs: '100%', sm: '260px' },
              height: "140px",
              borderRadius: 2,
              backgroundColor: '#F3F4FF',
             
              boxShadow: 1,
              fontFamily:'Tajawal'
            
             
            }}
          >
           
             <Stack direction={'column'} spacing={1} sx={{mt:3,ml:3}}>
              <img src="./images/h57.png" width="32px" height="32px"/>
              <Typography sx={{fontWeight:700,fontSize:'30px',lineHeight:"36px",color:'#111827'}}>
                ٢٤٨
              </Typography>
              <Typography sx={{fontWeight:500,fontSize:'16px',lineHeight:"24px",color:'#6B7280'}}>
                مجموع الطلاب
              </Typography>
              
            
          
            
         
          </Stack>
          </Box>
        </Stack>
        </Box>
      
  
         </ThemeProvider>
      </CacheProvider>
 
  );
}

export default Header; 