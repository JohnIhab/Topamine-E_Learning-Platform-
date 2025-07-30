import { useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Typography, CircularProgress } from '@mui/material';
import { UserContext } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userContext = useContext(UserContext);
    const authContext = useAuth();
    
    // Try to get user from UserContext first, then fallback to AuthContext
    const user = userContext?.user || authContext?.user;
    
    console.log("=== PaymentResult Debug ===");
    console.log("UserContext user:", userContext?.user);
    console.log("AuthContext user:", authContext?.user);
    console.log("Final user:", user);
    console.log("==========================");

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');
        const price = parseFloat(sessionStorage.getItem('amount'));
        const courseId = sessionStorage.getItem('courseId');


        if (user) {
            // Get user ID from either context (UserContext.user.id or AuthContext.user.uid)
            const userId = user.id || user.uid;
            console.log("✅ User found, ID:", userId);
            console.log("courseId:", courseId);

            if (isSuccess === 'true') {
                const savePayment = async () => {
                    try {
                        const paymentRef = doc(db, 'payments', userId);
                        await setDoc(paymentRef, {
                            uid: userId,
                            paid: true,
                            amount: price ,
                            courseId: courseId, // Save courseId in Firestore
                            timestamp: new Date(),
                        });
                        sessionStorage.removeItem('amount');
                        sessionStorage.removeItem('courseId')

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
            console.log('⛔ No user found in any context.');
            navigate('/login'); // Redirect to login page if no user
        }
    }, [location.search, navigate, user]);

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