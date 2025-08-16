import mainImg from '../../assets/images/main-removebg.png'
import { Box, Grid, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import FeatureSection from '../../components/FeatureSection/FeatureSection';
import TeacherSec from '../../components/TeacherSec/TeacherSec';

export default function Home() {
  return (
    <>
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          direction: 'rtl',
          px: 8,
          py: 0,
          overflow: 'hidden',
        }}
      >
        <Grid container alignItems="center" spacing={8}>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection="column" alignItems="flex-end" gap={2} textAlign="right">
              <motion.div
                initial={{ opacity: .3, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 1,
                  type: 'spring',
                  stiffness: 100,
                }}
              >
                <Typography variant="h2" fontWeight="bold">
                  منصة <span style={{ color: '#60a5fa' }}>توبامين</span>
                </Typography>
              </motion.div>
              <Typography variant="h5" fontWeight="500">
                منصة تعليمة شاملة جميع المراحل التعليمية
              </Typography>
              <Typography variant="body1" fontSize={18}>
                توبامين هي مزيج من كلمتين كلمة توب "Top" وكلمة دوبامين "Dupamine"
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: 'relative',
                width: 600,
                height: 600,
                mx: 'auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.div
                initial={{ scale: 1 }}
                animate={{
                  scale: [1, 1.05, 1],
                  rotate: [0, 2, -2, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, 5, -5, 0],
                  transition: {
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: 'loop',
                  },
                }}
                style={{
                  position: 'absolute',
                  width: 700,
                  height: 700,
                  top: 0,
                  left: -30,
                  zIndex: 0,
                  cursor: 'pointer',
                }}
              >
                <svg
                  viewBox="0 0 200 200"
                  xmlns="http://www.w3.org/2000/svg"
                  width="100%"
                  height="100%"
                >
                  <path
                    fill="#60a5fa"
                    d="M46.1,-53.4C58.3,-45.4,66.7,-29.6,65.3,-15.3C63.8,-0.9,52.4,11.8,43.1,22.5C33.8,33.1,26.5,41.6,16.3,47.4C6,53.2,-7.2,56.3,-21.6,54.5C-36,52.8,-51.5,46.3,-60.6,34.2C-69.6,22.1,-72.3,4.5,-68.6,-11.3C-64.9,-27.1,-54.8,-41.2,-41.1,-49.4C-27.4,-57.7,-13.7,-60.2,1.7,-62.2C17.1,-64.3,34.3,-65.7,46.1,-53.4Z"
                    transform="translate(100 100)"
                  />
                </svg>
              </motion.div>

              <motion.img
                src={mainImg}
                alt="main img"
                loading="lazy"
                initial={{ opacity: 0.3, y: 0 }}
                animate={{
                  opacity: [0.3, 1, 0.7, 1],
                  y: [0, -15, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  repeatType: 'loop',
                }}
                style={{
                  width: 500,
                  height: 500,
                  borderRadius: 24,
                  zIndex: 1,
                }}
              />
            </Box>

          </Grid>
        </Grid>
      </Box>
      <TeacherSec />
      <FeatureSection />
    </>
  )
}
