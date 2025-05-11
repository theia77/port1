// contact.js (formerly contact-script.js)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle", stroke: { width: 0, color: "#000000" }, },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
                line_linked: { enable: true, distance: 150, color: "#7c3aed", opacity: 0.3, width: 1 },
                move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out", bounce: false, attract: { enable: false, rotateX: 600, rotateY: 1200 } }
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
    if (bridgeContainer && typeof THREE !== 'undefined') { // Check for THREE definition
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

    // Set current year in footer
    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Contact Form Submission (User-facing)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            // In a real implementation, you would send the form data to your server
            // or use a service like Formspree, Netlify Forms, etc.
            showNotification('Message sent successfully! We\'ll get back to you soon.');
            contactForm.reset();
        });
    }

    // --- Admin Panel related JavaScript REMOVED from here ---
    // The original script had functions for:
    // - Toggling a local admin panel modal on this page
    // - Handling login for that local admin panel
    // - Tab switching within that local admin panel
    // - Loading contact page content INTO the local admin panel's forms
    // - Submitting those forms to update the contact page content directly from the local admin panel
    // All this functionality is removed as admin editing is now centralized to auth.html

    // Show notification function (kept for contact form submission and potential dynamic loading feedback)
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.classList.remove('success', 'error', 'info'); // Remove previous types
            
            if (type === 'error') {
                notification.classList.add('error');
                icon.className = 'fas fa-exclamation-circle';
                notification.style.borderColor = 'var(--danger)';
                icon.style.color = 'var(--danger)';
            } else if (type === 'info') {
                notification.classList.add('info'); // You might need to add CSS for .notification.info
                icon.className = 'fas fa-info-circle';
                notification.style.borderColor = 'var(--primary)'; // Example for info
                icon.style.color = 'var(--primary)';
            } else { // Default to success
                notification.classList.add('success');
                icon.className = 'fas fa-check-circle';
                notification.style.borderColor = 'var(--success)';
                icon.style.color = 'var(--success)';
            }
            
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }

    // If you plan to dynamically load contact information from localStorage (managed by auth.html)
    // you would add that logic here.
    function loadContactPageDisplayData() {
        const contactData = JSON.parse(localStorage.getItem('contactPageData'));
        if (contactData) {
            // Update page title
            const pageTitleEl = document.getElementById('contact-page-title');
            if (pageTitleEl && contactData.title) pageTitleEl.textContent = contactData.title;

            // Update page description
            const pageDescEl = document.getElementById('contact-page-description');
            if (pageDescEl && contactData.description) pageDescEl.textContent = contactData.description;

            // Update email
            const emailDisplayLink = document.getElementById('email-display-link');
            if (emailDisplayLink && contactData.email) {
                emailDisplayLink.textContent = contactData.email;
                emailDisplayLink.href = `mailto:${contactData.email}`;
            }

            // Update phone
            const phoneDisplayLink = document.getElementById('phone-display-link');
            if (phoneDisplayLink && contactData.phone) {
                phoneDisplayLink.textContent = contactData.phone;
                phoneDisplayLink.href = `tel:${contactData.phone.replace(/\s+/g, '')}`;
            }

            // Update Calendly
            const calendlyLink = document.getElementById('calendly-link');
            if (calendlyLink && contactData.calendlyUrl) {
                calendlyLink.href = contactData.calendlyUrl;
                if (contactData.calendlyText) {
                    calendlyLink.innerHTML = `${contactData.calendlyText} <i class="fas fa-arrow-right"></i>`;
                }
            }

            // Update Social Links
            if (contactData.socialLinks) {
                const githubCard = document.getElementById('github-social-card');
                const githubUsernameDisplay = document.getElementById('github-username-display');
                if (githubCard && githubUsernameDisplay && contactData.socialLinks.github) {
                    githubCard.href = `https://github.com/${contactData.socialLinks.github}`;
                    githubUsernameDisplay.textContent = `@${contactData.socialLinks.github}`;
                }

                const linkedinCard = document.getElementById('linkedin-social-card');
                // Note: LinkedIn username display might be static or also dynamic
                if (linkedinCard && contactData.socialLinks.linkedin) {
                    linkedinCard.href = contactData.socialLinks.linkedin;
                }
                // ... and so on for Twitter, Medium
            }
            // showNotification("Contact details loaded dynamically.", "info");
        } else {
            // showNotification("Displaying static contact content.", "info");
        }
    }
    
    // Call it if you want to load data dynamically:
    loadContactPageDisplayData();
});
