// paymob.js
import axios from "axios";
import { doc, setDoc } from "firebase/firestore";
import { db } from "./firebase";

const API_KEY = "ZXlKaGJHY2lPaUpJVXpVeE1pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmpiR0Z6Y3lJNklrMWxjbU5vWVc1MElpd2ljSEp2Wm1sc1pWOXdheUk2TVRBMk1EVTRNU3dpYm1GdFpTSTZJbWx1YVhScFlXd2lmUS5uenlPN1hSN012N1ZKZHRoSTBPVkxsTTRjMUR4WHNfc293cWtmZ3VyQzAtUGR0SktjR0lLZlA4Yi1XTFNBZC1YWWwyQ0dnVHk2TmN2cXEtRVlvQ3JhQQ==";
const INTEGRATION_ID = "5193527";
const IFRAEM_ID = "940163";

export const getPaymentIframe = async (amountCents, userData) => {
    const { data: authRes } = await axios.post("https://accept.paymob.com/api/auth/tokens", {
        api_key: API_KEY,
    });

    const token = authRes.token;

    const { data: orderRes } = await axios.post(
        "https://accept.paymob.com/api/ecommerce/orders",
        {
            auth_token: token,
            delivery_needed: false,
            amount_cents: amountCents,
            currency: "EGP",
            items: [],
        }
    );

    const orderId = orderRes.id;

    // ✅ تخزين الطلب بشكل مبدأي مع merge
    // await setDoc(doc(db, "payments", `${orderId}`), {
    //     uid: userData.uid || null,
    //     first_name: userData.first_name,
    //     last_name: userData.last_name,
    //     email: userData.email,
    //     phone: userData.phone,
    //     amountCents,
    //     order_id: orderId,
    //     status: "pending",
    //     timestamp: new Date(),
    // }, { merge: true });

    const { data: payKeyRes } = await axios.post(
        "https://accept.paymob.com/api/acceptance/payment_keys",
        {
            auth_token: token,
            amount_cents: amountCents,
            expiration: 3600,
            order_id: orderId,
            billing_data: {
                first_name: userData.first_name,
                last_name: userData.last_name,
                email: userData.email,
                phone_number: userData.phone,
                apartment: "NA",
                floor: "NA",
                street: "NA",
                building: "NA",
                city: "Cairo",
                country: "EG",
                state: "NA",
            },
            currency: "EGP",
            integration_id: INTEGRATION_ID,
            lock_order_when_paid: true,
            redirect_url: (() => {
                const origin = window.location.origin;
                const redirectUrl = `${origin}/paymentSuccess?success=true`;
                console.log("🔗 PayMob redirect URL set to:", redirectUrl);
                return redirectUrl;
            })(),
        }
    );

    const paymentToken = payKeyRes.token;
    return `https://accept.paymob.com/api/acceptance/iframes/${IFRAEM_ID}?payment_token=${paymentToken}`;
};