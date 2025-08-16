
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
  serverTimestamp,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { db, auth } from "../../../src/firebase";
import axios from "axios";
import { useThemeMode } from "../../context/ThemeContext";

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
  CircularProgress,
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
  
} from "@mui/icons-material";
import DashboardIcon from '@mui/icons-material/Dashboard';

import Loading from "../../components/Loading/Loading";

const TeacherProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isDarkMode } = useThemeMode();

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
  const [image, setImage] = useState<File | null>(null);
  const [uploadedImgUrl, setUploadedImgUrl] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string>('');
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [currentUserRole, setCurrentUserRole] = useState<string | null>(null);

  const isOwnProfile = !id || id === auth.currentUser?.uid;

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

  const handleCreateChat = async () => {
    console.log('handleCreateChat called');
    console.log('student:', student);
    console.log('id:', id);

    if (!student || !id) {
      console.log('Missing student or id, returning');
      return;
    }

    try {
      console.log('Creating/finding chat...');

      const chatId = `${student.id}_${id}`;
      console.log('Chat ID will be:', chatId);

      const chatsRef = collection(db, 'chats');
      const chatDocRef = doc(chatsRef, chatId);

      const chatSnap = await getDoc(chatDocRef);

      if (chatSnap.exists()) {
        console.log('Found existing chat:', chatId);
        navigate(`/chat/${chatId}`);
      } else {
        console.log('Creating new chat with ID:', chatId);

        await setDoc(chatDocRef, {

          lastMessage: '',
          lastMessageTime: serverTimestamp(),

        });

        console.log('New chat created with ID:', chatId);
        navigate(`/chat/${chatId}`);
      }
    } catch (error) {
      console.error('خطأ في إنشاء المحادثة:', error);
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

          setTeacherData((prev: any) => ({
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
    const fetchCurrentUserRole = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const userData = docSnap.data();
            setCurrentUserRole(userData.role || null);
            console.log("Current user role:", userData.role);
          }
        } catch (error) {
          console.error("خطأ في جلب دور المستخدم", error);
        }
      }
    };

    fetchCurrentUserRole();
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

  if (!teacherData) {
    return (
      <Typography sx={{
        color: isDarkMode ? "#90caf9" : "blue",
        textAlign: "center",
        mt: 5
      }}>
        <Loading />
      </Typography>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        backgroundColor: isDarkMode ? "#121212" : "#f9f9f9",
        direction: "rtl",
        p: 2,
      }}
    >
      <Box sx={{
        width: "100%",
        maxWidth: 1500,
        p: 4,
        backgroundColor: isDarkMode ? "#1e1e1e" : "transparent",
        borderRadius: 2,
        boxShadow: isDarkMode ? "0 4px 20px rgba(0,0,0,0.3)" : "none",
      }}>
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
                    border: isDarkMode ? "2px solid #90caf9" : "2px solid #1976d2",
                    backgroundColor: isDarkMode ? "#333" : "#eee",
                    cursor: isOwnProfile ? "pointer" : "default",
                    transition: "0.3s",
                    "&:hover": {
                      opacity: isOwnProfile ? 0.8 : 1,
                    },
                    opacity: isUploadingPhoto ? 0.5 : 1,
                  }}
                  onClick={() => isOwnProfile && !isUploadingPhoto && document.getElementById('upload-photo')?.click()}
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
                {isOwnProfile && (
                  <>
                    <label htmlFor="upload-photo">
                      <AddAPhotoIcon
                        sx={{
                          position: "absolute",
                          bottom: 8,
                          right: 8,
                          backgroundColor: isDarkMode ? "#333" : "#fff",
                          borderRadius: "25%",
                          padding: "6px",
                          fontSize: 28,
                          color: isDarkMode ? "#90caf9" : "#1976d2",
                          cursor: "pointer",
                          boxShadow: 1,
                          transition: "0.3s",
                          "&:hover": {
                            backgroundColor: isDarkMode ? "#444" : "#e3f2fd",
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
                  </>
                )}
              </Box>

              {(() => {
                console.log("Button condition check - currentUserRole:", currentUserRole);
                console.log("Should show button:", currentUserRole !== "student" && currentUserRole !== null);
                return currentUserRole !== "student" && currentUserRole !== null;
              })() && (
                  <Link
                    to="/teacherdashboard"
                    style={{ textDecoration: "none", width: "100%" }}
                  >
                    <Button
                      variant="contained"
                      startIcon={<DashboardIcon />}
                      fullWidth
                      sx={{
                        '& .MuiButton-startIcon': {
                          marginLeft: 1,
                        },
                      }}
                    >
                      الذهاب إلى اللوحة
                    </Button>
                  </Link>
                )}
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
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ ml: 1 }}
                        onClick={handleCreateChat}
                      >
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
                  p: 1.5,
                  borderRadius: 1,
                  cursor: "pointer",
                  // backgroundColor: isDarkMode ? "rgba(144, 202, 249, 0.1)" : "rgba(25, 118, 210, 0.1)",
                  // border: isDarkMode ? "1px solid rgba(144, 202, 249, 0.3)" : "1px solid rgba(25, 118, 210, 0.3)",
                  transition: "all 0.3s ease",
                  // "&:hover": {
                  //   backgroundColor: isDarkMode ? "rgba(144, 202, 249, 0.2)" : "rgba(25, 118, 210, 0.2)",
                  // },
                }}
                onClick={handleOpen}
              >
                <Edit sx={{
                  ml: 1,
                  color: isDarkMode ? "#90caf9" : "#1976d2"
                }} />
                <Typography sx={{
                  color: isDarkMode ? "#90caf9" : "#1976d2",
                  fontWeight: 500
                }}>
                  تعديل الملف الشخصي
                </Typography>
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
                        width: 330,
                        height: 420,
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
                        <Typography fontWeight="bold" sx={{
                          display: '-webkit-box',
                          WebkitBoxOrient: 'vertical',
                          WebkitLineClamp: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                          maxWidth: '100%'
                        }}>
                          {course.title}
                        </Typography>
                        <Typography
                          sx={{
                            mb: 3,
                            display: "-webkit-box",
                            WebkitLineClamp: 1,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden"
                          }}
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
                        <CardActions sx={{ px: 2 }}>
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