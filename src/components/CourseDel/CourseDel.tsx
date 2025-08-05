

import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Stack,
  Typography,
  Collapse as MUICollapse,
  List,
  ListItem,
  Skeleton,
  Alert,
  Button,
  LinearProgress,
  Chip,
  Divider
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { useParams } from 'react-router-dom';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';

import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { UserContext } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

const theme = createTheme({ 
  direction: 'rtl',
  typography: {
    fontFamily: `'Tajawal', 'sans-serif'`,
  },
});
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });


interface Lecture {
  title?: string;
  videoUrl?: string;
  pdfUrl?: string;
  txtUrl?: string;
  docUrl?: string;
}


interface Course {
  id: string;
  title: string;
  subTitle: string;
  imageUrl?: string;
  capacity: number;
  term: string;
  startDate: any;
  endDate: any;
  gradeLevel: string;
  teacherName: string;
  teacherId?: string;
  price: number;
  lectures?: Lecture[];
}

function getDownloadUrl(url: string) {
  if (!url) return '';
  if (url.includes('/upload/')) {
    return url.replace('/upload/', '/upload/fl_attachment/');
  }
  return url;
}

const CourseDetails = () => {
  const navigate = useNavigate();
  const { courseId } = useParams();
  const { user } = useContext(UserContext) || {};
  // @ts-ignore
  const { user: authUser, role } = useAuth() || {};
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [courseData, setCourseData] = useState<Course | null>(null);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [openLectures, setOpenLectures] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        setError('لم يتم تحديد الكورس.');
        setLectures([]);
        setLoading(false);
        return;
      }
      setLoading(true);
      setError('');
      try {
        const courseRef = doc(db, 'courses', courseId);
        const courseSnap = await getDoc(courseRef);
        if (courseSnap.exists()) {
          const data = courseSnap.data() as Course;
          setCourseData(data);
          const courseLectures = data.lectures || [];
          setLectures(courseLectures);
          setOpenLectures(Array.from({ length: courseLectures.length }, () => false));

          if (data.teacherId) {
            try {
              const teacherRef = doc(db, 'users', data.teacherId);
              const teacherSnap = await getDoc(teacherRef);
              if (teacherSnap.exists()) {
                const teacherInfo = teacherSnap.data();
                console.log('Teacher data fetched:', teacherInfo);
                setTeacherData(teacherInfo);
              } else {
                console.log('Teacher document not found');
              }
            } catch (teacherError) {
              console.error('Error fetching teacher data:', teacherError);
            }
          }
        } else {
          setError('لم يتم العثور على بيانات الكورس.');
          setLectures([]);
        }
      } catch (err) {
        setError('حدث خطأ أثناء جلب بيانات الكورس.');
        setLectures([]);
      }
      setLoading(false);
    };
    fetchCourseData();
  }, [courseId]);

  const toggleLecture = (index: number) => {
    setOpenLectures(prev =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };

  return (
    <>

      <Box
        sx={{
          width: '95vw',

          height: { xs: 250, md: 350, lg: 400 },
          margin: '20px 0px',
          mr: 3,

          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          borderRadius: 3,
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
          backgroundImage: `url(${courseData?.imageUrl || '/images/default.jpg'})`,
        }}
      >

        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundPosition: 'fill',


            zIndex: 1,
          }}
        />


        <Box
          sx={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            zIndex: 2,
            p: { xs: 3, md: 4 },
            color: 'white',
            background: 'linear-gradient(transparent, rgba(0, 0, 0, 0.7))',
          }}
        >
          {courseData && (
            <>
              <Typography
                sx={{
                  fontSize: { xs: 24, md: 32, lg: 36 },
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: 'Tajawal',
                  textShadow: '0 2px 4px rgba(0, 0, 0, 0.5)'
                }}
              >
                {courseData.title}
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16, lg: 18 },
                  opacity: 0.9,
                  fontFamily: 'Tajawal',
                  textShadow: '0 1px 2px rgba(0, 0, 0, 0.5)'
                }}
              >
                {courseData.subTitle}
              </Typography>
            </>
          )}
        </Box>
      </Box>

      <Box sx={{
        width: '60%',
        mr: 3,
        backgroundColor: '#ffffff',
        borderRadius: 3,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        border: '1px solid #e0e0e0'
      }}>

        <Box sx={{
          backgroundColor: 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)'
          ,
          color: 'gray',
          p: { xs: 3, md: 4 },
        }}>

          <Skeleton variant="rectangular" sx={{ width: 150, height: 7, mb: 1, mt: 1 }} />
          <Typography
            sx={{
              fontSize: { xs: 24, md: 28, lg: 32 },
              fontWeight: 'bold',
              mb: 1,
              fontFamily: 'Tajawal'
            }}
          >
            تفاصيل الكورس
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 14, md: 16 },
              opacity: 0.9,
              fontFamily: 'Tajawal'
            }}
          >
            معلومات شاملة عن الكورس
          </Typography>
          <Skeleton variant="rectangular" sx={{ width: 150, height: 7, mb: 1, mt: 1 }} />
          <Skeleton variant="rectangular" sx={{ width: 250, height: 7, mt: 1 }} />
        </Box>


        <Box sx={{ p: { xs: 3, md: 4 } }}>
          {loading ? (
            <Box sx={{ p: 3 }}>
              <Skeleton variant="rectangular" height={60} sx={{ mb: 3, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ mb: 2, borderRadius: 2 }} />
              <Skeleton variant="rectangular" height={40} sx={{ borderRadius: 2 }} />
            </Box>
          ) : courseData ? (
            <Stack spacing={4}>

              <Box sx={{
                p: 3,
                backgroundColor: '#f8f9fa',
                borderRadius: 2,
                border: '1px solid #e9ecef'
              }}>
                <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
                  <Box sx={{
                    width: 50,
                    height: 50,
                    borderRadius: '50%',
                    backgroundColor: '#667eea',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: 20
                  }}>
                    👨‍🏫
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontWeight: 'bold',
                        color: '#2c3e50',
                        fontSize: { xs: 16, md: 18 },
                        fontFamily: 'Tajawal'
                      }}
                    >
                      المدرس المسؤول
                    </Typography>
                    <Typography
                      sx={{
                        color: '#667eea',
                        fontSize: { xs: 16, md: 18 },
                        fontWeight: 'bold',
                        fontFamily: 'Tajawal'
                      }}
                    >
                      {teacherData?.name || courseData.teacherName || authUser?.displayName || 'غير محدد'}
                    </Typography>
                  </Box>
                </Stack>
              </Box>


              <Box>
                <Typography
                  sx={{
                    fontWeight: 'bold',
                    fontSize: { xs: 20, md: 24, lg: 28 },
                    color: '#2c3e50',
                    mb: 2,
                    fontFamily: 'Tajawal',
                    lineHeight: 1.3
                  }}
                >
                  {courseData.title}
                </Typography>
                <Typography
                  sx={{
                    color: '#6c757d',
                    fontSize: { xs: 14, md: 16 },
                    fontFamily: 'Tajawal',
                    lineHeight: 1.6
                  }}
                >
                  {courseData.subTitle}
                </Typography>
              </Box>


              <Box sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
                gap: 3
              }}>

                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#28a745',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16
                    }}>
                      🎓
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        المرحلة الدراسية
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        {courseData.gradeLevel}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#ffc107',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16
                    }}>
                      📚
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        الترم
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        {courseData.term}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>


                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#17a2b8',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16
                    }}>
                      📅
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        تاريخ البدء
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        {courseData.startDate && typeof courseData.startDate.toDate === 'function'
                          ? courseData.startDate.toDate().toLocaleDateString()
                          : 'غير محدد'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>


                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#dc3545',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16
                    }}>
                      🏁
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        تاريخ الانتهاء
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        {courseData.endDate && typeof courseData.endDate.toDate === 'function'
                          ? courseData.endDate.toDate().toLocaleDateString()
                          : 'غير محدد'}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>

                <Box sx={{
                  p: 3,
                  backgroundColor: '#f8f9fa',
                  borderRadius: 2,
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: '#e9ecef',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
                  }
                }}>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      backgroundColor: '#6f42c1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: 16
                    }}>
                      📹
                    </Box>
                    <Box>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        عدد المحاضرات
                      </Typography>
                      <Typography
                        sx={{
                          color: '#6c757d',
                          fontSize: { xs: 14, md: 16 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        {lectures.length} محاضرة
                      </Typography>
                    </Box>
                  </Stack>
                </Box>


                
                  
                
              </Box>

              <Box sx={{
                p: 4,
                backgroundColor: 'linear-gradient(135deg, #a1c4fd 0%, #8ed4f5ff 100%)',

                borderRadius: 3,
                textAlign: 'center',
                background: 'linear-gradient(135deg, #1569f1ff 0%, #c2e9fb 100%)',
                color: 'white'
              }}>
                <Typography
                  sx={{
                    fontSize: { xs: 16, md: 18 },
                    fontWeight: 'bold',
                    mb: 1,
                    fontFamily: 'Tajawal'
                  }}
                >
                  سعر الكورس
                </Typography>
                <Typography
                  sx={{
                    fontSize: { xs: 32, md: 40, lg: 48 },
                    fontWeight: 'bold',
                    fontFamily: 'Tajawal'
                  }}
                >
                  {courseData.price} ج.م
                </Typography>
              </Box>
            </Stack>
          ) : (
            <Box sx={{ p: 3 }}>
              <Alert
                severity="error"
                sx={{
                  width: '100%',
                  borderRadius: 2,
                  fontFamily: 'Tajawal'
                }}
              >
                لا يمكن تحميل بيانات الكورس
              </Alert>
            </Box>
          )}
        </Box>
      </Box>


      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>

          <Box sx={{
            width: '95vw',
            margin: '40px auto',
            ml: 3,
            backgroundColor: '#ffffff',
            borderRadius: 3,
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            overflow: 'hidden',
            border: '1px solid #e0e0e0'
          }}>

            <Box sx={{
              color: 'gray',
              p: 4,
            }}>
              <Skeleton variant="rectangular" sx={{ width: 300, height: 7, mt: 1 }} />
              <Typography
                sx={{
                  fontSize: { xs: 28, md: 32, lg: 36 },
                  fontWeight: 'bold',
                  mb: 1,
                  fontFamily: 'Tajawal'
                }}
              >
                محتوى الكورس
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16 },
                  opacity: 0.9,
                  fontFamily: 'Tajawal'
                }}
              >
                استكشف المحاضرات والمواد التعليمية
              </Typography>
              <Skeleton variant="rectangular" sx={{ width: 200, height: 7, mt: 1 }} />
              <Skeleton variant="rectangular" sx={{ width: 300, height: 7, mt: 1 }} />
            </Box>


            <Box sx={{ p: { xs: 2, md: 4 } }}>
              {loading ? (
                <Box sx={{ p: 3 }}>
                  <LinearProgress
                    sx={{
                      mb: 3,
                      height: 6,
                      borderRadius: 3,
                      backgroundColor: '#e9ecef',
                      '& .MuiLinearProgress-bar': {
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: 3
                      }
                    }}
                  />
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
                  <Skeleton variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
                </Box>
              ) : error ? (
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    mb: 3,
                    borderRadius: 2,
                    fontFamily: 'Tajawal'
                  }}
                >
                  {error}
                </Alert>
              ) : lectures.length === 0 ? (
                <Box sx={{
                  textAlign: 'center',
                  py: 6,
                  px: 3
                }}>
                  <Alert
                    severity="info"
                    sx={{
                      width: '100%',
                      borderRadius: 2,
                      fontFamily: 'Tajawal'
                    }}
                  >
                    لا يوجد محاضرات متاحة لهذا الكورس حالياً.
                  </Alert>
                </Box>
              ) : (
                <>
                  <Box sx={{
                    p: 3,
                    backgroundColor: '#f8f9fa',
                    borderRadius: 2,
                    border: '1px solid #e9ecef',
                    mb: 3
                  }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                      <Typography
                        sx={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: { xs: 16, md: 18 },
                          fontFamily: 'Tajawal'
                        }}
                      >
                        تقدم الكورس
                      </Typography>
                      <Chip
                        label={`${lectures.length} محاضرة`}
                        sx={{
                          backgroundColor: '#667eea',
                          color: 'white',
                          fontFamily: 'Tajawal',
                          fontWeight: 'bold'
                        }}
                      />
                    </Stack>
                    <LinearProgress
                      variant="determinate"
                      value={100}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: '#e9ecef',
                        '& .MuiLinearProgress-bar': {
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          borderRadius: 4
                        }
                      }}
                    />
                    <Typography
                      sx={{
                        mt: 1,
                        color: '#6c757d',
                        fontSize: { xs: 12, md: 14 },
                        fontFamily: 'Tajawal'
                      }}
                    >
                      جميع المحاضرات متاحة للعرض
                    </Typography>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={3}>
                    {lectures.map((lecture, index) => (
                      <Box key={index} sx={{
                        border: '1px solid #e0e0e0',
                        borderRadius: 3,
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                          transform: 'translateY(-2px)'
                        }
                      }}>

                        <Box
                          onClick={() => toggleLecture(index)}
                          sx={{
                            p: { xs: 2, md: 3 },
                            backgroundColor: '#f8f9fa',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s ease',
                            borderBottom: openLectures[index] ? '1px solid #e0e0e0' : 'none',
                            '&:hover': {
                              backgroundColor: '#e9ecef'
                            }
                          }}
                        >
                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            alignItems="center"
                            spacing={2}
                          >
                            <Stack direction="row" spacing={2} alignItems="center">
                              <Box sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                backgroundColor: '#667eea',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: 'white'
                              }}>
                                <DashboardCustomizeIcon sx={{ fontSize: 20 }} />
                              </Box>
                              <Box>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 'bold',
                                    color: '#2c3e50',
                                    fontFamily: 'Tajawal',
                                    fontSize: { xs: 16, md: 18 }
                                  }}
                                >
                                  {lecture.title || `محاضرة ${index + 1}`}
                                </Typography>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: '#6c757d',
                                    fontFamily: 'Tajawal',
                                    fontSize: { xs: 12, md: 14 }
                                  }}
                                >
                                  انقر لعرض المحتوى
                                </Typography>
                              </Box>
                            </Stack>
                            <Box sx={{
                              transition: 'transform 0.3s ease',
                              transform: openLectures[index] ? 'rotate(180deg)' : 'rotate(0deg)'
                            }}>
                              <KeyboardArrowDownIcon sx={{
                                color: '#667eea',
                                fontSize: { xs: 24, md: 28 }
                              }} />
                            </Box>
                          </Stack>
                        </Box>
                        <MUICollapse in={openLectures[index]}>
                          <Box sx={{
                            p: { xs: 2, md: 3 },
                            backgroundColor: 'white'
                          }}>
                            <Typography
                              sx={{
                                color: '#6c757d',
                                fontSize: { xs: 14, md: 16 },
                                fontFamily: 'Tajawal',
                                textAlign: 'center',
                                fontStyle: 'italic'
                              }}
                            >
                              محتوى المحاضرة متاح بعد الحجز
                            </Typography>
                          </Box>
                        </MUICollapse>
                      </Box>
                    ))}
                  </Stack>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{
            width: '90%',
            maxWidth: '1200px',
            margin: '20px auto 40px auto',
            display: 'flex',
            justifyContent: 'center',
            gap: { xs: 2, md: 3 },
            flexWrap: 'wrap'
          }}>
            {role !== 'teacher' && (
              <Button
                onClick={() => {
                  console.log("=== CourseDel Navigation Debug ===");
                  console.log("courseData:", courseData);
                  console.log("courseData.price:", courseData?.price);
                  console.log("courseId:", courseId);
                  console.log("Price type:", typeof courseData?.price);
                  console.log("CourseId type:", typeof courseId);
                  console.log("User role:", role);
                  console.log("Auth user:", authUser);
                  console.log("=====================================");
                  
                  navigate("/Checkout", {
                    state: { 
                      price: courseData?.price, 
                      courseId: courseId 
                    },
                  });
                }}
                variant="contained"
                sx={{
                  minWidth: { xs: 140, md: 160 },
                  height: { xs: 48, md: 52 },
                  fontFamily: "Tajawal",
                  fontWeight: "bold",
                  fontSize: { xs: 14, md: 16 },
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                  },
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
                }}
              >
                حجز الكورس
              </Button>
            )}


            <Button
              onClick={() => navigate('/courseMangement')}
              variant="outlined"
              sx={{
                minWidth: { xs: 140, md: 160 },
                height: { xs: 48, md: 52 },
                fontFamily: 'Tajawal',
                fontWeight: 'bold',
                fontSize: { xs: 14, md: 16 },
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#5a6fd8',
                  backgroundColor: 'rgba(102, 126, 234, 0.04)'
                },
                borderRadius: 2
              }}
            >
              الرجوع للكورسات
            </Button>
          </Box>
        </ThemeProvider>
      </CacheProvider>
    </>
  );
};

export default CourseDetails;
