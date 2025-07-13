import React, { useState } from 'react';
import {
  Box, TextField, Typography, Stack, InputLabel, Button, MenuItem,List, ListItem, ListItemText,Collapse
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Header from '../Header/Header';
import ResponsiveDrawer from '../Aside/ResponsiveDrawer';
// import Aside from '../Aside';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase.ts';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer, toast } from 'react-toastify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import HelpIcon from '@mui/icons-material/Help';

interface Lecture {
  open: boolean;
}

const theme = createTheme({ direction: 'rtl' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const gradeOptions = [
  { value: 'الصف الاول الثانوي', label: 'الصف الاول الثانوي' },
  { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
  { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
];

const termOptions = [
  { value: 'الفصل الدراسي الاول', label: 'الفصل الدراسي الاول' },
  { value: 'الفصل الدراسي الثاني', label: 'الفصل الدراسي الثاني' }
];
const StatusOptions = [
  { value: 'active', label: 'active' },
  { value: 'draft', label: 'draft' }
];

const NewCourse: React.FC = () => {
  const [lectures, setLectures] = useState<Lecture[]>([{ open: false }]);
  
    const toggleLecture = (index: number) => {
      const updated = lectures.map((item, i) =>
        i === index ? { ...item, open: !item.open } : item
      );
      setLectures(updated);
    };
  
    const handleClick = () => {
      setLectures([...lectures, { open: false }]);
    };
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
  const [isUploading, setIsUploading] = useState<boolean>(false);

  const navigate = useNavigate();

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
      });
      setImageUrl(base64);
    } catch (error) {
      console.error("error", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleCreate = async () => {
    // const currentUser = auth.currentUser;
    if (
      !title.trim() || !subTitle.trim() || !gradeLevel || !term ||
      !status.trim() || !price || !startDate || !endDate || !capacity || !imageUrl
    ) {
      alert("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      alert("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }
    try {
      const course = collection(db, 'courses');
      const docRef = await addDoc(course, {
        title,
        subTitle,
        gradeLevel,
        term,
        status,
        price: Number(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        teacherId: "guest-user",
        teacherEmail: "guest@example.com",
        capacity: Number(capacity),
        enrolledCount: Number(enrolledCount),
        imageUrl,
        createdAt: new Date(),
      });
      await updateDoc(docRef, { id: docRef.id });
      toast.success("تم اضافة الكورس بنجاح", {
        position: 'top-left',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/courseMangement');
      }, 3000);
    } catch (error) {
      console.error(error);
      alert("حدث خطأ أثناء حفظ البيانات");
    }
  };

  return (
    <Box>
      <ResponsiveDrawer/>
      <Box sx={{ backgroundColor: '#f5f5f5', width: '99vw', direction: 'rtl' }}>
        <Header />
        <Box
          component="form"
          sx={{ width: '77%', mr: 39, borderRadius: 2, backgroundColor: 'white', mt: 3, pt: 2 }}
          noValidate autoComplete="off"
        >
          <Box sx={{ border: '1px solid gray', mt: 2, width: '95%', borderRadius: 2, mr: 4 }}>
            <Stack direction={'row'} spacing={1} sx={{ mb: 2, mt: 2, mr: 2, pl: 2, display: 'flex', justifyContent: 'space-between' }}>
              <Typography onClick={handleCreate} sx={{ cursor: 'pointer' }}>اضافة كورس جديد</Typography>
              <CloseIcon />
            </Stack>
          </Box>

          <CacheProvider value={cacheRtl}>
            <ThemeProvider theme={theme}>
              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>عنوان الكورس</InputLabel>
                <TextField
                  label="ادخل عنوان الكورس"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>وصف الكورس</InputLabel>
                <TextField
                  label="ادخل وصف الكورس"
                  value={subTitle}
                  onChange={(e) => setSubTitle(e.target.value)}
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>الصف الدراسي</InputLabel>
                <TextField
                  select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  label="اختر"
                  sx={{ width: '80%', ml: 15 }}
                >
                  {gradeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ m: 2, ml: 17 }}>
                <InputLabel shrink sx={{ mr: 1, fontSize: 20, fontWeight: 'bold' }}>تحميل صورة</InputLabel>
                <input type="file" accept="image/*" onChange={handleUpload} />
                {isUploading && (
                  <Typography sx={{ ml: 80, mt: 1, color: 'orange' }}>
                    يتم تحميل الصورة...
                  </Typography>
                )}
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>السعر</InputLabel>
                <TextField
                  label="$ 0.00"
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>

              <Typography sx={{ ml: 17, fontSize: 20, fontWeight: 'bold', mt: 2, mb: 2, color: 'gray' }}>الجدول الزمني</Typography>
              <Stack direction="row" spacing={1} sx={{ ml: 2 }}>
                <CacheProvider value={cacheRtl}>
                  <ThemeProvider theme={theme}>
                    <Box sx={{ m: 1 }}>
                      <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>تاريخ البداية</InputLabel>
                      <TextField
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ width: '80%', ml: 15 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </ThemeProvider>
                </CacheProvider>
                <CacheProvider value={cacheRtl}>
                  <ThemeProvider theme={theme}>
                    <Box sx={{ m: 1 }}>
                      <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>تاريخ النهاية</InputLabel>
                      <TextField
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ width: '80%', ml: 15 }}
                        InputLabelProps={{ shrink: true }}
                      />
                    </Box>
                  </ThemeProvider>
                </CacheProvider>
              </Stack>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>السعة</InputLabel>
                <TextField
                  label="عدد الطلاب"
                  type="number"
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>عدد الطلاب المسجلين</InputLabel>
                <TextField
                  label="عدد الطلاب المسجلين"
                  type="number"
                  value={enrolledCount}
                  onChange={(e) => setEnrolledCount(Number(e.target.value))}
                  sx={{ width: '80%', ml: 15 }}
                />
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>الحالة</InputLabel>
                <TextField
                  select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  label="اختر الحالة"
                  sx={{ width: '80%', ml: 15 }}
                >
                  {StatusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ m: 2 }}>
                <InputLabel shrink sx={{ ml: 15, fontSize: 20, fontWeight: 'bold' }}>الترم</InputLabel>
                <TextField
                  select
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  label="اختر الترم"
                  sx={{ width: '80%', ml: 15 }}
                >
                  {termOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                  ))}
                </TextField>
              </Box>
                
    <Box sx={{ m: 2, width: "60vw", ml: 13 }}>
      {lectures.map((lecture, index) => (
         
        <Box key={index} sx={{ mb: 2 }}>
           
          
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              p: 2,
              border: '1px solid gray',
              borderRadius: 2,
              cursor: 'pointer'
            }}
            onClick={() => toggleLecture(index)}
          >
              <Typography variant="h6">المحاضرة {index + 1}</Typography>
            {lecture.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            {/* <Typography variant="h6">المحاضرة {index + 1}</Typography> */}
          </Stack>
         

          <Collapse in={lecture.open}>
            <Box sx={{ mt: 1, pl: 2 }}>
              <List>
                <ListItem>
                  <Stack direction={'row'} spacing={1}>
                    <ListItemText primary="فيديو توضيحي" />
                    <PlayCircleIcon />
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack direction={'row'} spacing={1}>
                    <ListItemText primary="ملف للمحاضرة" />
                    <DescriptionIcon />
                  </Stack>
                </ListItem>
                <ListItem>
                  <Stack direction={'row'} spacing={1}>
                    <ListItemText primary="اختبار على المحاضرة" />
                    <HelpIcon />
                  </Stack>
                </ListItem>
              </List>
            </Box>
       
          </Collapse>
        </Box>
      ))}

      <Button variant="contained" onClick={handleClick} sx={{ml:115,width:30}}>+</Button>
    </Box>
              <Button variant="contained" color="primary" sx={{ ml: 15, mt: 3, mb: 3 }} onClick={handleCreate}>
                حفظ الكورس
              </Button>
            </ThemeProvider>
          </CacheProvider>
        </Box>
      </Box>
      <ToastContainer />
    </Box>
  );
};

export default NewCourse; 