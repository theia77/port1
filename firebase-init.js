// firebase-init.js

// Firebase App (Core)
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";

// Firebase Authentication
import {
    getAuth,
    GoogleAuthProvider, // If used elsewhere
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signInWithPopup, // If used elsewhere
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

// **ACTION: REPLACE WITH YOUR ACTUAL FIREBASE CONFIGURATION**
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
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
const googleProvider = new GoogleAuthProvider(); // If you plan to use Google Sign-In

// Helper Functions (Example - keep or remove as needed)
async function getProfileData() { /* ... your implementation ... */ }
async function getSectionPreviewData(sectionCollectionName, count = 2, orderByField = 'timestamp', orderDirection = 'desc') { /* ... */ }

export {
    app, auth, db, storage, googleProvider,
    // Auth
    createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup, signOut, onAuthStateChanged,
    // Firestore
    collection, getDocs, getDoc, doc, query, orderBy, limit, addDoc, updateDoc, deleteDoc, serverTimestamp, setDoc,
    // Storage
    ref, uploadBytesResumable, getDownloadURL, deleteObject,
    // Helpers
    getProfileData, getSectionPreviewData
};
