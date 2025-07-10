import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Typography,
  IconButton,
  Toolbar,
  Box,
  Badge,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";
//icon
import DeleteIcon from "@mui/icons-material/Delete";

//images
import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";

// courses data
const courses = [
  {
    name: "AI for Beginners",
    instructor: "Eman Soliman",
    price: "$99",
    status: "Active",
  },
  {
    name: "Web Development",
    instructor: "Ahmed Salah",
    price: "$79",
    status: "Pending",
  },
];

export default function PrimarySearchAppBar() {
  const [selectedItem, setSelectedItem] = React.useState("dashboard");
  const navigate = useNavigate();

  return (
    <ThemeProvider theme={theme}>
      <Stack sx={{ display: "flex", flexDirection: "row" }}>
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
                navigate("/");
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
                style={{ height: "20px" }}
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
          {/* AppBar */}

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

          {/* Courses Manegement */}
          <TableContainer
            component={Paper}
            sx={{ mt: 4, borderRadius: "20px", margin: "2%", width: "96%" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "77%",
                padding: "20px",
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
                الكورسات
              </Typography>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    اسم الكورس
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    المعلم
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    السعر
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الحاله
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الاجراءات
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {courses.map((course, index) => (
                  <TableRow key={index}>
                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                      {course.name}
                    </TableCell>
                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                      {course.instructor}
                    </TableCell>
                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                      {course.price}
                    </TableCell>
                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                      {course.status}
                    </TableCell>
                    <TableCell sx={{ width: "20%", textAlign: "center" }}>
                      <Button color="error">
                        <DeleteIcon />
                      </Button>
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
