import React, { useEffect, useState, type FormEvent, useContext } from 'react';
import {
  Box, TextField, Typography, Stack, InputLabel, MenuItem, Button, List, ListItem,
  Popover, Collapse, Skeleton, LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer, toast } from 'react-toastify';
import { UserContext } from '../../context/UserContext';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';


const theme = createTheme({
  direction: 'rtl',
  typography: {
    fontFamily: `'Tajawal', 'sans-serif'`,
  },
});
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const gradeOptions = [
  { value: 'الصف الاول الثانوي', label: 'الصف الاول الثانوي' },
  { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
  { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
];

const StatusOptions = [
  { value: 'حاليا', label: 'حاليا' },
  { value: 'مسجل', label: 'مسجل' }
];

interface Lecture {
  open: boolean;
  title?: string;
  videoUrl?: string;
  docFile?: File;
  docUrl?: string;
  txtFile?: File;
  txtUrl?: string;
  uploading?: boolean;
  uploadError?: string;
}

interface EditPopoverProps {
  open: boolean;
  anchorEl: HTMLElement | null;
  onClose: () => void;
  courseId: string;
  onCourseUpdated: () => void;
}

const EditPopover: React.FC<EditPopoverProps> = ({
  open,
  anchorEl,
  onClose,
  courseId,
  onCourseUpdated
}) => {
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
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [lectures, setLectures] = useState<Lecture[]>([{ open: false, title: '' }]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { video?: number; doc?: number; txt?: number } }>({});
  const { user } = useContext(UserContext) || {};

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        if (!courseId) return;
        const ref = doc(db, 'courses', courseId);
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
          setLectures((data.lectures || []).map((lec: any) => ({ ...lec, open: false })));
        }
      } catch (error) {
        console.error('Error fetching course data:', error);
      } finally {
        setLoading(false);
      }
    };
    if (courseId && open) {
      fetchCourseData();
    }
  }, [courseId, open]);

  useEffect(() => {
    if (user && user.name) {
      setTeacherName(user.name);
    }
  }, [user]);

  const toggleLecture = (index: number) => {
    const updated = lectures.map((item, i) =>
      i === index ? { ...item, open: !item.open } : item
    );
    setLectures(updated);
  };

  const handleClick = () => {
    setLectures([...lectures, { open: false, title: '' }]);
  };

  const handleLectureTitleChange = (index: number, value: string) => {
    const updated = [...lectures];
    updated[index].title = value;
    setLectures(updated);
  };

  const uploadLectureFile = async (
    type: 'video' | 'doc' | 'txt',
    file: File,
    lectureIndex: number
  ): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    let resourceType = 'image';
    let uploadPreset = '';
    if (type === 'video') {
      resourceType = 'video';
      uploadPreset = 'videos';
    } else if (type === 'doc' || type === 'txt') {
      resourceType = 'raw';
      uploadPreset = 'raw_files';
    }
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', uploadPreset);
    formData.append('context', `display_name=${file.name}`);
    try {
      setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: true, uploadError: '' } : lec));

      setUploadProgress(prev => ({
        ...prev,
        [lectureIndex]: { ...prev[lectureIndex], [type]: 0 }
      }));

      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const res = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent: any) => {
          const percent = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          setUploadProgress(prev => ({
            ...prev,
            [lectureIndex]: { ...prev[lectureIndex], [type]: percent }
          }));
        }
      });
      setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: false, uploadError: '' } : lec));
      setUploadProgress(prev => ({
        ...prev,
        [lectureIndex]: { ...prev[lectureIndex], [type]: 100 }
      }));
      return res.data.secure_url;
    } catch (error) {
      setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: false, uploadError: `فشل رفع ${type}` } : lec));
      setUploadProgress(prev => ({
        ...prev,
        [lectureIndex]: { ...prev[lectureIndex], [type]: 0 }
      }));
      alert(`فشل رفع ${type}`);
      return null;
    }
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (!courseId) return;
      const ref = doc(db, 'courses', courseId);
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
        lectures: lectures.map((lecture) => ({
          title: lecture.title || '',
          videoUrl: lecture.videoUrl || '',
          docUrl: lecture.docUrl || '',
          txtUrl: lecture.txtUrl || ''
        }))
      });
      toast.success('تم تحديث الكورس بنجاح', {
        position: 'top-left',
        autoClose: 3000,
      });
      onCourseUpdated();
      onClose();
    } catch (error) {
      toast.error('فشل في تحديث الكورس', {
        position: 'top-left',
        autoClose: 3000,
      });
    }
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    if (!file) return null;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "images");
    formData.append("folder", "images");
    formData.append("context", `display_name=${file.name}`);
    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });
      return res.data.secure_url;
    } catch (error) {
      alert('فشل رفع الصورة');
      return null;
    }
  };

  if (loading) {
    return (
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>
          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              sx: {
                width: '40vw',
                maxWidth: 1000,
                maxHeight: '90vh',
                overflow: 'auto'
                , direction: 'lrt',
              }
            }}
          >
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'ltr' }} />
            <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="20%" height={80} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
            <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />

          </Popover>
        </ThemeProvider>
      </CacheProvider>

    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={onClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          PaperProps={{
            sx: {
              width: '40vw',
              maxWidth: 1000,
              maxHeight: '90vh',
              overflow: 'auto'
              , direction: 'rtl',
            }
          }}
        >

          <Box
            component="form"
            sx={{
              p: 3,
              backgroundColor: 'white',
              direction: 'rtl'
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleEdit}
          >
            <Stack direction="row" spacing={2} sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center' }}>
              <Button onClick={onClose} sx={{ minWidth: 'auto' }}>
                <CloseIcon />
              </Button>
              <Typography variant="h5" fontWeight="bold">تعديل الكورس</Typography>

            </Stack>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 55 }}>
                اسم المدرس
              </InputLabel>
              <Typography sx={{ p: 2, borderRadius: 1, direction: 'ltr' }}>
                {teacherName || '---'}
              </Typography>
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 53 }}>
                عنوان الكورس
              </InputLabel>
              <TextField
                label="ادخل عنوان الكورس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ direction: 'ltr' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 53 }}>
                وصف الكورس
              </InputLabel>
              <TextField
                label="ادخل وصف الكورس"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                fullWidth
                sx={{ direction: 'ltr' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 53 }}>
                الصف الدراسي
              </InputLabel>
              <TextField
                select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                label="اختر"
                fullWidth
                sx={{ direction: 'ltr' }}

              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} >{option.label}</MenuItem>
                ))}
              </TextField>
            </Box>


            <Box sx={{ mb: 2, textAlign: 'right' }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 46 }}>
                تحميل صورة الكورس
              </InputLabel>

              <Button
                variant="outlined"
                component="label"
                sx={{ fontFamily: 'Tajawal', fontWeight: 'bold', mr: 56 }}
              >
                اختر صورة
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setImage(file);
                    const url = await uploadFile(file);
                    if (url) {
                      setUploadedImgUrl(url);
                      setImageUrl(url);
                    }
                  }}
                />
              </Button>

              {(uploadedImgUrl || imageUrl) && (
                <Box sx={{ mt: 2, marginRight: 53 }}>
                  <img
                    src={uploadedImgUrl || imageUrl}
                    alt="Uploaded"
                    width="120"
                    style={{
                      borderRadius: "8px",
                      boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                      objectFit: "cover",

                    }}
                  />
                </Box>
              )}
            </Box>


            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 61 }}>
                السعر
              </InputLabel>
              <TextField
                label="ج 0.00"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                fullWidth
                sx={{ direction: 'ltr' }}
              />
            </Box>

            <Typography sx={{ fontSize: "26px", fontWeight: 700, color: '#374151', mb: 2, mr: 53 }}>
              الجدول الزمني
            </Typography>

            <Stack direction={"row"} spacing={4} sx={{ mb: 2, mr: 28 }}>
              <Box sx={{}}>
                <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mr: 5 }}>
                  تاريخ البداية
                </InputLabel>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150, ml: 3 }}
                />
              </Box>
              <Box sx={{}}>
                <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mr: 6 }}>
                  تاريخ النهاية
                </InputLabel>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150 }}
                />
              </Box>
            </Stack>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 61 }}>
                السعة
              </InputLabel>
              <TextField
                label="عدد الطلاب"
                type="number"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                fullWidth
                sx={{ direction: 'ltr' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 47 }}>
                عدد الطلاب المسجلين
              </InputLabel>
              <TextField
                label="عدد الطلاب المسجلين"
                type="number"
                value={enrolledCount}
                onChange={(e) => setEnrolledCount(Number(e.target.value))}
                fullWidth
                sx={{ direction: 'ltr' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 61 }}>
                الحالة
              </InputLabel>
              <TextField
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                label="اختر الحالة"
                fullWidth
                sx={{ direction: 'ltr' }}
              >
                {StatusOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 61 }}>
                الترم
              </InputLabel>
              <TextField
                select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                label="اختر الترم"
                fullWidth
                sx={{ direction: 'ltr' }}
              >
                <MenuItem value="الفصل الدراسي الاول">الفصل الدراسي الاول</MenuItem>
                <MenuItem value="الفصل الدراسي الثاني">الفصل الدراسي الثاني</MenuItem>
              </TextField>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 56 }}>
                المحاضرات
              </Typography>

              {lectures.map((lecture, index) => (
                <Box key={index} sx={{ mb: 2 }}>

                  <Stack
                    direction={"row"}

                    sx={{ ml: 10, mb: 2, gap: 2, width: "35vw" }}
                  >


                    <Box>
                      <Button
                        variant="outlined"
                        component="label"
                        onClick={handleClick}
                        sx={{ width: 30, minWidth: 30, height: 40, mt: 2 }}
                        disabled={loading}
                      >
                        +
                      </Button>
                    </Box>

                    <Box
                      onClick={() => toggleLecture(index)}
                      sx={{
                        p: 2,
                        border: '1px solid gray',
                        borderRadius: 2,
                        cursor: 'pointer',

                        width: "100%",


                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        {lecture.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        <Typography variant="h6">المحاضرة {index + 1}</Typography>

                      </Stack>
                    </Box>

                  </Stack>

                  <Collapse in={lecture.open}>
                    <Box sx={{ mt: 1, pl: 2 }}>
                      <TextField
                        label="عنوان المحاضرة"
                        value={lecture.title || ''}
                        onChange={e => handleLectureTitleChange(index, e.target.value)}

                        sx={{ mb: 2, mt: 2, direction: 'ltr', width: '90.5%', mr: 7, borderRedius: 2 }}
                      />
                      <List>
                        <ListItem>
                          <Stack direction={"row"} sx={{ gap: 6 }}>

                            {lecture.videoUrl && (
                              <Box >

                                <video
                                  width="300px"
                                  height="200px"
                                  controls
                                  src={lecture.videoUrl}
                                  style={{
                                    borderRadius: '8px',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                    marginBottom: '10px'
                                  }}
                                />
                              </Box>
                            )}
                            <Box sx={{ flex: 1 }}>
                              <InputLabel sx={{ fontSize: "24px", fontWeight: '700', mb: 1 }}>
                                فيديو توضيحي
                              </InputLabel>

                              <Button
                                variant="outlined"
                                component="label"
                                sx={{
                                  fontFamily: 'Tajawal',
                                  fontWeight: 700,
                                  mr: 3,
                                  fontSize: '16px',
                                  height: '48px',
                                  width: 150,

                                  textAlign: 'center'
                                }}
                              >
                                اختر فيديو
                                <input
                                  type="file"
                                  accept="video/*"
                                  disabled={lecture.uploading}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const url = await uploadLectureFile('video', file, index);
                                    if (!url) return;
                                    const updatedLectures = [...lectures];
                                    updatedLectures[index].videoUrl = url;
                                    setLectures(updatedLectures);
                                  }}
                                  hidden
                                />


                              </Button>

                              {uploadProgress[index]?.video !== undefined && lecture.uploading && (
                                <Box sx={{ width: '80%', mt: 1 }}>
                                  <LinearProgress variant="determinate" value={uploadProgress[index]?.video || 0} />
                                  <Typography variant="caption">{uploadProgress[index]?.video || 0}%</Typography>
                                </Box>
                              )}

                            </Box>

                          </Stack>
                        </ListItem>
                        <ListItem>
                          <Stack direction={"row"} sx={{ gap: 6 }}  >
                            {lecture.docUrl && (
                              <Box sx={{ flexGrow: 2 }}>

                                <iframe
                                  src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(lecture.docUrl)}`}
                                  width="300px"
                                  height="200px"
                                  style={{
                                    borderRadius: '8px',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                    marginBottom: '10px',
                                    border: 'none'
                                  }}
                                />

                              </Box>
                            )}
                            <Stack direction={"column"}>
                              <Box sx={{}}>
                                <InputLabel sx={{ fontSize: "24px", fontWeight: '700', mb: 1 }}> Word رفع ملف </InputLabel>
                                <Button
                                  variant="outlined"
                                  component="label"
                                  sx={{
                                    fontFamily: 'Tajawal',
                                    fontWeight: 'bold',


                                    fontSize: '16px',
                                    height: '48px',
                                    display: 'inline-block',
                                    width: 150,
                                    textAlign: 'center',
                                    lineHeight: '40px',
                                    mr: 3

                                  }}
                                >
                                  DOC اختر ملف
                                  <input
                                    type="file"
                                    accept=".doc,.docx"
                                    disabled={lecture.uploading}
                                    hidden
                                    onChange={async (e) => {
                                      const file = e.target.files?.[0];
                                      if (!file) return;

                                      const updatedLectures = [...lectures];
                                      updatedLectures[index].docFile = file;

                                      const url = await uploadLectureFile('doc', file, index);
                                      if (url) {
                                        updatedLectures[index].docUrl = url;
                                      }

                                      setLectures(updatedLectures);
                                    }}
                                  />
                                </Button>
                              </Box>

                              {uploadProgress[index]?.doc !== undefined && lecture.uploading && (
                                <Box sx={{ width: '80%', mt: 1 }}>
                                  <LinearProgress variant="determinate" value={uploadProgress[index]?.doc || 0} />
                                  <Typography variant="caption">{uploadProgress[index]?.doc || 0}%</Typography>
                                </Box>
                              )}

                            </Stack>
                          </Stack>
                        </ListItem>
                        <ListItem>
                          <Stack direction={"row"} sx={{ gap: 6 }}  >
                            {lecture.txtUrl && (
                              <Box >

                                <iframe
                                  src={
                                    lecture.txtUrl}
                                  width="300px"
                                  height="200px"
                                  style={{
                                    borderRadius: '8px',
                                    boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                    marginBottom: '10px',
                                    border: 'none'
                                  }}
                                />

                              </Box>
                            )}
                            <Box>
                              <InputLabel sx={{
                                fontSize: "24px", fontWeight: '700', mb: 1,
                              }}>   TXTرفع ملف </InputLabel>
                              <Button
                                variant="outlined"
                                component="label"
                                sx={{
                                  fontFamily: 'Tajawal',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  height: '48px',
                                  width: 150,
                                  mr: 3
                                }}
                              >
                                TXT اختر ملف
                                <input
                                  type="file"
                                  accept=".txt"
                                  hidden
                                  disabled={lecture.uploading}
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const updatedLectures = [...lectures];
                                    updatedLectures[index].txtFile = file;
                                    const url = await uploadLectureFile('txt', file, index);
                                    if (url) {
                                      updatedLectures[index].txtUrl = url;
                                    }
                                    setLectures(updatedLectures);
                                  }}
                                />
                              </Button>

                              {uploadProgress[index]?.txt !== undefined && lecture.uploading && (
                                <Box sx={{ width: '80%', mt: 1 }}>
                                  <LinearProgress variant="determinate" value={uploadProgress[index]?.txt || 0} />
                                  <Typography variant="caption">{uploadProgress[index]?.txt || 0}%</Typography>
                                </Box>
                              )}
                            </Box>
                          </Stack>
                        </ListItem>
                      </List>
                    </Box>

                  </Collapse>
                </Box>
              ))}

            </Box>

            <Stack direction={"row"} sx={{ gap: 1 }}>

              <Button
                variant="outlined"
                type="submit"
                sx={{
                  fontFamily: 'Tajawal',
                  fontWeight: 'bold',


                  fontSize: '16px',
                  height: '48px',
                  display: 'inline-block',
                  width: 140,
                  textAlign: 'center',
                  lineHeight: '40px'
                }}>
                حفظ التعديلات
              </Button>
              <Button variant="outlined" onClick={onClose} sx={{
                fontSize: '16px',
                height: '48px',
                display: 'inline-block',
                width: 140,
                textAlign: 'center',
                lineHeight: '40px',
                fontFamily: 'Tajawal',
                fontWeight: 'bold',
              }}>
                إلغاء
              </Button>
            </Stack>
          </Box>

          <ToastContainer />
        </Popover>
      </ThemeProvider>
    </CacheProvider>
  );
};

export default EditPopover; 