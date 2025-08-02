import { useEffect, useContext } from 'react';
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

    // Try to get user from UserContext first, then fallback to AuthContext
    const user = userContext?.user || authContext?.user;
    const isLoading = authContext?.loading;

    console.log("=== PaymentResult Debug ===");
    console.log("UserContext user:", userContext?.user);
    console.log("AuthContext user:", authContext?.user);
    console.log("AuthContext loading:", authContext?.loading);
    console.log("Final user:", user);
    console.log("==========================");

    useEffect(() => {
        // Don't proceed if AuthContext is still loading
        if (isLoading) {
            console.log("🔄 AuthContext still loading, waiting...");
            return;
        }

        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');
        const price = parseFloat(sessionStorage.getItem('amount'));
        const courseId = sessionStorage.getItem('courseId');

        console.log("🔍 Payment params:", { isSuccess, price, courseId });

        // Check for user in contexts or localStorage as fallback
        let currentUser = user;
        let userId = null;

        if (currentUser) {
            userId = currentUser.id || currentUser.uid;
        } else {
            // Fallback: check localStorage for user data
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                try {
                    currentUser = JSON.parse(storedUser);
                    userId = currentUser.id || currentUser.uid;
                    console.log("📦 Found user in localStorage:", currentUser);
                } catch (error) {
                    console.error("Error parsing stored user:", error);
                }
            }
        }

        if (currentUser && userId) {
            console.log("✅ User found, ID:", userId);
            console.log("📋 Course ID:", courseId);
            console.log("💰 Price:", price);
            console.log("✔️ Success status:", isSuccess);

            if (isSuccess === 'true') {
                const savePayment = async () => {
                    try {
                        console.log("💰 About to save payment with data:", {
                            uid: userId,
                            paid: true,
                            amount: price,
                            courseId: courseId,
                            timestamp: new Date(),
                        });
                        
                        const paymentsRef = collection(db, 'payments');
                        const docRef = await addDoc(paymentsRef, {
                            uid: userId,
                            paid: true,
                            amount: price,
                            courseId: courseId,
                            timestamp: new Date(),
                        });
                        
                        console.log("💾 Payment saved successfully with ID:", docRef.id);
                        
                        sessionStorage.removeItem('amount');
                        sessionStorage.removeItem('courseId');

                        console.log("� About to navigate to video page with courseId:", courseId);
                        // Navigate to the video page, passing courseId in state
                        navigate('/video', { state: { courseId } });
                    } catch (error) {
                        console.error('❌ Error saving payment:', error);
                        // Navigate to home page instead of non-existent error page
                        alert('حدث خطأ في حفظ بيانات الدفع. سيتم توجيهك للصفحة الرئيسية.');
                        navigate('/');
                    }
                };

                savePayment();
            } else {
                console.log('❌ Payment failed or was canceled.');
                alert('فشل في عملية الدفع أو تم إلغاؤها. سيتم توجيهك للصفحة الرئيسية.');
                navigate('/'); // Navigate to home instead of non-existent payment-failed page
            }
        } else {
            // If not loading and still no user, then redirect to login
            console.log('⛔ No user found in any context or localStorage after loading completed.');
            console.log('🔍 Debug - userContext:', userContext);
            console.log('🔍 Debug - authContext:', authContext);
            console.log('🔍 Debug - localStorage user:', localStorage.getItem('user'));
            navigate('/login'); // Redirect to login page if no user
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