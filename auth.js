// auth.js
import { auth } from './firebase-init.js'; // Assuming firebase-init.js is in the same directory
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";

// DOM Elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const userStatusDiv = document.getElementById('user-status');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
const signupButton = document.getElementById('signup-button');

const showSignupButton = document.getElementById('show-signup');
const showLoginButton = document.getElementById('show-login');

const userEmailDisplay = document.getElementById('user-email-display');
const logoutButton = document.getElementById('logout-button');
const authErrorP = document.getElementById('auth-error');

// --- Toggle Forms ---
if (showSignupButton) {
    showSignupButton.addEventListener('click', () => {
        loginSection.style.display = 'none';
        signupSection.style.display = 'block';
        authErrorP.textContent = '';
    });
}

if (showLoginButton) {
    showLoginButton.addEventListener('click', () => {
        signupSection.style.display = 'none';
        loginSection.style.display = 'block';
        authErrorP.textContent = '';
    });
}

// --- Sign Up Function ---
if (signupButton) {
    signupButton.addEventListener('click', () => {
        const email = signupEmailInput.value;
        const password = signupPasswordInput.value;
        authErrorP.textContent = ''; // Clear previous errors

        if (!email || !password) {
            authErrorP.textContent = 'Please enter both email and password.';
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User signed up:", user.email);
                // UI will be updated by onAuthStateChanged
                signupEmailInput.value = ''; // Clear fields
                signupPasswordInput.value = '';
            })
            .catch((error) => {
                console.error("Signup Error:", error.code, error.message);
                authErrorP.textContent = error.message;
            });
    });
}

// --- Login Function ---
if (loginButton) {
    loginButton.addEventListener('click', () => {
        const email = loginEmailInput.value;
        const password = loginPasswordInput.value;
        authErrorP.textContent = ''; // Clear previous errors

        if (!email || !password) {
            authErrorP.textContent = 'Please enter both email and password.';
            return;
        }

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log("User logged in:", user.email);
                // UI will be updated by onAuthStateChanged
                loginEmailInput.value = ''; // Clear fields
                loginPasswordInput.value = '';
            })
            .catch((error) => {
                console.error("Login Error:", error.code, error.message);
                authErrorP.textContent = error.message;
            });
    });
}

// --- Logout Function ---
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        signOut(auth).then(() => {
            console.log("User logged out");
            // UI will be updated by onAuthStateChanged
        }).catch((error) => {
            console.error("Logout Error:", error);
            authErrorP.textContent = "Logout failed: " + error.message;
        });
    });
}

// --- Observe Auth State Changes ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        console.log("Auth state changed: User is signed in", user.email);
        userEmailDisplay.textContent = user.email;

        loginSection.style.display = 'none';
        signupSection.style.display = 'none';
        userStatusDiv.style.display = 'block';
        authErrorP.textContent = '';
    } else {
        // User is signed out
        console.log("Auth state changed: User is signed out");
        userStatusDiv.style.display = 'none';
        loginSection.style.display = 'block'; // Show login form by default when logged out
        signupSection.style.display = 'none';
    }
});

// Initial check in case the user is already logged in (e.g., from a previous session)
// The onAuthStateChanged listener above will handle this automatically when it fires.
