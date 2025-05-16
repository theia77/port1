document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();

    if (typeof gsap !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Header animation
        gsap.fromTo(".header", 
            { opacity: 0, y: -30 }, 
            { opacity: 1, y: 0, duration: 0.8, ease: "power2.out", delay: 0.2 }
        );

        // Subtitle animation (after title lines via CSS)
        gsap.fromTo(".subtitle", 
            { opacity: 0, y: 20 }, 
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 1.9 } // After title line 3 (1.1s + 0.7s duration)
        );
        
        // CTA Container animation (after subtitle)
        gsap.fromTo(".cta-container",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 2.3 } // After subtitle
        );

        // Stats animation (on scroll)
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            gsap.utils.toArray('.stat').forEach((stat, index) => {
                gsap.fromTo(stat, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.6, 
                        delay: index * 0.15,
                        scrollTrigger: {
                            trigger: statsContainer,
                            start: "top 88%",
                            toggleActions: "play none none none",
                        }
                    }
                );
            });

            // IntersectionObserver for counter animation (triggers after GSAP makes them visible)
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    animateCounters();
                    observer.unobserve(statsContainer); 
                }
            }, { threshold: 0.5 }); 
            observer.observe(statsContainer);
        }
    }

    if (typeof VANTA !== 'undefined') {
        VANTA.FOG({
            el: "#vanta-bg",
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            highlightColor: 0x8da9c4,
            midtoneColor: 0xd6c180,
            lowlightColor: 0x5a534a,
            baseColor: 0xfcfbf8,
            blurFactor: 0.90,
            zoom: 0.80
        })
    }

    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Data-Driven Design", "Smart Infrastructure", "AI-Powered Engineering", "Sustainable Solutions", "Resilient Urban Planning"];
        let wordIndex = 0; charIndex = 0; isDeleting = false;
        const typeSpeed = 90, deleteSpeed = 45, delayBetweenWords = 1600;

        function type() {
            const currentWord = words[wordIndex];
            typingText.textContent = currentWord.substring(0, charIndex);
            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++; setTimeout(type, typeSpeed);
            } else if (isDeleting && charIndex > 0) {
                charIndex--; setTimeout(type, deleteSpeed);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) wordIndex = (wordIndex + 1) % words.length;
                setTimeout(type, isDeleting ? typeSpeed : delayBetweenWords);
            }
        }
        setTimeout(type, 1900); // After title line 3 animation (1.1s delay + 0.7s duration) + small buffer
    }

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && typeof confetti === 'function') {
        ctaButton.addEventListener('click', function(e) {
            const duration = 900, animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 22, spread: 360, ticks: 45, zIndex: 1001 };
            function randomInRange(min, max) { return Math.random() * (max - min) + min; }
            const themeColorsConfetti = ['#8DA9C4', '#D6C180', '#CE7B69', '#FCFBF8'];
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                const particleCount = 35 * (timeLeft / duration);
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: themeColorsConfetti }));
                confetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: themeColorsConfetti }));
            }, 180);
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0; counter.innerText = count;
            const updateCount = () => {
                const increment = target / 160; // Adjusted speed
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 10); 
                } else {
                    counter.innerText = target;
                    gsap.to(counter, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });
                }
            };
            updateCount();
        });
    }
    
    // Subtle Mousemove parallax for the main hero text content (optional, can be removed if too busy)
    const heroElementsToParallax = document.querySelectorAll('.title, .subtitle');
    if (heroElementsToParallax.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.addEventListener('mousemove', function(e) {
            const moveXBase = (e.clientX - window.innerWidth / 2);
            const moveYBase = (e.clientY - window.innerHeight / 2);
            
            heroElementsToParallax.forEach((el, index) => {
                const factor = (index === 0 ? 0.006 : 0.009); // Title moves less than subtitle
                const moveX = moveXBase * factor;
                const moveY = moveYBase * factor;
                // Using GSAP for smoother transform
                gsap.to(el, { 
                    x: moveX, 
                    y: moveY, 
                    duration: 0.8, // Smooth transition
                    ease: "power3.out" // Easing function
                });
            });
        });
    }
});

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}
