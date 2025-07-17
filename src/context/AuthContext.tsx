// context/AuthContext.tsx
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase"; // تأكد من صحة المسار

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [role, setRole] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                const usersRef = doc(db, "users", firebaseUser.uid);
                const userSnap = await getDoc(usersRef);

                let fetchedRole = null;
                let status = null;

                if (userSnap.exists()) {
                    fetchedRole = userSnap.data().role;

                    if (fetchedRole === "teacher") {
                        const teachersRef = doc(db, "users", firebaseUser.uid);
                        const teacherSnap = await getDoc(teachersRef);
                        if (teacherSnap.exists()) {
                            status = teacherSnap.data().status;
                        }
                    }
                }

                setUser({ ...firebaseUser, status });
                setRole(fetchedRole);
            } else {
                setUser(null);
                setRole(null);
            }
            setLoading(false);
        });

        return () => unsub();
    }, []);

    return (
        <AuthContext.Provider value={{ user, role, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
