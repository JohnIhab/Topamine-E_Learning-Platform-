// import { useEffect, useContext } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { collection, addDoc } from 'firebase/firestore';
// import { db } from '../firebase';
// import { Box, Typography, CircularProgress } from '@mui/material';
// import { UserContext } from '../context/UserContext';
// import { useAuth } from '../context/AuthContext';

// const PaymentResult = () => {
//     const navigate = useNavigate();
//     const location = useLocation();
//     const userContext = useContext(UserContext);
//     const authContext = useAuth();

//     const user = userContext?.user || authContext?.user;
//     const isLoading = authContext?.loading;

//     console.log("=== PaymentResult Debug ===");
//     console.log("UserContext user:", userContext?.user);
//     console.log("AuthContext user:", authContext?.user);
//     console.log("AuthContext loading:", authContext?.loading);
//     console.log("Final user:", user);
//     console.log("==========================");

//     useEffect(() => {
//         if (isLoading) {
//             console.log("🔄 AuthContext still loading, waiting...");
//             return;
//         }

//         const params = new URLSearchParams(location.search);
//         const isSuccess = params.get('success');
//         const price = parseFloat(sessionStorage.getItem('amount'));
//         const courseId = sessionStorage.getItem('courseId');

//         console.log("Payment params:", { isSuccess, price, courseId });

//         let currentUser = user;
//         let userId = null;

//         if (currentUser) {
//             userId = currentUser.id || currentUser.uid;
//         } else {
//             const storedUser = localStorage.getItem('user');
//             if (storedUser) {
//                 try {
//                     currentUser = JSON.parse(storedUser);
//                     userId = currentUser.id || currentUser.uid;
//                     console.log("Found user in localStorage:", currentUser);
//                 } catch (error) {
//                     console.error("Error parsing stored user:", error);
//                 }
//             }
//         }

//         if (currentUser && userId) {
//             console.log("User found, ID:", userId);
//             console.log("Course ID:", courseId);
//             console.log("Price:", price);
//             console.log(" Success status:", isSuccess);

//             if (isSuccess === 'true') {
//                 const savePayment = async () => {
//                     try {
//                         console.log("About to save payment with data:", {
//                             uid: userId,
//                             paid: true,
//                             amount: price,
//                             courseId: courseId,
//                             timestamp: new Date(),
//                         });
                        
//                         const paymentsRef = collection(db, 'payments');
//                         const docRef = await addDoc(paymentsRef, {
//                             uid: userId,
//                             paid: true,
//                             amount: price,
//                             courseId: courseId,
//                             timestamp: new Date(),
//                         });
                        
//                         console.log("Payment saved successfully with ID:", docRef.id);
                        
//                         localStorage.setItem('lastAccessedCourse', courseId);
                        
//                         sessionStorage.removeItem('amount');
//                         sessionStorage.removeItem('courseId');

//                         console.log("About to navigate to video page with courseId:", courseId);
//                         console.log("Navigation state will be:", { courseId });
                        
//                         setTimeout(() => {

                            
//                             try {
//                                 console.log("Trying React Router navigation...");
//                                 navigate('/video', { 
//                                     state: { courseId },
//                                     replace: true
//                                 });
//                                 console.log("React Router navigation executed");
//                             } catch (navError) {
//                                 console.error("React Router navigation failed:", navError);
//                                 console.log("Trying window.location fallback...");
                                
//                                 const baseUrl = window.location.origin;
//                                 const targetUrl = `${baseUrl}/video?courseId=${courseId}`;
//                                 console.log(" Redirecting to:", targetUrl);
                                
//                                 window.location.href = targetUrl;
//                             }
//                         }, 1000);
//                     } catch (error) {
//                         console.error('Error saving payment:', error);
//                         alert('حدث خطأ في حفظ بيانات الدفع. سيتم توجيهك للصفحة الرئيسية.');
//                         navigate('/');
//                     }
//                 };

//                 savePayment();
//             } else {
//                 console.log('Payment failed or was canceled.');
//                 alert('فشل في عملية الدفع أو تم إلغاؤها. سيتم توجيهك للصفحة الرئيسية.');
//                 navigate('/');
//             }
//         } else {
//             console.log('No user found in any context or localStorage after loading completed.');
//             console.log('Debug - userContext:', userContext);
//             console.log('Debug - authContext:', authContext);
//             console.log('Debug - localStorage user:', localStorage.getItem('user'));
//         }
//     }, [location.search, navigate, user, isLoading, userContext, authContext]);

//     return (
//         <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//             <Box sx={{ textAlign: 'center' }}>
//                 <CircularProgress sx={{ mb: 2 }} />
//                 <Typography variant="h5" sx={{ fontFamily: 'Tajawal' }}>
//                     {isLoading ? 'جارٍ تحميل بيانات المستخدم...' : 'جارٍ التحقق من حالة الدفع...'}
//                 </Typography>
//             </Box>
//         </Box>
//     );
// };

// export default PaymentResult;
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
    const hasRun = useRef(false); // ✅ هنا

    const user = userContext?.user || authContext?.user;
    const isLoading = authContext?.loading;

    useEffect(() => {
        if (hasRun.current) return; // ✅ يمنع التكرار
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
                        const paymentsRef = collection(db, 'payments');
                        const docRef = await addDoc(paymentsRef, {
                            uid: userId,
                            paid: true,
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
