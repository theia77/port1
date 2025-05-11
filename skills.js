// skills.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#3b82f6" },
                shape: { type: "circle", stroke: {width: 0, color: "#000000" }, },
                opacity: { value: 0.5, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
                size: { value: 3, random: true, anim: { enable: true, speed: 2, size_min: 0.1, sync: false } },
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

    // Initialize code highlighting
    if (typeof hljs !== 'undefined') {
        document.querySelectorAll('.skills-main pre code').forEach((block) => { // Scoped to skills-main
            hljs.highlightBlock(block);
        });
    }

    // Animate XP bars on scroll
    const animateXPBars = () => {
        const xpBars = document.querySelectorAll('.skills-main .xp-bar'); // Scoped to skills-main
        xpBars.forEach(bar => {
            const barTop = bar.getBoundingClientRect().top;
            // Check if bar is (partially) in viewport and not already animated
            if (barTop < window.innerHeight * 0.9 && barTop + bar.offsetHeight > 0 && !bar.classList.contains('animated')) {
                 // The --xp variable should be set in the HTML style attribute e.g. style="--xp: 90%;"
                bar.classList.add('animated');
            }
            // Optional: Reset animation if it scrolls out of view (e.g. for re-animation on scroll up)
            // else if ((barTop > window.innerHeight || barTop + bar.offsetHeight < 0) && bar.classList.contains('animated')) {
            //    bar.classList.remove('animated');
            // }
        });
    };

    // Set current year in footer
    const currentYearElement = document.querySelector('.current-year');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // --- Admin Panel related JavaScript REMOVED from here ---
    // All functionality for login, tabs, editing skills, code, certs, files
    // that was previously in this file (targeting an admin panel within skills.html)
    // is removed. This functionality should now reside in auth.html and its JS.

    // Show notification (kept for potential future use, e.g., data loading status)
    function showNotification(message, type = 'success') { // type can be 'success' or 'error'
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.classList.remove('success', 'error'); // Remove previous types
            
            if (type === 'error') {
                notification.classList.add('error');
                icon.className = 'fas fa-exclamation-circle'; // Error icon
                notification.style.borderColor = 'var(--danger)'; // Error border
                icon.style.color = 'var(--danger)';
            } else {
                notification.classList.add('success');
                icon.className = 'fas fa-check-circle'; // Success icon
                notification.style.borderColor = 'var(--success)'; // Success border
                icon.style.color = 'var(--success)';
            }
            
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
    
    // Run animations on page load and scroll
    animateXPBars(); 
    window.addEventListener('scroll', animateXPBars);

    // If you plan to load skills data dynamically into skills.html (e.g., from localStorage managed by auth.html):
    // loadSkillsDisplayData(); // You would define this function
    function loadSkillsDisplayData() {
        const skillsData = JSON.parse(localStorage.getItem('skillsDashboardData'));
        if (skillsData) {
            // Example: Populate technical skills
            const techSkillsContainer = document.querySelector('#technical-skills-display');
            // Clear existing static content if you're fully dynamic
            // techSkillsContainer.innerHTML = '<h2 class="section-title">Technical Skills</h2>'; 
            
            // skillsData.technicalSkills.forEach(category => {
            //    const categoryDiv = document.createElement('div');
            //    categoryDiv.className = 'skill-category';
            //    categoryDiv.innerHTML = `<h3>${category.name}</h3>`;
            //    category.skills.forEach(skill => { /* ... create skill-item divs ... */ });
            //    techSkillsContainer.appendChild(categoryDiv);
            // });
            // Similarly populate code samples, certifications from skillsData
            // console.log("Skills data loaded for display", skillsData);
            // showNotification("Skills data loaded dynamically.", "success");
        } else {
            // console.log("No dynamic skills data found, displaying static content.");
            // showNotification("Displaying static skills content.", "info"); // 'info' type would need CSS
        }
        // After populating, re-run animations if necessary
        animateXPBars();
        if (typeof hljs !== 'undefined') {
            document.querySelectorAll('.skills-main pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        }
    }
    // Call it if you want to load data:
    // loadSkillsDisplayData(); 
});
