import React, { useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import FolderIcon from '@mui/icons-material/Folder';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
// import SubCollape from '../SubCollape.tsx';
import Skeleton from '@mui/material/Skeleton';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CustomCollapse from '../Collapse/Collapse.tsx';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import rtlPlugin from 'stylis-plugin-rtl';
import { prefixer } from 'stylis';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
const theme = createTheme({ direction: 'rtl' });
const cacheRtl = createCache({ key: 'muirtl', stylisPlugins: [prefixer, rtlPlugin] });

const CourseDel: React.FC = () => {
  //  const [open, setOpen] = useState(false);

  const [openLectures, setOpenLectures] = useState(
    Array.from({ length: 10 }, () => false)
  );

  const toggleLecture = (index: number) => {
    setOpenLectures(prev =>
      prev.map((open, i) => (i === index ? !open : open))
    );
  };
  return (
    <>
      <Box
        sx={{
          width: '95vw',
          height: '400px',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          margin: 'auto',
          mb: 9
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 255, 0.3)',
            zIndex: 1,
            borderRadius: 3,
            boxShadow: 15,
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            top: '75%',
            right: 50,
            transform: 'translateY(-50%)',
            zIndex: 2,
          }}
        >
          <Typography sx={{ fontSize: 30, fontWeight: 'bold', color: 'white' }}>
            الشهر التاني الترم التاني (محمد صلاح-لغة عربية-2ثانوي)
          </Typography>
          <Typography sx={{ color: 'white', mb: 2, ml: 40, mt: 2 }}>
            يتكون الشهر من 4محاضرات-محاضرة اسبوعيا
          </Typography>
          <Stack direction="row" spacing={5} sx={{ ml: 3 }}>
            <Stack direction="row" spacing={1}>
              <Typography sx={{ color: 'white' }}>
                اخر تحديث للكورس الاتنين 21ابريل 2025
              </Typography>
              <RadioButtonCheckedIcon sx={{ width: 15, color: 'white' }} />
            </Stack>
            <Stack direction="row" spacing={1}>
              <Typography sx={{ color: 'white' }}>
                تاريخ انشاء الكورس الخميس 6 مارس 2025
              </Typography>
              <FolderIcon sx={{ width: 15, color: 'white' }} />
            </Stack>
          </Stack>
        </Box>
      </Box>

      <Box sx={{ width: '60%', textAlign: 'right', mt: 2, mb: 10, border: '1px solid #e0e0e0', ml: 61, mr: 4, height: 40, pb: 20, pr: 5, pt: 6, boxShadow: 5, borderRadius: 3 }}>
        <Skeleton sx={{ width: '10%', height: 10, float: 'right', color: '#e0e0e0' }} animation={false} />
        <br />
        <Typography sx={{ fontWeight: 'bold', fontSize: 30 }}>
          الشهر الثاني الترم التاني (محمد صلاح - لغة عربية - 2 ثانوي)
        </Typography>
        <Skeleton sx={{ width: '20%', height: 10, float: 'right' }} animation={false} />
        <br />
        <Skeleton sx={{ width: '10%', height: 10, float: 'right' }} animation={false} />
        <Typography sx={{ color: 'gray', mt: 2 }}>يتكون الشهر من 4محاضرات-محاضرة اسبوعيا</Typography>
      </Box>
      <CacheProvider value={cacheRtl}>
        <ThemeProvider theme={theme}>

          <Box sx={{ pb: 4, backgroundColor: '#f5f5f5', width: '95vw', margin: 'auto', borderRadius: 5, boxShadow: 15 }}>
            <Stack direction={'column'} spacing={4}>
              <Box>
                <Stack
                  direction="column"
                  spacing={2}
                  sx={{ width: '97%', alignItems: 'flex-start', mt: 4, ml: 6 }}
                >
                  <Skeleton
                    variant="text"
                    sx={{ width: '10%', height: 10, bgcolor: '#e0e0e0' }}
                    animation={false}
                  />
                  <Typography sx={{ fontSize: 40, fontWeight: 'bold' }}>
                    محتوى الكورس
                  </Typography>
                  <Skeleton
                    variant="text"
                    sx={{ width: '20%', height: 10, bgcolor: '#e0e0e0' }}
                    animation={false}
                  />
                  <Skeleton
                    variant="text"
                    sx={{ width: '10%', height: 10, bgcolor: '#e0e0e0' }}
                    animation={false}
                  />
                </Stack>
              </Box>
              <Stack direction={'column'} spacing={1}>
                <Box sx={{ width: '95%', pl: 5, pt: 2, pb: 2 }}>
                  {openLectures.map((isOpen, index) => (
                    <Box key={index} sx={{ mb: 3 }}>
                      <Box
                        sx={{
                          border: '1px solid #bdbdbd',
                          p: 3,
                          boxShadow: 10,
                          borderRadius: 2,
                          backgroundColor: 'white'
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                          sx={{
                            p: 4,
                            borderRadius: 2,
                            cursor: 'pointer',
                            backgroundColor: '#f1f1f1'
                          }}
                          onClick={() => toggleLecture(index)}
                        >
                          {/* {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />} */}
                          <Stack direction="row" spacing={1}>
                            <DashboardCustomizeIcon sx={{ color: '#e57373' }} />
                            <Typography variant="subtitle1">
                              المحاضرة {index + 1}
                            </Typography>
                            {/* <DashboardCustomizeIcon sx={{ color: '#e57373' }} /> */}
                          </Stack>
                          {isOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                        </Stack>
                      </Box>

                      <Collapse in={isOpen}>
                        <Box sx={{ mt: 1, px: 2 }}>
                          <List>
                            {Array.from({ length: 8 }).map((_, i) => (
                              <ListItem key={i}>
                                <CustomCollapse title={`المحتوى ${i + 1}`} />
                              </ListItem>
                            ))}
                          </List>
                        </Box>
                      </Collapse>
                    </Box>
                  ))}
                </Box>

              </Stack>
            </Stack>
          </Box>
        </ThemeProvider>
      </CacheProvider>


    </>
  );
};

export default CourseDel; 