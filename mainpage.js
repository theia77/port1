// mainpage.js (for mainpage.html - Portfolio Hub)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with "Architect's Study" theme
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 50, density: { enable: true, value_area: 800 } }, // Slightly fewer particles
                color: { value: "#8DA9C4" }, // Primary: Muted Cadet Blue
                shape: { type: "circle", stroke: { width: 0, color: "#000000" }},
                opacity: { value: 0.35, random: true, anim: { enable: true, speed: 0.7, opacity_min: 0.05, sync: false }},
                size: { value: 2.5, random: true, anim: { enable: true, speed: 1.5, size_min: 0.1, sync: false }},
                line_linked: { enable: true, distance: 160, color: "#D6C180", opacity: 0.18, width: 1 }, // Secondary: Muted Gold
                move: { enable: true, speed: 1.0, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }}
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" }, // Softer interaction
                    onclick: { enable: true, mode: "push" }, // Keep push for some interaction
                    resize: true
                },
                modes: {
                    grab: { distance: 130, line_opacity: 0.25 },
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 3 }
                }
            },
            retina_detect: true
        });
    }

    // Initialize 3D bridge model with "Architect's Study" theme
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.8, 5.5); // Adjusted camera slightly
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createBridge = () => {
            const deckMaterial = new THREE.MeshBasicMaterial({ color: 0x8DA9C4, wireframe: true, transparent: true, opacity: 0.45 }); // Primary
            const deckGeometry = new THREE.BoxGeometry(10, 0.25, 1.6);
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            scene.add(deck);
            
            const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xCE7B69, wireframe: true, transparent: true, opacity: 0.45 }); // Accent
            const towerGeometry = new THREE.BoxGeometry(0.3, 3.8, 0.3); // Taller, slender towers
            
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
            leftTower.position.set(-3.8, 1.9, 0);
            scene.add(leftTower);
            
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
            rightTower.position.set(3.8, 1.9, 0);
            scene.add(rightTower);
            
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0xD6C180, wireframe: true, transparent: true, opacity: 0.4 }); // Secondary
            
            const points = [];
            points.push( new THREE.Vector3( -3.8, 3.8, 0 ) );
            points.push( new THREE.Vector3( 0, 0.8, 0 ) ); // Deeper sag for main cable
            points.push( new THREE.Vector3( 3.8, 3.8, 0 ) );
            const curve = new THREE.CatmullRomCurve3( points );
            const tubeGeometry = new THREE.TubeGeometry( curve, 24, 0.035, 8, false ); // Smoother tube
            const mainCable = new THREE.Mesh( tubeGeometry, cableMaterial );
            scene.add( mainCable );

            // Vertical suspenders
            for (let i = -3.2; i <= 3.2; i += 0.8) { // More suspenders
                if (Math.abs(i) < 0.1) continue; 
                const t = (i + 3.8) / (2 * 3.8); // Normalize position for curve
                const cablePoint = curve.getPointAt(t);
                const deckLevelY = 0.125; // Half of deck height
                const suspenderHeight = cablePoint.y - deckLevelY;
                if (suspenderHeight <= 0) continue;

                const suspenderGeometry = new THREE.CylinderGeometry(0.018, 0.018, suspenderHeight, 6);
                const suspender = new THREE.Mesh(suspenderGeometry, cableMaterial);
                suspender.position.set(i, deckLevelY + suspenderHeight / 2, 0);
                scene.add(suspender);
            }
            return { deck, leftTower, rightTower, mainCable };
        };
        
        const bridge = createBridge();
        
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.85); // Brighter ambient for light theme
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.55); // Softer directional
        directionalLight.position.set(3, 8, 6);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0002; 
            
            bridge.deck.rotation.y += 0.0015; 
            bridge.leftTower.rotation.y += 0.002;
            bridge.rightTower.rotation.y += 0.002;
            if (bridge.mainCable) bridge.mainCable.rotation.y += 0.0008;
            
            bridge.deck.position.y = Math.sin(time * 1.5) * 0.025; // Very subtle sway
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // XP Bar Animation Trigger
    const animateXPBars = () => {
        const xpBars = document.querySelectorAll('.xp-bar');
        const windowHeight = window.innerHeight;
        
        xpBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            const barFill = bar.querySelector('::before'); // This selector won't work directly in JS
                                                        // The animation is now handled by CSS @keyframes xpFillAnimation
                                                        // This JS function is mostly for triggering if needed, but CSS handles it.
            if (barTop < windowHeight * 0.9 && barTop > -bar.offsetHeight) {
                // Animation is triggered by CSS 'animation' property on .xp-bar::before
                // No need to add a class here if using direct keyframe animation
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Admin Panel Related (primarily for auth.html or if adminPanel is a generic modal)
    const adminPanel = document.getElementById('adminPanel');
    const closeAdminPanelBtn = document.querySelector('.close-admin-panel');
    const adminLoginSection = document.getElementById('adminLogin'); 
    const adminEditSection = document.getElementById('adminEdit'); 
    const adminLoginForm = document.getElementById('adminLoginForm'); 
    const adminTabs = document.querySelectorAll('.admin-tab'); 
    const adminTabContents = document.querySelectorAll('.admin-tab-content'); 
    const loginError = document.getElementById('login-error'); 
    
    const profileForm = document.getElementById('profileForm'); 
    const skillsForm = document.getElementById('skillsForm'); 
    const projectsForm = document.getElementById('projectsForm'); 
    const contactForm = document.getElementById('contactForm'); 

    if (closeAdminPanelBtn && adminPanel) { 
        closeAdminPanelBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    if (adminLoginForm) { 
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (username === 'admin' && password === 'password123') { 
                if(adminLoginSection) adminLoginSection.style.display = 'none';
                if(adminEditSection) adminEditSection.classList.add('active'); 
                if (adminTabs.length > 0) adminTabs[0].click(); // Activate the first tab
                loadContentIntoForms(); 
            } else {
                if(loginError) {
                    loginError.textContent = 'Invalid credentials. (Hint: admin/password123)';
                    loginError.style.display = 'block';
                    setTimeout(() => { loginError.style.display = 'none'; }, 3000);
                }
            }
        });
    }
    
    if (adminTabs.length > 0) { 
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                adminTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                adminTabContents.forEach(content => content.classList.remove('active'));
                const tabContentId = tab.getAttribute('data-tab');
                const activeContent = document.querySelector(`.admin-tab-content[data-tab-content="${tabContentId}"]`);
                if(activeContent) activeContent.classList.add('active');
            });
        });
    }
    
    document.querySelectorAll('input[type="range"]').forEach(range => {
        const valueDisplay = range.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('range-value')) { 
            range.addEventListener('input', () => { valueDisplay.textContent = `${range.value}%`; });
            valueDisplay.textContent = `${range.value}%`; 
        }
    });
    
    function loadContentIntoForms() { 
        // Placeholder - actual data loading depends on where it's stored/fetched from
        const mainPageProfileName = document.getElementById('profile-name');
        const editFormNameInput = document.getElementById('edit-name');
        if (mainPageProfileName && editFormNameInput) {
            editFormNameInput.value = mainPageProfileName.textContent.trim();
        }
        // ... and so on for other fields.
    }
    
    const profileImageInput = document.getElementById('edit-profile-image'); 
    const imagePreview = document.getElementById('image-preview'); 
    const previewContainer = document.querySelector('.preview-container'); 

    if (profileImageInput && imagePreview && previewContainer) {
        profileImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    previewContainer.classList.add('active');
                };
                reader.readAsDataURL(this.files[0]);
            } else { previewContainer.classList.remove('active'); }
        });
    }
    
    if (profileForm) { profileForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Profile updated!'); }); }
    if (skillsForm) { skillsForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Skills updated!'); }); }
    if (projectsForm) { projectsForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Projects updated!'); }); }
    if (contactForm) { contactForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Contact info updated!'); }); }
    
    function showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        if(notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.classList.add('active');
            setTimeout(() => { notification.classList.remove('active'); }, 3500); // Slightly longer display
        }
    }
    
    window.addEventListener('scroll', animateXPBars);
    animateXPBars(); // Initial check
    
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel && adminPanel.classList.contains('active')) { 
            adminPanel.classList.remove('active');
        }
    });

    // Entrance animation for cards on scroll (if not already handled by CSS animation-delay)
    const cards = document.querySelectorAll('.flip-card');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the card is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1'; // CSS animation handles the transform
                entry.target.style.animationPlayState = 'running';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, observerOptions);

    cards.forEach(card => {
        card.style.opacity = '0'; // Initially hide for JS-driven entrance if preferred
        card.style.animationPlayState = 'paused'; // Pause CSS animation until in view
        observer.observe(card);
    });

});
