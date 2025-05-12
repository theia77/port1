// mainpage.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#64ffda" }, // Using accent color from CSS
                shape: { type: "circle" },
                opacity: { value: 0.2, random: true }, // More subtle
                size: { value: 2, random: true },
                line_linked: { enable: false }, // Lines can be distracting
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: false }, onclick: { enable: false }, resize: true }, // Simplified interactivity
                modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
            },
            retina_detect: true
        });
    }

    // Header scroll effect
    const header = document.getElementById('mainHeader');
    if (header) {
        const scrollThreshold = 50; // Pixels to scroll before changing header
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

   // Mobile navigation toggle
    const mobileNavToggle = document.querySelector('.mobile-nav-toggle');
    const navMenu = document.querySelector('.nav');
    if (mobileNavToggle && navMenu) {
        mobileNavToggle.addEventListener('click', () => {
            const isExpanded = mobileNavToggle.getAttribute('aria-expanded') === 'true' || false;
            mobileNavToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
            document.body.classList.toggle('no-scroll'); // Optional: prevent body scroll when nav is open
        });

        // Close mobile nav when a link is clicked
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu.classList.contains('active')) {
                    mobileNavToggle.setAttribute('aria-expanded', 'false');
                    navMenu.classList.remove('active');
                    document.body.classList.remove('no-scroll');
                }
            });
        });
    }

    // Set current year in footer
    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Optional: Load dynamic content from localStorage
    function loadMainPageDynamicContent() {
        // Get from localStorage and update elements with IDs
        // e.g., if (localStorage.getItem('profileName')) { document.getElementById('profile-name').textContent = localStorage.getItem('profileName'); }
    }
    // loadMainPageDynamicContent(); // Call if admin changes impact the home page

    // Show notification (if needed) - implement as in previous responses
    function showNotification(message, type = 'success') {
          const notification = document.getElementById('notification');
          const notificationMessage = document.getElementById('notification-message');
          if (notification && notificationMessage) {
             notificationMessage.textContent = message;
             notification.classList.add('active');
             setTimeout(() => {
                 notification.classList.remove('active');
             }, 3000);
        }
    }

});
