document.addEventListener('DOMContentLoaded', () => {
    updateCurrentYear();

    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false } },
                size: { value: 2, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 180, color: "#D6C180", opacity: 0.15, width: 1 },
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" },
                    onclick: { enable: false, mode: "push" }
                },
                modes: {
                    grab: { distance: 150, line_opacity: 0.2 },
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 3 }
                }
            },
            retina_detect: true
        });
    }

    initBridgeModel();

    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Data-Driven Design", "Smart Infrastructure", "AI-Powered Engineering", "Sustainable Solutions", "Resilient Urban Planning", "Predictive Analytics in Construction"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenWords = 1500;

        function type() {
            const currentWord = words[wordIndex];
            // Relies on CSS for the blinking cursor via border-right
            typingText.textContent = currentWord.substring(0, charIndex);
            
            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(type, typeSpeed);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(type, deleteSpeed);
            } else {
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(type, isDeleting ? typeSpeed : delayBetweenWords);
            }
        }
        // Start typing after title line 3 animation (1.1s delay + 0.6s duration = 1.7s) + small buffer
        setTimeout(type, 1800); 
    }

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && typeof confetti === 'function') {
        ctaButton.addEventListener('click', function(e) {
            const duration = 1000;
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 1001 };

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const themeColorsConfetti = ['#8DA9C4', '#D6C180', '#CE7B69', '#FCFBF8'];

            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) {
                    return clearInterval(interval);
                }
                const particleCount = 40 * (timeLeft / duration);
                
                confetti(Object.assign({}, defaults, { 
                    particleCount, 
                    origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                    colors: themeColorsConfetti
                }));
                confetti(Object.assign({}, defaults, { 
                    particleCount, 
                    origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                    colors: themeColorsConfetti
                }));
            }, 200);
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 180; 
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0; 
            counter.innerText = count;

            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 12); 
                } else {
                    counter.innerText = target;
                    counter.style.transform = 'scale(1.1)';
                    setTimeout(() => { counter.style.transform = 'scale(1)'; }, 200);
                }
            };
            updateCount();
        });
    }

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        // GSAP animation for individual stat items
        if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
            gsap.utils.toArray('.stat').forEach((stat, index) => {
                gsap.fromTo(stat, 
                    { opacity: 0, y: 20 },
                    { 
                        opacity: 1, 
                        y: 0, 
                        duration: 0.5, 
                        delay: index * 0.1, // Stagger animation
                        scrollTrigger: {
                            trigger: statsContainer,
                            start: "top 85%", // Start animation when statsContainer is 85% from top of viewport
                            toggleActions: "play none none none", // Play once when triggered
                        }
                    }
                );
            });
        }

        // IntersectionObserver for counter animation (triggers after GSAP makes them visible)
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsContainer); 
            }
        }, { threshold: 0.6 }); // Trigger when 60% visible
        observer.observe(statsContainer);
    }
    
    // Subtle Mousemove parallax effect for hero content - keep if desired
    const heroMain = document.querySelector('.hero');
    if (heroMain) { // Only apply if hero section exists
        document.addEventListener('mousemove', function(e) {
            const rect = heroMain.getBoundingClientRect();
            // Check if mouse is roughly over the hero area to avoid parallax when mouse is far away
            if (e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom) {
                const moveX = (e.clientX - window.innerWidth / 2) * 0.008; 
                const moveY = (e.clientY - window.innerHeight / 2) * 0.008; 
                
                const titleElement = document.querySelector('.title');
                const subtitleElement = document.querySelector('.subtitle');
                // Note: stats and cta containers already have CSS animations, parallax might conflict or be too much.
                // Consider removing parallax from them if CSS animations are preferred.
                // const statsElement = document.querySelector('.stats-container'); 
                // const ctaElement = document.querySelector('.cta-container');

                if (titleElement) { titleElement.style.transform = `translate(${moveX}px, ${moveY}px)`; }
                // If subtitle also has CSS animation, this might override it.
                // if (subtitleElement && !subtitleElement.style.animationName) { subtitleElement.style.transform = `translate(${moveX * 1.2}px, ${moveY * 1.2}px)`; }
            }
        });
    }
});

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function initBridgeModel() {
    const container = document.getElementById('hero-3d-container'); // Changed ID
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js container not found or THREE is not defined.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7); // Slightly brighter ambient
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFEEDD, 0.5); // Warmer directional
    directionalLight.position.set(5, 8, 3).normalize();
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x8DA9C4, 0.6, 70); // Primary color, slightly brighter
    pointLight1.position.set(8, 4, 8);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xD6C180, 0.5, 70); // Secondary color, slightly brighter
    pointLight2.position.set(-8, -3, -8);
    scene.add(pointLight2);

    const createBridgeSegment = (xOffset) => {
        const group = new THREE.Group();
        const roadGeometry = new THREE.BoxGeometry(10, 0.4, 1.8);
        const roadMaterial = new THREE.MeshPhongMaterial({ color: 0x8C8278, specular: 0x5A534A, shininess: 20 });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(xOffset, 0, 0);
        group.add(road);
        
        const pillarGeometry = new THREE.CylinderGeometry(0.25, 0.4, 4.5, 8);
        const pillarMaterial = new THREE.MeshPhongMaterial({ color: 0x8DA9C4, specular: 0x708CA0, shininess: 25 });
        for (let z = -1; z <= 1; z += 2) { 
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(xOffset, -2.25, z * 0.7);
            group.add(pillar);
        }
        
        const cableMaterial = new THREE.LineBasicMaterial({ color: 0xD6C180, linewidth: 1.5 });
        for (let z = -1; z <= 1; z += 2) {
            const points = [
                new THREE.Vector3(xOffset - 4.5, 1.8, z * 0.7),
                new THREE.Vector3(xOffset, 0.2, z * 0.7),
                new THREE.Vector3(xOffset + 4.5, 1.8, z * 0.7)
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

    camera.position.set(0, 3, 12);
    camera.lookAt(0, 0, 0);

    let time = 0;
    let mouseX = 0, mouseY = 0;
    let targetCameraX = 0, targetCameraY = camera.position.y;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        // Adjust target based on mouse position, scale effect for subtle follow
        targetCameraX = mouseX * 0.5; 
        targetCameraY = camera.position.y - mouseY * 0.3; // Adjust Y slightly, keep it mostly level
    }, false);

    function animate() {
        requestAnimationFrame(animate);
        time += 0.008; 
        
        bridgeSegments.forEach((segment, i) => {
            segment.position.y = Math.sin(time + i * 0.8) * 0.08; 
            segment.rotation.y += 0.0005 * (i % 2 === 0 ? 1 : -1); 
        });
        
        pointLight1.intensity = 0.5 + Math.sin(time * 1.5) * 0.2; // Adjusted base intensity
        pointLight2.position.x = Math.cos(time * 0.3) * 9;
        pointLight2.position.z = Math.sin(time * 0.3) * 9;

        // Smooth camera movement towards target
        camera.position.x += (targetCameraX - camera.position.x) * 0.02;
        // camera.position.y += (targetCameraY - camera.position.y) * 0.02; // Optional: subtle Y movement
        camera.lookAt(scene.position); // Keep looking at the center of the scene
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
