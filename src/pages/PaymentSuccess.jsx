import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');
        const price = parseFloat(params.get("amount"));

        if (isSuccess === 'true') {
            const savePayment = async () => {
                const paymentRef = doc(db, "payments", "user_john");
                await setDoc(paymentRef, {
                    paid: true,
                    amount: price,
                    timestamp: new Date(),
                });

                navigate("/video");
            };

            savePayment();
        }
    }, [location.search, navigate]);

    return (
        <div>
            <h2>جارٍ التحقق من حالة الدفع...</h2>
        </div>
    );
};

export default PaymentResult;
