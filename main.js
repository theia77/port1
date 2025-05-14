// main.js (for index.html - Landing Page)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with "Architect's Study" theme
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } }, // Fewer for a cleaner look
                color: { value: "#8DA9C4" }, // Primary: Muted Cadet Blue
                shape: { type: "circle" },
                opacity: { value: 0.25, random: true, anim: { enable: true, speed: 0.5, opacity_min: 0.05, sync: false } }, // More subtle
                size: { value: 2, random: true, anim: { enable: false } }, // Smaller, non-animated size
                line_linked: { enable: true, distance: 180, color: "#D6C180", opacity: 0.15, width: 1 }, // Secondary: Muted Gold, more subtle
                move: { enable: true, speed: 0.8, direction: "none", random: true, straight: false, out_mode: "out" } // Slower movement
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" }, // Softer grab interaction
                    onclick: { enable: false, mode: "push" } // Disabled click interaction for cleaner feel
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

    // Initialize 3D Bridge Model with "Architect's Study" theme
    initBridgeModel();

    // Typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Data Science", "AI Models", "Civil Engineering", "CodeStruct"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        const typeSpeed = 100;
        const deleteSpeed = 50;
        const delayBetweenWords = 1500;

        function type() {
            const currentWord = words[wordIndex];
            // Ensure typingText starts empty or with a non-breaking space to maintain height
            typingText.innerHTML = currentWord.substring(0, charIndex) + '<span class="cursor">|</span>';
            
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
        // Initial delay for typing animation to start after other elements have animated in
        setTimeout(type, parseFloat(getComputedStyle(document.querySelector('.title-line-2')).animationDelay.replace('s','')) * 1000 + 800); 
    }


    // CTA button confetti with "Architect's Study" theme colors
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && typeof confetti === 'function') {
        ctaButton.addEventListener('click', function(e) {
            // Allow default link behavior (navigation) unless a delay is explicitly needed
            // e.preventDefault(); // Uncomment if navigation should be delayed

            const duration = 1000; // Shorter confetti duration
            const animationEnd = Date.now() + duration;
            const defaults = { startVelocity: 25, spread: 360, ticks: 50, zIndex: 1001 }; // Ensure confetti is on top

            function randomInRange(min, max) {
                return Math.random() * (max - min) + min;
            }

            const themeColorsConfetti = ['#8DA9C4', '#D6C180', '#CE7B69', '#FCFBF8']; // Architect's Study colors

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

            // If navigation was prevented:
            // setTimeout(() => { window.location.href = this.getAttribute('href'); }, duration + 100);
        });
    }

    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 180; // Slightly faster
        
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0; // Start from 0 for animation
            counter.innerText = count; // Initialize display to 0

            const updateCount = () => {
                const increment = target / speed;
                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 12); 
                } else {
                    counter.innerText = target; // Ensure exact target is displayed
                    // Subtle pulse effect after counting finishes
                    counter.style.transform = 'scale(1.1)';
                    setTimeout(() => { counter.style.transform = 'scale(1)'; }, 200);
                }
            };
            updateCount();
        });
    }

    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsContainer); // Animate only once
            }
        }, { threshold: 0.6 }); // Trigger when 60% visible
        observer.observe(statsContainer);
    }
    
    // Mousemove parallax effect (kept subtle)
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.008; // Reduced intensity
        const moveY = (e.clientY - window.innerHeight / 2) * 0.008; // Reduced intensity
        
        const titleElement = document.querySelector('.title');
        const subtitleElement = document.querySelector('.subtitle');
        const statsElement = document.querySelector('.stats-container');
        const ctaElement = document.querySelector('.cta-container');

        if (titleElement) { titleElement.style.transform = `translate(${moveX}px, ${moveY}px)`; }
        if (subtitleElement) { subtitleElement.style.transform = `translate(${moveX * 1.2}px, ${moveY * 1.2}px)`; }
        if (statsElement) { statsElement.style.transform = `translate(${moveX * 0.8}px, ${moveY * 0.8}px)`; }
        if (ctaElement) { ctaElement.style.transform = `translate(${moveX * 0.6}px, ${moveY * 0.6}px)`; }
    });
});

// 3D Bridge Model with "Architect's Study" theme
function initBridgeModel() {
    const container = document.getElementById('bridge-container');
    if (!container || typeof THREE === 'undefined') return; 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Softer lighting for "Architect's Study"
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.6); // Brighter ambient
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xFFEEDD, 0.4); // Warmer directional light
    directionalLight.position.set(5, 8, 3).normalize();
    scene.add(directionalLight);
    
    // Point lights with theme colors, more subtle
    const pointLight1 = new THREE.PointLight(0x8DA9C4, 0.5, 60); // Primary color
    pointLight1.position.set(8, 4, 8);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0xD6C180, 0.4, 60); // Secondary color
    pointLight2.position.set(-8, -3, -8);
    scene.add(pointLight2);

    const createBridgeSegment = (xOffset) => {
        const group = new THREE.Group();
        
        // Road with theme-aligned colors
        const roadGeometry = new THREE.BoxGeometry(10, 0.4, 1.8); // Slightly thinner
        const roadMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8C8278, // Warm Gray from theme
            specular: 0x5A534A, // Dark Taupe for subtle specular
            shininess: 20
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(xOffset, 0, 0);
        group.add(road);
        
        // Pillars with theme color
        const pillarGeometry = new THREE.CylinderGeometry(0.25, 0.4, 4.5, 8); // More slender
        const pillarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x8DA9C4, // Primary: Muted Cadet Blue
            specular: 0x708CA0, // Primary Dark
            shininess: 25,
        });
        
        for (let z = -1; z <= 1; z += 2) { 
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(xOffset, -2.25, z * 0.7); // Adjusted position
            group.add(pillar);
        }
        
        // Cables with theme color
        const cableMaterial = new THREE.LineBasicMaterial({ 
            color: 0xD6C180, // Secondary: Muted Gold
            linewidth: 1.5 // Thinner lines
        });
        
        for (let z = -1; z <= 1; z += 2) {
            const points = [];
            points.push(new THREE.Vector3(xOffset - 4.5, 1.8, z * 0.7)); // Adjusted cable points
            points.push(new THREE.Vector3(xOffset, 0.2, z * 0.7));
            points.push(new THREE.Vector3(xOffset + 4.5, 1.8, z * 0.7)); 
            
            const cableGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const cable = new THREE.Line(cableGeometry, cableMaterial);
            group.add(cable);
        }
        return group;
    };

    const bridgeSegments = [];
    // Fewer segments for a less cluttered background, or adjust xOffset increments
    for (let x = -5; x <= 5; x += 10) { // Only two segments for simplicity, or adjust distance
        const segment = createBridgeSegment(x);
        scene.add(segment);
        bridgeSegments.push(segment);
    }

    camera.position.set(0, 3, 12); // Adjusted camera for better view of simpler model
    camera.lookAt(0, 0, 0);

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.008; // Slower animation overall
        
        bridgeSegments.forEach((segment, i) => {
            segment.position.y = Math.sin(time + i * 0.8) * 0.08; // Softer sway
            segment.rotation.y += 0.0005 * (i % 2 === 0 ? 1 : -1); // Very slow rotation
        });
        
        // Subtle point light animation
        pointLight1.intensity = 0.4 + Math.sin(time * 1.5) * 0.2;
        pointLight2.position.x = Math.cos(time * 0.3) * 9;
        pointLight2.position.z = Math.sin(time * 0.3) * 9;
        
        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
