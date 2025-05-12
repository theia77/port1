// firebase-init.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
// You can import other Firebase services here if needed, e.g.:
// import { getFirestore } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
// import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyAmMPzkIWQIG44pLQbIRNqoZBAvOT8epXc", // This is public
  authDomain: "portfolio-sumoverse.firebaseapp.com",
  projectId: "portfolio-sumoverse",
  storageBucket: "portfolio-sumoverse.appspot.com", // Corrected typical format
  messagingSenderId: "475386816588",
  appId: "1:475386816588:web:dbfc0daa07a99799522ce9",
  measurementId: "G-YJ2SLKGTCG" // Optional, but included in your previous snippet
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);

// Initialize other services if needed
// const firestore = getFirestore(app);
// const analytics = getAnalytics(app);

// Export the instances for use in other scripts
export { app, auth /*, firestore, analytics */ };
