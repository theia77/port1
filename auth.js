// auth.js
import { auth } from './firebase-init.js';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js"; // Use your Firebase version

// DOM Elements
const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const userStatusDiv = document.getElementById('user-status');

const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');

const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
// const signupAdminKeyInput = document.getElementById('signup-admin-key'); // If you add a secret key
const signupButton = document.getElementById('signup-button');

const showSignupButton = document.getElementById('show-signup');
const showLoginButton = document.getElementById('show-login');

const userEmailDisplay = document.getElementById('user-email-display');
const logoutButtonAuthPage = document.getElementById('logout-button-authpage'); // Button on auth page
const authErrorP = document.getElementById('auth-error');

const ADMIN_SECRET_KEY = "YOUR_SUPER_SECRET_ADMIN_KEY"; // IMPORTANT: Replace or manage securely

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
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value;
        // const adminKey = signupAdminKeyInput ? signupAdminKeyInput.value : ADMIN_SECRET_KEY; // Use this if implementing secret key
        authErrorP.textContent = '';

        if (!email || !password) {
            authErrorP.textContent = 'Please enter both email and password.';
            return;
        }

        // **Basic Admin Key Check (Example - enhance for production)**
        // if (adminKey !== ADMIN_SECRET_KEY) {
        //     authErrorP.textContent = 'Invalid Admin Secret Key.';
        //     return;
        // }

        signupButton.disabled = true;
        signupButton.textContent = 'Signing up...';

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User signed up successfully.
                // UI will be updated by onAuthStateChanged, which redirects to dashboard.
                signupEmailInput.value = '';
                signupPasswordInput.value = '';
                // if (signupAdminKeyInput) signupAdminKeyInput.value = '';
            })
            .catch((error) => {
                console.error("Signup Error:", error);
                authErrorP.textContent = error.message;
            })
            .finally(() => {
                signupButton.disabled = false;
                signupButton.textContent = 'Sign Up';
            });
    });
}

// --- Login Function ---
if (loginButton) {
    loginButton.addEventListener('click', () => {
        const email = loginEmailInput.value.trim();
        const password = loginPasswordInput.value;
        authErrorP.textContent = '';

        if (!email || !password) {
            authErrorP.textContent = 'Please enter both email and password.';
            return;
        }
        loginButton.disabled = true;
        loginButton.textContent = 'Logging in...';

        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // User logged in successfully.
                // UI will be updated by onAuthStateChanged, which redirects to dashboard.
                loginEmailInput.value = '';
                loginPasswordInput.value = '';
            })
            .catch((error) => {
                console.error("Login Error:", error);
                authErrorP.textContent = error.message;
            })
            .finally(() => {
                loginButton.disabled = false;
                loginButton.textContent = 'Login';
            });
    });
}

// --- Logout Function (for the button on auth.html, primarily if redirect fails) ---
if (logoutButtonAuthPage) {
    logoutButtonAuthPage.addEventListener('click', () => {
        signOut(auth).catch((error) => {
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
        if (userEmailDisplay) userEmailDisplay.textContent = user.email;

        // If on auth.html, prepare to redirect
        if (window.location.pathname.includes('auth.html')) {
            if(loginSection) loginSection.style.display = 'none';
            if(signupSection) signupSection.style.display = 'none';
            if(userStatusDiv) userStatusDiv.style.display = 'block';
            // Redirect to admin dashboard
            window.location.href = 'admin-dashboard.html';
        }
    } else {
        // User is signed out
        console.log("Auth state changed: User is signed out");
        // If on a protected page (like admin-dashboard.html), redirect to login
        if (window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'auth.html';
        } else {
            // On auth.html, ensure login form is visible
            if(userStatusDiv) userStatusDiv.style.display = 'none';
            if(loginSection) loginSection.style.display = 'block';
            if(signupSection) signupSection.style.display = 'none';
            if(logoutButtonAuthPage) logoutButtonAuthPage.style.display = 'none';
        }
    }
});
