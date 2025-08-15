
import React, { useEffect, useState, type FormEvent, useContext } from 'react';
import {
  Box, TextField, Typography, Stack, InputLabel, MenuItem, Button, List, ListItem,
  Dialog, Collapse, Skeleton, LinearProgress
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


const theme = createTheme({ direction: 'rtl' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const gradeOptions = [
  { value: 'الصف الاول الثانوي', label: 'الصف الاول الثانوي' },
  { value: 'الصف الثاني الثانوي', label: 'الصف الثاني الثانوي' },
  { value: 'الصف الثالث الثانوي', label: 'الصف الثالث الثانوي' }
];



interface Lecture {
  open: boolean;
  title?: string;
  videoUrl?: string;
  docFile?: File;
  docUrl?: string;
  txtFile?: File;
  txtUrl?: string;
  uploadError?: string;
  videoTitle?: string;
  docTitle?: string;
  txtTitle?: string;
  uploadingVideo?: boolean;
  uploadingDoc?: boolean;
  uploadingTxt?: boolean;
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
  const [price, setPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [enrolledCount, setEnrolledCount] = useState<number>(0);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [teacherName, setTeacherName] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [lectures, setLectures] = useState<Lecture[]>([{ open: false, title: '' }]);
  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { video?: number; doc?: number; txt?: number } }>({});
  const { user } = useContext(UserContext) || {};
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [docTitle, setDocTitle] = useState<string>('');
  const [txtTitle, setTxtTitle] = useState<string>('');


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
          setPrice(data.price || 0);
          setStartDate(data.startDate?.toDate().toISOString().slice(0, 10) || '');
          setEndDate(data.endDate?.toDate().toISOString().slice(0, 10) || '');
          setEnrolledCount(data.enrolledCount || 0);
          setImageUrl(data.imageUrl || '');
          setLectures((data.lectures || []).map((lec: any) => ({ ...lec, open: false })));
          setVideoTitle(data.videoTitle || '');
          setDocTitle(data.docTitle || '');
          setTxtTitle(data.txtTitle || '');
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
      setLectures(prev => prev.map((lec, i) => {
        if (i !== lectureIndex) return lec;
        if (type === 'video') return { ...lec, uploadingVideo: true, uploadError: '' };
        if (type === 'doc') return { ...lec, uploadingDoc: true, uploadError: '' };
        if (type === 'txt') return { ...lec, uploadingTxt: true, uploadError: '' };
        return lec;
      }));
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
      setLectures(prev => prev.map((lec, i) => {
        if (i !== lectureIndex) return lec;
        if (type === 'video') return { ...lec, uploadingVideo: false, uploadError: '' };
        if (type === 'doc') return { ...lec, uploadingDoc: false, uploadError: '' };
        if (type === 'txt') return { ...lec, uploadingTxt: false, uploadError: '' };
        return lec;
      }));
      setUploadProgress(prev => ({
        ...prev,
        [lectureIndex]: { ...prev[lectureIndex], [type]: 100 }
      }));
      return res.data.secure_url;
    } catch (error) {
      setLectures(prev => prev.map((lec, i) => {
        if (i !== lectureIndex) return lec;
        if (type === 'video') return { ...lec, uploadingVideo: false, uploadError: `فشل رفع ${type}` };
        if (type === 'doc') return { ...lec, uploadingDoc: false, uploadError: `فشل رفع ${type}` };
        if (type === 'txt') return { ...lec, uploadingTxt: false, uploadError: `فشل رفع ${type}` };
        return lec;
      }));
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
        enrolledCount: Number(enrolledCount),
        imageUrl,
        lectures: lectures.map((lecture) => ({
          title: lecture.title || '',
          videoUrl: lecture.videoUrl || '',
          docUrl: lecture.docUrl || '',
          txtUrl: lecture.txtUrl || '',
          videoTitle: lecture.videoTitle || '',
          docTitle: lecture.docTitle || '',
          txtTitle: lecture.txtTitle || '',
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
          <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
              sx: {
                width: '40vw',
                maxWidth: 1000,
                maxHeight: '90vh',
                overflow: 'auto',
              }
            }}
          >
            <Box sx={{ p: 4, ml: 2 }}>
              <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="10%" height={10} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />
              <Skeleton variant="rectangular" width="90%" height={60} sx={{ mb: 2, mr: 5, direction: 'rtl' }} />

            </Box>
          </Dialog>
        </ThemeProvider>
      </CacheProvider>
    );
  }

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="lg"
          fullWidth
          PaperProps={{
            sx: {
              width: '40vw',
              maxWidth: 1000,
              maxHeight: '90vh',
              overflow: 'auto',
              direction: 'rtl',
              fontFamily: 'Tajawal'
            }
          }}
        >


          <Box
            component="form"
            sx={{
              p: 3,
              backgroundColor: 'white',
              direction: 'rtl',
              fontFamily: 'Tajawal'
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleEdit}
          >
            <Stack direction="row" sx={{ mb: 3, justifyContent: 'space-between', alignItems: 'center', mr: 4 }}>
              <Button variant="outlined" onClick={onClose} sx={{
                fontSize: '16px',
                height: '35px',
                display: 'inline-block',
                width: 25,
                textAlign: 'center',
                lineHeight: '35px',
                fontFamily: 'Tajawal',
                fontWeight: 'bold',
              }}>
                <CloseIcon />
              </Button>
              <Typography variant="h5" fontWeight="bold" sx={{ color: '#1976d2', fontFamily: 'Tajawal' }}>تعديل الكورس</Typography>

            </Stack>


            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 49, fontFamily: 'Tajawal' }}>
                عنوان الكورس
              </InputLabel>
              <TextField
                label="ادخل عنوان الكورس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                fullWidth
                sx={{ direction: 'ltr', fontFamily: 'Tajawal' }}


              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 49, fontFamily: 'Tajawal' }}>
                وصف الكورس
              </InputLabel>
              <TextField
                label="ادخل وصف الكورس"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                fullWidth
                sx={{ direction: 'ltr', fontFamily: 'Tajawal' }}
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 48, fontFamily: 'Tajawal' }}>
                الصف الدراسي
              </InputLabel>
              <TextField
                select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                label="اختر"
                fullWidth
                sx={{ direction: 'ltr', fontFamily: 'Tajawal' }}

              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value} >{option.label}</MenuItem>
                ))}
              </TextField>
            </Box>


            <Box sx={{ mb: 2, textAlign: 'right' }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 40, fontFamily: 'Tajawal' }}>
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
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 59, fontFamily: 'Tajawal' }}>
                السعر
              </InputLabel>
              <TextField
                label="ج 0.00"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                fullWidth
                sx={{ direction: 'ltr', fontFamily: 'Tajawal' }}
              />
            </Box>

            <Typography sx={{ fontSize: "26px", fontWeight: 700, color: '#374151', mb: 2, mr: 48, fontFamily: 'Tajawal' }}>
              الجدول الزمني
            </Typography>

              <Box sx={{ mb: 2}}>
                <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mr: 2, fontFamily: 'Tajawal' }}>
                  تاريخ البداية
                </InputLabel>
                <TextField
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150, direction: 'ltr', fontFamily: 'Tajawal' }}
                  inputProps={{
                    min: new Date().toISOString().split('T')[0], 
                  }}
                  helperText="لا يمكن اختيار تاريخ سابق لليوم"
                />
              </Box>

              <Box sx={{ mb: 2}}>
                <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mr: 2, fontFamily: 'Tajawal' }}>
                  تاريخ النهاية
                </InputLabel>
                <TextField
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  sx={{ width: 150,direction: 'ltr', fontFamily: 'Tajawal' }}
                  inputProps={{
                    min: startDate || new Date().toISOString().split('T')[0], 
                  }}
                  helperText="لا يمكن اختيار تاريخ سابق لتاريخ البداية"
                />
              </Box>



            <Box sx={{ mb: 3 }}>
              <InputLabel shrink sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 61, fontFamily: 'Tajawal' }}>
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
              <Typography sx={{ fontSize: "24px", fontWeight: 700, color: '#374151', mb: 1, mr: 51, fontFamily: 'Tajawal' }}>
                المحاضرات
              </Typography>

              {lectures.map((lecture, index) => (
                <Box key={index} sx={{ mb: 2 }}>

                  <Stack
                    direction={"row"}

                    sx={{ ml: 10, mb: 2, gap: 2, width: "35vw", fontFamily: 'Tajawal' }}
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
                        <Typography variant="h6" sx={{ fontFamily: 'Tajawal' }}>المحاضرة {index + 1}</Typography>

                      </Stack>
                    </Box>

                  </Stack>

                  <Collapse in={lecture.open}>
                    <Box sx={{ mt: 1, pl: 2 }}>
                      <TextField
                        label="عنوان المحاضرة"
                        value={lecture.title || ''}
                        onChange={e => handleLectureTitleChange(index, e.target.value)}

                        sx={{ mb: 2, mt: 2, direction: 'ltr', borderRedius: 2, fontFamily: 'Tajawal', width: "92%", mr: 5 }}
                      />

                      <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'flex-end', width: '100%', fontFamily: 'Tajawal' }}>
                        <Stack direction="column" spacing={3} alignItems="flex-end" sx={{ width: 'fit-content' }}>

                          <Box >
                            <Stack direction={'column'} sx={{ display: 'flex', justifyContent: "flex-end" }}>
                          
                              <Stack direction={"row"} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                                {lecture.videoUrl && (
                                  <Box mb={1}>
                                    <video
                                      width="300px"
                                      height="200px"
                                      controls
                                      src={lecture.videoUrl}
                                      style={{
                                        borderRadius: '8px',
                                        boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                        marginBottom: '10px',
                                        marginRight: 40
                                      }}
                                    />
                                  </Box>
                                )}
                                <Stack direction={"column"}>
                                  <InputLabel sx={{ fontSize: "18px", fontWeight: '700', mb: 1, mr: 2, fontFamily: 'Tajawal' }}>فيديو توضيحي</InputLabel>

                                  <Button
                                    variant="outlined"
                                    component="label"
                                    sx={{ fontFamily: 'Tajawal', fontWeight: 700, fontSize: '16px', height: '48px', width: 150, textAlign: 'center' }}
                                  >
                                    اختر فيديو
                                    <input
                                      type="file"
                                      accept="video/*"
                                      disabled={lecture.uploadingVideo}
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
                                  
                                  {uploadProgress[index]?.video !== undefined && lecture.uploadingVideo && (
                                    <Box sx={{ width: '80%', mt: 1 }}>
                                      <LinearProgress variant="determinate" value={uploadProgress[index]?.video || 0} sx={{ height: 10, width: '100%', mr: 2, borderRadius: 5 }} color={
                                        uploadProgress[index].video < 33
                                          ? 'error'
                                          : uploadProgress[index].video < 66
                                            ? 'warning'
                                            : 'success'
                                      } />
                                      <Typography variant="caption">{uploadProgress[index]?.video || 0}%</Typography>
                                    </Box>
                                  )}
                                </Stack>

                              </Stack>
                            </Stack>
                          </Box>

                          <Box sx={{}}>

                            <Stack direction={"row"} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                              {lecture.docUrl && (
                                <Box mb={1}>
                                  <iframe
                                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(lecture.docUrl)}`}
                                    width="300px"
                                    height="200px"
                                    style={{
                                      borderRadius: '8px',
                                      boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                      marginBottom: '10px',
                                      border: 'none',
                                      marginRight: 40
                                    }}
                                  />
                                </Box>
                              )}
                              <Stack direction={"column"}>

                                <InputLabel sx={{ fontSize: "20px", fontWeight: '700', mb: 1, mr: 5, fontFamily: 'Tajawal' }}>ملف الورد</InputLabel>
                                
                                <Button
                                  variant="outlined"
                                  component="label"
                                  sx={{ fontFamily: 'Tajawal', fontWeight: 'bold', fontSize: '16px', height: '48px', width: 150, textAlign: 'center', lineHeight: '40px' }}
                                >
                                  اختر ملف Word
                                  <input
                                    type="file"
                                    accept=".doc,.docx"
                                    disabled={lecture.uploadingDoc}
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
                              
                                {uploadProgress[index]?.doc !== undefined && lecture.uploadingDoc && (
                                  <Box sx={{ width: '80%', mt: 1 }}>
                                    <LinearProgress variant="determinate" value={uploadProgress[index]?.doc || 0} sx={{ height: 10, width: '100%', mr: 2, borderRadius: 5 }} color={
                                      uploadProgress[index].doc < 33
                                        ? 'error'
                                        : uploadProgress[index].doc < 66
                                          ? 'warning'
                                          : 'success'
                                    } />
                                    <Typography variant="caption">{uploadProgress[index]?.doc || 0}%</Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Stack>
                          </Box>

                          <Box sx={{}}>
                            {/*  */}
                            <Stack direction={"row"} sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', }}>
                              {lecture.txtUrl && (
                                <Box mb={1}>
                                  <iframe
                                    src={lecture.txtUrl}
                                    width="300px"
                                    height="200px"
                                    style={{
                                      borderRadius: '8px',
                                      boxShadow: '0px 2px 8px rgba(0,0,0,0.2)',
                                      marginBottom: '10px',
                                      border: 'none',
                                      marginRight: 40
                                    }}
                                  />
                                </Box>
                              )}
                              <Stack direction={"column"}>
                                <InputLabel sx={{ fontSize: "20px", fontWeight: '700', mb: 1, mr: 6, fontFamily: 'Tajawal' }}> txt ملف </InputLabel>

                                <Button
                                  variant="outlined"
                                  component="label"
                                  sx={{ fontFamily: 'Tajawal', fontWeight: 'bold', fontSize: '16px', height: '48px', width: 150, textAlign: 'center', lineHeight: '40px' }}
                                >
                                  اختر ملف TXT
                                  <input
                                    type="file"
                                    accept=".txt"
                                    hidden
                                    disabled={lecture.uploadingTxt}
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

                                {uploadProgress[index]?.txt !== undefined && lecture.uploadingTxt && (
                                  <Box sx={{ width: '80%', mt: 1 }}>
                                    <LinearProgress variant="determinate" value={uploadProgress[index]?.txt || 0} sx={{ height: 10, width: '100%', mr: 2, borderRadius: 5 }} color={
                                      uploadProgress[index].txt < 33
                                        ? 'error'
                                        : uploadProgress[index].txt < 66
                                          ? 'warning'
                                          : 'success'
                                    } />
                                    <Typography variant="caption">{uploadProgress[index]?.txt || 0}%</Typography>
                                  </Box>
                                )}
                              </Stack>
                            </Stack>
                          </Box>
                        </Stack>
                      </Box>
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
        </Dialog>

      </ThemeProvider>
    </CacheProvider>
  );
};

export default EditPopover; 