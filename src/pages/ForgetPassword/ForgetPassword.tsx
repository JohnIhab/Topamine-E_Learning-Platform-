import { Box, Button, TextField, Typography } from '@mui/material';
import { styled } from '@mui/system';
import loginPhoto from '../../assets/images/login.jpg';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from '../../firebase';
import { useNavigate } from 'react-router';
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
    height: 510,
});

const SubTitle = styled(Typography)({
    fontSize: '1rem',
    color: '#666',
    textAlign: 'center',
    marginBottom: '30px',
});
const ForgetPassword = () => {
    const navigate = useNavigate();

    const formik = useFormik({
        initialValues: { email: '' },
        validationSchema: Yup.object({
            email: Yup.string().email('البريد الإلكتروني غير صالح').required('البريد الإلكتروني مطلوب'),
        }),
        onSubmit: async (values) => {
            try {
                toast.success(`تم إرسال رابط إعادة التعيين إلى ${values.email}`);
                await sendPasswordResetEmail(auth, values.email);

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } catch (error) {
                toast.error("حدث خطأ أثناء إرسال الرابط. تأكد من البريد الإلكتروني.");
                console.error(error);
            }
        }


    });

    return (
        <>
            <CustomBox>
                <LoginContainer>
                    <LeftPanel>
                        <Typography variant="h6" align="center" gutterBottom>
                            نسيت كلمة السر؟
                        </Typography>
                        <SubTitle>
                            أدخل الجيميل الخاص بحسابك وسنرسل لك رسالة لإعادة تعيين كلمة المرور الخاصة بك
                        </SubTitle>
                        <form onSubmit={formik.handleSubmit}>
                            <TextField
                                label="البريد الإلكتروني"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={formik.touched.email && Boolean(formik.errors.email)}
                                helperText={formik.touched.email && formik.errors.email}
                            />
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                sx={{ mt: 2, py: 1.5 }}
                                disabled={!formik.isValid || !formik.dirty}
                            >
                                أرسل الجيميل
                            </Button>
                        </form>
                    </LeftPanel>
                    <RightPanel />
                </LoginContainer>
            </CustomBox>
            <ToastContainer position="top-center" autoClose={3000} />
        </>
    );
};

export default ForgetPassword;
