import React, { useEffect, useState } from "react";
import { getPaymentIframe } from "../paymob";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

const CheckoutPage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const fetchIframe = async () => {
            const user = {
                first_name: "John",
                last_name: "Ihab",
                email: "john@example.com",
                phone: "+201234567890",
            };

            const iframeUrl = await getPaymentIframe(5000, user); // 50 EGP

            window.open(iframeUrl, "_blank");
        };

        fetchIframe();
    }, []);

    useEffect(() => {
        const listener = (event) => {
            if (event.origin.includes("accept.paymob.com")) {
                if (event.data === "payment_success") {
                    // حفظ حالة الدفع
                    const paymentRef = doc(db, "payments", "user_john");
                    setDoc(paymentRef, {
                        paid: true,
                        timestamp: new Date(),
                    });

                    navigate("/video");
                }
            }
        };
        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, []);

    return (
        <div>
            <h2>ادفع 50 جنيه لمشاهدة الفيديو</h2>
            {iframeUrl ? (
                <iframe
                    src={iframeUrl}
                    style={{ width: "100%", height: "600px", border: "none" }}
                />
            ) : (
                <p>جاري تحميل بوابة الدفع...</p>
            )}
        </div>
    );
};

export default CheckoutPage;
