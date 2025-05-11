// script.js (for mainpage.html)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    particlesJS('particles-js', {
        particles: {
            number: { 
                value: 60, 
                density: { 
                    enable: true, 
                    value_area: 900 
                } 
            },
            color: { value: "#3b82f6" },
            shape: { 
                type: "circle",
                stroke: {
                    width: 0,
                    color: "#000000"
                },
            },
            opacity: { 
                value: 0.5, 
                random: true,
                anim: {
                    enable: true,
                    speed: 1,
                    opacity_min: 0.1,
                    sync: false
                }
            },
            size: { 
                value: 3, 
                random: true,
                anim: {
                    enable: true,
                    speed: 2,
                    size_min: 0.1,
                    sync: false
                }
            },
            line_linked: { 
                enable: true, 
                distance: 150, 
                color: "#7c3aed", 
                opacity: 0.3, 
                width: 1 
            },
            move: { 
                enable: true, 
                speed: 1.5, 
                direction: "none", 
                random: true, 
                straight: false, 
                out_mode: "out",
                bounce: false,
                attract: {
                    enable: false,
                    rotateX: 600,
                    rotateY: 1200
                }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { 
                    enable: true, 
                    mode: "repulse" 
                },
                onclick: { 
                    enable: true, 
                    mode: "push" 
                },
                resize: true
            },
            modes: {
                repulse: {
                    distance: 100,
                    duration: 0.4
                },
                push: {
                    particles_nb: 4
                }
            }
        },
        retina_detect: true
    });

    // Initialize 3D bridge model
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && window.THREE) {
        const scene = new THREE.Scene();
        
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ 
            alpha: true,
            antialias: true 
        });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createBridge = () => {
            const deckGeometry = new THREE.BoxGeometry(10, 0.4, 2);
            const deckMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x3b82f6,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            const deck = new THREE.Mesh(deckGeometry, deckMaterial);
            scene.add(deck);
            
            const towerGeometry = new THREE.BoxGeometry(0.4, 3, 0.4);
            const towerMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x7c3aed,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial);
            leftTower.position.set(-3, 1.5, 0);
            scene.add(leftTower);
            
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial);
            rightTower.position.set(3, 1.5, 0);
            scene.add(rightTower);
            
            const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 7, 8);
            const cableMaterial = new THREE.MeshBasicMaterial({ 
                color: 0x10b981,
                wireframe: true,
                transparent: true,
                opacity: 0.7
            });
            
            const mainCable = new THREE.Mesh(cableGeometry, cableMaterial);
            mainCable.rotation.z = Math.PI / 2;
            mainCable.position.y = 3;
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
            const barBottom = bar.getBoundingClientRect().bottom;
            
            if (barTop < windowHeight * 0.85 && barBottom > 0) {
                bar.classList.add('animated');
            } else {
                bar.classList.remove('animated');
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
    
    // Toggle admin panel - THIS PART IS MODIFIED
    // If adminLoginBtn exists, its default behavior (following the href="auth.html")
    // should now occur. The previous JavaScript was preventing this and opening a modal.
    // By commenting out or removing the event listener, the link will work as intended.
    /*
    if (adminLoginBtn) {
        adminLoginBtn.addEventListener('click', (e) => {
            e.preventDefault(); // This line PREVENTED navigation
            adminPanel.classList.add('active'); // This line opened the modal
        });
    }
    */
    // The above block is commented out to allow the link to navigate to auth.html.
    // If you still need other JS functionality for the admin panel (e.g., the close button, form submissions),
    // ensure that logic remains and is correctly targeted.
    
    if (closeAdminPanelBtn) {
        closeAdminPanelBtn.addEventListener('click', () => {
            adminPanel.classList.remove('active');
        });
    }
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            
            if (username === 'admin' && password === 'password') { // Replace with actual auth
                adminLoginSection.style.display = 'none';
                adminEditSection.classList.add('active');
                loadContentIntoForms();
            } else {
                loginError.textContent = 'Invalid username or password. Try admin/password for demo.';
                loginError.style.display = 'block';
                setTimeout(() => {
                    loginError.style.display = 'none';
                }, 3000);
            }
        });
    }
    
    if (adminTabs) {
        adminTabs.forEach(tab => {
            tab.addEventListener('click', () => {
                adminTabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                
                adminTabContents.forEach(content => content.classList.remove('active'));
                const tabContentId = tab.getAttribute('data-tab');
                document.querySelector(`[data-tab-content="${tabContentId}"]`).classList.add('active');
            });
        });
    }
    
    document.querySelectorAll('input[type="range"]').forEach(range => {
        const valueDisplay = range.nextElementSibling;
        if (valueDisplay) { // Check if valueDisplay exists
            range.addEventListener('input', () => {
                valueDisplay.textContent = `${range.value}%`;
            });
            // Initialize display
            valueDisplay.textContent = `${range.value}%`;
        }
    });
    
    function loadContentIntoForms() {
        document.getElementById('edit-name').value = document.getElementById('profile-name').textContent;
        document.getElementById('edit-tagline').value = document.getElementById('profile-tagline').textContent;
        document.getElementById('edit-description-1').value = document.getElementById('profile-description-1').textContent;
        document.getElementById('edit-description-2').value = document.getElementById('profile-description-2').textContent;
        document.getElementById('edit-linkedin').value = document.getElementById('linkedin-url').getAttribute('href');
        document.getElementById('edit-github').value = document.getElementById('github-url').getAttribute('href');
        document.getElementById('edit-twitter').value = document.getElementById('twitter-url').getAttribute('href');
        
        document.getElementById('edit-skills-title').value = document.getElementById('skills-title').textContent;
        document.getElementById('edit-skill-1').value = document.getElementById('skill-1-name').textContent;
        document.getElementById('edit-skill-2').value = document.getElementById('skill-2-name').textContent;
        document.getElementById('edit-skill-3').value = document.getElementById('skill-3-name').textContent;
        document.getElementById('edit-skills-btn').value = document.getElementById('skills-btn-text').textContent;
        
        document.getElementById('edit-projects-title').value = document.getElementById('projects-title').textContent;
        document.getElementById('edit-project-1').value = document.getElementById('project-1').textContent;
        document.getElementById('edit-project-2').value = document.getElementById('project-2').textContent;
        document.getElementById('edit-project-3').value = document.getElementById('project-3').textContent;
        document.getElementById('edit-projects-btn').value = document.getElementById('projects-btn-text').textContent;
        
        document.getElementById('edit-contact-title').value = document.getElementById('contact-title').textContent;
        document.getElementById('edit-contact-1').value = document.getElementById('contact-method-1').textContent;
        document.getElementById('edit-contact-2').value = document.getElementById('contact-method-2').textContent;
        document.getElementById('edit-contact-3').value = document.getElementById('contact-method-3').textContent;
        document.getElementById('edit-contact-btn').value = document.getElementById('contact-btn-text').textContent;
    }
    
    const profileImage = document.getElementById('edit-profile-image');
    const imagePreview = document.getElementById('image-preview');
    const previewContainer = document.querySelector('.preview-container');
    
    if (profileImage && imagePreview && previewContainer) { // Added checks for elements
        profileImage.addEventListener('change', function() {
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
            document.getElementById('profile-name').textContent = document.getElementById('edit-name').value;
            document.getElementById('profile-tagline').textContent = document.getElementById('edit-tagline').value;
            document.getElementById('profile-description-1').textContent = document.getElementById('edit-description-1').value;
            document.getElementById('profile-description-2').textContent = document.getElementById('edit-description-2').value;
            document.getElementById('linkedin-url').setAttribute('href', document.getElementById('edit-linkedin').value);
            document.getElementById('github-url').setAttribute('href', document.getElementById('edit-github').value);
            document.getElementById('twitter-url').setAttribute('href', document.getElementById('edit-twitter').value);
            
            if (profileImage && profileImage.files && profileImage.files[0] && imagePreview) {
                document.querySelector('.profile-img').src = imagePreview.src;
            }
            showNotification('Profile updated successfully!');
        });
    }
    
    if (skillsForm) {
        skillsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('skills-title').textContent = document.getElementById('edit-skills-title').value;
            document.getElementById('skill-1-name').textContent = document.getElementById('edit-skill-1').value;
            document.getElementById('skill-2-name').textContent = document.getElementById('edit-skill-2').value;
            document.getElementById('skill-3-name').textContent = document.getElementById('edit-skill-3').value;
            document.getElementById('skills-btn-text').textContent = document.getElementById('edit-skills-btn').value;
            
            const skill1Value = document.getElementById('edit-skill-1-value').value;
            const skill2Value = document.getElementById('edit-skill-2-value').value;
            const skill3Value = document.getElementById('edit-skill-3-value').value;
            document.querySelectorAll('.xp-bar')[0].style.setProperty('--xp', `${skill1Value}%`);
            document.querySelectorAll('.xp-bar')[1].style.setProperty('--xp', `${skill2Value}%`);
            document.querySelectorAll('.xp-bar')[2].style.setProperty('--xp', `${skill3Value}%`);
            showNotification('Skills updated successfully!');
        });
    }
    
    if (projectsForm) {
        projectsForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('projects-title').textContent = document.getElementById('edit-projects-title').value;
            document.getElementById('project-1').textContent = document.getElementById('edit-project-1').value;
            document.getElementById('project-2').textContent = document.getElementById('edit-project-2').value;
            document.getElementById('project-3').textContent = document.getElementById('edit-project-3').value;
            document.getElementById('projects-btn-text').textContent = document.getElementById('edit-projects-btn').value;
            showNotification('Projects updated successfully!');
        });
    }
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            document.getElementById('contact-title').textContent = document.getElementById('edit-contact-title').value;
            document.getElementById('contact-method-1').textContent = document.getElementById('edit-contact-1').value;
            document.getElementById('contact-method-2').textContent = document.getElementById('edit-contact-2').value;
            document.getElementById('contact-method-3').textContent = document.getElementById('edit-contact-3').value;
            document.getElementById('contact-btn-text').textContent = document.getElementById('edit-contact-btn').value;
            showNotification('Contact information updated successfully!');
        });
    }
    
    function showNotification(message) {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        if(notification && notificationMessage) { // Check if elements exist
            notificationMessage.textContent = message;
            notification.classList.add('active');
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
    
    window.addEventListener('scroll', animateXPBars);
    animateXPBars();
    
    window.addEventListener('click', (e) => {
        if (adminPanel && e.target === adminPanel) { // Check if adminPanel exists
            adminPanel.classList.remove('active');
        }
    });
});
