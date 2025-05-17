// Import the initializeApp function from the Firebase SDK
import { initializeApp } from "firebase/app";

// If you plan to use other Firebase services, import them here.
// For example, for Firestore:
// import { getFirestore } from "firebase/firestore";
// For Authentication:
// import { getAuth } from "firebase/auth";
// For Realtime Database:
// import { getDatabase } from "firebase/database";
// For Storage:
// import { getStorage } from "firebase/storage";
// For Analytics (if you use measurementId):
// import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCG1aRMKiqK9HdytJGh0ZAdPpi15R0AELA",
  authDomain: "portfolio-sumoverse-d1834.firebaseapp.com",
  projectId: "portfolio-sumoverse-d1834",
  storageBucket: "portfolio-sumoverse-d1834.appspot.com", // Verified common format, double-check in your Firebase console
  messagingSenderId: "274868857687",
  appId: "1:274868857687:web:37ee07365edb445ddcec12",
  measurementId: "G-VNXL4PZYSZ" // Optional for SDK v7.20.0+ but good to include if you use Analytics
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize and export Firebase services you want to use.
// Example for Firestore:
// export const db = getFirestore(app);

// Example for Authentication:
// export const auth = getAuth(app);

// Example for Realtime Database (if you added databaseURL to firebaseConfig):
// Make sure to add `databaseURL: "https://portfolio-sumoverse-d1834.firebaseio.com"` (or your specific region) to firebaseConfig
// export const database = getDatabase(app);

// Example for Storage:
// export const storage = getStorage(app);

// Example for Analytics:
// const analytics = getAnalytics(app); // Only if you are using it

// Export the initialized Firebase app instance.
// You might not always need to export the app itself if you export the services.
export default app;
