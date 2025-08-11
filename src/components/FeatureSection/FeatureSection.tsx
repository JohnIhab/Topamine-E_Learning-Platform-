import { Box, Grid, Typography, Paper } from "@mui/material";
import { motion } from "framer-motion";
import mainImg from "../../assets/images/main-removebg.png";
import backgroundSvg from "../../assets/images/25182514_7044278.svg";


export default function FeatureSection() {
  const features = [
    "ابدأ رحلتك من غير ما تحس إنك بتذاكر",
    "معاك بوت كامل بتاعك يقدر يحدد مستواك",
    "منصة واحدة، آلاف الفرص للتفوق",
  ];

  return (
    <Box
      sx={{
        backgroundImage: `url(${backgroundSvg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "",
        px: { xs: 4, md: 12 },
        direction: "rtl",
      }}
    >
      <Grid container alignItems="center" justifyContent="center" spacing={6}>
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ scale: 0.9, rotate: -5 }}
            animate={{ scale: [0.9, 1.05, 1], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ position: "relative" }}
          >
            <Box
              sx={{
                width: 500,
                height: 500,
                borderRadius: "50%",
                boxShadow: "0 0 40px rgba(56, 189, 248, 0.4)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <Box
                component="img"
                src={mainImg}
                alt="main"
                sx={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                }}
              />
            </Box>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={3}>
            {features.map((text, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Paper
                  elevation={4}
                  sx={{
                    backgroundColor: "#7dbcbcb6",
                    border: "2px solid #38bdf8",
                    borderRadius: "16px",
                    px: 3,
                    py: 2,
                    textAlign: "right",
                    color: '#fff'
                  }}
                >
                  <Typography fontWeight="bold" fontSize="1.2rem">
                    {text}
                  </Typography>
                </Paper>
              </motion.div>
            ))}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
