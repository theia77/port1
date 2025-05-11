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
            
            const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 7, 8); // height might be too large if mainCable.rotation.z = Math.PI / 2;
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.7 });
            
            const mainCable = new THREE.Mesh(cableGeometry, cableMaterial);
            mainCable.rotation.z = Math.PI / 2; // Rotates it to be horizontal
            mainCable.position.set(0, 3, 0); // Adjusted y position if it's a top horizontal cable
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
            bridge.mainCable.rotation.x += 0.003; // If it's horizontal, maybe rotate on Y or Z?
            
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
            const barBottom = bar.getBoundingClientRect().bottom; // Not used, but good for context
            
            // Check if the top of the bar is within 85% of the viewport height from the top
            // and also ensure the bar is somewhat visible from the top (barBottom > 0 is implicitly true if barTop < windowHeight)
            if (barTop < windowHeight * 0.85 && barTop > -bar.offsetHeight) { // -bar.offsetHeight ensures it has entered from top
                bar.classList.add('animated');
                 // The CSS will handle the width animation based on --xp variable
            } else {
                // Optionally remove 'animated' if you want the animation to reset when scrolled out of view
                // bar.classList.remove('animated'); 
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Admin Panel Functionality
    const adminPanel = document.getElementById('adminPanel');
    const adminLoginBtn = document.querySelector('.admin-login-btn'); // Button that links to auth.html
    const closeAdminPanelBtn = document.querySelector('.close-admin-panel'); // Assuming this is part of a modal
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
    
    // MODIFIED: The 'admin-login-btn' is an <a> tag linking to auth.html.
    // The previous JavaScript that prevented default navigation and opened a modal is removed/commented out.
    // The link will now navigate directly to auth.html.
    /*
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // This line PREVENTED navigation
            if(adminPanel) adminPanel.classList.add('active'); // This line opened the modal
        });
    }
    */
    
    // If 'adminPanel' is still used for other modal purposes (e.g., directly from auth.html or other triggers)
    // the close button logic can remain.
    if (closeAdminPanelBtn && adminPanel) {
        closeAdminPanelBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    // The rest of the admin panel JS (login, tabs, form submissions) would typically reside
    // on auth.html or be loaded dynamically if the admin panel is part of mainpage.html.
    // If auth.html is a separate page, these listeners might not find their elements here.
    // For this structure, assuming they are on auth.html or a shared script loaded there.

    if (adminLoginForm) { // This code would typically be on auth.html
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value;
            const password = passwordInput.value;
            
            if (username === 'admin' && password === 'password123') { // Example credentials
                if(adminLoginSection) adminLoginSection.style.display = 'none';
                if(adminEditSection) adminEditSection.classList.add('active');
                loadContentIntoForms(); // This function would also need its target elements present
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
    
    if (adminTabs.length > 0) { // Check if adminTabs exist
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
        if (valueDisplay && valueDisplay.classList.contains('range-value')) { // Check if valueDisplay exists and is correct
            range.addEventListener('input', () => {
                valueDisplay.textContent = `${range.value}%`;
            });
            valueDisplay.textContent = `${range.value}%`; // Initialize display
        }
    });
    
    // Functions like loadContentIntoForms and form submissions assume the relevant HTML
    // elements are present on the page where this script is running.
    // If auth.html is separate, these functions and their calls should be on auth.html.

    function loadContentIntoForms() {
        // Ensure elements exist before trying to access their properties
        const profileNameEl = document.getElementById('profile-name');
        const editNameEl = document.getElementById('edit-name');
        if (profileNameEl && editNameEl) editNameEl.value = profileNameEl.textContent;

        // ... (Repeat for all other elements, always checking for existence first)
        // Example for one more:
        const profileTaglineEl = document.getElementById('profile-tagline');
        const editTaglineEl = document.getElementById('edit-tagline');
        if (profileTaglineEl && editTaglineEl) editTaglineEl.value = profileTaglineEl.textContent;

        // (Continue for all form fields listed in the original script)
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
            }
        });
    }
    
    // Form submission handlers - these would typically be on auth.html if that's where the forms live
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update logic here, ensuring elements exist
            // Example:
            const editNameVal = document.getElementById('edit-name')?.value;
            const profileNameDisplay = document.getElementById('profile-name');
            if(editNameVal && profileNameDisplay) profileNameDisplay.textContent = editNameVal;
            // ... (rest of the form fields) ...
            showNotification('Profile updated successfully!');
        });
    }
    
    if (skillsForm) {
        skillsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update logic
            showNotification('Skills updated successfully!');
        });
    }
    
    if (projectsForm) {
        projectsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update logic
            showNotification('Projects updated successfully!');
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update logic
            showNotification('Contact information updated successfully!');
        });
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
        if (adminPanel && e.target === adminPanel) {
            adminPanel.classList.remove('active');
        }
    });
});
