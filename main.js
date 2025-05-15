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


    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 25, density: { enable: true, value_area: 900 } }, // Even fewer
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.15, random: true, anim: { enable: true, speed: 0.3, opacity_min: 0.03, sync: false } }, // More subtle
                size: { value: 1.5, random: true, anim: { enable: false } }, // Smaller
                line_linked: { enable: true, distance: 200, color: "#D6C180", opacity: 0.08, width: 0.5 }, // Fainter lines
                move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out" } // Slower
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 120, line_opacity: 0.1 } }
            },
            retina_detect: true
        });
    }

    initBridgeModel();

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

function initBridgeModel() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js container or THREE library not found.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000); // Slightly narrower FOV
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    renderer.outputEncoding = THREE.sRGBEncoding; // For better color accuracy
    container.appendChild(renderer.domElement);

    // Enhanced Lighting - Three-Point Lighting idea
    const keyLight = new THREE.DirectionalLight(0xffeedd, 0.8); // Warmer key light
    keyLight.position.set(-5, 5, 5);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x8DA9C4, 0.4); // Cooler fill light from theme
    fillLight.position.set(5, 2, 5);
    scene.add(fillLight);
    
    const backLight = new THREE.DirectionalLight(0xD6C180, 0.3); // Rim light from theme
    backLight.position.set(0, 5, -8);
    scene.add(backLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Lower ambient, rely on directs
    scene.add(ambientLight);

    // Using MeshStandardMaterial for more realism
    const roadMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x6c6258, // Darker, less saturated road
        metalness: 0.3, 
        roughness: 0.7 
    });
    const pillarMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x708CA0, // Darker primary accent
        metalness: 0.4, 
        roughness: 0.6
    });
    const cableMaterial = new THREE.LineBasicMaterial({ 
        color: 0xB09A6A, // Desaturated gold
        linewidth: 1 
    });

    const createBridgeSegment = (xOffset) => {
        const group = new THREE.Group();
        const roadGeometry = new THREE.BoxGeometry(10, 0.3, 1.6);
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(xOffset, 0, 0);
        group.add(road);
        
        const pillarGeometry = new THREE.CylinderGeometry(0.2, 0.3, 4, 10);
        for (let z = -1; z <= 1; z += 2) { 
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(xOffset, -2, z * 0.6);
            group.add(pillar);
        }
        
        for (let z = -1; z <= 1; z += 2) {
            const points = [
                new THREE.Vector3(xOffset - 4.8, 1.5, z * 0.6),
                new THREE.Vector3(xOffset, 0.15, z * 0.6),
                new THREE.Vector3(xOffset + 4.8, 1.5, z * 0.6)
            ];
            const cableGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const cable = new THREE.Line(cableGeometry, cableMaterial);
            group.add(cable);
        }
        return group;
    };

    const bridgeSegments = [];
    for (let x = -5; x <= 5; x += 10) { 
        const segment = createBridgeSegment(x);
        scene.add(segment);
        bridgeSegments.push(segment);
    }

    camera.position.set(0, 2.5, 11); // Adjusted camera
    camera.lookAt(0, 0.5, 0); // Look slightly above center

    let time = 0;
    let mouseX = 0, mouseY = 0;
    const targetCameraPos = new THREE.Vector2(); // For smoother camera follow

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);
    }

    function animate() {
        requestAnimationFrame(animate);
        time += 0.006; 
        
        bridgeSegments.forEach((segment, i) => {
            segment.position.y = Math.sin(time * 0.8 + i * 0.7) * 0.05; 
            segment.rotation.y += 0.0003 * (i % 2 === 0 ? 1 : -1); 
        });
        
        // Smooth camera follow with GSAP-like interpolation
        targetCameraPos.x = mouseX * 0.3; // Reduced effect
        targetCameraPos.y = -mouseY * 0.2; // Reduced effect, inverted for natural feel

        camera.position.x += (targetCameraPos.x - camera.position.x) * 0.03;
        camera.position.y += (targetCameraPos.y - (camera.position.y - 2.5)) * 0.03; // Adjust relative to base Y
        camera.lookAt(0, 0.5, 0);
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}

