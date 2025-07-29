// CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { getPaymentIframe } from "../paymob";
import { useLocation, useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "../firebase";

const CheckoutPage = () => {
    const navigate = useNavigate();
    const [iframeUrl, setIframeUrl] = useState(null);
    const location = useLocation();

    const price = location.state?.price;
    const courseId = location.state?.courseId;

    useEffect(() => {
        const fetchIframe = async () => {
            const user = {
                first_name: "John",
                last_name: "Ihab",
                email: "john@example.com",
                phone: "+201234567890",
            };

            const url = await getPaymentIframe((price * 100), user);
            setIframeUrl(url);
        };

        fetchIframe();
    }, []);

    useEffect(() => {
        const listener = async (event) => {
            console.log("Received postMessage event:", event);
            console.log("Message data:", event.data);
            if (event.origin.includes("accept.paymob.com")) {
                if (event.data === "payment_success") {
                    const userAuth = auth.currentUser;
                    const uid = userAuth?.uid;
                    console.log("user:", uid);
                    console.log("Course ID:", courseId);

                    // const paymentRef = doc(db, "payments", `${uid}_${courseId}`);
                    // await setDoc(paymentRef, {
                    //     uid: uid || null,
                    //     courseId,
                    //     price,
                    //     paid: true,
                    //     timestamp: new Date(),
                    // }, { merge: true });

                    navigate("/video");
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [navigate, price, courseId]);

    return (
        <div>
            <h2>ادفع {price} جنيه لمشاهدة الفيديو</h2>
            {iframeUrl ? (
                <iframe
                    src={iframeUrl}
                    style={{ width: "100%", height: "600px", border: "none" }}
                    title="Paymob Payment"
                />
            ) : (
                <p>جاري تحميل بوابة الدفع...</p>
            )}
        </div>
    );
};

export default CheckoutPage;
