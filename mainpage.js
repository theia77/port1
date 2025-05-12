// script.js
document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for internal links
    const navLinks = document.querySelectorAll('.main-nav a[href^="#"], .cta-button[href^="#"]');

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const headerOffset = document.querySelector('.site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top + window.pageYOffset;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Header shadow on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) {
            header.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Fade-in animation for sections on scroll
    const sections = document.querySelectorAll('.content-section, .hero-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible'); // Add 'visible' class
                // observer.unobserve(entry.target); // Optional: stop observing after first animation
            }
            // Optional: remove 'visible' class if you want animation to repeat when scrolling up
            // else {
            //     entry.target.classList.remove('visible');
            // }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });
});
