import { Box, Stack, Typography } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const Header: React.FC = () => {
  return (

    <CacheProvider value={cacheRtl}>
      <Box sx={{ backgroundColor: 'white', pb: 2, pt: 5, width: '100%', position: 'relative' }}>

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
              fontFamily: 'Tajawal'

            }}
          >
            <Stack direction={'column'} spacing={1} sx={{ mt: 3, ml: 3 }}>
              <PaymentsIcon sx={{ fontSize: 32, color: '#7C3AED' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '30px', lineHeight: "36px", color: '#111827' }}>
                ١٢,٤٥٠
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: "24px", color: '#6B7280' }}>
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
              fontFamily: 'Tajawal',
            }}
          >
            <Stack direction={'column'} spacing={1} sx={{ mt: 3, ml: 3 }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#EA580C' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '30px', lineHeight: "36px", color: '#111827' }}>
                ١٢
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: "24px", color: '#6B7280' }}>
                مجموع الكورسات
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
              fontFamily: 'Tajawal'
            }}
          >
            <Stack direction={'column'} spacing={1} sx={{ mt: 3, ml: 3 }}>
              <PeopleIcon sx={{ fontSize: 32, color: '#4F46E5' }} />
              <Typography sx={{ fontWeight: 700, fontSize: '30px', lineHeight: "36px", color: '#111827' }}>
                ٢٤٨
              </Typography>
              <Typography sx={{ fontWeight: 500, fontSize: '16px', lineHeight: "24px", color: '#6B7280' }}>
                مجموع الطلاب
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </Box>


    </CacheProvider>

  );
}

export default Header; 