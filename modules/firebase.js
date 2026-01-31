// modules/firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, doc, setDoc, getDoc, collection, addDoc, 
    onSnapshot, updateDoc, arrayUnion, query, where, getDocs, orderBy 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { 
    getAuth, signInAnonymously, onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

// --- NEW: Import App Check ---
import { 
    initializeAppCheck, ReCaptchaEnterpriseProvider 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app-check.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCUDWKDMwl3DRVxHvY85K-Y4ceBGPUkAe8",
            authDomain: "pookiequizlive.firebaseapp.com",
            projectId: "pookiequizlive",
            storageBucket: "pookiequizlive.firebasestorage.app",
            messagingSenderId: "340758596918",
            appId: "1:340758596918:web:96c439644cc0f4e5217797",
            measurementId: "G-XB9D8TT1PZ"
        };
// 1. Initialize Firebase
const app = initializeApp(firebaseConfig);

// 2. --- NEW: Activate the Bot Shield (App Check) ---

try {
    const appCheck = initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider('6LcyhFwsAAAAAARKTZO2Yn6IlFj_xloPP12yA7ue'),
        isTokenAutoRefreshEnabled: true 
    });
} catch (e) {
    console.log("App Check (Bot Shield) skipped locally.");
}

// 3. Initialize Services
const db = getFirestore(app);
const auth = getAuth(app);

// 4. Export everything
export { 
    app, db, auth, doc, setDoc, getDoc, collection, addDoc, 
    onSnapshot, updateDoc, arrayUnion, query, where, getDocs, orderBy, 
    signInAnonymously, onAuthStateChanged 
};
