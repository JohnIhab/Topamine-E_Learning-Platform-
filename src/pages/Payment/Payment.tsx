import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Stack,
  FormControlLabel,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  Input,
  Toolbar,
  AppBar,
  Grid,
  TextField,
  Container,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../../../theme";

//Images
import paymentImage from "../../assets/images/payment.png";
import teacherImage from "../../assets/images/teacher.jpg";
import visa from "../../assets/images/visa.png";
import paypal from "../../assets/images/paypal.png";
import Applepay from "../../assets/images/applepay.png";
import Googlepay from "../../assets/images/Googlepay.png";
import secure from "../../assets/images/secure.png";
import SSL from "../../assets/images/ssl.png";
import moneyBack from "../../assets/images/money-back.png";
import TopaminIcon from "../../assets/images/Icon-logo.png";
//Icons
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import AllInclusiveIcon from "@mui/icons-material/AllInclusive";
import StarIcon from "@mui/icons-material/Star";
import HeadphonesIcon from "@mui/icons-material/Headphones";

import { useState } from "react";
import { useSnackbar } from "notistack";

//validation
//رقم البطاقه

const Payment = () => {
  //snackbar
  const { enqueueSnackbar } = useSnackbar();
  const [nationalId, setNationalId] = useState("");
  const [nationalIdError, setNationalIdError] = useState("");

  const [cvv, setCvv] = useState("");
  const [cvvError, setCvvError] = useState("");

  const [holderName, setHolderName] = useState("");
  const [holderNameError, setHolderNameError] = useState("");

  const [expiryDate, setExpiryDate] = useState("");
  const [expiryDateError, setExpiryDateError] = useState("");

  const handlePurchase = () => {
    let valid = true;

    if (nationalId.length !== 14) {
      setNationalIdError("رقم البطاقة يجب أن يكون 14 رقمًا");
      valid = false;
    } else {
      setNationalIdError("");
    }

    if (cvv.length !== 3) {
      setCvvError("CVV يجب أن يتكون من 3 أرقام");
      valid = false;
    } else {
      setCvvError("");
    }

    const containsNumberRegex = /\d/;
    if (!holderName.trim()) {
      setHolderNameError("من فضلك أدخل اسم حامل البطاقة");
      valid = false;
    } else if (containsNumberRegex.test(holderName.trim())) {
      setHolderNameError(" الاسم يجب الا يحتوى على ارقام");
    } else {
      setHolderNameError("");
    }

    if (!expiryDate) {
      setExpiryDateError("من فضلك اختر تاريخ الانتهاء");
      valid = false;
    } else {
      setExpiryDateError("");
    }

    if (valid) {
      enqueueSnackbar("تم الشراء بنجاح ", {
        variant: "success",
        autoHideDuration: 3000,
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack>
        <AppBar
          position="static"
          sx={{
            backgroundColor: "white",
            height: "75px",
            color: "black",
            fontSize: "16px",
            fontWeight: "400",
            borderBottom: "1px solid rgba(157, 180, 206, 0.57)",
            boxShadow: "none",
          }}
        >
          <Toolbar>
            <img src="" alt="" />
            <img
              src={TopaminIcon}
              alt="توبامين"
              style={{ width: "40px", height: "40px" }}
            />
            <Typography
              variant="h6"
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
            <Typography noWrap component="div" sx={{ padding: "30px 20px" }}>
              الدورات
            </Typography>
            <Typography
              // variant="h5"
              noWrap
              component="div"
              sx={{ padding: "30px  20px" }}
            >
              التصنيفات
            </Typography>
            <Typography
              // variant="h5"
              noWrap
              component="div"
              sx={{ padding: "30px 20px" }}
            >
              تعلمي
            </Typography>
          </Toolbar>
        </AppBar>

        {/* container */}
        <Grid
          container
          spacing={4}
          sx={{
            padding: "2%",
            maxWidth: "1400px",
            margin: "auto",
          }}
        >
          {/* right Section */}
          <Grid item xs={12} md={5} sx={{ maxWidth: "820px" }}>
            <Card sx={{ boxShadow: "none" }}>
              <CardMedia
                component="img"
                image={paymentImage}
                alt="paymentImage"
                sx={{ width: "100%", height: "522px", borderRadius: "12px" }}
              />
              <CardContent>
                <Typography
                  gutterBottom
                  sx={{ fontWeight: "700", fontSize: "30px", height: "36px" }}
                >
                  دورة احتراف التسويق الرقمي المتقدم
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  تعلم استراتيجيات التسويق الرقمي الحديثة من خبراء المجال
                </Typography>
                <Box mt={2} display="flex" gap={2} alignItems="center">
                  <img
                    src={teacherImage}
                    alt="studentImage"
                    width={48}
                    height={48}
                    style={{ borderRadius: 30 }}
                  />
                  <Box>
                    <Typography sx={{ fontSize: "16px", fontWeight: "500" }}>
                      {" "}
                      إيمان سليمان{" "}
                    </Typography>
                    <Typography
                      variant="body1"
                      color="text.secondary"
                      sx={{ fontSize: "16px", fontWeight: "400" }}
                    >
                      خبيرة تسويق بخبرة أكثر من 15 سنة
                    </Typography>
                  </Box>
                </Box>

                <Grid container spacing={2} mt={2}>
                  {/* First Column */}
                  <Grid item xs={12} md={6}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <AccessTimeIcon
                        sx={{ width: "20px", height: "20px", color: "#2563EB" }}
                      />
                      <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                        40 ساعة من الفيديو
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <HeadphonesIcon
                        sx={{ width: "20px", height: "20px", color: "#2563EB" }}
                      />
                      <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                        دعم فني 24/7
                      </Typography>
                    </Stack>
                  </Grid>

                  {/* Second Column */}
                  <Grid item xs={12} md={6}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      mb={1}
                    >
                      <StarIcon
                        sx={{ width: "20px", height: "20px", color: "#2563EB" }}
                      />
                      <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                        شهادة إتمام الدورة
                      </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <AllInclusiveIcon
                        sx={{ width: "20px", height: "20px", color: "#2563EB" }}
                      />
                      <Typography sx={{ fontSize: "16px", fontWeight: "400" }}>
                        وصول مدى الحياة
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          {/* left Section */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                padding: 3,
                // width: "400px",
                // height: "830px",
                width: "100%",
                height: "auto",
                backgroundColor: "#F9FAFB",
                boxShadow: "none",
              }}
            >
              <Typography
                variant="h5"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: "30px", fontWeight: "700" }}
              >
                100.000$
                <span
                  style={{
                    color: "rgba(179, 177, 177, 0.93)",
                    textDecoration: "line-through",
                    marginLeft: "30px",
                    fontSize: "30px",
                    fontWeight: "700",
                  }}
                >
                  140.000$
                </span>
              </Typography>
              <span
                style={{
                  padding: "4px 12px",
                  borderRadius: "9999px",
                  color: "red",
                  backgroundColor: "#ffebee",
                }}
              >
                خصم 50% - عرض لفترة محدودة
              </span>
              <Typography
                variant="h6"
                fontWeight="bold"
                gutterBottom
                sx={{ fontSize: "18px", fontWeight: "600", marginTop: 3 }}
              >
                اختر وسيلة الدفع
              </Typography>
              <Box>
                <FormControl>
                  <RadioGroup defaultValue="medium" name="radio-buttons-group">
                    <div
                      style={{
                        border: "1px solid #E5E7EB",
                        width: "352px",
                        height: "50px",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="credit"
                        control={
                          <Radio
                            sx={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "10px",
                            }}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={visa}
                              alt="visa"
                              style={{ width: "24px" }}
                            />
                            <Typography>بطاقة ائتمان / خصم</Typography>
                          </Box>
                        }
                      />
                    </div>

                    <div
                      style={{
                        border: "1px solid #E5E7EB",
                        width: "352px",
                        height: "50px",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="paypal"
                        control={
                          <Radio
                            sx={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "10px",
                            }}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={paypal}
                              alt="paypal"
                              style={{ width: "24px" }}
                            />
                            <Typography>باي بال</Typography>
                          </Box>
                        }
                      />
                    </div>

                    <div
                      style={{
                        border: "1px solid #E5E7EB",
                        width: "352px",
                        height: "50px",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="applePay"
                        control={
                          <Radio
                            sx={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "10px",
                            }}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={Applepay}
                              alt="Applepay"
                              style={{ width: "24px" }}
                            />
                            <Typography>Apple Pay</Typography>
                          </Box>
                        }
                      />
                    </div>

                    <div
                      style={{
                        border: "1px solid #E5E7EB",
                        width: "352px",
                        height: "50px",
                        padding: "12px",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    >
                      <FormControlLabel
                        value="googlePay"
                        control={
                          <Radio
                            sx={{
                              width: "16px",
                              height: "16px",
                              marginLeft: "10px",
                            }}
                          />
                        }
                        label={
                          <Box display="flex" alignItems="center" gap={1}>
                            <img
                              src={Googlepay}
                              alt="Googlepay"
                              style={{ width: "24px" }}
                            />
                            <Typography>Google Pay</Typography>
                          </Box>
                        }
                      />
                    </div>
                  </RadioGroup>
                </FormControl>
              </Box>
              <Stack spacing={1.5} sx={{ minWidth: 300 }}>
                <FormControl>
                  <FormLabel
                    sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    رقم البطاقة
                  </FormLabel>

                  <Input
                    value={nationalId}
                    onChange={(e) =>
                      setNationalId(e.target.value.replace(/\D/g, ""))
                    }
                    placeholder="1234 5678 9012 3456"
                    disableUnderline
                    error={!!nationalIdError}
                    sx={{
                      border: "1px solid #D1D5DB",
                      padding: "5px",
                      borderRadius: "8px",
                    }}
                  />
                  {nationalIdError && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      {nationalIdError}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
              <Stack
                spacing={1.5}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "20px",
                  alignItems: "center",
                }}
              >
                <FormControl>
                  <FormLabel
                    sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    تاريخ الانتهاء
                  </FormLabel>

                  <Input
                    type="date"
                    value={expiryDate}
                    onChange={(e) => setExpiryDate(e.target.value)}
                    disableUnderline
                    error={!!expiryDateError}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "10px",
                      padding: "5px",
                    }}
                  />
                  {expiryDateError && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      {expiryDateError}
                    </Typography>
                  )}
                </FormControl>

                <FormControl>
                  <FormLabel
                    sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    CVV
                  </FormLabel>

                  <Input
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
                    placeholder="123"
                    disableUnderline
                    error={!!cvvError}
                    sx={{
                      border: "1px solid gray",
                      borderRadius: "10px",
                      padding: "5px",
                    }}
                  />
                  {cvvError && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      {cvvError}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
              <Stack spacing={1.5} sx={{ minWidth: 300 }}>
                <FormControl>
                  <FormLabel
                    sx={{
                      fontWeight: "500",
                      fontSize: "14px",
                      color: "#374151",
                    }}
                  >
                    اسم حامل البطاقة
                  </FormLabel>

                  <Input
                    value={holderName}
                    onChange={(e) => setHolderName(e.target.value)}
                    placeholder="إيمان سليمان"
                    disableUnderline
                    error={!!holderNameError}
                    sx={{
                      border: "1px solid gray",
                      padding: "5px",
                      borderRadius: "10px",
                    }}
                  />
                  {holderNameError && (
                    <Typography sx={{ color: "red", fontSize: "12px" }}>
                      {holderNameError}
                    </Typography>
                  )}
                </FormControl>
              </Stack>
              <Box mt={2}>
                <button
                  onClick={handlePurchase}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "none",
                    borderRadius: "8px",
                    fontSize: "16px",
                    cursor: "pointer",
                    color: "white",
                    background: "#2563EB",
                  }}
                >
                  إتمام الشراء
                </button>
              </Box>

              <Stack sx={{ display: "flex", flexDirection: "row" }}>
                <div
                  style={{
                    width: "90px",
                    height: "40px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <img
                    src={secure}
                    alt="secure"
                    style={{
                      padding: " 10px 10px 0 0",
                      width: "25px",
                      height: "25px",
                    }}
                  />
                  <span> دفع آمن</span>
                </div>
                <div
                  style={{
                    width: "90px",
                    height: "40px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <img
                    src={SSL}
                    alt="SSL"
                    style={{
                      padding: " 10px 10px 0 0",
                      width: "25px",
                      height: "25px",
                      marginLeft: "10px",
                    }}
                  />
                  تشفير SSL
                </div>
                <div
                  style={{
                    width: "90px",
                    height: "40px",
                    display: "flex",
                    flexDirection: "row",
                    gap: "10px",
                  }}
                >
                  <img
                    src={moneyBack}
                    alt="money Back graunte"
                    style={{
                      padding: " 10px 10px 0 0",
                      width: "25px",
                      height: "25px",
                      marginLeft: "10px",
                    }}
                  />
                  ضمان استرجاع الأموال
                </div>
              </Stack>
            </Card>
          </Grid>
        </Grid>

        <Box
          sx={{
            backgroundColor: "#F9FAFB",
            padding: "30px 30%",
            color: "black",
          }}
        >
          <Stack
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              fontWeight: "400",
              fontsize: "16px",
              color: "#4B5563",
            }}
          >
            <Typography>الشروط والأحكام</Typography>
            <Typography>سياسة الخصوصية</Typography>
            <Typography>سياسة الاسترجاع</Typography>
          </Stack>
          <Typography
            sx={{ fontWeight: "400", fontsize: "16px", color: "#4B5563" }}
          >
            © 2024 . جميع الحقوق محفوظة
          </Typography>
        </Box>
      </Stack>
    </ThemeProvider>
  );
};

export default Payment;
