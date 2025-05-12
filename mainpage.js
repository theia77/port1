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
                // Calculate position, considering fixed header
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

    // Optional: Header shadow on scroll
    const header = document.querySelector('.site-header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 10) { // Add shadow after scrolling a bit
            header.style.boxShadow = '0 10px 30px -10px rgba(2,12,27,0.7)';
        } else {
            header.style.boxShadow = 'none';
        }
    });

    // Simple fade-in animation for sections on scroll (optional)
    const sections = document.querySelectorAll('.content-section, .hero-section');
    const observerOptions = {
        root: null, // relative to document viewport
        rootMargin: '0px',
        threshold: 0.1 // 10% of item visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                // observer.unobserve(entry.target); // Optional: stop observing after animation
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(section);
    });

});
