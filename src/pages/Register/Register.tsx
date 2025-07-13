import React, { useRef, useState, useEffect } from 'react';
import axios from 'axios';
import {
    Grid,
    Tabs,
    Tab,
    TextField,
    Box,
    Typography,
    MenuItem,
    Button,
    IconButton,
    InputAdornment,
} from '@mui/material';
import { styled } from '@mui/system';
import loginPhoto from '../../assets/images/login.jpg';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import ImageIcon from '@mui/icons-material/Image';
import { Link, useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const governments = [
    'أسوان', 'أسيوط', 'الإسكندرية', 'الإسماعيلية', 'الأقصر', 'البحر الأحمر', 'البحيرة',
    'الجيزة', 'الدقهلية', 'السويس', 'الشرقية', 'الغربية', 'الفيوم', 'القاهرة',
    'القليوبية', 'المنوفية', 'المنيا', 'الوادي الجديد', 'بني سويف', 'بورسعيد',
    'جنوب سيناء', 'دمياط', 'سوهاج', 'شمال سيناء', 'قنا', 'كفر الشيخ', 'مطروح'
];
const grades = ['الصف الأول الثانوى', 'الصف الثانى الثانوى', 'الصف الثالث الثانوى', 'الثانوية العامة'];
const materials = ['لغة عربية', 'الرياضيات', 'لغة انجليزية', 'فيزياء', 'كيمياء', 'احياء', 'جيولوجيا', 'فلسفة', 'علم نفس', 'جغرافيا', 'تاريخ'];

const CustomBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f2f5',
});

const LoginContainer = styled(Box)({
    display: 'flex',
    width: '100%',
    maxWidth: '1000px',
    minHeight: '600px',
    backgroundColor: '#fff',
    borderRadius: '16px',
    overflow: 'hidden',
    boxShadow: '0 8px 20px rgba(0,0,0,0.1)',
});

const LeftPanel = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    padding: '40px',
});

const RightPanel = styled(Box)({
    flex: 1,
    backgroundImage: `url(${loginPhoto})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
});

const ScrollableFormBox = styled(Box)({
    overflowY: 'auto',
    maxHeight: 'calc(100vh - 120px)',
    paddingRight: '8px',
    paddingLeft: '8px',
});

const Register: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const nav = useNavigate();
    const isTeacher = tabIndex === 1;

    const handleImageClick = () => {
        fileInputRef.current?.click();
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setErrorMsg('يرجى اختيار ملف صورة صالح');
                return;
            }
            if (file.size > 5 * 1024 * 1024) {
                setErrorMsg('حجم الصورة يتجاوز الحد المسموح (5 ميغابايت)');
                return;
            }
            const imageURL = URL.createObjectURL(file);
            setImagePreview(imageURL);
        }
    };

    useEffect(() => {
        return () => {
            if (imagePreview) {
                URL.revokeObjectURL(imagePreview);
            }
        };
    }, [imagePreview]);

const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
        firstName: '',
        lastName: '',
        phone: '',
        province: 'الشرقية',
        email: '',
        password: '',
        confirmPassword: '',
        grade: 'الصف الأول الثانوى',
        subject: 'لغة عربية',
        isTeacher: tabIndex === 1,
    },
    validationSchema: Yup.object({
        firstName: Yup.string().required('الاسم الأول مطلوب'),
        lastName: Yup.string().required('اسم العائلة مطلوب'),
        phone: Yup.string()
            .matches(/^01[0125][0-9]{8}$/, 'رقم الهاتف غير صالح')
            .required('رقم الهاتف مطلوب'),
        province: Yup.string().required('المحافظة مطلوبة'),
        email: Yup.string().email('البريد الإلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
        password: Yup.string()
            .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
            .matches(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
            .matches(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
            .matches(/[0-9]/, 'يجب أن تحتوي على رقم')
            .matches(/[@$!%*?&#]/, 'يجب أن تحتوي على رمز خاص')
            .required('كلمة المرور مطلوبة'),
        confirmPassword: Yup.string()
            .oneOf([Yup.ref('password')], 'كلمة المرور غير متطابقة')
            .required('تأكيد كلمة المرور مطلوب'),
        isTeacher: Yup.boolean(),
        grade: Yup.string().when('isTeacher', {
            is: false,
            then: (schema) => schema.required('المرحلة الدراسية مطلوبة'),
            otherwise: (schema) => schema.notRequired(),
        }),
        subject: Yup.string().when('isTeacher', {
            is: true,
            then: (schema) => schema.required('المادة مطلوبة'),
            otherwise: (schema) => schema.notRequired(),
        }),
    }),
    onSubmit: async (values, { setSubmitting, setErrors }) => {
        try {
            await formik.validateForm(values);
            await sendDataToApi(values);
        } catch (error) {
            console.error('Validation or submission error:', error);
            setErrors({ submit: 'حدث خطأ أثناء التحقق من البيانات' });
            setSubmitting(false);
        }
    },
});
    useEffect(() => {
    console.log('isTeacher:', tabIndex === 1);
    formik.setFieldValue('isTeacher', tabIndex === 1);
}, [tabIndex]);


    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabIndex(newValue);
        formik.setFieldValue('isTeacher', newValue === 1);
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

function sendDataToApi(values) {
    setLoading(false);

    const formData = new FormData();
    formData.append('role', values.isTeacher ? 'Teacher' : 'Student');
    formData.append('firstName', values.firstName);
    formData.append('lastName', values.lastName);
    formData.append('email', values.email);
    formData.append('password', values.password);
    formData.append('confirmPassword', values.confirmPassword);
    formData.append('phone', values.phone);
    formData.append('province', values.province);

    if (!values.isTeacher) {
        formData.append('academicStage', values.grade);
    }

    if (values.isTeacher) {
        formData.append('subject', values.subject);
        if (fileInputRef.current?.files?.[0]) {
            formData.append('profileImage', fileInputRef.current.files[0]);
        } else {
            setErrorMsg('يرجى رفع صورة شخصية');
            setLoading(true);
            return;
        }
    }

    for (let [key, value] of formData.entries()) {
        console.log(`${key}: ${typeof value === 'object' ? value.name : value}`);
    }

    axios
        .post('https://topamun-backend.vercel.app/auth/register', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((response) => {
            console.log('✅ Success:', response);
            setLoading(true);
            if (response.status === 200) {
                nav('/login');
            } else {
                setErrorMsg('تم إرسال الطلب، لكن الاستجابة غير متوقعة');
            }
        })
        .catch((err) => {
            console.error('API Error:', JSON.stringify(err.response, null, 2));
            const errorMessage = err.response?.data?.msgError || '';
            if (err.response?.status === 409 && /email|بريد/i.test(errorMessage)) {
                setErrorMsg('البريد الإلكتروني موجود من قبل');
            } else {
                setErrorMsg(errorMessage || 'حدث خطأ أثناء التسجيل');
            }
            setLoading(true);
        });
}

    const renderForm = () => (
        <ScrollableFormBox component="form" onSubmit={formik.handleSubmit} noValidate sx={{ direction: 'rtl', mt: 2 }}>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="الاسم الأول"
                        name="firstName"
                        value={formik.values.firstName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                        helperText={formik.touched.firstName && formik.errors.firstName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="اسم العائلة"
                        name="lastName"
                        value={formik.values.lastName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                        helperText={formik.touched.lastName && formik.errors.lastName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="رقم الهاتف"
                        name="phone"
                        value={formik.values.phone}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.phone && Boolean(formik.errors.phone)}
                        helperText={formik.touched.phone && formik.errors.phone}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        select
                        label="المحافظة"
                        name="province"
                        value={formik.values.province}
                        onChange={formik.handleChange}
                        error={formik.touched.province && Boolean(formik.errors.province)}
                        helperText={formik.touched.province && formik.errors.province}
                    >
                        {governments.map((gov) => (
                            <MenuItem key={gov} value={gov}>{gov}</MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="البريد الإلكتروني"
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.email && Boolean(formik.errors.email)}
                        helperText={formik.touched.email && formik.errors.email}
                    />
                </Grid>
                {!isTeacher && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="المرحلة الدراسية"
                            name="grade"
                            value={formik.values.grade}
                            onChange={formik.handleChange}
                            error={formik.touched.grade && Boolean(formik.errors.grade)}
                            helperText={formik.touched.grade && formik.errors.grade}
                        >
                            {grades.map((grade) => (
                                <MenuItem key={grade} value={grade}>{grade}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                )}
                {isTeacher && (
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            select
                            label="المادة"
                            name="subject"
                            value={formik.values.subject}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={formik.touched.subject && Boolean(formik.errors.subject)}
                            helperText={formik.touched.subject && formik.errors.subject}
                        >
                            {materials.map((mat) => (
                                <MenuItem key={mat} value={mat}>{mat}</MenuItem>
                            ))}
                        </TextField>
                    </Grid>
                )}
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="كلمة المرور"
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.password && Boolean(formik.errors.password)}
                        helperText={formik.touched.password && formik.errors.password}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        fullWidth
                        label="تأكيد كلمة المرور"
                        type={showPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formik.values.confirmPassword}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.confirmPassword && Boolean(formik.errors.confirmPassword)}
                        helperText={formik.touched.confirmPassword && formik.errors.confirmPassword}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={togglePasswordVisibility}>
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />
                </Grid>
                {isTeacher && (
                    <Grid item xs={12}>
                        <Box
                            onClick={handleImageClick}
                            sx={{
                                border: '1px dashed #ccc',
                                p: 2,
                                textAlign: 'center',
                                borderRadius: 2,
                                cursor: 'pointer',
                                backgroundColor: '#fafafa',
                                minHeight: '100px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            {imagePreview ? (
                                <img
                                    src={imagePreview}
                                    alt="معاينة الصورة"
                                    style={{ maxHeight: '120px', borderRadius: '8px' }}
                                />
                            ) : (
                                <>
                                    <ImageIcon sx={{ fontSize: 40, color: '#999' }} />
                                    <Typography variant="body2">
                                        <strong style={{ color: '#1976d2', cursor: 'pointer' }}>
                                            اختر ملفًا
                                        </strong>
                                    </Typography>
                                </>
                            )}
                        </Box>
                        <input
                            type="file"
                            ref={fileInputRef}
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </Grid>
                )}
                <Grid item xs={12} mt="40px">
                    <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5 }}>
                        {loading ? 'إنشاء الحساب' : 'جارٍ التحميل...'}
                    </Button>
                </Grid>
                {errorMsg && (
                    <Typography color="error" align="center" mt={2}>
                        {errorMsg}
                    </Typography>
                )}
                <Typography variant="body2" align="center" mt={1}>
                    لديك حساب بالفعل؟{' '}
                    <Link to="/login">
                        <span style={{ color: '#1976d2', cursor: 'pointer' }}>تسجيل الدخول</span>
                    </Link>
                </Typography>
            </Grid>
        </ScrollableFormBox>
    );

    return (
        <CustomBox>
            <LoginContainer>
                <LeftPanel>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        إنشاء حساب
                    </Typography>
                    <Typography variant="body1" color="text.secondary" mb={2}>
                        انضم إلى منصتنا التعليمية
                    </Typography>
                    <Tabs value={tabIndex} onChange={handleTabChange} sx={{ mb: 2 }}>
                        <Tab label="طالب" />
                        <Tab label="معلم" />
                    </Tabs>
                    {renderForm()}
                </LeftPanel>
                <RightPanel />
            </LoginContainer>
        </CustomBox>
    );
};

export default Register;