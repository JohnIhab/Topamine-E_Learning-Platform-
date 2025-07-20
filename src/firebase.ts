import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider  } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; 

const firebaseConfig = {
    apiKey: "AIzaSyBMkAnIqVPDqQBO10gxytAY19HP7iqLOwA",
    authDomain: "test-aed20.firebaseapp.com",
    projectId: "test-aed20",
    storageBucket: "test-aed20.firebasestorage.app",
    messagingSenderId: "460436985222",
    appId: "1:460436985222:web:69dbf5034837ea8e064807"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app); 
export const db = getFirestore(app); 
export const googleProvider = new GoogleAuthProvider();

