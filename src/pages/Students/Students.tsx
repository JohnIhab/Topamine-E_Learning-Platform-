import * as React from "react";
import { useNavigate } from "react-router-dom";

import {
  AppBar,
  Typography,
  Toolbar,
  Box,
  Stack,
  TextField,
  Autocomplete,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";

//icon
import SearchIcon from "@mui/icons-material/search";
import InputAdornment from "@mui/material/InputAdornment";
//images
import dashboardIcon from "../../assets/images/dashboardIcon.png";
import grayCoursesIcon from "../../assets/images/graycoursesIcon.png";
import grayTeachersIcon from "../../assets/images/grayTeachersIcon.png";
import grayStudentsIcon from "../../assets/images/graystudentsIcon.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";
import blockIcon from "../../assets/images/blockIcon.png";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Button,
} from "@mui/material";
import { useState } from "react";

//Students Data
const studentstable = [
  {
    name: "دينا محمد",
    email: "dina@gmail.com",
    enrollmentdata: "2024-01-15",
    courses: 3,
    status: "فعال",
  },
  {
    name: "احمد محمد",
    email: "ahmed@gmail.com",
    enrollmentdata: "2024-01-15",
    courses: 3,
    status: "فعال",
  },
  {
    name: "سليمان عبدالرحمن",
    email: "dina@gmail.com",
    enrollmentdata: "2024-01-15",
    courses: 3,
    status: "فعال",
  },
];

export default function PrimarySearchAppBar() {
  const [selectedItem, setSelectedItem] = useState("dashboard");
  const [searchValue, setSearchValue] = useState("");
  const navigate = useNavigate();

  //EditPassword
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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

          {/* Student Manegement */}

          <TableContainer
            component={Paper}
            sx={{ mt: 4, borderRadius: "20px", margin: "2%", width: "96%" }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: "60%",
                padding: "2%",
              }}
            >
              <Typography variant="h6" fontWeight="bold" sx={{ p: 2 }}>
                الطلاب
              </Typography>
              <Stack
                spacing={2}
                sx={{
                  width: 300,
                }}
              >
                <Autocomplete
                  freeSolo
                  id="free-solo-2-demo"
                  disableClearable
                  options={studentstable.map((option) => option.name)}
                  onInputChange={(event, newInputValue) => {
                    setSearchValue(newInputValue);
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder="ابحث عن طالب ..."
                      InputProps={{
                        ...params.InputProps,
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon sx={{ color: "gray" }} />
                          </InputAdornment>
                        ),
                        inputProps: {
                          ...params.inputProps,
                          type: "search",
                        },
                      }}
                      sx={{
                        "& .MuiInputBase-root": {
                          height: "50px",
                          borderRadius: "10px",
                          border: "1px solid rgba(134, 145, 160, 0.57)",
                          color: "#4F46E5",
                          paddingX: 1,
                        },
                        "& .MuiInputBase-input": {
                          color: "gray",
                        },
                        "& .MuiInputLabel-root": {
                          color: "gray",
                        },
                      }}
                    />
                  )}
                />
              </Stack>
            </Box>

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    اسم الطالب
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    الايميل
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    موعد الالتحاق
                  </TableCell>
                  <TableCell sx={{ width: "20%", textAlign: "center" }}>
                    {" "}
                    الكورسات
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
                {studentstable
                  .filter((studentstable) =>
                    searchValue === ""
                      ? true
                      : studentstable.name
                          .toLowerCase()
                          .includes(searchValue.toLowerCase())
                  )

                  .map((studentstable, index) => (
                    <TableRow key={index}>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {studentstable.name}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {studentstable.email}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {studentstable.enrollmentdata}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {studentstable.courses}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        {studentstable.status}
                      </TableCell>
                      <TableCell sx={{ width: "20%", textAlign: "center" }}>
                        <img src={blockIcon} alt="Block" />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
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
              <Button onClick={handleClose} color="primary" variant="contained">
                حفظ
              </Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Stack>
    </ThemeProvider>
  );
}
