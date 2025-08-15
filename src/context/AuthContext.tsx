import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase"; 

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
                let isBlocked = false;

                if (userSnap.exists()) {
                    const data = userSnap.data();
                    fetchedRole = data.role;

                    if (fetchedRole === "teacher") {
                        status = data.status; 
                    } else if (fetchedRole === "student") {
                        isBlocked = data.blocked === true; 
                    }
                }

                if (fetchedRole === "student" && isBlocked) {
                    setUser(null);
                    setRole(null);
                    alert("Your account is blocked. Please contact support.");
                } else {
                    setUser({ ...firebaseUser, status, isBlocked });
                    setRole(fetchedRole);
                }
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
