
import React, { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  Typography,
  Button,
  Skeleton,
  Grid,
  Pagination as MuiPagination,
} from '@mui/material';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import CourseCard from '../CourseCard/Card1';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { useAuth } from '../../context/AuthContext';

const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

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
  teacherName:string;
}

const CourseManagment: React.FC = () => {
  const [data, setData] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ from: 0, to: 6 });
  const pageSize = 6;
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth() || {};

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        // Only fetch courses if user is logged in and is a teacher
        if (!user || !user.uid) {
          setLoading(false);
          return;
        }

        // Use a simpler query to avoid index requirement
        const coursesQuery = query(
          collection(db, 'courses'),
          where('teacherId', '==', user.uid)
        );

        const unsub = onSnapshot(coursesQuery, (snapshot) => {
          let courseList = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Course[];
          
          // Sort by createdAt in memory instead of in the query
          courseList = courseList.sort((a, b) => {
            const aDate = a.createdAt?.toDate() || new Date(0);
            const bDate = b.createdAt?.toDate() || new Date(0);
            return bDate.getTime() - aDate.getTime(); // desc order
          });
          
          setData(courseList);
          setLoading(false);
        });

        return () => unsub();
      } catch (error) {
        console.error('Error fetching courses:', error);
        setLoading(false);
      }
    };
    fetchCourses();
  }, [user]);

  const handlePagination = (_: unknown, page: number) => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setPagination({ from, to });
  };

  const totalPages = Math.ceil(data.length / pageSize);

  return (
    <>
      <CacheProvider value={cacheRtl}>
          <Box sx={{ backgroundColor: '#f5f5f5', minHeight: '100vh', width: '100%', overflowX: 'hidden' }}>
            <Box sx={{ width: '100%', backgroundColor: 'white', borderRadius: 5, p: 4, mt: 4, overflowX: 'hidden' }}>
              {/* Render nested route content if on /add */}
              {location.pathname.endsWith('/add') ? (
                <Outlet />
              ) : (
                <>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mb: 4
                    }}
                  >
                    {loading?
                    <Skeleton variant='rectangular' sx={{width:120,height:30, boxShadow: 1 }}/>: <Typography  sx={{fontWeight:700,fontSize:'30px',lineHeight:"36px",color:'#111827'}}>
                      إدارة الكورسات
                    </Typography>
                    }
                    {loading?
                     <Skeleton variant='rectangular' sx={{width:120,height:30, boxShadow: 1 }}/>
                    :<Button
                      variant="contained"
                      sx={{ borderRadius: 2, backgroundColor: '#2563EB' }}
                      onClick={() => navigate('add')}
                    >
                      إضافة كورس جديد
                    </Button>
                    }
                  </Box>

                  <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: '100%' }}>
                    {loading ? (
                      Array.from(new Array(pageSize)).map((_, index) => (
                        <Grid item xs={12} sm={6} lg={4} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <Box
                            sx={{
                              width: 350,
                              height: 410,
                              borderRadius: 3,
                              boxShadow: 3,
                              display: 'flex',
                              flexDirection: 'column',
                              justifyContent: 'space-between',
                              p: 2,
                            }}
                          >
                            <Skeleton variant="rectangular" sx={{ width: '100%', height: 140 }} />
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                              sx={{ mb: 2 }}
                            >
                              <Skeleton variant="rectangular" sx={{ width: 120, height: 30 }} />
                              <Stack direction="row" spacing={1}>
                                <Skeleton variant="rectangular" sx={{ width: 30, height: 30 }} />
                                <Skeleton variant="rectangular" sx={{ width: 30, height: 30 }} />
                              </Stack>
                            </Stack>
                            <Skeleton variant="rectangular" sx={{ width: '100%', height: 40, mb: 2 }} />
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                              <Skeleton variant="rectangular" sx={{ width: 80, height: 20 }} />
                              <Skeleton variant="rectangular" sx={{ width: 80, height: 20 }} />
                              <Skeleton variant="rectangular" sx={{ width: 80, height: 20 }} />
                            </Stack>
                            <Stack direction="row" spacing={2} sx={{ mb: 2 }}>
                              <Skeleton variant="rectangular" sx={{ width: 100, height: 20 }} />
                              <Skeleton variant="rectangular" sx={{ width: 100, height: 20 }} />
                            </Stack>
                            <Box display="flex" justifyContent="flex-end">
                              <Skeleton variant="rectangular" sx={{ width: 100, height: 35 }} />
                            </Box>
                          </Box>
                        </Grid>
                      ))
                    ) : data.length === 0 ? (
                      <Grid item xs={12}>
                        <Box
                          sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            py: 8,
                            textAlign: 'center'
                          }}
                        >
                          <Typography
                            variant="h5"
                            sx={{
                              fontWeight: 600,
                              color: '#6b7280',
                              mb: 2
                            }}
                          >
                            لا توجد كورسات حاليًا
                          </Typography>
                          <Typography
                            variant="body1"
                            sx={{
                              color: '#9ca3af',
                              mb: 4,
                              maxWidth: '400px'
                            }}
                          >
                            لم تقم بإنشاء أي كورسات بعد. ابدأ بإضافة كورسك الأول لتظهر هنا.
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              borderRadius: 2,
                              backgroundColor: '#2563EB',
                              px: 4,
                              py: 1.5
                            }}
                            onClick={() => navigate('add')}
                          >
                            إضافة كورس جديد
                          </Button>
                        </Box>
                      </Grid>
                    ) : (
                      data.slice(pagination.from, pagination.to).map(course => (
                        <Grid item xs={12} sm={6} lg={4} key={course.id} sx={{ display: 'flex', justifyContent: 'center' }}>
                          <CourseCard
                            id={course.id}
                            title={course.title}
                            subTitle={course.subTitle}
                            image={course.imageUrl}
                            capacity={course.capacity}
                            term={course.term}
                            startDate={course.startDate}
                            endDate={course.endDate}
                            gradeLevel={course.grade || course.gradeLevel || ''}
                            teacherName={course.teacherName}
                            price={course.price || 0}
                          />
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
                </>
              )}
            </Box>
          </Box>
      </CacheProvider>
    </>
  );
};

export default CourseManagment;

