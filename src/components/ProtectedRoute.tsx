import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { useState } from "react";

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, role, loading } = useAuth();
    const [open, setOpen] = useState(true);
    if (loading) return <div>Loading...</div>;

    if (!user) return <Navigate to="/login" />;

    if (!allowedRoles.includes(role)) return <Navigate to="/notfound" />;
    const handleCloseDialog = () => {
        setOpen(false); 
    };
    if (role === "teacher") {
        if (user.status === "قيد المراجعة") {
            return (
                <Dialog open={open} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                    <DialogTitle>قيد المراجعة</DialogTitle>
                    <DialogContent>
                        حسابك قيد المراجعة من قبل الإدارة. يرجى الانتظار حتى يتم تفعيل حسابك.
                    </DialogContent>
                </Dialog>
            );
        }

        if (user.status === "تم الرفض") {
            return (
                <Dialog open fullWidth maxWidth="sm">
                    <DialogTitle>تم رفض الحساب</DialogTitle>
                    <DialogContent>
                        نعتذر، تم رفض طلبك من قبل الإدارة. يرجى التواصل معنا لمزيد من التفاصيل.
                    </DialogContent>
                </Dialog>
            );
        }
    }

    return children;
};

export default ProtectedRoute;
