// mainpage.js (for mainpage.html - Portfolio Hub)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" }, // New Primary: Muted Cadet Blue
                shape: { type: "circle", stroke: { width: 0, color: "#000000" }},
                opacity: { value: 0.3, random: true, anim: { enable: true, speed: 0.8, opacity_min: 0.05, sync: false }}, // Adjusted for light background
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false }},
                line_linked: { enable: true, distance: 150, color: "#D6C180", opacity: 0.2, width: 1 }, // New Secondary: Muted Gold, adjusted opacity
                move: { enable: true, speed: 1.2, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 }}
            },
            interactivity: {
                detect_on: "canvas",
                events: {
                    onhover: { enable: true, mode: "grab" }, // Changed to grab for a softer feel
                    onclick: { enable: true, mode: "push" },
                    resize: true
                },
                modes: {
                    grab: { distance: 140, line_opacity: 0.3 }, // Adjusted grab mode
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
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000); // Slightly wider FOV
        camera.position.set(0, 1.5, 6); // Adjusted camera position for better view
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createBridge = () => {
            // Using MeshStandardMaterial for better lighting interaction if complex lights were added
            const deckMaterial = new THREE.MeshBasicMaterial({ color: 0x8DA9C4, wireframe: true, transparent: true, opacity: 0.5 }); // New Primary: Muted Cadet Blue
            const deckGeometry = new THREE.BoxGeometry(10, 0.3, 1.8); // Slightly thinner deck
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            scene.add(deck);
            
            const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xCE7B69, wireframe: true, transparent: true, opacity: 0.5 }); // New Accent: Soft Coral/Terracotta
            const towerGeometry = new THREE.BoxGeometry(0.35, 3.5, 0.35); // Slightly taller towers
            
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
            leftTower.position.set(-3.5, 1.75, 0); // Adjusted positions
            scene.add(leftTower);
            
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
            rightTower.position.set(3.5, 1.75, 0); // Adjusted positions
            scene.add(rightTower);
            
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0xD6C180, wireframe: true, transparent: true, opacity: 0.5 }); // New Secondary: Muted Gold
            
            // Main suspension cables (simplified as straight lines for basic wireframe)
            const points1 = [];
            points1.push( new THREE.Vector3( -3.5, 3.5, 0 ) ); // Top of left tower
            points1.push( new THREE.Vector3( 0, 0.5, 0 ) );   // Mid-point dip
            points1.push( new THREE.Vector3( 3.5, 3.5, 0 ) );  // Top of right tower
            const curve1 = new THREE.CatmullRomCurve3( points1 );
            const tubeGeometry1 = new THREE.TubeGeometry( curve1, 20, 0.04, 8, false );
            const mainCable1 = new THREE.Mesh( tubeGeometry1, cableMaterial );
            scene.add( mainCable1 );

            // Vertical suspender cables
            for (let i = -3; i <= 3; i += 1) {
                if (i === 0) continue;
                const suspenderHeight = Math.abs(i) * 0.4 + 1; // Simple varying height
                 const suspenderGeometry = new THREE.CylinderGeometry(0.02, 0.02, suspenderHeight, 6);
                 const suspender = new THREE.Mesh(suspenderGeometry, cableMaterial);
                 // Position approximatley, this part would need refinement for realistic catenary
                 suspender.position.set(i * 1.1, suspenderHeight / 2 - 0.2, 0); 
                 scene.add(suspender);
            }

            return { deck, leftTower, rightTower, mainCable1 };
        };
        
        const bridge = createBridge();
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); // Brighter ambient for light theme
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6); // Softer directional
        directionalLight.position.set(5, 10, 7);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);
            
            bridge.deck.rotation.y += 0.002; 
            bridge.leftTower.rotation.y += 0.003;
            bridge.rightTower.rotation.y += 0.003;
            
            if (bridge.mainCable1) { // Check if mainCable1 exists (it should from TubeGeometry)
                 bridge.mainCable1.rotation.y += 0.001;
            }
            
            const time = Date.now() * 0.0003; 
            bridge.deck.position.y = Math.sin(time) * 0.03;
            
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
            
            if (barTop < windowHeight * 0.9 && barTop > -bar.offsetHeight) { 
                // CSS handles animation via --xp variable. No need to add/remove class if transition is on width.
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Admin Panel Functionality (largely for modal or auth.html)
    // Assuming these elements are primarily on a separate auth.html page.
    // If adminPanel is used as a generic modal on mainpage.html, some of this could be relevant.
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

    // The adminLoginBtn on mainpage.html is now a direct link to auth.html,
    // so its click event listener to show a modal is not needed here.

    if (closeAdminPanelBtn && adminPanel) { 
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
            
            // Dummy credentials
            if (username === 'admin' && password === 'password123') { 
                if(adminLoginSection) adminLoginSection.style.display = 'none';
                if(adminEditSection) adminEditSection.classList.add('active'); // Show the edit section
                if (adminTabs.length > 0) adminTabs[0].click(); // Activate the first tab by default
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
            valueDisplay.textContent = `${range.value}%`; // Initialize display
        }
    });
    
    function loadContentIntoForms() { 
        // This function would be on auth.html and would fetch data from localStorage or an API
        // to populate the forms. For demonstration, if elements were on the same page:
        const mainPageProfileName = document.getElementById('profile-name'); // Main page element
        const editFormNameInput = document.getElementById('edit-name'); // Admin form element
        if (mainPageProfileName && editFormNameInput) {
            editFormNameInput.value = mainPageProfileName.textContent.trim();
        }
        // Similar logic for other fields like tagline, description etc.
        // Example:
        const mainPageTagline = document.getElementById('profile-tagline');
        const editFormTaglineInput = document.getElementById('edit-tagline');
        if(mainPageTagline && editFormTaglineInput) {
            editFormTaglineInput.value = mainPageTagline.textContent.trim();
        }
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
            } else {
                 previewContainer.classList.remove('active'); // Hide if no file selected
            }
        });
    }
    
    // Form submission handlers - these would typically be on auth.html
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Logic to save profile data (e.g., to localStorage or send to server)
            // For main page update: data would be saved and main page would read it on load.
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
    animateXPBars(); // Initial check on load
    
    // Close modal if clicked outside (if adminPanel is used as a generic modal on this page)
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel && adminPanel.classList.contains('active')) { 
            adminPanel.classList.remove('active');
        }
    });
});
