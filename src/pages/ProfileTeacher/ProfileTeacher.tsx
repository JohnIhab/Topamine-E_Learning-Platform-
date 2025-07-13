import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import {
    Avatar,
    Box,
    Button,
    Divider,
    Grid,
    Typography,
} from '@mui/material';
import {
    Email,
    Phone,
    Edit,
    School,
    Star,
    Info,
    CalendarMonth,
    Payment,
    ViewModule,
    Dashboard,
} from '@mui/icons-material';

import image from '../../assets/images/main-removebg.png';

type Course = {
    title: string;
    subtitle: string;
    image: string;
    start: string;
    end: string;
};

const courses: Course[] = [
    {
        title: 'التفاضل المتقدم',
        subtitle: 'لطلاب الهندسة',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
    {
        title: 'أساسيات الإحصاء',
        subtitle: 'مقدمة في تحليل البيانات',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
    {
        title: 'الجبر الخطي',
        subtitle: 'أساسيات الرياضيات لعلوم الحاسب',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
    {
        title: 'الرياضيات المتقطعة',
        subtitle: 'أساسيات علوم الحاسوب',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
    {
        title: 'نظرية الاحتمالات',
        subtitle: 'مفاهيم إحصائية متقدمة',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
    {
        title: 'المنطق الرياضي',
        subtitle: 'مقدمة في الأنظمة الشكلية',
        image,
        start: 'سبتمبر 2023',
        end: 'ديسمبر 2023',
    },
];

const TeacherProfile = () => {
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
                        <Button variant="contained" startIcon={<Dashboard />} sx={{ mb: 2 }}>
                            الذهاب إلى اللوحة
                        </Button>
                    </Grid>

                    <Grid size={9} xs={12} md={6}>

                        <Box display="flex" alignItems="center" gap={2}>
                            <Typography variant="h5" fontWeight="bold">
                                عبده احمد
                            </Typography>
                            <Button  variant="outlined" size="small" sx={{ whiteSpace: 'nowrap', mx:'30px' }}>
                                متابعة
                            </Button>
                        </Box>
                        <Typography color="text.secondary" gutterBottom>
                            أستاذ رياضيات
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
                            <School sx={{ ml: 1 }} />
                            <Typography>التخصص: رياضيات، إحصاء</Typography>
                        </Box>

                        <Box display="flex" alignItems="center" mb={1}>
                            <Star sx={{ ml: 1 }} />
                            <Typography>الخبرة: أكثر من 8 سنوات</Typography>
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
                        عرض كل الدورات
                    </Link>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={2}>
                    تقوم حاليًا بتدريس {courses.length} دورات
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
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {course.subtitle}
                                        </Typography>
                                        <Box display="flex" alignItems="center" color="text.secondary" mb={2}>
                                            <CalendarMonth fontSize="small" sx={{ ml: 0.5 }} />
                                            <Typography variant="body2">
                                                {course.start} – {course.end}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" gap={1}>
                                            <Link to="/profileTeacher/courseDetails" style={{ textDecoration: 'none' }}>
                                            <Button fullWidth variant="outlined">
                                                تفاصيل الدورة
                                            </Button>
                                            </Link>
                                            <Button
                                                fullWidth
                                                variant="contained"
                                                startIcon={<Payment sx={{ ml: 1 }} />}
                                            >
                                                معلومات الدفع
                                            </Button>
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

export default TeacherProfile;
