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
  Payment,
  ViewModule,
  Dashboard,
} from "@mui/icons-material";

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
  const [open, setOpen] = useState(false);
  const [teacherData, setTeacherData] = useState<any>(null);

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

              <Link to="/teacherdashboard" style={{ textDecoration: "none", width: "100%" }}>
                <Button
                  variant="contained"
                  startIcon={<Dashboard />}
                  fullWidth
                >
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
              <Button variant="outlined" size="small" sx={{ whiteSpace: "nowrap" }}>
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
              <Typography>التخصص: {teacherData.subject}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Star sx={{ ml: 1 }} />
              <Typography>الخبرة: {teacherData.experiance}</Typography>
            </Box>

            <Box display="flex" alignItems="center" mb={1}>
              <Info sx={{ ml: 1, maxWidth: 200 }} />
              <Typography>{teacherData.info}</Typography>
            </Box>

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
                <Button onClick={handleSave} color="primary" variant="contained">
                  حفظ
                </Button>
              </DialogActions>
            </Dialog>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">دوراتي</Typography>
          <Link to="#" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
            <ViewModule fontSize="small" sx={{ ml: 0.5 }} />
            عرض كل الدورات
          </Link>
        </Box>

        <Typography variant="body2" color="text.secondary" mb={2}>
          تقوم حاليًا بتدريس {courses.length} دورات
        </Typography>

        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
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
                    src={teacherData.avatar || "/default-course.png"}
                    alt={course.title}
                    style={{ width: "100%", height: 200, objectFit: "cover" }}
                  />
                  <Box p={2}>
                    <Typography fontWeight="bold">{course.title}</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {course.subtitle}
                    </Typography>
                    <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
                      <CalendarMonth fontSize="small" sx={{ ml: 0.5 }} />
                      <Typography variant="body2">
                        {course.start} – {course.end}
                      </Typography>
                    </Box>
                    <CardActions sx={{ px: 2, pb: 2 }}>
  <Box sx={{ display: "flex", gap: 2, width: "100%" }}>
    <Button
      variant="contained"
      color="primary"
      sx={{ flex: 1 }}
    >
      الدفع
    </Button>
    <Button
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
      </Box>
    </Box>
  );
};

export default TeacherProfile;
