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
  onSnapshot,
  orderBy,
  limit,
} from "firebase/firestore";
import { db, auth } from "../../../src/firebase";
import axios from "axios";
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
  CircularProgress,
  IconButton,
  Badge,
  List,
  ListItem,
  ListItemText,
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
  Notifications as NotificationsIcon,
} from "@mui/icons-material";


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
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const navigate = useNavigate();

  //Editing
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editGrade, setEditGrade] = useState("");
  const [editInfo, setEditInfo] = useState("");

  // Photo upload states
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  const handleOpen = () => {
    if (studentData) {
      setEditName(studentData.name || "");
      setEditPhone(studentData.phone || "");
      setEditGrade(studentData.grade || "");
      setEditInfo(studentData.info || "");
    }
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  const handleCourseClick = (courseId: string) => {
    navigate('/video', { state: { courseId } });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (!user) return;
    const docRef = doc(db, "users", user.uid);
    try {
      await updateDoc(docRef, {
        name: editName,
        phone: editPhone,
        grade: editGrade,
        info: editInfo,
      });

      setStudentData((prev: any) => ({
        ...prev,
        name: editName,
        phone: editPhone,
        grade: editGrade,
        info: editInfo,
      }));
      handleClose();
    } catch (error) {
      console.error("خطأ أثناء التعديل ", error);
    }
  };

  const uploadFile = async (
    type: "image",
    file: File
  ): Promise<string | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    const uploadPreset = "images";
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", uploadPreset);
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
      console.error("Image upload error:", error);
      return null;
    }
  };

  const handlePhotoUpload = async (file: File) => {
    try {
      setIsUploadingPhoto(true);
      const uploadedUrl = await uploadFile("image", file);
      if (uploadedUrl) {
        setUploadedImgUrl(uploadedUrl);
        setImageUrl(uploadedUrl);

        const user = auth.currentUser;
        if (user) {
          const docRef = doc(db, "users", user.uid);
          await updateDoc(docRef, {
            avatar: uploadedUrl,
          });

          setStudentData((prev: any) => ({
            ...prev,
            avatar: uploadedUrl,
          }));
        }
      }
    } catch (error) {
      console.error("خطأ في رفع الصورة:", error);
    } finally {
      setIsUploadingPhoto(false);
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

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      const user = auth.currentUser;
      if (!user) {
        setLoadingCourses(false);
        return;
      }

      try {
        setLoadingCourses(true);
        const paymentsQuery = query(
          collection(db, 'enrollments'),
          where('uid', '==', user.uid),
          where('paid', '==', "enrolled")
        );

        const paymentDocs = await getDocs(paymentsQuery);
        const courseIds = paymentDocs.docs.map(doc => doc.data().courseId);

        if (courseIds.length > 0) {
          const coursesData = await Promise.all(
            courseIds.map(async (courseId) => {
              const courseDoc = await getDoc(doc(db, 'courses', courseId));
              if (courseDoc.exists()) {
                const courseData = courseDoc.data();
                return {
                  id: courseDoc.id,
                  title: courseData.title || 'كورس بدون عنوان',
                  subtitle: courseData.subTitle || 'وصف غير متوفر',
                  image: courseData.imageUrl || image,
                  start: courseData.startDate ? new Date(courseData.startDate.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد',
                  end: courseData.endDate ? new Date(courseData.endDate.seconds * 1000).toLocaleDateString('ar-EG') : 'غير محدد',
                  progress: 0,
                };
              }
              return null;
            })
          );

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
  useEffect(() => {
    const user = auth.currentUser;
    if (!user) {
      return;
    }
    const notifRef = collection(db, "users", user.uid, "notifications");
    const q = query(notifRef, orderBy("createdAt", "desc"), limit(3));

    const unsub = onSnapshot(q, (snapshot) => {
      const arr: any[] = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      setNotifications(arr);
    });

    return () => unsub();
  }, []);

  const toggleNotif = () => setNotifOpen((s) => !s);

  const markAsRead = async (notifId: string) => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      const notifDoc = doc(db, "users", user.uid, "notifications", notifId);
      await updateDoc(notifDoc, { read: true });
    } catch (err) {
      console.error("Error marking read:", err);
    }
  };

  if (!studentData)
    return (


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
              src={studentData.avatar || "/default-avatar.png"}
              alt={studentData.name}
              sx={{
                width: 150,
                height: 150,
                mb: 4,
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  opacity: 0.8,
                },
                opacity: isUploadingPhoto ? 0.5 : 1,
              }}
              onClick={() => !isUploadingPhoto && document.getElementById('upload-photo')?.click()}
            />
            {isUploadingPhoto && (
              <CircularProgress
                size={40}
                sx={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-20px",
                  marginLeft: "-20px",
                }}
              />
            )}

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
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImage(file);
                await handlePhotoUpload(file);
              }}
            />
          </Box>
          <Grid size={9} xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" fontWeight="bold">
                {studentData.name}
              </Typography>

              {/* Notifications bell */}
              <IconButton onClick={toggleNotif} aria-label="notifications">
                <Badge
                  badgeContent={notifications.filter((n) => !n.read).length}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>

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

            {/* Notifications dropdown-ish */}
            {notifOpen && (
              <Box
                sx={{
                  mt: 2,
                  mb: 2,
                  width: 360,
                  bgcolor: "background.paper",
                  boxShadow: 3,
                  borderRadius: 1,
                  p: 1,
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{ mb: 1, fontWeight: "bold" }}
                >
                  الإشعارات
                </Typography>
                {notifications.length === 0 && (
                  <Typography color="text.secondary">
                    لا توجد إشعارات
                  </Typography>
                )}
                <List>
                  {notifications.map((n) => (
                    <ListItem
                      key={n.id}
                      button
                      onClick={async () => {
                        await markAsRead(n.id);
                        if (n.courseId)
                          navigate(
                            `/profileTeacher/courseDetails/${n.courseId}`,
                            {
                              state: { courseId: n.courseId },
                            }
                          );
                      }}
                      sx={{
                        background: n.read ? "transparent" : "#fff7e6",
                        mb: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <ListItemText
                        primary={n.title || "إشعار جديد"}
                        secondary={n.message || ""}
                      />
                    </ListItem>
                  ))}
                </List>
                <Divider sx={{ my: 1 }} />
                <Button
                  fullWidth
                  size="small"
                  onClick={() => setNotifOpen(false)}
                >
                  إغلاق
                </Button>
              </Box>
            )}
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
                      height: 420,
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
                      <Typography sx={{ marginBottom: "15px" }} fontWeight="bold" textAlign={"center"}>{course.title}</Typography>
                      <Typography
                        sx={{
                          mb: 3,
                          display: "-webkit-box",
                          WebkitLineClamp: 2, 
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden"
                        }}
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
                          e.stopPropagation(); 
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
