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


    console.log("Received price:", price);

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
        const listener = (event) => {
            if (event.origin.includes("accept.paymob.com")) {
                if (event.data === "payment_success") {
                    const userAuth = auth.currentUser;
                    const uid = userAuth?.uid;

                    const paymentRef = doc(db, "payments", uid || "unknown_user");
                    setDoc(paymentRef, {
                        uid: uid || null,
                        status: "paid",
                        paid: true,
                        timestamp: new Date(),
                        price: price,
                    });

                    navigate("/video");
                }
            }
        };

        window.addEventListener("message", listener);
        return () => window.removeEventListener("message", listener);
    }, [navigate, price]);


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
