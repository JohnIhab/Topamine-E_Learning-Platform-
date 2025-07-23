import * as React from "react";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Stack,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import TopaminIcon from "../../assets/images/Icon-logo.png";
import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import theme from "../../../theme";
import { getDocs, collection } from "firebase/firestore";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";
import { useNavigate } from "react-router-dom";


export default function TeachersPage() {
  const [selectedItem, setSelectedItem] = React.useState("Teachers");
  const [teachers, setTeachers] = React.useState([]);
  const [statusFilter, setStatusFilter] = React.useState(null);


  const navigate = useNavigate();

  async function fetchTeachers() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const allUsers = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() || new Date(0),
      }));

      const teacherUsers = allUsers
        .filter((user) => user.role === "teacher")
        .sort((a, b) => b.createdAt - a.createdAt);

      setTeachers(teacherUsers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
    }
  }

  async function acceptTeacher(id) {
    try {
      await updateDoc(doc(db, "users", id), { status: "تم القبول" });
      fetchTeachers();
    } catch (error) {
      console.error("Error accepting teacher:", error);
    }
  }

  async function rejectTeacher(id) {
    try {
      await updateDoc(doc(db, "users", id), { status: "تم الرفض" });
      fetchTeachers();
    } catch (error) {
      console.error("Error rejecting teacher:", error);
    }
  }


  React.useEffect(() => {
    fetchTeachers();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Stack
        sx={{ display: "flex", flexDirection: "row", fontFamily: "Tajawal" }}
      >
        {/* right side */}
        <Box sx={{ width: "200px" }}>
          <Stack>
            <AppBar
              position="static"
              sx={{
                backgroundColor: "#FFFFFF",
                marginTop: "4%",
                boxShadow: "none",
                textAlign: "center",
              }}
            >
              <Toolbar
                sx={{ display: "flex", flexDirection: "row", gap: "5px" }}
              >
                <img
                  src={TopaminIcon}
                  alt="توبامين"
                  style={{ width: "40px", height: "40px" }}
                />
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    display: {
                      xs: "none",
                      sm: "block",
                      color: "black",
                      fontWeight: "700",
                      fontSize: "30",
                      marginLeft: "20px",
                    },
                  }}
                >
                  توبامين
                </Typography>
              </Toolbar>
            </AppBar>

            <Box
              onClick={() => {
                setSelectedItem("Dashboard");
                navigate("/admin");
              }}
              sx={{
                display: "flex",
                flexDirection: "row",

                height: "70px",
                padding: "12% 23%",
                gap: "10%",
                cursor: "pointer",
                backgroundColor:
                  selectedItem === "Dashboard" ? "#F3F4FF" : "transparent",
                color: selectedItem === "Dashboard" ? "#4F46E5" : "gray",
                transition: "0.3s background-color ease",
              }}
            >
              <img
                src={dashboardIcon}
                alt="dashboardicon"
                style={{ height: "20px", width: "20px" }}
              />
              <Typography> لوحه التحكم</Typography>
            </Box>
            <Box
              onClick={() => {
                setSelectedItem("Courses");
                navigate("/Courses");
              }}
              sx={{
                display: "flex",
                flexDirection: "row",

                height: "70px",
                padding: "10% 23%",
                gap: "10%",
                cursor: "pointer",
                marginTop: "2%",

                backgroundColor:
                  selectedItem === "Courses" ? "#F3F4FF" : "transparent",
                color: selectedItem === "Courses" ? "#4F46E5" : "gray",
                transition: "0.3s background-color ease",
              }}
            >
              <img
                src={grayCoursesIcon}
                alt="coursesIcon"
                style={{ height: "25px" }}
              />
              <Typography> الكورسات</Typography>
            </Box>

            <Box
              onClick={() => {
                setSelectedItem("Teachers");
                navigate("/Teachers");
              }}
              sx={{
                display: "flex",
                flexDirection: "row",

                height: "70px",
                padding: "10% 23%",
                gap: "10%",
                cursor: "pointer",
                marginTop: "2%",

                backgroundColor:
                  selectedItem === "Teachers" ? "#F3F4FF" : "transparent",
                color: selectedItem === "Teachers" ? "#4F46E5" : "gray",
                transition: "0.3s background-color ease",
              }}
            >
              <img
                src={grayTeachersIcon}
                alt="teachersIcon"
                style={{ height: "25px" }}
              />
              <Typography> المعلمون</Typography>
            </Box>
            <Box
              onClick={() => {
                setSelectedItem("Students");
                navigate("/Students");
              }}
              sx={{
                display: "flex",
                flexDirection: "row",
                height: "70px",
                padding: "10% 23%",
                gap: "10%",
                cursor: "pointer",
                marginTop: "2%",

                backgroundColor:
                  selectedItem === "Students" ? "#F3F4FF" : "transparent",
                color: selectedItem === "Students" ? "#4F46E5" : "gray",
                transition: "0.3s background-color ease",
              }}
            >
              <img
                src={grayStudentsIcon}
                alt="studentIcon"
                style={{ height: "25px" }}
              />
              <Typography> الطلاب</Typography>
            </Box>
          </Stack>
        </Box>
        <Box
          sx={{
            flexGrow: 1,
            backgroundColor: "#eeeeee",
            minHeight: "100vh",
            borderRight: "1px solid rgba(157, 180, 206, 0.57)",
          }}
        >
          {/* AppBar*/}
          <AppBar
            position="static"
            sx={{
              backgroundColor: "#FFFFFF",
              borderBottom: "1px solid rgba(157, 180, 206, 0.57)",
              boxShadow: "none",
              padding: "0.5%",
            }}
          >
            <Toolbar>
              <Typography
                // variant="h5"
                noWrap
                component="div"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    fontWeight: "600",
                    fontSize: "20px",
                    color: "#111827",
                  },
                }}
              >
                لوحه التحكم
              </Typography>
            </Toolbar>
          </AppBar>

          {/* Teachers*/}
          <TableContainer
            component={Paper}
            sx={{ mt: 4, borderRadius: "20px", margin: "2%", width: "96%" }}
            dir="rtl"
          >
            <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
              المعلمون ({teachers.length})
            </Typography>

            <Box sx={{ padding: "10px", gap: "16px", display: "flex" }}>
              <Button
                onClick={() => setStatusFilter(null)}
                sx={{
                  backgroundColor: "#F3F4F6",
                  color: "#6B7280",
                  border: "1px solid #F3F4F6",
                  borderRadius: "8px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                    color: "white",
                  },
                }}
              >
                الكل
              </Button>
              <Button
                onClick={() => setStatusFilter("قيد المراجعة")}
                sx={{
                  backgroundColor: "#F3F4F6",
                  color: "#6B7280",
                  border: "1px solid #F3F4F6",
                  borderRadius: "8px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                    color: "white",
                  },
                }}
              >
                قيد الانتظار
              </Button>
              <Button
                onClick={() => setStatusFilter("تم القبول")}
                sx={{
                  backgroundColor: "#F3F4F6",
                  color: "#6B7280",
                  border: "1px solid #F3F4F6",
                  borderRadius: "8px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                    color: "white",
                  },
                }}
              >
                مقبول
              </Button>
              <Button
                onClick={() => setStatusFilter("تم الرفض")}
                sx={{
                  backgroundColor: "#F3F4F6",
                  color: "#6B7280",
                  border: "1px solid #F3F4F6",
                  borderRadius: "8px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500px",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                    color: "white",
                  },
                }}
              >
                مرفوض
              </Button>
            </Box>


            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    اسم المعلم
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    المادة
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الايميل
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الحالة
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الإجراءات
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {teachers
                  .filter((teacher) => {
                    if (!statusFilter) return true;
                    return (teacher.status || "قيد المراجعة") === statusFilter;
                  })
                  .map((teacher, index) => (

                    <TableRow key={index}>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {teacher.name}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {teacher.subject}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {teacher.email}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {teacher.status || "قيد المراجعة"}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        <Box sx={{ display: "flex", gap: "12px" }}>
                          <Button
                            sx={{
                              fontWeight: "400",
                              fontSize: "14px",
                              height: "28px",
                              background: "#10B981",
                              color: "white",
                              "&:hover": {
                                background: "#10B981",
                                color: "white",
                              },
                            }}
                            onClick={() => acceptTeacher(teacher.id)}
                            disabled={teacher.status === "تم القبول"}

                          >
                            قبول
                          </Button>
                          <Button
                            sx={{
                              fontWeight: "400",
                              fontSize: "14px",
                              height: "28px",
                              background: "#EF4444",
                              color: "white",
                              "&:hover": {
                                background: "#EF4444",
                                color: "white",
                              },
                            }}
                            onClick={() => rejectTeacher(teacher.id)}
                            disabled={teacher.status === "تم الرفض"}
                          >
                            رفض
                          </Button>
                        </Box>
                      </TableCell>

                    </TableRow>
                  ))}
              </TableBody>

            </Table>
          </TableContainer>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
