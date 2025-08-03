// CheckoutPage.jsx
import React, { useEffect, useState, useContext } from "react";
import { getPaymentIframe } from "../paymob";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc, collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { UserContext } from "../context/UserContext";
import { useAuth } from "../context/AuthContext";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [iframeUrl, setIframeUrl] = useState(null);
    const location = useLocation();
    const userContext = useContext(UserContext);
    const authContext = useAuth(); // Fallback to AuthContext
    
    // More graceful handling of missing UserContext
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
    
    // Try to get user from UserContext first, then fallback to AuthContext
    const user = userContext.user || authContext?.user;
    const price = location.state?.price; 
    const courseId = location.state?.courseId;

    // Debug logging
    useEffect(() => {
        console.log("=== CheckoutPage Debug Info ===");
        console.log("Location state:", location.state);
        console.log("Price:", price, "Type:", typeof price);
        console.log("CourseId:", courseId, "Type:", typeof courseId);
        console.log("User:", user);
        console.log("=============================");
    }, [location.state, price, courseId, user]);

    // Redirect to login if no user is found
    useEffect(() => {
        if (!user) {
            console.warn("No user found in context, redirecting to login");
            navigate("/login");
            return;
        }
        
        if (!price || !courseId) {
            console.error("Missing price or courseId in location state");
            navigate("/courses"); // Redirect to courses page
            return;
        }
    }, [user, price, courseId, navigate]);

    useEffect(() => {
        const fetchIframe = async () => {
            // Validate inputs before proceeding
            if (!price || !courseId || !user) {
                console.error("Missing required data for payment:", { price, courseId, user: !!user });
                return;
            }

            // Use user data from UserContext or AuthContext, with fallback values
            const userName = user?.name || user?.displayName || "Student User";
            const userEmail = user?.email || "student@example.com";
            
            const userData = {
                first_name: userName.split(' ')[0] || "Student",
                last_name: userName.split(' ')[1] || "User",
                email: userEmail,
                phone: "+201234567890", // You might want to add phone to UserContext
            };
            sessionStorage.setItem("courseId", courseId);
            sessionStorage.setItem("amount", price.toString());
            const url = await getPaymentIframe((price * 100), userData);
            setIframeUrl(url);
        };

        fetchIframe();
    }, [price, courseId, user]);

    useEffect(() => {
        const listener = async (event) => {
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
                        // Validate data before saving
                        const userId = user.id || user.uid;
                        const userName = user.name || user.displayName || user.email;
                        
                        // Ensure price is a valid number
                        const validPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
                        
                        // Ensure courseId is not null/undefined
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

                        // Add to payments collection
                        const paymentsRef = collection(db, "payments");
                        const docRef = await addDoc(paymentsRef, paymentData);
                        
                        console.log("Payment saved successfully with ID:", docRef.id);
                        console.log("Final payment data:", paymentData);

                        // Navigate to video page with courseId
                        navigate("/video", { state: { courseId: validCourseId } });
                        
                    } catch (error) {
                        console.error("Error saving payment to Firestore:", error);
                        // Still navigate but log the error
                        navigate("/video", { state: { courseId: courseId || 'unknown' } });
                    }
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [navigate, price, courseId, user]);

    return (
        <div style={{ padding: '20px', fontFamily: 'Tajawal' }}>
            {!user ? (
                <div>جاري التحقق من بيانات المستخدم...</div>
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
                    {/* <p>الطالب: {user.name || user.displayName || user.email}</p> */}
                    {/* <p>معرف الكورس: {courseId}</p> */}
                    {/* <p>السعر: {price} (نوع البيانات: {typeof price})</p> */}
                    {iframeUrl ? (
                        <iframe
                            src={iframeUrl}
                            style={{ width: "100%", height: "600px", border: "none" }}
                            title="Paymob Payment"
                        />
                    ) : (
                        <p>جاري تحميل بوابة الدفع...</p>
                    )}
                </>
            )}
        </div>
    );
};

export default CheckoutPage;
