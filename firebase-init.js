// firebase-init.js

// Firebase App (Core) - Using the version from your latest snippet
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider, // Keep if you plan to use Google Sign-In for other purposes
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,    // Keep if you plan to use Google Sign-In for other purposes
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-auth.js";

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
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-firestore.js";

// Firebase Storage
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.3/firebase-storage.js";

// Firebase Analytics (as per your provided HTML snippet from previous request)
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.3/firebase-analytics.js";

// **YOUR LATEST FIREBASE CONFIGURATION**
const firebaseConfig = {
  apiKey: "AIzaSyCG1aRMKiqK9HdytJGh0ZAdPpi15R0AELA",
  authDomain: "portfolio-sumoverse-d1834.firebaseapp.com",
  projectId: "portfolio-sumoverse-d1834",
  // **CRITICAL VERIFICATION**: Double-check this value in your Firebase Console -> Storage.
  // Your snippet used ".firebasestorage.app". The more traditional one is ".appspot.com".
  // Use the EXACT value shown in your Firebase project's Storage section (usually starts with gs://).
  // If "portfolio-sumoverse-d1834.firebasestorage.app" IS correct from your console, use that.
  // Otherwise, the common format is: "portfolio-sumoverse-d1834.appspot.com"
  storageBucket: "portfolio-sumoverse-d1834.firebasestorage.app", // Using the one from your snippet, but verify!
  messagingSenderId: "274868857687",
  appId: "1:274868857687:web:37ee07365edb445ddcec12",
  measurementId: "G-VNXL4PZYSZ"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Services
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const analytics = getAnalytics(app); // Initialize Analytics

const googleProvider = new GoogleAuthProvider(); // For potential future Google Sign-In

// --- Helper Functions (Can be expanded or moved to utility files later) ---

// Example: Fetch general site settings or user profile information
async function getSiteSettings(docId = "generalSite") { // e.g., "generalSite", "profileInfo", "contactInfo"
    const settingsDocRef = doc(db, 'settings', docId);
    try {
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.warn(`No settings document found for ID: ${docId} in 'settings' collection.`);
            return {}; // Return empty object or defaults
        }
    } catch (error) {
        console.error(`Error fetching settings for ${docId}:`, error);
        return {}; // Return empty object on error
    }
}

// Example: Fetch a limited number of items from a collection for previews
async function getSectionPreviewData(sectionCollectionName, count = 3, orderByField = 'timestamp', orderDirection = 'desc') {
    try {
        const sectionColRef = collection(db, sectionCollectionName);
        const q = query(sectionColRef, orderBy(orderByField, orderDirection), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    } catch (error) {
        console.error(`Error fetching preview data for ${sectionCollectionName}:`, error);
        return []; // Return empty array on error
    }
}

// Export the initialized services and any helper functions
export {
    app,
    auth,
    db,
    storage,
    analytics,
    googleProvider,
    // Auth functions (re-exporting for convenience in other modules)
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
    signOut,
    onAuthStateChanged,
    // Firestore functions (re-exporting for convenience)
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
    // Storage functions (re-exporting for convenience)
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
    // Your helper functions
    getSiteSettings,
    getSectionPreviewData
};
