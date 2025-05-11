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
            // Check if the top of the bar is within 85% of the viewport height from the top
            // and also ensure the bar is somewhat visible from the top
            if (barTop < windowHeight * 0.85 && barTop > -bar.offsetHeight) { 
                bar.classList.add('animated');
            } else {
                // bar.classList.remove('animated'); // Optional: reset animation
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Admin Panel Functionality (mostly relevant if admin panel is a modal on this page)
    const adminPanel = document.getElementById('adminPanel');
    // const adminLoginBtn = document.querySelector('.admin-login-btn'); // Link to auth.html handles this
    const closeAdminPanelBtn = document.querySelector('.close-admin-panel'); 
    const adminLoginSection = document.getElementById('adminLogin'); // Assumes these IDs are in adminPanel
    const adminEditSection = document.getElementById('adminEdit');   // Assumes these IDs are in adminPanel
    const adminLoginForm = document.getElementById('adminLoginForm'); // Assumes these IDs are in adminPanel
    const adminTabs = document.querySelectorAll('.admin-tab');       // Assumes these elements are in adminPanel
    const adminTabContents = document.querySelectorAll('.admin-tab-content'); // Assumes these are in adminPanel
    const loginError = document.getElementById('login-error');       // Assumes this ID is in adminPanel
    
    const profileForm = document.getElementById('profileForm');     // Assumes these forms are in adminPanel
    const skillsForm = document.getElementById('skillsForm');       // Assumes these forms are in adminPanel
    const projectsForm = document.getElementById('projectsForm');   // Assumes these forms are in adminPanel
    const contactForm = document.getElementById('contactForm');     // Assumes these forms are in adminPanel
    
    // The adminLoginBtn functionality is handled by its href="auth.html".
    // The JavaScript to preventDefault and show a modal for adminLoginBtn was removed in the previous step.

    if (closeAdminPanelBtn && adminPanel) {
        closeAdminPanelBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    // The following admin panel JS (login, tabs, forms) assumes that the adminPanel HTML
    // (with all its forms and elements) is present on this page (mainpage.html).
    // If auth.html is a completely separate page handling the admin interface,
    // this JS would belong there or in a script loaded by auth.html.

    if (adminLoginForm) { 
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const usernameInput = document.getElementById('username');
            const passwordInput = document.getElementById('password');
            if (!usernameInput || !passwordInput) return;

            const username = usernameInput.value;
            const password = passwordInput.value;
            
            // IMPORTANT: Replace with actual secure authentication
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
                const activeContent = document.querySelector(`.admin-tab-content[data-tab-content="${tabContentId}"]`);
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
    
    function loadContentIntoForms() {
        // This function loads content FROM the main page INTO admin panel forms.
        // It assumes the admin panel forms exist in the DOM when called.
        const getElementText = (id) => document.getElementById(id)?.textContent || '';
        const getElementAttr = (id, attr) => document.getElementById(id)?.getAttribute(attr) || '';
        const setInputValue = (id, value) => {
            const el = document.getElementById(id);
            if (el) el.value = value;
        };

        setInputValue('edit-name', getElementText('profile-name'));
        setInputValue('edit-tagline', getElementText('profile-tagline'));
        setInputValue('edit-description-1', getElementText('profile-description-1'));
        setInputValue('edit-description-2', getElementText('profile-description-2'));
        setInputValue('edit-linkedin', getElementAttr('linkedin-url', 'href'));
        setInputValue('edit-github', getElementAttr('github-url', 'href'));
        setInputValue('edit-twitter', getElementAttr('twitter-url', 'href'));

        setInputValue('edit-skills-title', getElementText('skills-title'));
        setInputValue('edit-skill-1', getElementText('skill-1-name'));
        // ... and so on for other skills, projects, contact form fields if they exist in admin panel
        // Example for one skill value (assuming an input 'edit-skill-1-value' exists in admin panel)
        // const skill1Bar = document.querySelector('#skills-xp-dashboard .xp-bar:nth-child(1)');
        // if (skill1Bar) setInputValue('edit-skill-1-value', skill1Bar.style.getPropertyValue('--xp').replace('%',''));

        // Note: Education card content loading not added here, as admin form fields for it aren't defined yet.
    }
    
    const profileImageInput = document.getElementById('edit-profile-image'); // In admin panel
    const imagePreview = document.getElementById('image-preview');           // In admin panel
    const previewContainer = document.querySelector('.admin-panel .preview-container'); //Scoped to admin panel
    
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
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update main page elements from admin form values
            const setText = (id, value) => { const el = document.getElementById(id); if (el) el.textContent = value; };
            const setAttr = (id, attr, value) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, value); };
            
            setText('profile-name', document.getElementById('edit-name')?.value);
            setText('profile-tagline', document.getElementById('edit-tagline')?.value);
            // ... (rest of the profile form fields to update main page display) ...

            // The profile image display on mainpage.html was removed.
            // The following line would try to update a non-existent element on mainpage.html if .profile-img was the display.
            // if (profileImageInput && profileImageInput.files && profileImageInput.files[0] && imagePreview) {
            //     const mainPageProfileImg = document.querySelector('.profile-img'); // This element is removed
            //     if (mainPageProfileImg) mainPageProfileImg.src = imagePreview.src;
            // }
            showNotification('Profile updated successfully!');
        });
    }
    
    // Similar submit handlers for skillsForm, projectsForm, contactForm
    // ... (These would update their respective sections on the main page from admin panel inputs)

    if (skillsForm) {
        skillsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update skills display on main page from skillsForm inputs
            showNotification('Skills updated successfully!');
        });
    }
    
    if (projectsForm) {
        projectsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update projects display on main page
            showNotification('Projects updated successfully!');
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Update contact display on main page
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
    
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel) { // If admin panel is a modal on this page
            adminPanel.classList.remove('active');
        }
    });
});
