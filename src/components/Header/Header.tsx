import { Box, Stack, Typography, useTheme } from '@mui/material';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import PaymentsIcon from '@mui/icons-material/Payments';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
// @ts-ignore
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useThemeMode } from '../../context/ThemeContext';

const cacheRtl = createCache({
  key: 'muirtl',
  stylisPlugins: [prefixer, rtlPlugin],
});

const Header: React.FC = () => {
  const [courseCount, setCourseCount] = useState<number>(0);
  const [totalPayments, setTotalPayments] = useState<number>(0);
  const [studentCount, setStudentCount] = useState<number>(0);
  const { user } = useAuth();
  const theme = useTheme();
  const { isDarkMode } = useThemeMode();

  useEffect(() => {
    if (!user?.uid) {
      return;
    }

    const coursesQuery = query(
      collection(db, 'courses'),
      where('teacherId', '==', user.uid)
    );

    const unsub = onSnapshot(coursesQuery, async (snapshot) => {
      setCourseCount(snapshot.docs.length);
      
      
      const courseIds = snapshot.docs.map(doc => doc.id);
      
      if (courseIds.length > 0) {
        if (courseIds.length <= 10) {
          const paymentsQuery = query(
            collection(db, 'payments'),
            where('courseId', 'in', courseIds)
          );

          const paymentsUnsub = onSnapshot(paymentsQuery, (paymentsSnapshot) => {
            const total = paymentsSnapshot.docs.reduce((sum, doc) => {
              const paymentData = doc.data();
              return sum + (paymentData.amount || 0);
            }, 0);
            setTotalPayments(total);
          });

          return () => {
            paymentsUnsub();
          };
        } else {
          const paymentsQuery = collection(db, 'payments');
          const paymentsUnsub = onSnapshot(paymentsQuery, (paymentsSnapshot) => {
            const total = paymentsSnapshot.docs.reduce((sum, doc) => {
              const paymentData = doc.data();
              if (courseIds.includes(paymentData.courseId)) {
                return sum + (paymentData.amount || 0);
              }
              return sum;
            }, 0);
            setTotalPayments(total);
          });

          return () => {
            paymentsUnsub();
          };
        }
      } else {
        setTotalPayments(0);
      }
    });

    return () => unsub();
  }, [user?.uid]);

  return (

    <CacheProvider value={cacheRtl}>
      <Box sx={{ 
        backgroundColor: theme.palette.background.paper, 
        pb: 2, 
        pt: 5, 
        width: '100%', 
        position: 'relative',
        borderBottom: isDarkMode ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(229, 231, 235, 0.8)'
      }}>

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
              backgroundColor: isDarkMode ? 'rgba(139, 92, 246, 0.15)' : '#F5F3FF',
              boxShadow: 1,
              fontFamily: 'Tajawal'

            }}
          >
            <Stack direction={'column'} spacing={1} sx={{ mt: 3, ml: 3 }}>
              <PaymentsIcon sx={{ fontSize: 32, color: '#7C3AED' }} />
              <Typography sx={{ 
                fontWeight: 700, 
                fontSize: '30px', 
                lineHeight: "36px", 
                color: theme.palette.text.primary 
              }}>
                {totalPayments}
              </Typography>
              <Typography sx={{ 
                fontWeight: 500, 
                fontSize: '16px', 
                lineHeight: "24px", 
                color: theme.palette.text.secondary 
              }}>
                مجموع المدفوعات
              </Typography>
            </Stack>
          </Box>
          <Box
            sx={{
              width: { xs: '100%', sm: '260px' },
              height: "140px",
              borderRadius: 2,
              backgroundColor: isDarkMode ? 'rgba(251, 146, 60, 0.15)' : '#FFF7ED',
              boxShadow: 1,
              fontFamily: 'Tajawal',
            }}
          >
            <Stack direction={'column'} spacing={1} sx={{ mt: 3, ml: 3 }}>
              <SchoolIcon sx={{ fontSize: 32, color: '#EA580C' }} />
              <Typography sx={{ 
                fontWeight: 700, 
                fontSize: '30px', 
                lineHeight: "36px", 
                color: theme.palette.text.primary 
              }}>
                {courseCount}
              </Typography>
              <Typography sx={{ 
                fontWeight: 500, 
                fontSize: '16px', 
                lineHeight: "24px", 
                color: theme.palette.text.secondary 
              }}>
                مجموع الكورسات
              </Typography>
            </Stack>
          </Box>
          
        </Stack>
      </Box>


    </CacheProvider>

  );
}

export default Header; 