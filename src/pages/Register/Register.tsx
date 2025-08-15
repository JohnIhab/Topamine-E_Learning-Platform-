import React, { useRef, useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { signInWithPopup } from 'firebase/auth';
import { googleProvider, auth, db } from '../../firebase';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import GoogleIcon from "@mui/icons-material/Google";
import { Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
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
const grades = ['الصف الأول الثانوى', 'الصف الثانى الثانوى', 'الصف الثالث الثانوى'];
const materials = ['لغة عربية', 'الرياضيات', 'لغة انجليزية', 'فيزياء', 'كيمياء', 'احياء', 'جيولوجيا', 'فلسفة', 'علم نفس', 'جغرافيا', 'تاريخ'];




const Register: React.FC = () => {
    const [tabIndex, setTabIndex] = useState(0);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(true);
    const [showWaitingPopup, setShowWaitingPopup] = useState(false);
    const [open, setOpen] = useState(true);

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
            info: '',
            grade: 'الصف الأول الثانوى',
            subject: 'لغة عربية',
            blocked: false,
            isTeacher: tabIndex === 1,
            isStudent: tabIndex === 0,

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
        onSubmit: async (values) => {
            console.log("Submitting form values:", values);
            setLoading(false);
            setErrorMsg('');
            try {
                const { email, password } = values;

                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                const uid = user.uid;
                const fullName = `${values.firstName} ${values.lastName}`;
                let imageUrl = null;
                if (isTeacher && fileInputRef.current?.files?.[0]) {
                    const imageFile = fileInputRef.current.files[0];
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    formData.append("upload_preset", "topamine");
                    formData.append("folder", "profile_pictures");
                    try {
                        const response = await fetch("https://api.cloudinary.com/v1_1/duljb1fz3/image/upload", {
                            method: "POST",
                            body: formData,
                        });
                        const data = await response.json();
                        imageUrl = data?.secure_url;
                    } catch (err) {
                        console.error("فشل رفع الصورة:", err);
                        setErrorMsg("فشل رفع الصورة");
                        return;
                    }
                }

                await setDoc(doc(db, 'users', uid), {
                    avatar: imageUrl,
                    email: values.email,
                    governorate: values.province,
                    grade: values.isTeacher ? null : values.grade,
                    id: uid,
                    name: fullName,
                    phone: values.phone,
                    role: values.isTeacher ? 'teacher' : 'student',
                    subject: values.isTeacher ? values.subject : null,
                    status: values.isTeacher ? 'قيد المراجعة' : 'تم القبول',
                    blocked: values.isStudent || values.isTeacher ? false : true,
                    createdAt: new Date(),
                });


                console.log("تم إنشاء المستخدم وإضافة البيانات بنجاح");
                if (values.isTeacher) {
                    setShowWaitingPopup(true)
                } else {
                    nav('/profileTeacher');
                }

            } catch (error) {
                console.error('خطأ أثناء إنشاء الحساب:', error);
                setErrorMsg(error.message);
            } finally {
                setLoading(true);
            }
        }


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

    const handleGoogleRegister = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(db, 'users', user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await setDoc(userRef, {
                    name: user.displayName,
                    email: user.email,
                    avatar: user.photoURL,
                    role: 'student',
                    id: user.uid,
                });
            }

            nav('/profileStd');
        } catch (error) {
            console.error('فشل تسجيل الدخول باستخدام جوجل:', error);
            setErrorMsg('حدث خطأ أثناء التسجيل باستخدام جوجل');
        }
    };

    const handleCloseDialog = () => {
        setOpen(false); 
    };


    const renderForm = () => (
        <Box 
            component="form" 
            onSubmit={formik.handleSubmit} 
            noValidate 
            sx={{ 
                direction: 'rtl', 
                mt: 2,
                overflowY: 'auto',
                maxHeight: 'calc(100vh - 120px)',
                paddingRight: '8px',
                paddingLeft: '8px'
            }}
        >
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


                <Grid item xs={12} mt={2}>
                    <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<GoogleIcon />}
                        onClick={handleGoogleRegister}
                        sx={{ mt: 2, '& .MuiButton-startIcon': { marginLeft: '8px' } }}
                    >
                        التسجيل باستخدام جوجل
                    </Button>
                </Grid>
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
        </Box>
    );

    return (
        <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: 'background.default'
        }}>
            <Box sx={{
                display: 'flex',
                width: '100%',
                maxWidth: '1000px',
                minHeight: '600px',
                backgroundColor: 'background.paper',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
            }}>
                <Box sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '40px'
                }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom color="text.primary">
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
                </Box>
                <Box sx={{
                    flex: 1,
                    backgroundImage: `url(${loginPhoto})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                }} />
            </Box>
            <Dialog open={showWaitingPopup} onClose={handleCloseDialog}>
                <DialogTitle>بانتظار المراجعة</DialogTitle>
                <DialogContent>
                    <Typography>تم تسجيل حسابك كمعلم بنجاح. سيتم مراجعته من قبل الإدارة، وسيتم إعلامك فور الموافقة.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => nav('/login')} color="primary">
                        حسنًا
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>

    );
};

export default Register;