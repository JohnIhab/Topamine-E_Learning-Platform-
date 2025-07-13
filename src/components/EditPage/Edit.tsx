import React, { useEffect, useState, FormEvent } from 'react';
import {
  Box, TextField, Typography, Stack, InputLabel, MenuItem, Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../Header/Header';
import ResponsiveDrawer from "../Aside/ResponsiveDrawer";
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer, toast } from 'react-toastify';

const theme = createTheme({ direction: 'rtl' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const gradeOptions = [
  { value: 'الصف الاول الثانوي', label: 'الصف الاول الثانوي' },
  { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
  { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
];

const StatusOptions = [
  { value: 'active', label: 'active' },
  { value: 'draft', label: 'draft' }
];

const Edit: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [status, setStatus] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [capacity, setCapacity] = useState<number>(0);
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!id) return;
        const ref = doc(db, 'courses', id);
        const docSnap = await getDoc(ref);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setTitle(data.title || '');
          setSubTitle(data.subTitle || '');
          setGradeLevel(data.gradeLevel || '');
          setTerm(data.term || '');
          setStatus(data.status || '');
          setPrice(data.price || 0);
          setStartDate(data.startDate?.toDate().toISOString().slice(0, 10) || '');
          setEndDate(data.endDate?.toDate().toISOString().slice(0, 10) || '');
          setCapacity(data.capacity || 0);
          setEnrolledCount(data.enrolledCount || 0);
          setImageUrl(data.imageUrl || '');
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCourseData();
  }, [id]);

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!id) return;
      const ref = doc(db, 'courses', id);
      await updateDoc(ref, {
        title,
        subTitle,
        gradeLevel,
        term,
        status,
        price: Number(price),
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        capacity: Number(capacity),
        enrolledCount: Number(enrolledCount),
        imageUrl,
      });
      toast.success('تم تحديث الكورس  بنجاح ', {
        position: 'top-left',
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate('/courseMangement');
      }, 3000);
    } catch (error) {
      toast.error('فشل في تحديث الكورس', {
        position: 'top-left',
        autoClose: 3000,
      });
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 50 }}>Loading...</div>;

  return (
    <>
      <ResponsiveDrawer />
      <Box sx={{ backgroundColor: '#f5f5f5', width: '99vw', direction: 'rtl' }}>
        <Header />
        <Box
          component="form"
          sx={{
            width: '77%',
            mr: 38,
            border: '1px solid gray',
            borderRadius: 2,
            backgroundColor: 'white',
            mt: 3,
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleEdit}
        >
          <Box sx={{ border: '1px solid gray', mt: 2, width: '95%', borderRadius: 2, mr: 3 }}>
            <Stack direction="row" spacing={2} sx={{ mb: 2, mt: 2, pr: 2, justifyContent: 'space-between' }}>
              <Typography fontWeight="bold">تعديل الكورس </Typography>
              <CloseIcon />
            </Stack>
          </Box>

     
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  الصف الدراسي
                </InputLabel>
                <TextField
                  select
                  label="اختر الصف"
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  sx={{ width: '80%', ml: 15 }}
                >
                  {gradeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </ThemeProvider>
          </CacheProvider>

      
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ fontSize: 20, fontWeight: 'bold', ml: 15 }}>
                  عنوان الكورس
                </InputLabel>
                <TextField
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  label="أدخل عنوان الكورس"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

        
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  الوصف
                </InputLabel>
                <TextField
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  label="أدخل وصف الكورس"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

        
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  السعر
                </InputLabel>
                <TextField
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  label="0.00 $"
                  type="number"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

          <Typography sx={{ mr: 17, fontSize: 20, fontWeight: 'bold', mt: 2, mb: 2, color: 'gray' }}>الجدول الزمني</Typography>
          <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <Box sx={{ m: 1 }}>
                  <InputLabel shrink sx={{ ml: 18, fontSize: 20, fontWeight: 'bold' }}>تاريخ البداية</InputLabel>
                  <TextField
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    sx={{ width: 200, ml: 10 }}
                  />
                </Box>
              </ThemeProvider>
            </CacheProvider>
            <CacheProvider value={cacheRtl}>
              <ThemeProvider theme={theme}>
                <Box sx={{ m: 1 }}>
                  <InputLabel shrink sx={{ ml: 18, fontSize: 20, fontWeight: 'bold' }}>تاريخ النهاية</InputLabel>
                  <TextField
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    sx={{ width: 200, ml: 10 }}
                  />
                </Box>
              </ThemeProvider>
            </CacheProvider>
          </Stack>

      
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  السعة
                </InputLabel>
                <TextField
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  label="عدد الطلاب"
                  type="number"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

        
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  عدد الطلاب المسجلين
                </InputLabel>
                <TextField
                  value={enrolledCount}
                  onChange={(e) => setEnrolledCount(Number(e.target.value))}
                  label="عدد الطلاب المسجلين"
                  type="number"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  رابط الصورة
                </InputLabel>
                <TextField
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  label="رابط الصورة"
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>
            </ThemeProvider>
          </CacheProvider>

        
          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>
                  الحالة
                </InputLabel>
                <TextField
                  select
                  label="اختر الحالة"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  sx={{ width: '80%', ml: 15 }}
                >
                  {StatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>
            </ThemeProvider>
          </CacheProvider>

        
          <Button type="submit" variant="contained" color="primary" sx={{ ml: 15, mt: 3, mb: 3 }}>
            حفظ التعديلات
          </Button>
        </Box>
      </Box>
      <ToastContainer />
    </>
  );
};

export default Edit; 