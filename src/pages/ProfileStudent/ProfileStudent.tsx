import { motion } from "framer-motion";
import LinearProgress from "@mui/material/LinearProgress";
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
  title: string;
  subtitle: string;
  image: string;
  start: string;
  end: string;
  progress: number;
};

const courses: Course[] = [
  {
    title: "التفاضل المتقدم",
    subtitle: "لطلاب الهندسة",
    image,
    start: "سبتمبر 2023",
    end: "ديسمبر 2023",
    progress: 70,
  },
];

const ProfileStudent = () => {
  const [open, setOpen] = useState(false);

  const [studentData, setStudentData] = useState<any>(null);

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
        backgroundColor: "#f9f9f9",
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
          {courses.length} كورسات
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
                    src={course.image}
                    alt={course.title}
                    style={{ width: "100%", height: 200, objectFit: "fill" }}
                  />
                  <Box p={2}>
                    <Typography fontWeight="bold">{course.title}</Typography>
                    <Typography
                      sx={{ mb: 3 }}
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
                      {course.subtitle}
                    </Typography>
                    <Box sx={{ width: "100%", mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={course.progress}
                      />
                    </Box>
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                      color="text.secondary"
                      mb={2}
                    >
                      <Typography variant="body2">
                        {course.start} – {course.end}
                      </Typography>
                      <Typography variant="body2">
                        {course.progress}% complete
                      </Typography>
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

export default ProfileStudent;
