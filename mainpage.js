// mainpage.js (for mainpage.html - Portfolio Hub)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" }},
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }},
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false }},
                line_linked: { enable: true, distance: 150, color: "#7c3aed", opacity: 0.3, width: 1 },
                move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }}
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "repulse" },
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    repulse: { distance: 100, duration: 0.4 },
                    push: { particles_nb: 4 }
                }
            },
            retina_detect: true
        });
    }

    // Initialize 3D bridge model
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createBridge = () => {
            const deckGeometry = new THREE.BoxGeometry(10, 0.4, 2);
            const deckMaterial = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.7 });
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            scene.add(deck);
            
            const towerGeometry = new THREE.BoxGeometry(0.4, 3, 0.4);
            const towerMaterial = new THREE.MeshBasicMaterial({ color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.7 });
            
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
            leftTower.position.set(-3, 1.5, 0);
            scene.add(leftTower);
            
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
            rightTower.position.set(3, 1.5, 0);
            scene.add(rightTower);
            
            const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 7, 8); 
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.7 });
            
            const mainCable = new THREE.Mesh(cableGeometry, cableMaterial);
            mainCable.rotation.z = Math.PI / 2; 
            mainCable.position.set(0, 3, 0); 
            scene.add(mainCable);
            
            return { deck, leftTower, rightTower, mainCable };
        };
        
        const bridge = createBridge();
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 5);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);
            
            bridge.deck.rotation.y += 0.005;
            bridge.leftTower.rotation.y += 0.007;
            bridge.rightTower.rotation.y += 0.007;
            bridge.mainCable.rotation.x += 0.003; 
            
            const time = Date.now() * 0.001;
            bridge.deck.position.y = Math.sin(time) * 0.1;
            
            renderer.render(scene, camera);
        }
        animate();

        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    const animateXPBars = () => {
        const xpBars = document.querySelectorAll('.xp-bar');
        const windowHeight = window.innerHeight;
        
        xpBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            
            if (barTop < windowHeight * 0.85 && barTop > -bar.offsetHeight) { 
                bar.classList.add('animated');
            } else {
                // bar.classList.remove('animated'); 
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Admin Panel Functionality (largely for modal or auth.html)
    const adminPanel = document.getElementById('adminPanel');
    // const adminLoginBtn = document.querySelector('.admin-login-btn'); // This is now a direct link
    const closeAdminPanelBtn = document.querySelector('.close-admin-panel');
    const adminLoginSection = document.getElementById('adminLogin'); // Likely on auth.html
    const adminEditSection = document.getElementById('adminEdit'); // Likely on auth.html
    const adminLoginForm = document.getElementById('adminLoginForm'); // Likely on auth.html
    const adminTabs = document.querySelectorAll('.admin-tab'); // Likely on auth.html
    const adminTabContents = document.querySelectorAll('.admin-tab-content'); // Likely on auth.html
    const loginError = document.getElementById('login-error'); // Likely on auth.html
    
    const profileForm = document.getElementById('profileForm'); // Likely on auth.html
    const skillsForm = document.getElementById('skillsForm'); // Likely on auth.html
    const projectsForm = document.getElementById('projectsForm'); // Likely on auth.html
    const contactForm = document.getElementById('contactForm'); // Likely on auth.html
    
    // The adminLoginBtn click event listener that prevented default and showed a modal is removed
    // as the button now navigates to auth.html.

    if (closeAdminPanelBtn && adminPanel) { // This can remain if adminPanel is used for other modal purposes
        closeAdminPanelBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    // The following admin-related JS would primarily live on or be loaded by auth.html
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
                loadContentIntoForms(); 
            } else {
                if(loginError) {
                    loginError.textContent = 'Invalid username or password. (Hint: admin/password123)';
                    loginError.style.display = 'block';
                    setTimeout(() => {
                        loginError.style.display = 'none';
                    }, 3000);
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
                const activeContent = document.querySelector(`[data-tab-content="${tabContentId}"]`);
                if(activeContent) activeContent.classList.add('active');
            });
        });
    }
    
    document.querySelectorAll('input[type="range"]').forEach(range => {
        const valueDisplay = range.nextElementSibling;
        if (valueDisplay && valueDisplay.classList.contains('range-value')) { 
            range.addEventListener('input', () => {
                valueDisplay.textContent = `${range.value}%`;
            });
            valueDisplay.textContent = `${range.value}%`; 
        }
    });
    
    function loadContentIntoForms() { // This would be on auth.html
        const profileNameEl = document.getElementById('profile-name'); // On mainpage
        const editNameEl = document.getElementById('edit-name'); // On admin form
        if (profileNameEl && editNameEl) editNameEl.value = profileNameEl.textContent;

        const profileTaglineEl = document.getElementById('profile-tagline'); // On mainpage
        const editTaglineEl = document.getElementById('edit-tagline'); // On admin form
        if (profileTaglineEl && editTaglineEl) editTaglineEl.value = profileTaglineEl.textContent;
        // ... (Continue for all form fields, carefully checking element existence if this script runs on mainpage)
    }
    
    const profileImageInput = document.getElementById('edit-profile-image'); // On admin form
    const imagePreview = document.getElementById('image-preview'); // On admin form
    const previewContainer = document.querySelector('.preview-container'); // On admin form
    
    if (profileImageInput && imagePreview && previewContainer) {
        profileImageInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.src = e.target.result;
                    previewContainer.classList.add('active');
                };
                reader.readAsDataURL(this.files[0]);
            }
        });
    }
    
    // Form submission handlers - these would typically be on auth.html
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Example: Update main page content if this script were to also handle that (complex)
            const editNameVal = document.getElementById('edit-name')?.value;
            const profileNameDisplay = document.getElementById('profile-name'); // On mainpage
            if(editNameVal && profileNameDisplay) profileNameDisplay.textContent = editNameVal; // This direct update is tricky across pages
            showNotification('Profile updated successfully!');
        });
    }
    
    if (skillsForm) {
        skillsForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Skills updated successfully!'); });
    }
    
    if (projectsForm) {
        projectsForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Projects updated successfully!'); });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) { e.preventDefault(); showNotification('Contact information updated successfully!'); });
    }
    
    function showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        if(notification && notificationMessage) {
            notificationMessage.textContent = message;
            notification.classList.add('active');
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
    
    window.addEventListener('scroll', animateXPBars);
    animateXPBars(); // Initial check
    
    // Close modal if clicked outside (if adminPanel is used as a modal)
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel) { // If adminPanel is an active modal
            adminPanel.classList.remove('active');
        }
    });
});
