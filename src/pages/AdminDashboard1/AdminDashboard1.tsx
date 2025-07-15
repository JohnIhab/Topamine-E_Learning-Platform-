import * as React from "react";
import { useNavigate } from "react-router-dom";
import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Stack,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
} from "@mui/material";
import { useState } from "react";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";

// Images
import coursesIcon from "../../assets/images/book.png";
import teacherIcon from "../../assets/images/board.png";
import studentIcon from "../../assets/images/hatGrad.png";
import payments from "../../assets/images/dollar.png";

import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";

export default function PrimarySearchAppBar() {
  const [selectedItem, setSelectedItem] = React.useState("Dashboard");
  const navigate = useNavigate();

  //EditPassword
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // direction ,language
  React.useEffect(() => {
    document.documentElement.lang = "ar";
    document.documentElement.dir = "rtl";
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
            {/* الاعدادات */}
            <Box sx={{ textAlign: "center" }}>
              <Button
                onClick={handleOpen}
                sx={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  border: "1px solid #F3F4F6",
                  borderRadius: "8px",
                  height: "36px",
                  fontSize: "14px",
                  fontWeight: "500px",
                  margin: "0 3%",
                  textTransform: "capitalize",
                  "&:hover": {
                    backgroundColor: "#4F46E5",
                    color: "white",
                  },
                }}
              >
                الاعدادات
              </Button>
              {/* change password*/}
              <Dialog open={open} onClose={handleClose}>
                <DialogTitle>تغيير كلمة المرور</DialogTitle>
                <DialogContent>
                  <TextField
                    margin="dense"
                    placeholder="كلمة المرور القديمة"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    placeholder="كلمة المرور الجديدة"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    margin="dense"
                    placeholder="تأكيد كلمة المرور الجديدة"
                    type="password"
                    fullWidth
                  />
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose} color="error">
                    إلغاء
                  </Button>
                  <Button
                    onClick={handleClose}
                    color="primary"
                    variant="contained"
                  >
                    حفظ
                  </Button>
                </DialogActions>
              </Dialog>
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

          {/*Dashboard*/}
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
                backgroundColor: "#F3F4FF",
                fontFamily: "Tajawal",
              }}
            >
              <img src={studentIcon} alt="الطلاب" />
              <Typography sx={{ color: "gray" }}>الطلاب النشطين</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                1200
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px",
                borderRadius: "20px",
                backgroundColor: "#F0FDF4",
                fontFamily: "Tajawal",
              }}
            >
              <img src={teacherIcon} alt="المعلمون" />
              <Typography sx={{ color: "gray" }}>المعلمون النشطون</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                20
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px",
                borderRadius: "20px",
                backgroundColor: "#FFF7ED",
                fontFamily: "Tajawal",
              }}
            >
              <img src={coursesIcon} alt="الدورات" />
              <Typography sx={{ color: "gray" }}>الدورات النشطة</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                84
              </Typography>
            </Box>

            <Box
              sx={{
                width: "260px",
                height: "160px",
                padding: "40px",
                margin: "10px ",
                borderRadius: "20px",
                backgroundColor: "#F5F3FF",
                fontFamily: "Tajawal",
              }}
            >
              <img src={payments} alt="الإيرادات" />
              <Typography sx={{ color: "gray" }}>الإيرادات الكلية</Typography>
              <Typography sx={{ fontSize: "30px", fontWeight: "bold" }}>
                10.200
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
