import { Box, TextField, Button, Checkbox, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/system';
import loginPhoto from '../../assets/images/login.jpg';
import GoogleIcon from '@mui/icons-material/Google';
import { Link } from 'react-router-dom';
import * as Yup from "yup";
import { useFormik } from 'formik';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { IconButton, InputAdornment } from '@mui/material';

const CustomBox = styled(Box)({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    backgroundColor: '#f5f5f5',
});

const LoginContainer = styled(Box)({
    display: 'flex',
    width: '800px',
    backgroundColor: '#fff',
    padding: '10',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
});

const LeftPanel = styled(Box)({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    padding: '20px',
});

const RightPanel = styled(Box)({
    flex: 1,
    backgroundImage: `url(${loginPhoto})`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    position: 'relative',
});

const SubTitle = styled(Typography)({
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
});

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword(prev => !prev);

    function validationSchema() {
        return Yup.object({
            email: Yup.string()
                .email('البريد الإلكتروني غير صالح')
                .required('البريد الإلكتروني مطلوب'),
            password: Yup.string()
                .min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
                .matches(/[A-Z]/, 'يجب أن تحتوي على حرف كبير')
                .matches(/[a-z]/, 'يجب أن تحتوي على حرف صغير')
                .matches(/[0-9]/, 'يجب أن تحتوي على رقم')
                .matches(/[@$!%*?&#]/, 'يجب أن تحتوي على رمز خاص')
                .required('كلمة المرور مطلوبة'),
        });
    }

    const login = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema,
        onSubmit: async (values) => {
            setLoading(true);
            console.log('Sending login request with payload:', values);
            try {
                const response = await fetch('https://topamun-backend.vercel.app/auth/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(values),
                });

                const data = await response.json();
                console.log('Server response:', data);

                if (!response.ok) {
                    const errorMessage = data.msgError === 'Un-activated Account, please confirm your email'
                        ? 'بيانات تسجيل الدخول غير صحيحة. تأكد من البريد الإلكتروني وكلمة المرور أو سجل حسابًا جديدًا.'
                        : data.msgError || 'فشل تسجيل الدخول: خطأ في الخادم';
                    throw new Error(errorMessage);
                }

                toast.success('تسجيل الدخول ناجح!');
                // Handle successful login (e.g., store token, redirect)
                // localStorage.setItem('token', data.token);
                // navigate('/dashboard');
                
            } catch (error) {
                console.error('Login error:', error);
                toast.error(error.msgError || 'حدث خطأ أثناء تسجيل الدخول');
            } finally {
                setLoading(false);
            }
        }
    });

    return (
        <CustomBox>
            <LoginContainer>
                <LeftPanel>
                    <Typography variant="h6" align="center" gutterBottom>
                        مرحبًا مجددًا!
                    </Typography>
                    <SubTitle>
                        تسجيل الدخول لمواصلة التعلم
                    </SubTitle>
                    <form onSubmit={login.handleSubmit}>
                        <TextField
                            label="البريد الإلكتروني"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            id='email'
                            name='email'
                            type='email'
                            value={login.values.email}
                            onChange={login.handleChange}
                            error={Boolean(login.errors.email && login.touched.email)}
                            helperText={login.errors.email && login.touched.email ? login.errors.email : ''}
                        />
                        <TextField
                            label="كلمة المرور"
                            variant="outlined"
                            fullWidth
                            margin="normal"
                            id="password"
                            name="password"
                            type={showPassword ? 'text' : 'password'}
                            value={login.values.password}
                            onChange={login.handleChange}
                            error={Boolean(login.errors.password && login.touched.password)}
                            helperText={login.errors.password && login.touched.password ? login.errors.password : ''}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <IconButton sx={{mr: 1}} onClick={togglePasswordVisibility} edge="end">
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />
                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                            <Box display="flex" alignItems="center">
                                <Checkbox />
                                <Typography>تذكرني</Typography>
                            </Box>
                            <Link to="/ForgetPassword" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                نسيت كلمة السر؟
                            </Link>
                        </Box>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ mt: 2, py: 1.5 }}
                            type='submit'
                            disabled={!login.dirty || !login.isValid || loading}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'تسجيل الدخول'}
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<GoogleIcon />}
                            fullWidth
                            sx={{ mt: 2, '& .MuiButton-startIcon': { marginLeft: '8px' } }}
                        >
                            تسجيل الدخول باستخدام جوجل
                        </Button>
                        <Typography align="center" mt={2}>
                            ليس لديك حساب؟{' '}
                            <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>
                                سجل الآن
                            </Link>
                        </Typography>
                    </form>
                </LeftPanel>
                <RightPanel />
            </LoginContainer>
        </CustomBox>
    );
};

export default Login;