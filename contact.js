// contact.js
import { db, addDoc, collection } from './firebase-init.js'; // Assuming addDoc and collection are exported

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateContactPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    gsap.from(".contact-section", { 
        duration: 0.7, 
        y: 25, 
        opacity: 0, 
        stagger: 0.2, 
        ease: "power3.out",
        delay: 0.4 
    });
}

function showNotification(message, type = 'info') { // type can be 'success', 'error', 'info'
    const notification = document.getElementById('notification');
    const messageSpan = document.getElementById('notification-message');
    if (!notification || !messageSpan) return;

    messageSpan.textContent = message;
    notification.className = 'notification active'; // Remove previous type classes
    notification.classList.add(type);


    setTimeout(() => {
        notification.classList.remove('active');
    }, 5000); // Hide after 5 seconds
}


async function handleContactFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const name = form.name.value;
    const email = form.email.value;
    const subject = form.subject.value;
    const message = form.message.value;
    const submitButton = form.querySelector('button[type="submit"]');

    submitButton.disabled = true;
    submitButton.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';

    try {
        // Save to Firebase Firestore
        await addDoc(collection(db, "contactMessages"), {
            name: name,
            email: email,
            subject: subject,
            message: message,
            timestamp: new Date()
        });
        
        showNotification('Message sent successfully! Thank you.', 'success');
        form.reset();
    } catch (error) {
        console.error("Error sending message: ", error);
        showNotification('Failed to send message. Please try again later.', 'error');
    } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
    }
}

async function loadContactDetails() {
    // In a real app, you'd fetch these from Firebase config or a 'settings' document
    const contactInfo = {
        email: "sumouli.pramanik@example.com", // Replace with your actual email
        calendly: "https://calendly.com/sumouli-pramanik", // Replace with your Calendly
        phone: "+1 (555) 123-4567", // Replace
        github: "sumouliP", // Replace
        linkedin: "sumouli-pramanik-profile", // Replace
        twitter: "sumouliTweets", // Replace
        medium: "sumouliWrites" // Replace
    };

    const emailLink = document.getElementById('email-display-link');
    const calendlyLink = document.getElementById('calendly-link');
    const phoneLink = document.getElementById('phone-display-link');

    if (emailLink) emailLink.href = `mailto:${contactInfo.email}`;
    if (emailLink) emailLink.textContent = contactInfo.email;
    if (calendlyLink) calendlyLink.href = contactInfo.calendly;
    if (phoneLink) phoneLink.href = `tel:${contactInfo.phone.replace(/\D/g,'')}`; // Remove non-digits for tel link
    if (phoneLink) phoneLink.textContent = contactInfo.phone;


    const githubCardLink = document.getElementById('github-social-card');
    const githubUserDisplay = document.getElementById('github-username-display');
    if (githubCardLink) githubCardLink.href = `https://github.com/${contactInfo.github}`;
    if (githubUserDisplay) githubUserDisplay.textContent = `@${contactInfo.github}`;
    
    const linkedinCardLink = document.getElementById('linkedin-social-card');
    const linkedinUserDisplay = document.getElementById('linkedin-username-display');
    if (linkedinCardLink) linkedinCardLink.href = `https://linkedin.com/in/${contactInfo.linkedin}`;
    if (linkedinUserDisplay) linkedinUserDisplay.textContent = `Sumouli Pramanik`; // Or fetch name

    const twitterCardLink = document.getElementById('twitter-social-card');
    const twitterUserDisplay = document.getElementById('twitter-username-display');
    if (twitterCardLink) twitterCardLink.href = `https://twitter.com/${contactInfo.twitter}`;
    if (twitterUserDisplay) twitterUserDisplay.textContent = `@${contactInfo.twitter}`;

    const mediumCardLink = document.getElementById('medium-social-card');
    const mediumUserDisplay = document.getElementById('medium-username-display');
    if (mediumCardLink) mediumCardLink.href = `https://medium.com/@${contactInfo.medium}`;
    if (mediumUserDisplay) mediumUserDisplay.textContent = `@${contactInfo.medium}`;
}


document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateContactPage();
    loadContactDetails(); // Load/Update dynamic contact info

    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactFormSubmit);
    }

    const currentPage = window.location.pathname.split("/").pop() || "contact.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Paste initParticles and updateCurrentYear functions here
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2.5, random: true },
                line_linked: { enable: true, distance: 180, color: "#D6C180", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 120, line_opacity: 0.3 } }
            },
            retina_detect: true
        });
    }
}

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
