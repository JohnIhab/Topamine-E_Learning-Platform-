import { motion } from 'framer-motion';
import LinearProgress from '@mui/material/LinearProgress';
import {
    Avatar,
    Box,
    Divider,
    Grid,
    Link,
    Typography,
} from '@mui/material';
import {
    Email,
    Phone,
    Edit,
    Star,
    Info,
    ViewModule,
} from '@mui/icons-material';

import image from '../../assets/images/main-removebg.png';
import React from 'react';

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
        title: 'التفاضل المتقدم',
        subtitle: 'لطلاب الهندسة',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
        progress: 70
    }
];

const ProfileStudent = () => {
    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#f9f9f9',
                direction: 'rtl',
                p: 2,
            }}
        >
            <Box sx={{ width: '100%', maxWidth: 1500, p: 4 }}>
                <Grid container spacing={4}>
                    <Grid size={3} xs={12} md={3}>
                        <Avatar
                            src={image}
                            alt="عبده احمد"
                            sx={{ width: 150, height: 150, mb: 4 }}
                        />
                    </Grid>
                    <Grid size={9} xs={12} md={6}>
                        <Typography variant="h5" fontWeight="bold">
                            ايمن على
                        </Typography>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Email sx={{ ml: 1 }} />
                            <Typography>Sarah.Thompson@email.com</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Phone sx={{ ml: 1 }} />
                            <Typography>+1 (555) 123-4567</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Star sx={{ ml: 1 }} />
                            <Typography>الصف الثالث الثانوى</Typography>
                        </Box>
                        <Box display="flex" alignItems="center" mb={1}>
                            <Info sx={{ ml: 1, maxWidth: 200 }} />
                            <Typography>معلششششششششششششششششششش</Typography>
                        </Box>
                        <Link href="#" underline="hover" sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                            <Edit sx={{ ml: 1 }} />
                            تعديل الملف الشخصي
                        </Link>
                    </Grid>
                </Grid>
                <Divider sx={{ my: 4 }} />
                <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="h6">دوراتي</Typography>
                    <Link href="#" underline="hover" mr={10} display="flex" alignItems="center">
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
                                        overflow: 'hidden',
                                        boxShadow: 1,
                                        bgcolor: 'background.paper',
                                        width: 330
                                    }}
                                >
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        style={{ width: '100%', height: 200, objectFit: 'fill' }}
                                    />
                                    <Box p={2}>
                                        <Typography fontWeight="bold">{course.title}</Typography>
                                        <Typography sx={{ mb: 3 }} variant="body2" color="text.secondary" gutterBottom>
                                            {course.subtitle}
                                        </Typography>
                                        <Box sx={{ width: '100%', mb: 2 }}>
                                            <LinearProgress variant="determinate" value={course.progress} />
                                        </Box>
                                        <Box display="flex" alignItems="center" justifyContent="space-between" color="text.secondary" mb={2}>
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
