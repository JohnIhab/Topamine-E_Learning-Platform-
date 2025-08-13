
import { useEffect, useContext, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Typography, CircularProgress } from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useContext(UserContext);
    const authContext = useAuth();
    const hasRun = useRef(false);

    const user = userContext?.user || authContext?.user;
    const isLoading = authContext?.loading;

    useEffect(() => {
        if (hasRun.current) return; 
        hasRun.current = true;

        if (isLoading) return;

        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');
        const price = parseFloat(sessionStorage.getItem('amount'));
        const courseId = sessionStorage.getItem('courseId');

        let currentUser = user;
        let userId = currentUser?.id || currentUser?.uid;

        if (!userId) {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                    userId = currentUser.id || currentUser.uid;
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                }
            }
        }

        if (currentUser && userId) {
            if (isSuccess === 'true') {
                const savePayment = async () => {
                    try {
                        const paymentsRef = collection(db, 'enrollments');
                        const docRef = await addDoc(paymentsRef, {
                            uid: userId,
                            paid: "enrolled",
                            statusProgress: "completed",
                            amount: price,
                            courseId: courseId,
                            timestamp: new Date(),
                        });

                        localStorage.setItem('lastAccessedCourse', courseId);
                        sessionStorage.removeItem('amount');
                        sessionStorage.removeItem('courseId');

                        setTimeout(() => {
                            try {
                                navigate('/video', {
                                    state: { courseId },
                                    replace: true
                                });
                            } catch (navError) {
                                const baseUrl = window.location.origin;
                                window.location.href = `${baseUrl}/video?courseId=${courseId}`;
                            }
                        }, 1000);
                    } catch (error) {
                        alert('حدث خطأ في حفظ بيانات الدفع. سيتم توجيهك للصفحة الرئيسية.');
                        navigate('/');
                    }
                };
                savePayment();
            } else {
                alert('فشل في عملية الدفع أو تم إلغاؤها. سيتم توجيهك للصفحة الرئيسية.');
                navigate('/');
            }
        }
    }, [location.search, navigate, user, isLoading, userContext, authContext]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h5" sx={{ fontFamily: 'Tajawal' }}>
                    {isLoading ? 'جارٍ تحميل بيانات المستخدم...' : 'جارٍ التحقق من حالة الدفع...'}
                </Typography>
            </Box>
        </Box>
    );
};

export default PaymentResult;
