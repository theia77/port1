// auth.js
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from './firebase-init.js';

const loginSection = document.getElementById('login-section');
const signupSection = document.getElementById('signup-section');
const userStatusDiv = document.getElementById('user-status');
const loginEmailInput = document.getElementById('login-email');
const loginPasswordInput = document.getElementById('login-password');
const loginButton = document.getElementById('login-button');
const signupEmailInput = document.getElementById('signup-email');
const signupPasswordInput = document.getElementById('signup-password');
// const signupAdminKeyInput = document.getElementById('signup-admin-key'); // Uncomment if using admin key
const signupButton = document.getElementById('signup-button');
const showSignupButton = document.getElementById('show-signup');
const showLoginButton = document.getElementById('show-login');
const userEmailDisplay = document.getElementById('user-email-display');
const authErrorP = document.getElementById('auth-error');

// const ADMIN_SECRET_KEY = "YOUR_SUPER_SECRET_ADMIN_KEY"; // IMPORTANT: For production, use a secure way to manage this.

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

if (signupButton) {
    signupButton.addEventListener('click', () => {
        const email = signupEmailInput.value.trim();
        const password = signupPasswordInput.value;
        // const adminKey = signupAdminKeyInput ? signupAdminKeyInput.value : ''; // Get if field exists
        authErrorP.textContent = '';

        if (!email || !password) {
            authErrorP.textContent = 'Please enter both email and password.';
            return;
        }
        // IMPORTANT: Implement robust admin key check if using one
        // if (adminKey !== ADMIN_SECRET_KEY) {
        //     authErrorP.textContent = 'Invalid Admin Secret Key.';
        //     return;
        // }

        signupButton.disabled = true;
        signupButton.textContent = 'Signing up...';
        createUserWithEmailAndPassword(auth, email, password)
            .then(() => { /* onAuthStateChanged will handle redirect */ })
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
            .then(() => { /* onAuthStateChanged will handle redirect */ })
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

onAuthStateChanged(auth, (user) => {
    if (user) {
        if (window.location.pathname.includes('auth.html')) {
            if(loginSection) loginSection.style.display = 'none';
            if(signupSection) signupSection.style.display = 'none';
            if(userStatusDiv) userStatusDiv.style.display = 'block';
            if(userEmailDisplay) userEmailDisplay.textContent = user.email;
            window.location.href = 'admin-dashboard.html';
        }
    } else {
        if (window.location.pathname.includes('admin-dashboard.html')) {
            window.location.href = 'auth.html';
        } else if (window.location.pathname.includes('auth.html')) {
            if(userStatusDiv) userStatusDiv.style.display = 'none';
            if(loginSection) loginSection.style.display = 'block';
            if(signupSection) signupSection.style.display = 'none';
        }
    }
});
