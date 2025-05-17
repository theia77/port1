// firebase-init.js

// Firebase App (Core)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider, // Kept if you plan to use Google Sign-In elsewhere, not used by current auth.js
    createUserWithEmailAndPassword, // Added as it's used in auth.js
    signInWithEmailAndPassword,     // Added as it's used in auth.js
    signInWithPopup,                // Kept, though not currently used by auth.js
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

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
    setDoc // Added as it's used in admin-dashboard.js for settings
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase Storage
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";


// Firebase Analytics (Optional, uncomment if you plan to use it)
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmMPzkIWQIG44pLQbIRNqoZBAvOT8epXc", // This is typically public for web apps
  authDomain: "portfolio-sumoverse.firebaseapp.com",
  projectId: "portfolio-sumoverse",
  storageBucket: "portfolio-sumoverse.appspot.com",
  messagingSenderId: "475386816588",
  appId: "1:475386816588:web:dbfc0daa07a99799522ce9",
  measurementId: "G-YJ2SLKGTCG" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);

// Initialize Firebase Storage and get a reference to the service
const storage = getStorage(app);

// Initialize Google Auth Provider (if you plan to use it elsewhere)
const googleProvider = new GoogleAuthProvider(); // Renamed to avoid conflict if 'provider' is used locally

// Initialize Analytics (Optional)
// const analytics = getAnalytics(app);


// --- Helper Functions (Example for fetching data for mainpage.js) ---

// Example function to fetch general profile data
async function getProfileData() {
    // Assuming your profile data is in a document named 'mainInfo' within a 'profile' collection
    const profileDocRef = doc(db, 'profile', 'mainInfo');
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No 'mainInfo' document found in 'profile' collection!");
            // Return default or placeholder data if needed
            return {
                name: "Sumouli Pramanik",
                tagline: "Civil Engineer | Data Scientist | Infrastructure Consultant",
                description1: "Transforming raw data into resilient infrastructure.",
                description2: "Building bridges between physical construction and digital innovation.",
                avatarUrl: "placeholder-avatar.png", // Default avatar
                linkedin: "#", github: "#", twitter: "#" // Default links
            };
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
        // Return default or placeholder data on error
        return {
                name: "Sumouli Pramanik (Error)",
                tagline: "Data could not be loaded.",
                description1: "", description2: "",
                avatarUrl: "placeholder-avatar.png",
                linkedin: "#", github: "#", twitter: "#"
            };
    }
}

// Example function to fetch preview data for mainpage.js cards (e.g., latest 2 projects)
async function getSectionPreviewData(sectionCollectionName, count = 2, orderByField = 'timestamp', orderDirection = 'desc') {
    try {
        const sectionColRef = collection(db, sectionCollectionName);
        // Ensure the orderByField exists in your documents for this to work correctly
        const q = query(sectionColRef, orderBy(orderByField, orderDirection), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching preview data for ${sectionCollectionName}:`, error);
        return []; // Return empty array on error
    }
}


// Export the instances and functions for use in other scripts
export {
    app,
    auth,
    db,
    storage, // Export Storage instance
    googleProvider, // Export Google Auth Provider
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
    setDoc, // Export setDoc
    // Storage functions
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    // Helper functions
    getProfileData,
    getSectionPreviewData
    // , analytics // Uncomment if using Analytics
};
