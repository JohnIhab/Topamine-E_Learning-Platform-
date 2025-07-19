import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const PaymentResult = () => {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const isSuccess = params.get('success');

        if (isSuccess === 'true') {
            navigate('/video');
        }
    }, [location.search, navigate]);

    return (
        <div>
            <h2>جارٍ التحقق من حالة الدفع...</h2>
        </div>
    );
};

export default PaymentResult;
