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
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 1.9 }
        );
        
        // CTA Container animation (after subtitle)
        gsap.fromTo(".cta-container",
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7, ease: "power2.out", delay: 2.3 }
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
                number: { value: 25, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.15, random: true, anim: { enable: true, speed: 0.3, opacity_min: 0.03, sync: false } },
                size: { value: 1.5, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 200, color: "#D6C180", opacity: 0.08, width: 0.5 },
                move: { enable: true, speed: 0.5, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 120, line_opacity: 0.1 } }
            },
            retina_detect: true
        });
    }

    initCityModel(); 

    const typingTextElement = document.querySelector('.typing-text');
    if (typingTextElement) {
        const wordsToType = ["Data-Driven Design", "Smart Infrastructure", "AI-Powered Engineering", "Sustainable Solutions", "Resilient Urban Planning"];
        let currentWordIndex = 0;
        let currentCharIndex = 0;
        let isDeletingText = false;
        const typingSpeed = 90; 
        const deletingSpeed = 45;
        const delayBetweenWords = 1600;

        function performTypingEffect() {
            const currentWord = wordsToType[currentWordIndex];
            typingTextElement.textContent = currentWord.substring(0, currentCharIndex);

            if (!isDeletingText && currentCharIndex < currentWord.length) {
                currentCharIndex++;
                setTimeout(performTypingEffect, typingSpeed);
            } else if (isDeletingText && currentCharIndex > 0) {
                currentCharIndex--;
                setTimeout(performTypingEffect, deletingSpeed);
            } else {
                isDeletingText = !isDeletingText;
                if (!isDeletingText) {
                    currentWordIndex = (currentWordIndex + 1) % wordsToType.length;
                }
                setTimeout(performTypingEffect, isDeletingText ? typingSpeed : delayBetweenWords);
            }
        }
        setTimeout(performTypingEffect, 1900);
    }

    const ctaButton = document.querySelector('.cta-button');
    if (ctaButton && typeof confetti === 'function') {
        ctaButton.addEventListener('click', function(e) {
            const confettiDuration = 900;
            const animationEndTime = Date.now() + confettiDuration;
            const confettiDefaults = { startVelocity: 22, spread: 360, ticks: 45, zIndex: 1001 };

            function getRandomInRange(min, max) { return Math.random() * (max - min) + min; }
            const themeConfettiColors = ['#8DA9C4', '#D6C180', '#CE7B69', '#FCFBF8'];

            const confettiInterval = setInterval(function() {
                const timeLeft = animationEndTime - Date.now();
                if (timeLeft <= 0) return clearInterval(confettiInterval);

                const particleCount = 35 * (timeLeft / confettiDuration);
                confetti(Object.assign({}, confettiDefaults, { particleCount, origin: { x: getRandomInRange(0.1, 0.3), y: Math.random() - 0.2 }, colors: themeConfettiColors }));
                confetti(Object.assign({}, confettiDefaults, { particleCount, origin: { x: getRandomInRange(0.7, 0.9), y: Math.random() - 0.2 }, colors: themeConfettiColors }));
            }, 180);
        });
    }

    function animateCounters() {
        const counters = document.querySelectorAll('.counter');
        counters.forEach(counter => {
            const targetValue = +counter.getAttribute('data-target');
            let currentCount = 0;
            counter.innerText = currentCount;

            const updateCounter = () => {
                const increment = targetValue / 160; 
                if (currentCount < targetValue) {
                    currentCount += increment;
                    counter.innerText = Math.ceil(currentCount);
                    setTimeout(updateCounter, 10); 
                } else {
                    counter.innerText = targetValue;
                    gsap.to(counter, { scale: 1.1, duration: 0.15, yoyo: true, repeat: 1, ease: "power1.inOut" });
                }
            };
            updateCounter();
        });
    }
    
    const heroElementsToParallax = document.querySelectorAll('.title, .subtitle');
    if (heroElementsToParallax.length > 0 && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.addEventListener('mousemove', function(e) {
            const moveXBase = (e.clientX - window.innerWidth / 2);
            const moveYBase = (e.clientY - window.innerHeight / 2);
            
            heroElementsToParallax.forEach((el, index) => {
                const parallaxFactor = (index === 0 ? 0.006 : 0.009); 
                const moveX = moveXBase * parallaxFactor;
                const moveY = moveYBase * parallaxFactor;
                
                gsap.to(el, { 
                    x: moveX, 
                    y: moveY, 
                    duration: 0.8, 
                    ease: "power3.out" 
                });
            });
        });
    }
});

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) yearSpan.textContent = new Date().getFullYear();
}

function initCityModel() {
    const container = document.getElementById('hero-3d-container');
    if (!container || typeof THREE === 'undefined') {
        console.warn('Three.js container or THREE library not found. City model will not load.');
        return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5); 
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(15, 25, 20);
    directionalLight.castShadow = true; 
    scene.add(directionalLight);
    directionalLight.shadow.mapSize.width = 1024;
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 100;


    // Ground Plane
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x333842, roughness: 0.9, metalness: 0.1 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true; 
    scene.add(ground);

    const buildingsGroup = new THREE.Group();
    scene.add(buildingsGroup);

    const buildingColors = [0x5A534A, 0x8C8278, 0x708CA0, 0x8DA9C4, 0xCE7B69, 0xD6C180];
    const constructionMaterial = new THREE.MeshStandardMaterial({ color: 0xD6C180, wireframe: true, emissive: 0x444400, emissiveIntensity: 0.3 });
    const dataHubMaterial = new THREE.MeshStandardMaterial({ color: 0x8DA9C4, emissive: 0x3366ff, emissiveIntensity: 0.5, transparent: true, opacity: 0.8});

    const citySize = 80; 
    const buildingPadding = 1.5;

    for (let i = 0; i < 60; i++) { 
        const width = Math.random() * 5 + 2;
        const depth = Math.random() * 5 + 2;
        const height = Math.random() * 15 + 5;
        const buildingGeometry = new THREE.BoxGeometry(width, height, depth);
        
        let material;
        const randomType = Math.random();
        if (randomType < 0.15) { 
            material = constructionMaterial;
        } else if (randomType < 0.30) { 
            material = dataHubMaterial.clone(); 
             material.isDataHub = true; 
        } else {
            material = new THREE.MeshStandardMaterial({ 
                color: buildingColors[Math.floor(Math.random() * buildingColors.length)],
                roughness: 0.7,
                metalness: 0.2
            });
        }

        const building = new THREE.Mesh(buildingGeometry, material);
        building.castShadow = true;
        building.receiveShadow = true;

        building.position.x = (Math.random() - 0.5) * citySize;
        building.position.z = (Math.random() - 0.5) * citySize;
        building.position.y = height / 2; 

        let collision = false;
        for (const child of buildingsGroup.children) {
            if (building.position.distanceTo(child.position) < (width + child.geometry.parameters.width)/2 * buildingPadding) {
                collision = true;
                break;
            }
        }
        if (!collision) {
            buildingsGroup.add(building);
        } else {
            i--; 
        }
    }
    
    const particleCount = 500;
    const particlesGeometry = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * (citySize * 1.2); 
        if ((i + 1) % 3 === 0) { 
             posArray[i -1] = Math.random() * 30 + 2; 
        }
    }
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particleMaterial = new THREE.PointsMaterial({
        size: 0.15,
        color: 0xD6C180, 
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false, 
        opacity: 0.7
    });
    const dataParticles = new THREE.Points(particlesGeometry, particleMaterial);
    scene.add(dataParticles);


    camera.position.set(0, 25, 45);
    camera.lookAt(0, 0, 0);

    let time = 0;
    let mouseX = 0, mouseY = 0;
    const targetCameraOffset = new THREE.Vector2();

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        document.addEventListener('mousemove', (event) => {
            mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        }, false);
    }

    function animateScene() {
        requestAnimationFrame(animateScene);
        time += 0.01;

        const positions = dataParticles.geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            const yIndex = i * 3 + 1;
            positions[yIndex] += Math.sin(time + i * 0.1) * 0.01; 
            if (positions[yIndex] < 0) positions[yIndex] = 30; 
        }
        dataParticles.geometry.attributes.position.needsUpdate = true;
        dataParticles.rotation.y = time * 0.05; 

        buildingsGroup.children.forEach(building => {
            if (building.material.isDataHub) {
                building.material.emissiveIntensity = (Math.sin(time * 2 + building.position.x) * 0.25 + 0.75); 
            }
        });

        targetCameraOffset.x = mouseX * 5; 
        targetCameraOffset.y = mouseY * 3; 

        camera.position.x += (targetCameraOffset.x - camera.position.x) * 0.03;
        camera.position.y += ( (25 + targetCameraOffset.y) - camera.position.y) * 0.03; 
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    animateScene();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
}
