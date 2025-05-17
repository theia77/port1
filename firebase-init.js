// firebase-init.js

// Firebase App (Core)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup,
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
    setDoc
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";

// Firebase Storage
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY", // Replace with your actual API key
  authDomain: "YOUR_AUTH_DOMAIN", // e.g., portfolio-sumoverse.firebaseapp.com
  projectId: "YOUR_PROJECT_ID",  // e.g., portfolio-sumoverse
  storageBucket: "YOUR_STORAGE_BUCKET", // e.g., portfolio-sumoverse.appspot.com
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
  measurementId: "YOUR_MEASUREMENT_ID" // Optional
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);
const googleProvider = new GoogleAuthProvider();

// Helper Functions (Can be expanded or moved to utility files)
async function getProfileData() {
    const profileDocRef = doc(db, 'settings', 'profileInfo'); // Store profile in settings
    try {
        const docSnap = await getDoc(profileDocRef);
        if (docSnap.exists()) {
            return docSnap.data();
        } else {
            console.log("No 'profileInfo' document found in 'settings' collection!");
            return { name: "Your Name", tagline: "Your Tagline", /* ...defaults */ };
        }
    } catch (error) {
        console.error("Error fetching profile data:", error);
        return { name: "Error Loading", tagline: "", /* ...error defaults */ };
    }
}

async function getSectionPreviewData(sectionCollectionName, count = 2, orderByField = 'timestamp', orderDirection = 'desc') {
    try {
        const sectionColRef = collection(db, sectionCollectionName);
        const q = query(sectionColRef, orderBy(orderByField, orderDirection), limit(count));
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
        console.error(`Error fetching preview data for ${sectionCollectionName}:`, error);
        return [];
    }
}

export {
    app, auth, db, storage, googleProvider,
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged,
    collection, getDocs, getDoc, doc, query, orderBy, limit, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc,
    ref, uploadBytesResumable, getDownloadURL, deleteObject,
    getProfileData, getSectionPreviewData
};
