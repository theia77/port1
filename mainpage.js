// mainpage.js (for mainpage.html - Portfolio Hub)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" }, // New Primary: Muted Cadet Blue
                shape: { type: "circle", stroke: { width: 0, color: "#000000" }},
                opacity: { value: 0.4, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }}, // Slightly less opaque for light bg
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false }},
                line_linked: { enable: true, distance: 150, color: "#D6C180", opacity: 0.25, width: 1 }, // New Secondary: Muted Gold, adjusted opacity
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
            const deckMaterial = new THREE.MeshBasicMaterial({ color: 0x8DA9C4, wireframe: true, transparent: true, opacity: 0.6 }); // New Primary: Muted Cadet Blue
            const deckGeometry = new THREE.BoxGeometry(10, 0.4, 2);
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            scene.add(deck);
            
            const towerMaterial = new THREE.MeshBasicMaterial({ color: 0xCE7B69, wireframe: true, transparent: true, opacity: 0.6 }); // New Accent: Soft Coral/Terracotta
            const towerGeometry = new THREE.BoxGeometry(0.4, 3, 0.4);
            
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
            leftTower.position.set(-3, 1.5, 0);
            scene.add(leftTower);
            
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
            rightTower.position.set(3, 1.5, 0);
            scene.add(rightTower);
            
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0xD6C180, wireframe: true, transparent: true, opacity: 0.6 }); // New Secondary: Muted Gold
            const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 7, 8); 
            
            const mainCable = new THREE.Mesh(cableGeometry, cableMaterial);
            mainCable.rotation.z = Math.PI / 2; 
            mainCable.position.set(0, 3, 0); 
            scene.add(mainCable);
            
            // Add thinner suspender cables for more detail (optional)
            for (let i = -4; i <= 4; i += 2) {
                if (i === 0) continue; // Skip middle
                const suspenderGeometry = new THREE.CylinderGeometry(0.02, 0.02, 3, 6);
                const suspender = new THREE.Mesh(suspenderGeometry, cableMaterial); // Use same cable material
                suspender.position.set(i, 1.5, 0); // Adjust Y to connect deck to main cable level
                scene.add(suspender);
            }

            return { deck, leftTower, rightTower, mainCable };
        };
        
        const bridge = createBridge();
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.7); // Slightly brighter ambient for light theme
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.9); // Slightly brighter directional
        directionalLight.position.set(0, 10, 5);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);
            
            bridge.deck.rotation.y += 0.003; // Slower rotation
            bridge.leftTower.rotation.y += 0.004;
            bridge.rightTower.rotation.y += 0.004;
            bridge.mainCable.rotation.x += 0.002;
            
            const time = Date.now() * 0.0005; // Slower oscillation
            bridge.deck.position.y = Math.sin(time) * 0.05; // Smaller oscillation
            
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
                // The --xp variable is set inline in HTML, CSS handles animation with it.
                // No specific class like 'animated' needed if CSS transition on width with var(--xp) is used.
            }
        });
    };

    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    const adminPanel = document.getElementById('adminPanel');
    const closeAdminPanelBtn = document.querySelector('.close-admin-panel');
    
    // Admin Panel related JS - This would typically live on auth.html or be loaded by it.
    // For simplicity, keeping structure but noting its primary context.
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
            
            // Dummy credentials
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
            valueDisplay.textContent = `${range.value}%`; // Initialize
        }
    });
    
    function loadContentIntoForms() { 
        // This function is more complex if data is to be fetched or pre-filled
        // from main page elements, especially since admin is on a separate auth.html.
        // For now, it's a placeholder.
        // Example for one field (if it were on the same page or data passed):
        const profileNameOnMainPage = document.getElementById('profile-name')?.textContent;
        const editNameInput = document.getElementById('edit-name');
        if (profileNameOnMainPage && editNameInput) {
            editNameInput.value = profileNameOnMainPage;
        }
        // Add similar for other editable fields if needed.
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
    
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // Logic to save profile data (e.g., to localStorage or send to server)
            // Then update the main page if elements are accessible or via stored data on reload.
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
    
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel && adminPanel.classList.contains('active')) { 
            adminPanel.classList.remove('active');
        }
    });
});
