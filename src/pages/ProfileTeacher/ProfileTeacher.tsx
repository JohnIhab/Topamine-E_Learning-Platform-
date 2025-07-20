import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
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
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  Typography,
  TextField,
  DialogActions,
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
  Payment,
  ViewModule,
  Dashboard,
} from "@mui/icons-material";

// import image from "../../assets/images/main-removebg.png";

type Course = {
  title: string;
  subtitle: string;
  image: string;
  start: string;
  end: string;
};

const courses: Course[] = [
  {
    title: "التفاضل المتقدم",
    subtitle: "لطلاب الهندسة",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
  {
    title: "أساسيات الإحصاء",
    subtitle: "مقدمة في تحليل البيانات",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
  {
    title: "الجبر الخطي",
    subtitle: "أساسيات الرياضيات لعلوم الحاسب",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
  {
    title: "الرياضيات المتقطعة",
    subtitle: "أساسيات علوم الحاسوب",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
  {
    title: "نظرية الاحتمالات",
    subtitle: "مفاهيم إحصائية متقدمة",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
  {
    title: "المنطق الرياضي",
    subtitle: "مقدمة في الأنظمة الشكلية",
    image: "",
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
  },
];

const TeacherProfile = () => {
  //Edit Profile
  const [open, setOpen] = useState(false);

  const [teacherData, setTeacherData] = useState<any>(null); //any,null => typeScript

  //Editing
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editSubject, setEditSubject] = useState("");
  const [editExperiance, setEditExperiance] = useState("");
  const [editInfo, setEditInfo] = useState("");
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

  //save After Editing
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
      const user = auth.currentUser;
      console.log("current user:", user);
      if (!user) return;
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setTeacherData(docSnap.data());
      } else {
        console.log("user not found");
      }
    };

    fetchTeacherProfile();
  }, []);
  if (!teacherData)
    return (
      <Typography sx={{ color: "blue" }}> جارى التحميل..........</Typography>
    );

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        direction: "rtl",
        p: 2,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 1500, p: 4 }}>
        <Grid container spacing={4}>
          <Grid size={3} xs={12} md={3}>
            <Box sx={{ position: "relative", display: "inline-block", mb: 4 }}>
              <Avatar
                src={teacherData.avatar}
                alt={teacherData.name}
                sx={{ width: 150, height: 150 }}
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
                // onChange={handleImageChange} // لازم تكوني عرفتيها
              />
            </Box>

            <Link to="#" style={{ textDecoration: "none" }}>
              <Button
                variant="contained"
                startIcon={<Dashboard />}
                sx={{ mb: 2 }}
              >
                الذهاب إلى اللوحة
              </Button>
            </Link>
          </Grid>

          <Grid size={9} xs={12} md={6}>
            <Box display="flex" alignItems="center" gap={2}>
              <Typography variant="h5" fontWeight="bold">
                {teacherData.name}
              </Typography>
              <Button
                variant="outlined"
                size="small"
                sx={{ whiteSpace: "nowrap", mx: "30px" }}
              >
                متابعة
              </Button>
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
              <Typography>التخصص:{teacherData.subject}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Star sx={{ ml: 1 }} />
              <Typography>الخبرة: {teacherData.experiance}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Info sx={{ ml: 1, maxWidth: 200 }} />
              <Typography>{teacherData.info} </Typography>
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
                  placeholder="تغيير الاسم"
                  type="string"
                  fullWidth
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                />
                <TextField
                  margin="dense"
                  placeholder=" تعديل رقم الهاتف "
                  type="string"
                  fullWidth
                  value={editPhone}
                  onChange={(e) => setEditPhone(e.target.value)}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير التخصص"
                  type="string"
                  fullWidth
                  value={editSubject}
                  onChange={(e) => setEditSubject(e.target.value)}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير سنين الخبره"
                  type="string"
                  fullWidth
                  value={editExperiance}
                  onChange={(e) => setEditExperiance(e.target.value)}
                />
                <TextField
                  margin="dense"
                  placeholder="تغيير المعلومات عن المدرس"
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
            عرض كل الدورات
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          تقوم حاليًا بتدريس {courses.length} دورات
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
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
                    boxShadow: 1,
                    bgcolor: "background.paper",
                    width: 330,
                  }}
                >
                  <img
                    src={teacherData.avatar}
                    alt={course.title}
                    style={{ width: "100%", height: 200, objectFit: "fill" }}
                  />
                  <Box p={2}>
                    <Typography fontWeight="bold">{course.title}</Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {course.subtitle}
                    </Typography>
                    <Box
                      display="flex"
                      alignItems="center"
                      color="text.secondary"
                      mb={2}
                    >
                      <CalendarMonth fontSize="small" sx={{ ml: 0.5 }} />
                      <Typography variant="body2">
                        {course.start} – {course.end}
                      </Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" gap={1}>
                      <Link
                        to="/profileTeacher/courseDetails"
                        style={{ textDecoration: "none" }}
                      >
                        <Button fullWidth variant="outlined">
                          تفاصيل الدورة
                        </Button>
                      </Link>
                      <Button
                        fullWidth
                        variant="contained"
                        startIcon={<Payment sx={{ ml: 1 }} />}
                      >
                        معلومات الدفع
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default TeacherProfile;
