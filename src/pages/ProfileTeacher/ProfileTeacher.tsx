// import { motion } from "framer-motion";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { useEffect, useState } from "react";
// import {
//   doc,
//   getDoc,
//   updateDoc,
// } from "firebase/firestore";
// import { db, auth } from "../../../src/firebase";
// import { useAuth } from "../../context/AuthContext";

// import {
//   Avatar,
//   Box,
//   Button,
//   Dialog,
//   DialogContent,
//   DialogTitle,
//   Divider,
//   Grid,
//   Typography,
//   TextField,
//   DialogActions,
//   CardActions,
// } from "@mui/material";
// import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
// import {
//   Email,
//   Phone,
//   Edit,
//   School,
//   Star,
//   Info,
//   CalendarMonth,
//   ViewModule,
//   Dashboard,
// } from "@mui/icons-material";

// type Course = {
//   title: string;
//   subtitle: string;
//   image: string;
//   start: string;
//   end: string;
// };

// const courses: Course[] = [
//   {
//     title: "التفاضل المتقدم",
//     subtitle: "لطلاب الهندسة",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
//   {
//     title: "أساسيات الإحصاء",
//     subtitle: "مقدمة في تحليل البيانات",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
//   {
//     title: "الجبر الخطي",
//     subtitle: "أساسيات الرياضيات لعلوم الحاسب",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
//   {
//     title: "الرياضيات المتقطعة",
//     subtitle: "أساسيات علوم الحاسوب",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
//   {
//     title: "نظرية الاحتمالات",
//     subtitle: "مفاهيم إحصائية متقدمة",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
//   {
//     title: "المنطق الرياضي",
//     subtitle: "مقدمة في الأنظمة الشكلية",
//     image: "",
//     start: "سبتمبر 2023",
//     end: "ديسمبر 2023",
//   },
// ];

// const TeacherProfile = () => {
//   const { role } = useAuth() as { role: string }; // Get the current user's role with proper typing
//   const { teacherId } = useParams<{ teacherId?: string }>(); // Get teacher ID from URL
//   const [open, setOpen] = useState(false);
//   const [teacherData, setTeacherData] = useState<any>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // Check if this is the current user's own profile
//   const isOwnProfile = !teacherId || (auth.currentUser && teacherId === auth.currentUser.uid);
//   const canEdit = role === "teacher" && isOwnProfile;

//   const [editName, setEditName] = useState("");
//   const [editPhone, setEditPhone] = useState("");
//   const [editSubject, setEditSubject] = useState("");
//   const [editExperiance, setEditExperiance] = useState("");
//   const [editInfo, setEditInfo] = useState("");
//   let navigate = useNavigate();

//   const handleOpen = () => {
//     if (teacherData) {
//       setEditName(teacherData.name || "");
//       setEditPhone(teacherData.phone || "");
//       setEditSubject(teacherData.subject || "");
//       setEditExperiance(teacherData.experiance || "");
//       setEditInfo(teacherData.info || "");
//     }
//     setOpen(true);
//   };

//   const handleClose = () => setOpen(false);

//   const handleSave = async () => {
//     const user = auth.currentUser;
//     if (!user) return;
//     const docRef = doc(db, "users", user.uid);
//     try {
//       await updateDoc(docRef, {
//         name: editName,
//         phone: editPhone,
//         subject: editSubject,
//         experiance: editExperiance,
//         info: editInfo,
//       });

//       setTeacherData((prev: any) => ({
//         ...prev,
//         name: editName,
//         phone: editPhone,
//         subject: editSubject,
//         experiance: editExperiance,
//         info: editInfo,
//       }));
//       handleClose();
//     } catch (error) {
//       console.error("خطأ أثناء التعديل ", error);
//     }
//   };

//   useEffect(() => {
//     const fetchTeacherProfile = async () => {
//       setLoading(true);
//       setError(null);

//       let userId;

//       if (teacherId) {
//         // If teacherId is provided in URL, fetch that teacher's profile
//         userId = teacherId;
//       } else {
//         // If no teacherId, fetch current user's profile
//         const user = auth.currentUser;
//         if (!user) {
//           setError("User not authenticated");
//           setLoading(false);
//           return;
//         }
//         userId = user.uid;
//       }

//       const docRef = doc(db, "users", userId);
//       try {
//         const docSnap = await getDoc(docRef);
//         if (docSnap.exists()) {
//           const userData = docSnap.data();
//           // Verify this is actually a teacher profile
//           if (userData.role === 'teacher') {
//             setTeacherData(userData);
//           } else {
//             setError("User is not a teacher");
//           }
//         } else {
//           setError("Teacher not found");
//         }
//       } catch (error) {
//         console.error("Error fetching teacher profile:", error);
//         setError("Error loading teacher profile");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTeacherProfile();
//   }, [teacherId, role]);

//   if (loading) {
//     return (
//       <Typography sx={{ color: "blue", textAlign: "center", mt: 5 }}>
//         جاري التحميل...
//       </Typography>
//     );
//   }

//   if (error) {
//     return (
//       <Typography sx={{ color: "red", textAlign: "center", mt: 5 }}>
//         {error}
//       </Typography>
//     );
//   }

//   if (!teacherData) {
//     return (
//       <Typography sx={{ color: "red", textAlign: "center", mt: 5 }}>
//         المعلم غير موجود
//       </Typography>
//     );
//   }
//   return (
//     <Box
//       sx={{
//         minHeight: "100vh",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "flex-start",
//         backgroundColor: "background.default",
//         direction: "rtl",
//         p: 2,
//       }}
//     >
//       <Box sx={{ width: "100%", maxWidth: 1500, p: 4 }}>
//         <Grid container spacing={4}>
//           <Grid item xs={12} md={3}>
//             <Box
//               sx={{
//                 display: "flex",
//                 flexDirection: "column",
//                 alignItems: "center",
//                 mb: 4,
//               }}
//             >
//               <Box sx={{ position: "relative", mb: 2 }}>
//                 <Avatar
//                   src={teacherData.avatar || "/default-avatar.png"}
//                   alt={teacherData.name}
//                   sx={{
//                     width: 150,
//                     height: 150,
//                     border: "2px solid",
//                     borderColor: "primary.main",
//                     backgroundColor: "grey.100",
//                   }}
//                 />
//                 <label htmlFor="upload-photo">
//                   <AddAPhotoIcon
//                     sx={{
//                       position: "absolute",
//                       bottom: 8,
//                       right: 8,
//                       backgroundColor: "background.paper",
//                       borderRadius: "25%",
//                       padding: "6px",
//                       fontSize: 28,
//                       color: "primary.main",
//                       cursor: "pointer",
//                       boxShadow: 1,
//                       transition: "0.3s",
//                       "&:hover": {
//                         backgroundColor: "action.hover",
//                       },
//                     }}
//                   />
//                 </label>
//                 <input
//                   type="file"
//                   id="upload-photo"
//                   accept="image/*"
//                   style={{ display: "none" }}
//                 />
//               </Box>

//               {/* Dashboard button - only show for teachers viewing their own profile */}
//               {canEdit && (
//                 <Link to="/teacherdashboard" style={{ textDecoration: "none", width: "100%" }}>
//                   <Button
//                     variant="contained"
//                     startIcon={<Dashboard />}
//                     fullWidth
//                   >
//                     الذهاب إلى اللوحة
//                   </Button>
//                 </Link>
//               )}
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={9}>
//             <Box display="flex" alignItems="center" gap={2} mb={1}>
//               <Typography variant="h5" fontWeight="bold">
//                 {teacherData.name}
//               </Typography>
//               {/* Follow button - only show for students viewing other teachers */}
//               {role === "student" && teacherId && (
//                 <Box display="flex" gap={1}>
//                   <Button
//                     variant="outlined"
//                     size="small"
//                     sx={{ whiteSpace: "nowrap" }}
//                   >
//                     متابعة
//                   </Button>
//                 </Box>
//               )}
//             </Box>
//             <Typography color="text.secondary" gutterBottom>
//               {teacherData.subject}
//             </Typography>

//             <Box display="flex" alignItems="center" mb={1}>
//               <Email sx={{ ml: 1 }} />
//               <Typography>{teacherData.email}</Typography>
//             </Box>

//             <Box display="flex" alignItems="center" mb={1}>
//               <Phone sx={{ ml: 1 }} />
//               <Typography>{teacherData.phone}</Typography>
//             </Box>

//             <Box display="flex" alignItems="center" mb={1}>
//               <School sx={{ ml: 1 }} />
//               <Typography>التخصص: {teacherData.subject}</Typography>
//             </Box>

//             <Box display="flex" alignItems="center" mb={1}>
//               <Star sx={{ ml: 1 }} />
//               <Typography>الخبرة: {teacherData.experiance}</Typography>
//             </Box>

//             <Box display="flex" alignItems="center" mb={1}>
//               <Info sx={{ ml: 1, maxWidth: 200 }} />
//               <Typography>{teacherData.info}</Typography>
//             </Box>

//             {/* Edit profile section - only show for teachers viewing their own profile */}
//             {canEdit && (
//               <Box
//                 sx={{
//                   display: "flex",
//                   alignItems: "center",
//                   mt: 2,
//                   cursor: "pointer",
//                 }}
//                 onClick={handleOpen}
//               >
//                 <Edit sx={{ ml: 1 }} />
//                 <Typography>تعديل الملف الشخصي</Typography>
//               </Box>
//             )}

//             {/* Edit Dialog - only accessible for teachers viewing their own profile */}
//             {canEdit && (
//               <Dialog open={open} onClose={handleClose}>
//               <DialogTitle>تعديل الملف الشخصي</DialogTitle>
//               <DialogContent>
//                 <TextField
//                   margin="dense"
//                   placeholder="تغيير الاسم"
//                   fullWidth
//                   value={editName}
//                   onChange={(e) => setEditName(e.target.value)}
//                   inputProps={{ style: { direction: "rtl" } }}
//                 />
//                 <TextField
//                   margin="dense"
//                   placeholder="تعديل رقم الهاتف"
//                   fullWidth
//                   value={editPhone}
//                   onChange={(e) => setEditPhone(e.target.value)}
//                   inputProps={{ style: { direction: "rtl" } }}
//                 />
//                 <TextField
//                   margin="dense"
//                   placeholder="تغيير التخصص"
//                   fullWidth
//                   value={editSubject}
//                   onChange={(e) => setEditSubject(e.target.value)}
//                   inputProps={{ style: { direction: "rtl" } }}
//                 />
//                 <TextField
//                   margin="dense"
//                   placeholder="تغيير سنين الخبرة"
//                   fullWidth
//                   value={editExperiance}
//                   onChange={(e) => setEditExperiance(e.target.value)}
//                   inputProps={{ style: { direction: "rtl" } }}
//                 />
//                 <TextField
//                   margin="dense"
//                   placeholder="تغيير المعلومات"
//                   fullWidth
//                   value={editInfo}
//                   onChange={(e) => setEditInfo(e.target.value)}
//                   inputProps={{ style: { direction: "rtl" } }}
//                 />
//               </DialogContent>
//               <DialogActions>
//                 <Button onClick={handleClose} color="error">
//                   إلغاء
//                 </Button>
//                 <Button onClick={handleSave} color="primary" variant="contained">
//                   حفظ
//                 </Button>
//               </DialogActions>
//             </Dialog>
//             )}
//           </Grid>
//         </Grid>

//         <Divider sx={{ my: 4 }} />

//         <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
//           <Typography variant="h6">دوراتي</Typography>
//           <Link to="#" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
//             <ViewModule fontSize="small" sx={{ ml: 0.5 }} />
//             عرض كل الدورات
//           </Link>
//         </Box>

//         <Typography variant="body2" color="text.secondary" mb={2}>
//           تقوم حاليًا بتدريس {courses.length} دورات
//         </Typography>

//         <Grid container spacing={3}>
//           {courses.map((course, index) => (
//             <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
//               <motion.div
//                 whileHover={{ scale: 1.03 }}
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.4, delay: index * 0.1 }}
//               >
//                 <Box
//                   sx={{
//                     borderRadius: 2,
//                     overflow: "hidden",
//                     boxShadow: 2,
//                     bgcolor: "background.paper",
//                     width: "100%",
//                     maxWidth: 330,
//                   }}
//                 >
//                   <img
//                     src={teacherData.avatar || "/default-course.png"}
//                     alt={course.title}
//                     style={{ width: "100%", height: 200, objectFit: "cover" }}
//                   />
//                   <Box p={2}>
//                     <Typography fontWeight="bold">{course.title}</Typography>
//                     <Typography variant="body2" color="text.secondary" gutterBottom>
//                       {course.subtitle}
//                     </Typography>
//                     <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
//                       <CalendarMonth fontSize="small" sx={{ ml: 0.5 }} />
//                       <Typography variant="body2">
//                         {course.start} – {course.end}
//                       </Typography>
//                     </Box>
//                     <CardActions sx={{ px: 2, pb: 2 }}>
//                       <Box sx={{ display: "flex", gap: 2, width: "100%" }}>

//                         <Button
//                           onClick={() => {
//                             // navigate(`/coursedetalis/${courseId}`);
//                           }}
//                           variant="outlined"
//                           color="primary"
//                           sx={{ flex: 1 }}
//                         >
//                           تفاصيل الكورس
//                         </Button>
//                       </Box>
//                     </CardActions>

//                   </Box>
//                 </Box>
//               </motion.div>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//     </Box>
//   );
// };

// export default TeacherProfile;

import { motion } from "framer-motion";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../src/firebase";

import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  TextField,
  DialogActions,
  CardActions,
} from "@mui/material";

import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import {
  Email,
  Phone,
  Edit,
  School,
  Star,
  Info,
  CalendarMonth,
  ViewModule,
  Dashboard,
} from "@mui/icons-material";

const TeacherProfile = () => {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const [teacherData, setTeacherData] = useState<any>(null);
  const [courseData, setcourseData] = useState<any[]>([]);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editExperiance, setEditExperiance] = useState("");
  const [editInfo, setEditInfo] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  let navigate = useNavigate();

  const handleOpen = () => {
    if (teacherData) {
      setEditName(teacherData.name || "");
      setEditPhone(teacherData.phone || "");
      setEditSubject(teacherData.subject || "");
      setEditExperiance(teacherData.experiance || "");
      setEditInfo(teacherData.info || "");
    }
    setOpen(true);
  };

  const handleClose = () => setOpen(false);

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "users", user.uid);

    try {
      await updateDoc(docRef, {
        name: editName,
        phone: editPhone,
        subject: editSubject,
        experiance: editExperiance,
        info: editInfo,
      });

      setTeacherData((prev: any) => ({
        ...prev,
        name: editName,
        phone: editPhone,
        subject: editSubject,
        experiance: editExperiance,
        info: editInfo,
      }));
      handleClose();
    } catch (error) {
      console.error("خطأ أثناء التعديل ", error);
    }
  };

  useEffect(() => {
    const fetchTeacherProfile = async () => {
      const uid = id || auth.currentUser?.uid;
      if (!uid) return;

      try {
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const teacher = docSnap.data();
          setTeacherData(teacher);

          const coursesRef = collection(db, "courses");
          const q = query(coursesRef, where("teacherId", "==", uid));
          const querySnapshot = await getDocs(q);

          const courseList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));

          setcourseData(courseList);
        } else {
          console.log("User not found");
        }
      } catch (error) {
        console.error("خطأ في جلب البيانات", error);
      }
    };

    fetchTeacherProfile();
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      if (user && id) {
        const studentData = {
          id: user.uid,
          name: user.displayName || "طالب",
          email: user.email,
        };
        setStudent(studentData);
        console.log(user.displayName);
        console.log("user", user);
        console.log(user.email);
        const followDocRef = doc(db, "users", id, "followers", user.uid);
        const followSnap = await getDoc(followDocRef);
        setIsFollowing(followSnap.exists());
      }
    });
  }, [id]);

  if (!teacherData)
    return (
      <Typography sx={{ color: "blue", textAlign: "center", mt: 5 }}>
        جاري التحميل...
      </Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: "#f9f9f9",
        direction: "rtl",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1500, p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={3}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Box sx={{ position: "relative", mb: 2 }}>
                <Avatar
                  src={teacherData.avatar || "/default-avatar.png"}
                  alt={teacherData.name}
                  sx={{
                    width: 150,
                    height: 150,
                    border: "2px solid #1976d2",
                    backgroundColor: "#eee",
                  }}
                />
                <label htmlFor="upload-photo">
                  <AddAPhotoIcon
                    sx={{
                      position: "absolute",
                      bottom: 8,
                      right: 8,
                      backgroundColor: "#fff",
                      borderRadius: "25%",
                      padding: "6px",
                      fontSize: 28,
                      color: "#1976d2",
                      cursor: "pointer",
                      boxShadow: 1,
                      transition: "0.3s",
                      "&:hover": {
                        backgroundColor: "#e3f2fd",
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

              <Link
                to="/teacherdashboard"
                style={{ textDecoration: "none", width: "100%" }}
              >
                <Button variant="contained" startIcon={<Dashboard />} fullWidth>
                  الذهاب إلى اللوحة
                </Button>
              </Link>
            </Box>
          </Grid>

          <Grid item xs={12} md={9}>
            <Box display="flex" alignItems="center" gap={2} mb={1}>
              <Typography variant="h5" fontWeight="bold">
                {teacherData.name}
              </Typography>

              {student && (
                <>
                  {isFollowing ? (
                    <>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={async () => {
                          const ref = doc(
                            db,
                            "users",
                            id!,
                            "followers",
                            student.id
                          );
                          await deleteDoc(ref);
                          setIsFollowing(false);
                        }}
                      >
                        إلغاء المتابعة
                      </Button>
                      <Button variant="contained" size="small" sx={{ ml: 1 }}>
                        مراسلة
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={async () => {
                        const ref = doc(
                          db,
                          "users",
                          id!,
                          "followers",
                          student.id
                        );
                        await setDoc(ref, {
                          studentId: student.id,
                          studentName: student.name,
                          studentEmail: student.email,
                          followedAt: new Date(),
                        });
                        setIsFollowing(true);
                      }}
                    >
                      متابعة
                    </Button>
                  )}
                </>
              )}
            </Box>

            <Typography color="text.secondary" gutterBottom>
              {teacherData.subject}
            </Typography>

            <Box display="flex" alignItems="center" mb={1}>
              <Email sx={{ ml: 1 }} />
              <Typography>{teacherData.email}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Phone sx={{ ml: 1 }} />
              <Typography>{teacherData.phone}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <School sx={{ ml: 1 }} />
              <Typography>التخصص: {teacherData.subject}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Star sx={{ ml: 1 }} />
              <Typography>الخبرة: {teacherData.experiance}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Info sx={{ ml: 1 }} />
              <Typography>{teacherData.info}</Typography>
            </Box>

            {!id && (
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  mt: 2,
                  cursor: "pointer",
                }}
                onClick={handleOpen}
              >
                <Edit sx={{ ml: 1 }} />
                <Typography>تعديل الملف الشخصي</Typography>
              </Box>
            )}

            {/* Edit Dialog */}
            <Dialog open={open} onClose={handleClose}>
              <DialogTitle>تعديل الملف الشخصي</DialogTitle>
              <DialogContent>
                <TextField
                  margin="dense"
                  placeholder="تغيير الاسم"
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  inputProps={{ style: { direction: "rtl" } }}
                />
                <TextField
                  margin="dense"
                  placeholder="تعديل رقم الهاتف"
                  fullWidth
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                  inputProps={{ style: { direction: "rtl" } }}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير التخصص"
                  fullWidth
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                  inputProps={{ style: { direction: "rtl" } }}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير سنين الخبرة"
                  fullWidth
                  value={editExperiance}
                  onChange={(e) => setEditExperiance(e.target.value)}
                  inputProps={{ style: { direction: "rtl" } }}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير المعلومات"
                  fullWidth
                  value={editInfo}
                  onChange={(e) => setEditInfo(e.target.value)}
                  inputProps={{ style: { direction: "rtl" } }}
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

        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">دوراتي</Typography>
          <Link
            to="#"
            style={{
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
            }}
          >
            <ViewModule fontSize="small" sx={{ ml: 0.5 }} />
            عرض كل الدورات
          </Link>
        </Box>

        {courseData.length === 0 ? (
          <Typography color="text.secondary" mb={2}>
            لا توجد كورسات متاحة حاليًا
          </Typography>
        ) : (
          <>
            <Typography variant="body2" color="text.secondary" mb={2}>
              تقوم حاليًا بتدريس {courseData.length} دورات
            </Typography>

            <Grid container spacing={3}>
              {courseData.map((course: any, index: number) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={course.id}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                  >
                    <Box
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: 2,
                        bgcolor: "background.paper",
                        width: "100%",
                        maxWidth: 330,
                      }}
                    >
                      <img
                        src={course.imageUrl || "/default-course.png"}
                        alt={course.title}
                        style={{
                          width: "100%",
                          height: 200,
                          objectFit: "cover",
                        }}
                      />
                      <Box p={2}>
                        <Typography fontWeight="bold">
                          {course.title}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          gutterBottom
                        >
                          {course.subTitle}
                        </Typography>
                        <Box
                          display="flex"
                          alignItems="center"
                          color="text.secondary"
                          mb={2}
                        >
                          <CalendarMonth fontSize="small" sx={{ ml: 0.5 }} />
                          <Typography variant="body2">
                            {course?.startDate?.toDate().toLocaleDateString()} –{" "}
                            {course?.endDate?.toDate().toLocaleDateString()}
                          </Typography>
                        </Box>
                        <CardActions sx={{ px: 2, pb: 2 }}>
                          <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
                            <Button
                              onClick={() =>
                                navigate(
                                  `/profileTeacher/courseDetails/${course.id}`
                                )
                              }
                              variant="outlined"
                              color="primary"
                              sx={{ flex: 1 }}
                            >
                              تفاصيل الكورس
                            </Button>
                          </Box>
                        </CardActions>
                      </Box>
                    </Box>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </>
        )}
      </Box>
    </Box>
  );
};

export default TeacherProfile;
