// main.js (for index.html - Landing Page)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 80, density: { enable: true, value_area: 800 } },
                color: { value: "#2563eb" },
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#7c3aed", opacity: 0.4, width: 1 },
                move: { enable: true, speed: 2, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" }
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            }
        });
    }

    // Initialize 3D Bridge Model
    initBridgeModel();

    // Typing animation
    const typingText = document.querySelector('.typing-text');
    if (typingText) {
        const words = ["Data Science", "AI Models", "Civil Engineering", "CodeStruct"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            const currentChar = currentWord.substring(0, charIndex);
            typingText.textContent = currentChar;
            typingText.classList.add('active');
            
            if (!isDeleting && charIndex < currentWord.length) {
                charIndex++;
                setTimeout(type, 100);
            } else if (isDeleting && charIndex > 0) {
                charIndex--;
                setTimeout(type, 50);
            } else {
                typingText.classList.remove('active');
                isDeleting = !isDeleting;
                if (!isDeleting) {
                    wordIndex = (wordIndex + 1) % words.length;
                }
                setTimeout(type, 1000);
            }
        }
        setTimeout(type, 2500); // Start typing animation after 2.5 seconds
    }


    // Smooth scroll for CTA button - Modified to navigate to mainpage.html
    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e) {
            // The HTML already has href="mainpage.html".
            // If you want to add effects *before* navigation, prevent default,
            // then navigate after a delay.
            
            // Example: Prevent default only if confetti is to be shown extensively
            // and then manually navigate. Otherwise, let the link work as is.

            // For now, the confetti effect will play, and the link will navigate.
            // If a longer delay for confetti is desired before navigation:
            // e.preventDefault(); 

            // More elaborate confetti effect
            if (typeof confetti === 'function') {
                const duration = 1500; // milliseconds for confetti
                const animationEnd = Date.now() + duration;
                const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 }; // Ensure confetti is on top

                function randomInRange(min, max) {
                    return Math.random() * (max - min) + min;
                }

                const interval = setInterval(function() {
                    const timeLeft = animationEnd - Date.now();

                    if (timeLeft <= 0) {
                        return clearInterval(interval);
                    }

                    const particleCount = 50 * (timeLeft / duration);
                    
                    confetti(Object.assign({}, defaults, { 
                        particleCount, 
                        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                        colors: ['#2563eb', '#10b981', '#7c3aed']
                    }));
                    confetti(Object.assign({}, defaults, { 
                        particleCount, 
                        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                        colors: ['#2563eb', '#10b981', '#7c3aed']
                    }));
                }, 250);

                // If you prevented default, navigate after confetti:
                // setTimeout(() => {
                //     window.location.href = this.getAttribute('href');
                // }, duration); 
            } else {
                // If confetti is not defined, or if you don't want to delay navigation:
                // window.location.href = this.getAttribute('href'); // Or simply let the <a> tag handle it
            }
        });
    }


    // Counter animation
    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        const speed = 200; 
        
        counters.forEach(counter => {
            const updateCount = () => {
                const target = +counter.getAttribute('data-target');
                let count = +counter.innerText;
                const increment = target / speed;

                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 10); // Adjust timing for smoothness
                } else {
                    counter.innerText = target;
                    counter.style.animation = 'pulse 0.5s ease-in-out';
                    setTimeout(() => {
                        counter.style.animation = '';
                    }, 500);
                }
            };
            updateCount();
        });
    }

    // Start counters when visible
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                animateCounters();
                observer.unobserve(statsContainer);
            }
        }, { threshold: 0.5 });
        observer.observe(statsContainer);
    }
    
    // Add mousemove parallax effect
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        const titleElement = document.querySelector('.title');
        const subtitleElement = document.querySelector('.subtitle');

        if (titleElement) {
            titleElement.style.transform = `translate(${moveX}px, ${moveY}px)`;
        }
        if (subtitleElement) {
            subtitleElement.style.transform = `translate(${moveX * 1.5}px, ${moveY * 1.5}px)`;
        }
    });
});

// 3D Bridge Model with animations
function initBridgeModel() {
    const container = document.getElementById('bridge-container');
    if (!container || typeof THREE === 'undefined') return; 

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0x404040); 
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);
    
    const pointLight1 = new THREE.PointLight(0x10b981, 1, 50);
    pointLight1.position.set(10, 5, 10);
    scene.add(pointLight1);
    
    const pointLight2 = new THREE.PointLight(0x2563eb, 1, 50);
    pointLight2.position.set(-10, -5, -10);
    scene.add(pointLight2);

    const createBridgeSegment = (xOffset) => {
        const group = new THREE.Group();
        
        const roadGeometry = new THREE.BoxGeometry(10, 0.5, 2);
        const roadMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x333333,
            specular: 0x111111,
            shininess: 30
        });
        const road = new THREE.Mesh(roadGeometry, roadMaterial);
        road.position.set(xOffset, 0, 0);
        group.add(road);
        
        const pillarGeometry = new THREE.CylinderGeometry(0.3, 0.5, 5, 8);
        const pillarMaterial = new THREE.MeshPhongMaterial({ 
            color: 0x2563eb,
            specular: 0x111111,
            shininess: 30,
        });
        
        for (let z = -1; z <= 1; z += 2) { 
            const pillar = new THREE.Mesh(pillarGeometry, pillarMaterial);
            pillar.position.set(xOffset, -2.5, z * 0.8);
            group.add(pillar);
        }
        
        const cableMaterial = new THREE.LineBasicMaterial({ 
            color: 0x10b981,
            linewidth: 2 
        });
        
        for (let z = -1; z <= 1; z += 2) {
            const points = [];
            points.push(new THREE.Vector3(xOffset - 4, 2, z * 0.8)); 
            points.push(new THREE.Vector3(xOffset, 0.25, z * 0.8));
            points.push(new THREE.Vector3(xOffset + 4, 2, z * 0.8)); 
            
            const cableGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const cable = new THREE.Line(cableGeometry, cableMaterial);
            group.add(cable);
        }
        
        return group;
    };

    const bridgeSegments = [];
    for (let x = -10; x <= 10; x += 10) { 
        const segment = createBridgeSegment(x);
        scene.add(segment);
        bridgeSegments.push(segment);
    }

    camera.position.set(0, 5, 15); 
    camera.lookAt(0, 0, 0);

    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        
        time += 0.01;
        
        bridgeSegments.forEach((segment, i) => {
            segment.position.y = Math.sin(time + i * 0.5) * 0.1; 
        });
        
        pointLight1.intensity = 1 + Math.sin(time * 2) * 0.5;
        pointLight2.position.x = Math.cos(time * 0.5) * 10;
        pointLight2.position.z = Math.sin(time * 0.5) * 10;
        
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}
