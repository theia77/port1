// firebase-init.js

// Firebase App (Core)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js"; // Updated version

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider, // Keep if you might use Google Sign-In later
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup, // Keep if you might use Google Sign-In later
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js"; // Updated version

// Firebase Firestore
import {
    getFirestore,
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    setDoc
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js"; // Updated version

// Firebase Storage
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js"; // Updated version

// Firebase Analytics (Optional, but included in your HTML snippet)
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js"; // Updated version

// Your web app's Firebase configuration (FROM YOUR HTML SNIPPET)
const firebaseConfig = {
  apiKey: "AIzaSyCG1aRMKiqK9HdytJGh0ZAdPpi15R0AELA",
  authDomain: "portfolio-sumoverse-d1834.firebaseapp.com",
  projectId: "portfolio-sumoverse-d1834",
  storageBucket: "portfolio-sumoverse-d1834.appspot.com", // Corrected: .appspot.com is common, but your snippet had .firebasestorage.app which might also be valid for newer projects or specific setups. Double check this in your Firebase console. The more common is .appspot.com.
  messagingSenderId: "274868857687",
  appId: "1:274868857687:web:37ee07365edb445ddcec12",
  measurementId: "G-VNXL4PZYSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app); // Initialize Analytics as it's in your config

// Initialize Google Auth Provider (if you plan to use it elsewhere)
const googleProvider = new GoogleAuthProvider();

// --- Helper Functions (Keep or modify as needed) ---
async function getProfileData() {
    const profileDocRef = doc(db, 'settings', 'profileInfo');
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.warn("No 'profileInfo' document found in 'settings' collection!");
            return { name: "Your Name", tagline: "Your Tagline", /* ...other defaults */ };
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return { name: "Error Loading Name", tagline: "Error loading tagline", /* ... */ };
    }
}

async function getSectionPreviewData(sectionCollectionName, count = 2, orderByField = 'timestamp', orderDirection = 'desc') {
    try {
        const sectionColRef = collection(db, sectionCollectionName);
        const q = query(sectionColRef, orderBy(orderByField, orderDirection), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error(`Error fetching preview data for ${sectionCollectionName}:`, error);
        return [];
    }
}

// Export the instances and functions for use in other scripts
export {
    app,
    auth,
    db,
    storage,
    analytics, // Export Analytics
    googleProvider,
    // Auth functions
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    // Firestore functions
    collection,
    getDocs,
    getDoc,
    doc,
    query,
    orderBy,
    limit,
    addDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    setDoc,
    // Storage functions
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    // Helper functions
    getProfileData,
    getSectionPreviewData
};
