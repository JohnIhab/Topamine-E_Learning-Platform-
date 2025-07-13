
import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Grid,
  Skeleton,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Header from '../Header/Header';
import ResponsiveDrawer from '../Aside/ResponsiveDrawer';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import CourseCard from '../CourseCard/Card1.tsx';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { column, prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import MuiPagination from '@mui/material/Pagination';

const theme = createTheme({ direction: 'rtl' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const pageSize = 6;

interface Course {
  id: string;
  title: string;
  subTitle: string;
  imageUrl?: string;
  capacity: number;
  term: string;
  startDate: any;
  endDate: any;
  grade: string;
  [key: string]: any;
}

const CourseManagment: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<Course[]>([]);
  const [pagination, setPagination] = useState<{ from: number; to: number }>({ from: 0, to: pageSize });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'courses'));
        const courses = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as Course[];
        setData(courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handlePagination = (_: unknown, page: number) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setPagination({ from, to });
  };

  const totalPages = Math.ceil(data.length / pageSize);

  const DrawerSkeleton = () => (
    <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
    <Drawer variant="permanent" anchor="left" sx={{ width: 240, flexShrink: 0}}>
      <Box sx={{ width: 240, p: 2 }}>
        <Stack direction={'row'} sx={{ display: 'flex', gap: 2  ,mt:5}}>
          <Skeleton animation="wave" variant="circular" width={50} height={50} />
          <Skeleton variant="text" height={35} sx={{ mt: 1, width: 130 }} />
        </Stack>
        <Box sx={{ mt: 5}}>
          <Divider />
        </Box>
        <Stack direction={'column'} spacing={2} sx={{ mt: 4 }}>
          <Skeleton variant="text" height={35} sx={{ mt: 1, width: 130 }} />
          <Skeleton variant="text" height={35} sx={{ mt: 1, width: 130 }} />
          <Skeleton variant="text" height={35} sx={{ mt: 1, width: 130 }} />
        </Stack>
      </Box>
    </Drawer>
    </ThemeProvider>
    </CacheProvider>
  );

  const HeaderSkeleton = () => (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <AppBar position="static" sx={{ bgcolor: 'white', boxShadow: 1,mr:26,pb:2 ,width:'100%' }}>
          <Toolbar sx={{ direction: 'rtl', mt: 7 }}>
            <Stack direction={'row'}
              sx={{
                width: '76vw',
                justifyContent: 'space-between',
                alignContent: 'flex-end',
                display: 'flex',
                mr: 6
              }}>
              <Skeleton variant="rectangular" sx={{ width: 335, height: 80, borderReduis: 2, p: 2, boxShadow: 1 }} />
              <Skeleton variant="rectangular" sx={{ width: 335, height: 80, borderReduis: 2, p: 2, boxShadow: 1 }} />
              <Skeleton variant="rectangular" sx={{ width: 335, height: 80, borderReduis: 2, p: 2, boxShadow: 1 }} />
            </Stack>
          </Toolbar>
        </AppBar>
      </ThemeProvider>
    </CacheProvider>
  );

  return (
    <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      {loading ? <HeaderSkeleton /> : <Header />}
      {loading ? <DrawerSkeleton /> : <ResponsiveDrawer />}

      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <Box sx={{ marginLeft: 35, width: '80%', backgroundColor: 'white', borderRadius: 5, p: 4, mt: 5 }}>
            <Box
              sx={{
                width: '100%',
                borderRadius: 2,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 4
              }}
            >
             
              {loading?
              <Skeleton variant='rectangular' sx={{width:120,height:30, boxShadow: 1 }}/>: <Typography variant="h6" fontWeight="bold">
                إدارة الكورسات
              </Typography>
              }
              {loading?
               <Skeleton variant='rectangular' sx={{width:120,height:30, boxShadow: 1 }}/>
              :<Button
                variant="contained"
                sx={{ borderRadius: 2, backgroundColor: 'blue' }}
                onClick={() => navigate('/newcourse')}
              >
                اضافة كورس جديد +
              </Button>}
            </Box> 

            <Grid container spacing={2} justifyContent="center">
              {loading ? (
                Array.from(new Array(pageSize)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={4}>
                    <Box
                      sx={{
                        width: 345,
                        height: 420,
                        m: 2,
                        borderRadius: 3,
                        boxShadow: 3,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        p: 2,
                      }}
                    >
                      <Skeleton variant="rectangular" sx={{ width: '100%', height: 130 }} />
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                        sx={{ mb: 2 }}
                      >
                        <Skeleton variant="rectangular" sx={{ width: 150, height: 30 }} />
                        <Stack direction="row" spacing={1}>
                          <Skeleton variant="rectangular" sx={{ width: 50, height: 30 }} />
                          <Skeleton variant="rectangular" sx={{ width: 50, height: 30 }} />
                        </Stack>
                      </Stack>
                      <Skeleton variant="rectangular" sx={{ width: 150, height: 20, mb: 5 }} />
                      <Stack direction="row" spacing={3}>
                        <Skeleton variant="rectangular" sx={{ width: 120, height: 30 }} />
                        <Skeleton variant="rectangular" sx={{ width: 120, height: 30 }} />
                      </Stack>
                    </Box>
                  </Grid>
                ))
              ) : (
                data.slice(pagination.from, pagination.to).map(course => (
                  <Grid item key={course.id} xs={12} sm={6} md={4}>
                    <CourseCard {...course} image={course.imageUrl} />
                  </Grid>
                ))
              )}
            </Grid>

            <Stack spacing={2} mt={4} alignItems="center">
              {loading ? (
                <Skeleton variant="rectangular" width={200} height={40} />
              ) : (
                <MuiPagination
                  count={totalPages}
                  shape="rounded"
                  variant="outlined"
                  onChange={handlePagination}
                />
              )}
            </Stack>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </Box>
  );
};

export default CourseManagment;
