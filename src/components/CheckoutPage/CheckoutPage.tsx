import React, { useEffect, useState, useContext } from "react";
import { getPaymentIframe } from "./paymob";
import { useLocation, useNavigate } from "react-router-dom";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { UserContext } from "../../context/UserContext";
import { useAuth } from "../../context/AuthContext";
import Loading from "../Loading/Loading";

const CheckoutPage: React.FC = () => {
    const navigate = useNavigate();
    const [iframeUrl, setIframeUrl] = useState<string | null>(null);
    const location = useLocation();
    const userContext = useContext(UserContext);
    const authContext = useAuth(); 
    const [isAlreadyEnrolled, setIsAlreadyEnrolled] = useState(false);
    const [checkingEnrollment, setCheckingEnrollment] = useState(true); 
    
    const user = userContext?.user || authContext?.user;
    const price = location.state?.price; 
    const courseId = location.state?.courseId;

    const checkEnrollmentStatus = async () => {
        if (!user || !courseId) {
            setCheckingEnrollment(false);
            return;
        }

        try {
            const userId = user.id || user.uid;
            const enrollmentsQuery = query(
                collection(db, 'enrollments'),
                where('uid', '==', userId),
                where('courseId', '==', courseId),
                where('paid', '==', "enrolled")
            );

            const enrollmentDocs = await getDocs(enrollmentsQuery);
            const isEnrolled = enrollmentDocs.size > 0;
            
            setIsAlreadyEnrolled(isEnrolled);
            
            if (isEnrolled) {
                console.log("User is already enrolled in this course, redirecting to video page");
                navigate("/video", { state: { courseId } });
                return;
            }
        } catch (error) {
            console.error('Error checking enrollment status:', error);
        } finally {
            setCheckingEnrollment(false);
        }
    };

    useEffect(() => {
        console.log("=== CheckoutPage Debug Info ===");
        console.log("Location state:", location.state);
        console.log("Price:", price, "Type:", typeof price);
        console.log("CourseId:", courseId, "Type:", typeof courseId);
        console.log("User:", user);
        console.log("=============================");
    }, [location.state, price, courseId, user]);

    useEffect(() => {
        checkEnrollmentStatus();
    }, [user, courseId]);

    useEffect(() => {
        if (!user) {
            console.warn("No user found in context, redirecting to login");
            navigate("/login");
            return;
        }
        
        if (!price || !courseId) {
            console.error("Missing price or courseId in location state");
            navigate("/courses");
            return;
        }
    }, [user, price, courseId, navigate]);

    useEffect(() => {
        const fetchIframe = async () => {
            if (!price || !courseId || !user || isAlreadyEnrolled || checkingEnrollment) {
                console.error("Missing required data for payment or user already enrolled:", { 
                    price, 
                    courseId, 
                    user: !!user, 
                    isAlreadyEnrolled,
                    checkingEnrollment 
                });
                return;
            }

            const userName = user?.name || user?.displayName || "Student User";
            const userEmail = user?.email || "student@example.com";
            
            const userData = {
                first_name: userName.split(' ')[0] || "Student",
                last_name: userName.split(' ')[1] || "User",
                email: userEmail,
                phone: "+201234567890", 
            };
            sessionStorage.setItem("courseId", courseId);
            sessionStorage.setItem("amount", price.toString());
            const url = await getPaymentIframe((price * 100), userData);
            setIframeUrl(url);
        };

        fetchIframe();
    }, [price, courseId, user, isAlreadyEnrolled, checkingEnrollment]);

    useEffect(() => {
        const listener = async (event: MessageEvent) => {
            console.log("Received postMessage event:", event);
            console.log("Message data:", event.data);
            
            if (event.origin.includes("accept.paymob.com")) {
                if (event.data === "payment_success") {
                    if (!user) {
                        console.error("No user found in any context");
                        navigate("/login");
                        return;
                    }

                    try {
                        const userId = user.id || user.uid;
                        const userName = user.name || user.displayName || user.email;
                        
                        const validPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
                        
                        const validCourseId = courseId || 'unknown';
                        
                        console.log("=== Payment Data Validation ===");
                        console.log("Original price:", price, "Valid price:", validPrice);
                        console.log("Original courseId:", courseId, "Valid courseId:", validCourseId);
                        console.log("UserId:", userId);
                        
                        if (!userId) {
                            throw new Error("No valid user ID found");
                        }
                        
                        if (validPrice <= 0) {
                            console.warn("Invalid price detected:", price);
                        }
                        
                        if (!courseId) {
                            console.warn("No courseId found in location state");
                        }
                        
                        const paymentData = {
                            studentId: userId,
                            amount: validPrice,
                            courseId: validCourseId,
                            timestamp: new Date(),
                            status: "completed"
                        };

                        const paymentsRef = collection(db, "payments");
                        const docRef = await addDoc(paymentsRef, paymentData);
                        
                        const enrollmentData = {
                            uid: userId,
                            courseId: validCourseId,
                            paid: "enrolled",
                            enrollmentDate: new Date(),
                            amount: validPrice
                        };
                        
                        const enrollmentsRef = collection(db, "enrollments");
                        await addDoc(enrollmentsRef, enrollmentData);
                        
                        console.log("Payment saved successfully with ID:", docRef.id);
                        console.log("Enrollment created successfully");
                        console.log("Final payment data:", paymentData);
                        console.log("Final enrollment data:", enrollmentData);

                        navigate("/video", { state: { courseId: validCourseId } });
                        
                    } catch (error) {
                        console.error("Error saving payment to Firestore:", error);
                        navigate("/video", { state: { courseId: courseId || 'unknown' } });
                    }
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [navigate, price, courseId, user]);

    if (!userContext) {
        console.error("UserContext is not available. Make sure UserProvider is wrapping your app.");
        return (
            <div style={{ padding: '20px', fontFamily: 'Tajawal', textAlign: 'center' }}>
                <h2>خطأ في النظام</h2>
                <p>لم يتم العثور على بيانات المستخدم. يرجى إعادة تحميل الصفحة أو تسجيل الدخول مرة أخرى.</p>
                <button onClick={() => navigate("/login")}>تسجيل الدخول</button>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Tajawal' }}>
            {!user ? (
                <div>جاري التحقق من بيانات المستخدم...</div>
            ) : checkingEnrollment ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h3>جاري التحقق من حالة التسجيل...</h3>
                    <p>يرجى الانتظار بينما نتحقق من بياناتك</p>
                </div>
            ) : isAlreadyEnrolled ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h3 style={{ color: 'green' }}>أنت مشترك بالفعل في هذا الكورس!</h3>
                    <p>سيتم توجيهك إلى صفحة المحاضرات...</p>
                </div>
            ) : !price || !courseId ? (
                <div style={{ textAlign: 'center', marginTop: '50px' }}>
                    <h3 style={{ color: 'red' }}>خطأ في بيانات الدفع</h3>
                    <p>لم يتم العثور على سعر الكورس أو معرف الكورس</p>
                    <p><strong>السعر:</strong> {price || 'غير محدد'}</p>
                    <p><strong>معرف الكورس:</strong> {courseId || 'غير محدد'}</p>
                    <button 
                        onClick={() => navigate(-1)} 
                        style={{ padding: '10px 20px', marginTop: '20px' }}
                    >
                        العودة للصفحة السابقة
                    </button>
                </div>
            ) : (
                <>
                    <h2>ادفع {price} جنيه لمشاهدة الكورس</h2>

                    {iframeUrl ? (
                        <iframe
                            src={iframeUrl}
                            style={{ width: "100%", height: "600px", border: "none" }}
                            title="Paymob Payment"
                        />
                    ) : (
                        <p>جاري تحميل بوابة الدفع
                            <Loading />
                        </p>
                    )}
                </>
            )}
        </div>
    );
};

export default CheckoutPage;
