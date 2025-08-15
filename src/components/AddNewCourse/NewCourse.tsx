import React, { useState } from 'react';
import {
  Box, TextField, Typography, Stack, InputLabel, Button, MenuItem, List, ListItem, Collapse, LinearProgress
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { collection, addDoc, updateDoc, doc as docRef, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import { ToastContainer, toast } from 'react-toastify';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';



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

const termOptions = [
  { value: 'الفصل الدراسي الاول', label: 'الفصل الدراسي الاول' },
  { value: 'الفصل الدراسي الثاني', label: 'الفصل الدراسي الثاني' }
];


const NewCourse: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth() || {};
  console.log("User in NewCourse:", user);
  const [userData, setUserData] = useState<any>(null);
  const [lectures, setLectures] = useState<Lecture[]>([{ open: false, title: '' }]);

  const toggleLecture = (index: number) => {
    const updated = lectures.map((item, i) =>
      i === index ? { ...item, open: !item.open } : item
    );
    setLectures(updated);
  };

  const handleClick = () => {
    setLectures([...lectures, { open: false, title: '' }]);
  };
  const [title, setTitle] = useState<string>('');
  const [subTitle, setSubTitle] = useState<string>('');
  const [gradeLevel, setGradeLevel] = useState<string>('');
  const [term, setTerm] = useState<string>('');
  const [price, setPrice] = useState<number>(0);
  const [startDate, setStartDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState<string>('');
  const [teacherName, setTeacherName] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [uploading, setUploading] = useState<boolean>(false);

  const [image, setImage] = useState<File | null>(null);
  const [video, setVideo] = useState<File | null>(null);
  const [doc, setDoc] = useState<File | null>(null);
  const [txt, setTxt] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [uploadedVideoUrl, setUploadedVideoUrl] = useState<string | null>(null);
  const [uploadedDoc, setUploadedDoc] = useState<string | null>(null);
  const [uploadedTxt, setUploadedTxt] = useState<string | null>(null);

  const [uploadProgress, setUploadProgress] = useState<{ [key: string]: { video?: number; doc?: number; txt?: number } }>({});

  const handleLectureTitleChange = (index: number, value: string) => {
    const updated = [...lectures];
    updated[index].title = value;
    setLectures(updated);
  };

  const uploadFile = async (
    type: "image" | "video" | "doc" | "txt",
    file?: File,
    lectureIndex?: number
  ): Promise<string | null> => {
    const selectedFile =
      file ||
      (type === "image"
        ? image
        : type === "video"
          ? video
          : type === "doc"
            ? doc
            : type === "txt"
              ? txt
              : null);

    if (!selectedFile) return null;

    const formData = new FormData();
    formData.append("file", selectedFile);

    let resourceType = "image";
    let uploadPreset = "";

    if (type === "video") {
      resourceType = "video";
      uploadPreset = "videos";
    } else if (type === "image") {
      resourceType = "image";
      uploadPreset = "images";
    } else if (type === "doc" || type === "txt") {
      resourceType = "raw";
      uploadPreset = "raw_files";
    }

    formData.append("upload_preset", uploadPreset);
    formData.append("folder", uploadPreset);
    formData.append("context", `display_name=${selectedFile.name}`);

    try {
      if (lectureIndex !== undefined) {
        setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: true, uploadError: '' } : lec));

        setUploadProgress(prev => ({
          ...prev,
          [lectureIndex]: { ...prev[lectureIndex], [type]: 0 }
        }));
      }
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
      const res = await axios.post(url, formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        onUploadProgress: (progressEvent: any) => {

          const percent = progressEvent.total ? Math.round((progressEvent.loaded * 100) / progressEvent.total) : 0;
          if (lectureIndex !== undefined) {
            setUploadProgress(prev => ({
              ...prev,
              [lectureIndex]: { ...prev[lectureIndex], [type]: percent }
            }));
          }
        }
      });
      if (lectureIndex !== undefined) {
        setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: false, uploadError: '' } : lec));
        setUploadProgress(prev => ({
          ...prev,
          [lectureIndex]: { ...prev[lectureIndex], [type]: 100 }
        }));
      }
      return res.data.secure_url;
    } catch (error) {
      if (lectureIndex !== undefined) {
        setLectures(prev => prev.map((lec, i) => i === lectureIndex ? { ...lec, uploading: false, uploadError: `فشل رفع ${type}` } : lec));
        setUploadProgress(prev => ({
          ...prev,
          [lectureIndex]: { ...prev[lectureIndex], [type]: 0 }
        }));
      }
      console.error(`${type} upload error:`, error);
      toast.error(`فشل رفع ${type}`);
      return null;
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const imgUrl = image ? await uploadFile("image", image) : null;
      const videoUrl = video ? await uploadFile("video", video) : null;
      const docUrl = doc ? await uploadFile("doc", doc) : null;
      const txtUrl = txt ? await uploadFile("txt", txt) : null;
      setUploadedImgUrl(imgUrl);
      setUploadedVideoUrl(videoUrl);
      setUploadedDoc(docUrl);
      setUploadedTxt(txtUrl);
      toast.success("تم رفع الملفات بنجاح");
    } catch (error) {
      toast.error("فشل الرفع، حاول مرة أخرى");
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    const effectiveTeacherName = userData?.name || user?.displayName || teacherName || 'المعلم';
    const effectiveTeacherId = user && user.uid ? user.uid : "guest-user";
    const effectiveSubject = userData?.subject || subject || '';

    const effectiveTeacherEmail = user && user.email ? user.email : "guest@example.com";
    if (
      !title.trim() || !subTitle.trim() || !gradeLevel || !term ||
      !price || !endDate ||  !imageUrl
    ) {
      toast.warn("يرجى ملء جميع الحقول المطلوبة");
      return;
    }
    if (new Date(endDate) <= new Date(startDate)) {
      toast.error("تاريخ النهاية يجب أن يكون بعد تاريخ البداية");
      return;
    }

    for (let i = 0; i < lectures.length; i++) {
      const lec = lectures[i];
      if (!lec.title && !lec.videoUrl && !lec.docUrl && !lec.txtUrl) {
        toast.error(`يرجى إدخال عنوان أو رفع محتوى للمحاضرة رقم ${i + 1}`);
        return;
      }
      if (lec.uploading) {
        toast.info(`يرجى الانتظار حتى انتهاء رفع الملفات للمحاضرة رقم ${i + 1}`);
        return;
      }
      if (lec.uploadError) {
        toast.error(`يوجد خطأ في رفع ملفات المحاضرة رقم ${i + 1}: ${lec.uploadError}`);
        return;
      }
    }
    try {
      const course = collection(db, 'courses');
      const docRef = await addDoc(course, {
        teacherName: effectiveTeacherName,
        title,
        subTitle,
        gradeLevel,
        term,
        price: Number(price),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        teacherId: effectiveTeacherId,
        teacherEmail: effectiveTeacherEmail,
        imageUrl,
        createdAt: new Date(),
        subject: effectiveSubject,
        status: 'active',
        lectures: lectures.map((lecture) => ({
          title: lecture.title || '',
          videoUrl: lecture.videoUrl || '',
          docUrl: lecture.docUrl || '',
          txtUrl: lecture.txtUrl || ''
        }))
      });
      await updateDoc(docRef, { id: docRef.id });

          // الإشعارات
          const followersRef = collection(
              db,
              "users",
              effectiveTeacherId,
              "followers"
          );
          const followersSnap = await getDocs(followersRef);
      
          const notificationsBatch = followersSnap.docs.map(async (docSnap) => {
              const studentId = docSnap.id;
              const notifRef = collection(db, "users", studentId, "notifications");
              await addDoc(notifRef, {
                  title: `تم إضافة كورس جديد من ${effectiveTeacherName}`,
                  message: `تم إضافة الكورس "${title}"، تحقق من الدروس الجديدة!`,
                  courseId: docRef.id,
                  read: false,
                  createdAt: new Date(),
              });
      });
      
      await Promise.all(notificationsBatch);
      
      toast.success("تم اضافة الكورس بنجاح", {
        position: 'top-left',
        autoClose: 2000,
      });
      setTimeout(() => {
        navigate('/teacherdashboard/courses');
      }, 3000);
    } catch (error) {
      console.error(error);
      toast.error("حدث خطأ أثناء حفظ البيانات");
    }
  };


  React.useEffect(() => {
    const fetchUserData = async () => {
      console.log("User from AuthContext:", user);
      if (user && user.uid) {
        try {
          console.log("Fetching user data for UID:", user.uid);
          const userDoc = await getDoc(docRef(db, 'users', user.uid));
          console.log("User document exists:", userDoc.exists());
          if (userDoc.exists()) {
            const data = userDoc.data();
            console.log("User document data:", data);
            setUserData(data);
            if (data.name) {
              console.log("Setting teacher name:", data.name);
              setTeacherName(data.name);
            } else {
              console.log("No name field in user document");
              if (user.displayName) {
                setTeacherName(user.displayName);
              }
            }
            if (data.subject) {
              console.log("Setting teacher subject:", data.subject);
              setSubject(data.subject);
            }
          } else {
            console.log('No user document found in Firestore');
            if (user.displayName) {
              setTeacherName(user.displayName);
            }
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          if (user.displayName) {
            setTeacherName(user.displayName);
          }
        }
      } else {
        console.log("No user or no UID available");
      }
    };

    fetchUserData();
  }, [user]);

  return (
    <Box sx={{ width: '100%', overflowX: 'hidden' }}>
      <Box
        sx={{ width: '100%', borderRadius: 2, backgroundColor: 'white', mt: 3, pt: 2, mx: 'auto', overflowX: 'hidden' }}
      >
        <Box sx={{ mt: 2, width: '100%', borderRadius: 2, mx: 'auto' }}>
          <Stack direction={'row'} sx={{ mb: 2, mt: 2, display: 'flex', justifyContent: 'space-between' }}>
            <Typography onClick={handleCreate} sx={{ cursor: 'pointer', fontWeight: 700, fontSize: '20px', lineHeight: '28px' }}>اضافة كورس جديد</Typography>
            <Button onClick={() => navigate('/teacherdashboard/courses')} sx={{ minWidth: 'auto' }}>
              <CloseIcon />
            </Button>
          </Stack>
        </Box>

        <CacheProvider value={cacheRtl}>
          <ThemeProvider theme={theme}>

            <Box sx={{ m: 2 }}>
      

              {userData && userData.name ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1976d2', mt: 1 }}>
                  المعلم: {userData.name}
                </Typography>
              ) : user && user.displayName ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1976d2', mt: 1 }}>
                  المعلم: {user.displayName}
                </Typography>
              ) : teacherName ? (
                <Typography sx={{ fontSize: 18, fontWeight: 'bold', color: '#1976d2', mt: 1 }}>
                  المعلم: {teacherName}
                </Typography>
              ) : user ? (
                <Typography sx={{ fontSize: 18, fontWeight: '700', color: 'orange', mt: 1, lineHeight: "28px" }}>
                  تم تسجيل الدخول ولكن لا يوجد اسم متاح - معرف المستخدم: {user.uid}
                </Typography>
              ) : (
                <Typography sx={{ fontSize: 18, fontWeight: '700', color: 'black', mt: 1, lineHeight: "28px" }}>
                  جاري تحميل بيانات المعلم...
                </Typography>
              )}
              
              {/* Display teacher subject */}
              {(userData?.subject || subject) && (
                <Typography sx={{ fontSize: 16, fontWeight: 'bold', color: '#2196f3', mt: 0.5 }}>
                  المادة: {userData?.subject || subject}
                </Typography>
              )}
            </Box>
            <Box sx={{ m: 2, width: '100%' }}>
              <InputLabel sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>عنوان الكورس</InputLabel>
              <TextField
                label="ادخل عنوان الكورس"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Box>

            <Box sx={{ m: 2 }}>
              <InputLabel sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>وصف الكورس</InputLabel>
              <TextField
                label="ادخل وصف الكورس"
                value={subTitle}
                onChange={(e) => setSubTitle(e.target.value)}
                sx={{ width: '100%' }}
              />
            </Box>

            <Box sx={{ m: 2 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>الصف الدراسي</Typography>
              <TextField
                select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                label="اختر"
                sx={{ width: '100%' }}
              >
                {gradeOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Box>
            <Box sx={{ m: 2 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>
                تحميل صورة الكورس
              </Typography>

              <Button
                variant="outlined"
                component="label"
                sx={{ fontFamily: 'Tajawal', fontWeight: 'bold' }}
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
                    const url = await uploadFile("image", file);
                    if (url) {
                      setUploadedImgUrl(url);
                      setImageUrl(url);
                    }
                  }}
                />
              </Button>
            </Box>
            {uploadedImgUrl && (
              <Box sx={{ mt: 2, m: 2 }}>

                <img
                  src={uploadedImgUrl}
                  alt="Uploaded"
                  width="100"
                  style={{
                    borderRadius: "8px",
                    boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
                    objectFit: "cover"
                  }}
                />
              </Box>
            )}

            <Box sx={{ m: 2 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>السعر</Typography>
              <TextField
                label=" 0.00ج"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                sx={{ width: '100%' }}
              />
            </Box>

            <Typography sx={{ fontSize: "22px", fontWeight: '700', mt: 2, mb: 2, color: '#374151' }}>الجدول الزمني</Typography>
            <Stack direction="row" spacing={1} sx={{ m: 2 }}>
              <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                  <Box sx={{ m: 1, flex: 1 }}>
                    <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mb: 1, mt: 1 }}>تاريخ البداية</Typography>
                    <TextField
                      type="date"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      sx={{ width: '100%' }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: new Date().toISOString().split('T')[0],
                      }}
                      helperText="لا يمكن اختيار تاريخ سابق لليوم"
                    />
                  </Box>
                </ThemeProvider>
              </CacheProvider>
              <CacheProvider value={cacheRtl}>
                <ThemeProvider theme={theme}>
                  <Box sx={{ m: 1, flex: 1 }}>
                    <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mt: 1, mb: 2 }}>تاريخ النهاية</Typography>
                    <TextField
                      type="date"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      sx={{ width: '100%' }}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{
                        min: startDate,
                      }}
                      helperText="لا يمكن اختيار تاريخ سابق لتاريخ البداية"
                    />
                  </Box>
                </ThemeProvider>
              </CacheProvider>
            </Stack>





            <Box sx={{ m: 2 }}>
              <Typography sx={{ fontSize: "22px", fontWeight: 500, color: '#374151', lineHeight: "20px", mb: 2, mt: 1 }}>الترم</Typography>
              <TextField
                select
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                label="اختر الترم"
                sx={{ width: '100%' }}
              >
                {termOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                ))}
              </TextField>
            </Box>

            <Box sx={{ mt: 6, ml: 2, width: '65vw' }}>
              {lectures.map((lecture, index) => (

                <Box key={index} sx={{ mb: 2 }}>

                  <Stack
                    direction={"row"}

                    sx={{ mb: 2, gap: 2, width: "65vw" }}
                  >




                    <Box
                      onClick={() => toggleLecture(index)}
                      sx={{
                        p: 2,
                        border: '1px solid gray',
                        borderRadius: 2,
                        cursor: 'pointer',
                        width: "88vw",
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="h6">المحاضرة {index + 1}</Typography>
                        {lecture.open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </Stack>
                    </Box>
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
                  </Stack>
                  <Collapse in={lecture.open}>
                    <Box sx={{ mt: 1, pl: 2 }}>
                      <TextField
                        label="عنوان المحاضرة"
                        value={lecture.title || ''}
                        onChange={e => handleLectureTitleChange(index, e.target.value)}
                        sx={{ width: '59vw', mb: 2, mt: 2 }}
                      />
                      <List>
                        <ListItem>
                          <Stack direction={'column'} spacing={1} >
                            <Box sx={{ m: 2, ml: 17 }}>
                              <InputLabel sx={{ fontSize: "24px", fontWeight: '700', mb: 1 }}>
                                فيديو توضيحي
                              </InputLabel>
                              <Button
                                variant="outlined"
                                component="label"
                                sx={{
                                  fontFamily: 'Tajawal',
                                  fontWeight: 700,
                                  fontSize: '16px',
                                  height: '48px',
                                  width: 150
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
                                    const url = await uploadFile('video', file, index);
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
                            {lecture.videoUrl && (<Typography variant="subtitle2" color="success.main"> تم رفع فيديو المحاضرة</Typography>

                            )}
                          </Stack>
                        </ListItem>

                        <ListItem>
                          <Stack direction="column" spacing={2} >

                            <Box>
                              <InputLabel sx={{ fontSize: "24px", fontWeight: '700', mb: 1 }}>  ملف DOC</InputLabel>

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
                                  lineHeight: '40px'
                                }}
                              >
                                اختر ملف DOC
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

                                    const url = await uploadFile('doc', file, index);
                                    if (url) {
                                      updatedLectures[index].docUrl = url;
                                    }

                                    setLectures(updatedLectures);
                                  }}
                                />
                              </Button>

                              {uploadProgress[index]?.doc !== undefined && lecture.uploading && (
                                <Box sx={{ width: '80%', mt: 1 }}>
                                  <LinearProgress variant="determinate" value={uploadProgress[index]?.doc || 0} />
                                  <Typography variant="caption">{uploadProgress[index]?.doc || 0}%</Typography>
                                </Box>
                              )}
                              {lecture.docUrl && (<Typography color="success.main">تم رفع ملف DOC بنجاح</Typography>


                              )}
                            </Box>
                          </Stack>
                        </ListItem>

                        <ListItem>
                          <Stack direction="column" spacing={2} >

                            <Box>
                              <InputLabel sx={{ fontSize: "24px", fontWeight: '700', mb: 1 }}>  ملف TXT</InputLabel>

                              <Button
                                variant="outlined"
                                component="label"
                                sx={{
                                  fontFamily: 'Tajawal',
                                  fontWeight: 'bold',
                                  fontSize: '16px',
                                  height: '48px',
                                  width: 150
                                }}
                              >
                                اختر ملف TXT
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
                                    const url = await uploadFile('txt', file, index);
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
                              {lecture.txtUrl && (
                                <Typography color="success.main" sx={{ mt: 1 }}>
                                  تم رفع TXT:{" "}

                                </Typography>
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

            <Button variant="outlined"
              component="label" sx={{ ml: 120, mt: 3, mb: 3, fontFamily: 'Tajawal', fontWeight: 'bold' }} onClick={handleCreate} disabled={loading}>
              حفظ الكورس
            </Button>
          </ThemeProvider>
        </CacheProvider>
      </Box>
      {/* </Box> */}
      <ToastContainer />
    </Box>
  );
};

export default NewCourse; 