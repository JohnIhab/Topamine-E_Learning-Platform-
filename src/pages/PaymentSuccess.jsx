import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Box, Typography, CircularProgress } from '@mui/material';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');
        const price = parseFloat(params.get('amount'));
        const courseId = params.get('courseId'); // Retrieve courseId from URL parameters

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("✅ Logged in user UID:", user.uid);
                console.log("courseId:", courseId);

                if (isSuccess === 'true') {
                    const savePayment = async () => {
                        try {
                            const paymentRef = doc(db, 'payments', user.uid);
                            await setDoc(paymentRef, {
                                uid: user.uid,
                                paid: true,
                                amount: price / 100,
                                courseId: courseId, // Save courseId in Firestore
                                timestamp: new Date(),
                            });

                            // Navigate to the video page, passing courseId in state
                            navigate('/video', { state: { courseId } });
                        } catch (error) {
                            console.error('Error saving payment:', error);
                            navigate('/error'); // Handle error case
                        }
                    };

                    savePayment();
                } else {
                    console.log('Payment failed or was canceled.');
                    navigate('/payment-failed'); // Handle failed payment case
                }
            } else {
                console.log('⛔ No user is logged in.');
                navigate('/login'); // Redirect to login page if no user
            }
        });

        return () => unsubscribe();
    }, [location.search, navigate]);

    return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Box sx={{ textAlign: 'center' }}>
                <CircularProgress sx={{ mb: 2 }} />
                <Typography variant="h5" sx={{ fontFamily: 'Tajawal' }}>
                    جارٍ التحقق من حالة الدفع...
                </Typography>
            </Box>
        </Box>
    );
};

export default PaymentResult;