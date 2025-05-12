// mainpage.js
document.addEventListener('DOMContentLoaded', function() {
    // Particles.js Initialization (same as previous)
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } },
                color: { value: "#64ffda" }, 
                shape: { type: "circle" },
                opacity: { value: 0.2, random: true }, // More subtle
                size: { value: 2, random: true },
                line_linked: { enable: false }, // Lines can be distracting
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: { enable: false },
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

    // XP Bar Animation for main page previews (if kept and visible)
    const animateXPBars = () => {
        const xpBars = document.querySelectorAll('.access-portals .xp-bar');
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // observer.unobserve(entry.target); // Optional: Animate only once
                }
            });
        }, { threshold: 0.5 }); // Trigger when 50% visible

        xpBars.forEach(bar => observer.observe(bar));
    };
    if (document.querySelector('.access-portals .xp-bar')) {
         animateXPBars();
    }


    // Function to show notifications (same as before)
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.className = 'notification active'; 
            
            let iconClass = 'fas fa-check-circle';
            let notifClass = 'success';

            if (type === 'error') {
                notifClass = 'error';
                iconClass = 'fas fa-exclamation-circle';
            } else if (type === 'info') {
                notifClass = 'info';
                iconClass = 'fas fa-info-circle';
            }
            
            notification.classList.add(notifClass);
            icon.className = iconClass;
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }

    // Optional: Load dynamic content from localStorage for profile/previews
    function loadMainPageDynamicContent() {
        // Example for profile name:
        const profileNameData = localStorage.getItem('mainPageProfileName'); // Use specific key
        if (profileNameData) {
            const profileNameEl = document.getElementById('profile-name');
            if (profileNameEl) profileNameEl.textContent = profileNameData;
        }
        // Add similar logic for tagline, description, social links, and flip card previews
        // Ensure IDs in HTML match what you target here.
    }
    // loadMainPageDynamicContent(); // Call this if you manage this content via admin panel
});
