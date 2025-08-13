import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, Typography, Toolbar, Box, Stack, useTheme } from "@mui/material";

import { useThemeMode } from "../../context/ThemeContext";

import coursesIcon from "../../assets/images/book.png";
import teacherIcon from "../../assets/images/board.png";
import studentIcon from "../../assets/images/hatGrad.png";
import payments from "../../assets/images/dollar.png";
import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";

import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";


export default function PrimarySearchAppBar() {
  const [selectedItem, setSelectedItem] = React.useState("Dashboard");
  const [studentsCount, setStudentsCount] = React.useState(0);
  const [teachersCount, setTeachersCount] = React.useState(0);
  const [coursesCount, setCoursesCount] = React.useState(0);
  const [totalRevenue, setTotalRevenue] = React.useState(0);
  const { isDarkMode } = useThemeMode();
  const theme = useTheme();


  const navigate = useNavigate();



  async function fetchData() {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));

      const users = querySnapshot.docs.map(doc => doc.data());

      const students = users.filter(user => user.role === "student");
      const teachers = users.filter(user => user.role === "teacher" && user.status === "تم القبول");
      console.log("Teachers:", teachers);


      setStudentsCount(students.length);
      setTeachersCount(teachers.length);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  async function fetchCourses() {
    try {
      const querySnapshot = await getDocs(collection(db, "courses"));
      const courses = querySnapshot.docs.map(doc => doc.data());
      setCoursesCount(courses.length);
      console.log("Courses:", courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  async function fetchTotalRevenue() {
    try {
      const querySnapshot = await getDocs(collection(db, "enrollments"));
      const enrollments = querySnapshot.docs.map(doc => doc.data());
      
      const total = enrollments.reduce((sum, enrollment) => {

        const price = enrollment.price || enrollment.amount || enrollment.totalPrice || 0;
        return sum + (typeof price === 'number' ? price : parseFloat(price) || 0);
      }, 0);
      
      setTotalRevenue(total);
      console.log("Total Revenue:", total);
      console.log("Enrollments:", enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    }
  }
  React.useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
    fetchData();
    fetchCourses();
    fetchTotalRevenue();
  }, []);


  return (
      <Stack
        sx={{ display: "flex", flexDirection: "row", fontFamily: "Tajawal" }}
      >
        <Box sx={{ width: "200px", backgroundColor: theme.palette.background.paper, borderLeft: `1px solid ${theme.palette.divider}` }}>
          <Stack>
            <AppBar
              position="static"
              sx={{
                backgroundColor: theme.palette.background.paper,
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
                      color: theme.palette.text.primary,
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
                  selectedItem === "Dashboard" ? theme.palette.primary.main + "20" : "transparent",
                color: selectedItem === "Dashboard" ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: "0.3s background-color ease",
                '&:hover': {
                  
                  backgroundColor: theme.palette.primary.main + "10",
                },
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
                  selectedItem === "Courses" ? theme.palette.primary.main + "20" : "transparent",
                color: selectedItem === "Courses" ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: "0.3s background-color ease",
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + "10",
                },
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
                  selectedItem === "Teachers" ? theme.palette.primary.main + "20" : "transparent",
                color: selectedItem === "Teachers" ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: "0.3s background-color ease",
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + "10",
                },
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
                  selectedItem === "Students" ? theme.palette.primary.main + "20" : "transparent",
                color: selectedItem === "Students" ? theme.palette.primary.main : theme.palette.text.secondary,
                transition: "0.3s background-color ease",
                '&:hover': {
                  backgroundColor: theme.palette.primary.main + "10",
                },
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
            backgroundColor: theme.palette.background.default,
            minHeight: "100vh",
            borderRight: `1px solid ${theme.palette.divider}`,
          }}
        >
          {/* <AppBar
            position="static"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderBottom: `1px solid ${theme.palette.divider}`,
              boxShadow: "none",
              padding: "0.5%",
            }}
          >
            <Toolbar>
              <Typography
                noWrap
                component="div"
                sx={{
                  display: {
                    xs: "none",
                    sm: "block",
                    fontWeight: "600",
                    fontSize: "20px",
                    color: theme.palette.text.primary,
                  },
                  flexGrow: 1,
                }}
              >
                لوحه التحكم
              </Typography>
              <ThemeToggle />
            </Toolbar>
          </AppBar> */}

          <Stack
            sx={{ display: "flex", flexDirection: "row", flexWrap: "wrap" }}
          >
            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px ",
                borderRadius: "20px",
                backgroundColor: isDarkMode ? theme.palette.primary.dark + "30" : "#F3F4FF",
                fontFamily: "Tajawal",
              }}
            >
              <img src={studentIcon} alt="الطلاب" />
              <Typography sx={{ color: theme.palette.text.secondary }}>الطلاب </Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
                {studentsCount} طالب
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px",
                borderRadius: "20px",
                backgroundColor: isDarkMode ? "#10B981" + "30" : "#F0FDF4",
                fontFamily: "Tajawal",
              }}
            >
              <img src={teacherIcon} alt="المعلمون" />
              <Typography sx={{ color: theme.palette.text.secondary }}>المعلمون </Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
                {teachersCount} معلم
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px",
                borderRadius: "20px",
                backgroundColor: isDarkMode ? "#F59E0B" + "30" : "#FFF7ED",
                fontFamily: "Tajawal",
              }}
            >
              <img src={coursesIcon} alt="الدورات" />
              <Typography sx={{ color: theme.palette.text.secondary }}>عدد الكورسات</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
                {coursesCount} كورس
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px ",
                borderRadius: "20px",
                backgroundColor: isDarkMode ? theme.palette.secondary.dark + "30" : "#F5F3FF",
                fontFamily: "Tajawal",
              }}
            >
              <img src={payments} alt="الإيرادات" />
              <Typography sx={{ color: theme.palette.text.secondary }}>الإيرادات الكلية</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold", color: theme.palette.text.primary }}>
                {totalRevenue} جنيه
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
  );
}