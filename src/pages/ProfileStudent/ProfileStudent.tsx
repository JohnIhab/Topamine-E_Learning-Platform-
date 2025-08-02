import { motion } from "framer-motion";
import LinearProgress from "@mui/material/LinearProgress";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  doc,
  getDoc,
  query,
  where,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "../../../src/firebase";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Link,
  Typography,
  Button,
  TextField,
  DialogContent,
  DialogTitle,
  Dialog,
  DialogActions,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  Email,
  Phone,
  Edit,
  Star,
  Info,
  ViewModule,
  Grade,
} from "@mui/icons-material";

import image from "../../assets/images/main-removebg.png";
import React from "react";

type Course = {
  id?: string;
  title: string;
  subtitle: string;
  image: string;
  start: string;
  end: string;
  progress: number;
};

const ProfileStudent = () => {
  const [open, setOpen] = useState(false);
  const [studentData, setStudentData] = useState<any>(null);
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const navigate = useNavigate();

  //Editing
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGrade, setEditGrade] = useState("");
  // const [editExperiance, setEditExperiance] = useState("");
  const [editInfo, setEditInfo] = useState("");
  const handleOpen = () => {
    if (studentData) {
      setEditName(studentData.name || "");
      setEditPhone(studentData.phone || "");
      setEditGrade(studentData.grade || "");
      // setEditExperiance(teacherData.experiance || "");
      setEditInfo(studentData.info || "");
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  // Handle course click to navigate to video page
  const handleCourseClick = (courseId: string) => {
    navigate('/video', { state: { courseId } });
  };

  //save After Editing
  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, {
        name: editName,
        phone: editPhone,
        grade: editGrade,
        // experiance: editExperiance,
        info: editInfo,
      });

      setStudentData((prev: any) => ({
        ...prev,
        name: editName,
        phone: editPhone,
        grade: editGrade,
        // experiance: editExperiance,
        info: editInfo,
      }));
      handleClose();
    } catch (error) {
      console.error("خطأ أثناء التعديل ", error);
    }
  };

  useEffect(() => {
    const fetchStudentProfile = async () => {
      const user = auth.currentUser;
      console.log("current User is :", user);
      if (!user) return;

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setStudentData(docSnap.data());
      } else {
        console.log("User not Found");
      }
    };
    fetchStudentProfile();
  }, []);

  // Fetch enrolled courses based on payments
  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingCourses(false);
        return;
      }

      try {
        setLoadingCourses(true);
        // Get all payments for this student
        const paymentsQuery = query(
          collection(db, 'payments'),
          where('uid', '==', user.uid),
          where('paid', '==', true)
        );
        
        const paymentDocs = await getDocs(paymentsQuery);
        const courseIds = paymentDocs.docs.map(doc => doc.data().courseId);
        
        if (courseIds.length > 0) {
          // Get course details for each paid course
          const coursesData = await Promise.all(
            courseIds.map(async (courseId) => {
              const courseDoc = await getDoc(doc(db, 'courses', courseId));
              if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                return {
                  id: courseDoc.id,
                  title: courseData.title || 'كورس بدون عنوان',
                  subtitle: courseData.subTitle || 'وصف غير متوفر',
                  image: courseData.imageUrl || image, // fallback to default image
                  start: courseData.startDate ? new Date(courseData.startDate.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد',
                  end: courseData.endDate ? new Date(courseData.endDate.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد',
                  progress: 0, // You can implement progress tracking later
                };
              }
              return null;
            })
          );
          
          // Filter out null values and set enrolled courses
          const validCourses = coursesData.filter(course => course !== null) as Course[];
          setEnrolledCourses(validCourses);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        setEnrolledCourses([]);
      } finally {
        setLoadingCourses(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  if (!studentData)
    return (
      // <Box
      //     sx={{
      //         minHeight: '100vh',
      //         display: 'flex',
      //         justifyContent: 'center',
      //         alignItems: 'center',
      //         backgroundColor: '#f9f9f9',
      //         direction: 'rtl',
      //         p: 2,
      //     }}
      // >
      //     <Box sx={{ width: '100%', maxWidth: 1500, p: 4 }}>
      //         <Grid container spacing={4}>
      //             <Grid size={3} xs={12} md={3}>
      //                 <Avatar
      //                     src={image}
      //                     alt="عبده احمد"
      //                     sx={{ width: 150, height: 150, mb: 4 }}
      //                 />
      //             </Grid>
      //             <Grid size={9} xs={12} md={6}>
      //                 <Typography variant="h5" fontWeight="bold">
      //                     ايمن على
      //                 </Typography>
      //                 <Box display="flex" alignItems="center" mb={1}>
      //                     <Email sx={{ ml: 1 }} />
      //                     <Typography>Sarah.Thompson@email.com</Typography>
      //                 </Box>
      //                 <Box display="flex" alignItems="center" mb={1}>
      //                     <Phone sx={{ ml: 1 }} />
      //                     <Typography>+1 (555) 123-4567</Typography>
      //                 </Box>
      //                 <Box display="flex" alignItems="center" mb={1}>
      //                     <Star sx={{ ml: 1 }} />
      //                     <Typography>الصف الثالث الثانوى</Typography>
      //                 </Box>
      //                 <Box display="flex" alignItems="center" mb={1}>
      //                     <Info sx={{ ml: 1, maxWidth: 200 }} />
      //                     <Typography>معلششششششششششششششششششش</Typography>
      //                 </Box>
      //                 <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
      //                     <Edit sx={{ ml: 1 }} />
      //                     تعديل الملف الشخصي
      //                 </Link>
      //             </Grid>
      //         </Grid>
      //         <Divider sx={{ my: 4 }} />
      //         <Box display="flex" alignItems="center" mb={2}>
      //             <Typography variant="h6">دوراتي</Typography>
      //             <Link href="#" underline="hover" mr={10} display="flex" alignItems="center">
      //                 <ViewModule fontSize="small" sx={{ ml: 0.5 }} />
      //                 الكورسات المدفوعة
      //             </Link>
      //         </Box>
      //         <Typography variant="body2" color="text.secondary" mb={2}>
      //             {courses.length} كورسات
      //         </Typography>
      //         <Grid container spacing={3}>
      //             {courses.map((course, index) => (
      //                 <Grid item xs={12} sm={6} md={3} key={index}>
      //                     <motion.div
      //                         whileHover={{ scale: 1.03 }}
      //                         initial={{ opacity: 0, y: 20 }}
      //                         animate={{ opacity: 1, y: 0 }}
      //                         transition={{ duration: 0.4, delay: index * 0.1 }}
      //                     >
      //                         <Box
      //                             sx={{
      //                                 borderRadius: 2,
      //                                 overflow: 'hidden',
      //                                 boxShadow: 1,
      //                                 bgcolor: 'background.paper',
      //                                 width: 330
      //                             }}
      //                         >
      //                             <img
      //                                 src={course.image}
      //                                 alt={course.title}
      //                                 style={{ width: '100%', height: 200, objectFit: 'fill' }}
      //                             />
      //                             <Box p={2}>
      //                                 <Typography fontWeight="bold">{course.title}</Typography>
      //                                 <Typography sx={{ mb: 3 }} variant="body2" color="text.secondary" gutterBottom>
      //                                     {course.subtitle}
      //                                 </Typography>
      //                                 <Box sx={{ width: '100%', mb: 2 }}>
      //                                     <LinearProgress variant="determinate" value={course.progress} />
      //                                 </Box>
      //                                 <Box display="flex" alignItems="center" justifyContent="space-between" color="text.secondary" mb={2}>
      //                                     <Typography variant="body2">
      //                                         {course.start} – {course.end}
      //                                     </Typography>
      //                                     <Typography variant="body2">
      //                                         {course.progress}% complete
      //                                     </Typography>
      //                                 </Box>
      //                             </Box>
      //                         </Box>
      //                     </motion.div>
      //                 </Grid>
      //             ))}
      //         </Grid>
      //     </Box>

      // </Box>

      <Typography sx={{ color: "blue" }}> جاري التحميل...........</Typography>
    );
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "background.default",
        direction: "rtl",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1500, p: 4 }}>
        <Grid container spacing={4}>
          <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
            <Avatar
              src={studentData.avatar}
              alt={studentData.name}
              sx={{ width: 150, height: 150, mb: 4 }}
            />

            <label htmlFor="upload-photo">
              <AddAPhotoIcon
                sx={{
                  position: "absolute",

                  marginTop: -8,
                  right: 8,

                  backgroundColor: "background.paper",
                  borderRadius: "25%",
                  padding: "6px",
                  fontSize: 28,
                  color: "primary.main",
                  cursor: "pointer",
                  boxShadow: 1,
                  transition: "0.3s",
                  "&:hover": {
                    backgroundColor: "action.hover",
                  },
                }}
              />
            </label>

            <input
              type="file"
              id="upload-photo"
              accept="image/*"
              style={{ display: "none" }}
            />
          </Box>
          <Grid size={9} xs={12} md={6}>
            <Typography variant="h5" fontWeight="bold">
              {studentData.name}
            </Typography>
            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ ml: 1 }} />
              <Typography>{studentData.email}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ ml: 1 }} />
              <Typography>{studentData.phone}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Star sx={{ ml: 1 }} />
              <Typography>{studentData.grade}</Typography>
            </Box>
            <Box display="flex" alignItems="center" mb={1}>
              <Info sx={{ ml: 1, maxWidth: 200 }} />
              <Typography>{studentData.info} </Typography>
            </Box>
            <Link
              onClick={handleOpen}
              href="#"
              underline="hover"
              sx={{ display: "flex", alignItems: "center", mt: 1 }}
            >
              <Edit sx={{ ml: 1 }} />
              تعديل الملف الشخصي
            </Link>
            {/* Edit  Profile*/}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle> تعديل الملف الشخصى </DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  label="تغيير الاسم"
                  type="string"
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label=" تعديل رقم الهاتف "
                  type="string"
                  fullWidth
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                <TextField
                  margin="dense"
                  label="تغيير الصف"
                  type="string"
                  fullWidth
                  value={editGrade}
                  onChange={(e) => setEditGrade(e.target.value)}
                />
                {/* <TextField
                  margin="dense"
                  placeholder="تغيير سنين الخبره"
                  type="string"
                  fullWidth
                  value={editExperiance}
                  onChange={(e) => setEditExperiance(e.target.value)}
                /> */}
                <TextField
                  margin="dense"
                  label="تغيير المعلومات عن الطالب"
                  type="string"
                  fullWidth
                  value={editInfo}
                  onChange={(e) => setEditInfo(e.target.value)}
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose} color="error">
                  إلغاء
                </Button>
                <Button
                  onClick={handleSave}
                  color="primary"
                  variant="contained"
                >
                  حفظ
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6">دوراتي</Typography>
          <Link
            href="#"
            underline="hover"
            mr={10}
            display="flex"
            alignItems="center"
          >
            <ViewModule fontSize="small" sx={{ ml: 0.5 }} />
            الكورسات المدفوعة
          </Link>
        </Box>
        <Typography variant="body2" color="text.secondary" mb={2}>
          {loadingCourses ? 'جارٍ التحميل...' : `${enrolledCourses.length} كورسات`}
        </Typography>
        
        {loadingCourses ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
          </Box>
        ) : enrolledCourses.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              لم تشترك في أي كورسات بعد
            </Typography>
            <Typography variant="body2" color="text.secondary">
              اشترك في الكورسات لتظهر هنا
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3}>
            {enrolledCourses.map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Box
                  onClick={() => handleCourseClick(course.id!)}
                  sx={{
                    borderRadius: 2,
                    overflow: "hidden",
                    boxShadow: 1,
                    bgcolor: "background.paper",
                    width: 330,
                    cursor: "pointer",
                    transition: "transform 0.2s ease-in-out",
                    "&:hover": {
                      transform: "translateY(-2px)",
                      boxShadow: 3,
                    },
                  }}
                >
                  <img
                    src={course.image}
                    alt={course.title}
                    style={{ width: "100%", height: 200, objectFit: "fill" }}
                  />
                  <Box p={2}>
                    <Typography sx={{marginBottom: "15px"}} fontWeight="bold" textAlign={"center"}>{course.title}</Typography>
                    <Typography
                      sx={{ mb: 3 }}
                      // textAlign={"center"}
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {course.subtitle}
                    </Typography>
                    
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      color="text.secondary"
                      mb={2}
                    >
                      <Typography variant="body2">
                        {course.start} – {course.end}
                      </Typography>
                      
                    </Box>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ textTransform: 'none' }}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent box click when button is clicked
                        handleCourseClick(course.id!);
                      }}
                    >
                      متابعة الدروس
                    </Button>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
          </Grid>
        )}
      </Box>
    </Box>
  );
};

export default ProfileStudent;
