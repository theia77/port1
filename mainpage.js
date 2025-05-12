// mainpage.js (Core functionality from previous stable versions)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#64ffda" }, // Using accent color from CSS
                shape: { type: "circle" },
                opacity: { value: 0.4, random: true, anim: { enable: false } },
                size: { value: 2.5, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 160, color: "#8892b0", opacity: 0.2, width: 1 }, // Using gray
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out", bounce: false }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false }, resize: true },
                modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
            },
            retina_detect: true
        });
    }

    // Initialize 3D bridge model (or your preferred 3D background)
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 4; // Adjusted camera position
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        // Simple wireframe sphere as a placeholder for complex model
        const geometry = new THREE.IcosahedronGeometry(1.5, 1); // More complex sphere
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x64ffda, // Accent color
            wireframe: true,
            transparent: true,
            opacity: 0.3 
        });
        const sphere = new THREE.Mesh(geometry, material);
        scene.add(sphere);
        
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
        scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(0, 5, 5);
        scene.add(directionalLight);

        function animate() {
            requestAnimationFrame(animate);
            sphere.rotation.x += 0.001;
            sphere.rotation.y += 0.0015;
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

    // XP Bar Animation (if you want it on the main page previews)
    const animateXPBars = () => {
        const xpBars = document.querySelectorAll('.xp-bar'); // Selects all xp-bars
        xpBars.forEach(bar => {
            // This simple version just sets it. For on-scroll, IntersectionObserver is better.
            bar.classList.add('animated'); // Ensure your CSS has .xp-bar.animated::before { width: var(--xp); }
        });
    };
    animateXPBars(); // Animate on load

    // Optional: Load dynamic content for profile section or card previews from localStorage
    function loadMainPageDynamicContent() {
        // Example for profile name:
        const profileNameData = localStorage.getItem('profileName'); // Assuming you save profile name with this key
        if (profileNameData) {
            const profileNameEl = document.getElementById('profile-name');
            if (profileNameEl) profileNameEl.innerHTML = `<span class="highlight-name">${profileNameData}</span>`;
        }
        // Add similar for tagline, description, social links, and card previews
        // e.g., for project preview 1:
        // const projectsData = JSON.parse(localStorage.getItem('projectsPageData'));
        // if(projectsData && projectsData.projects && projectsData.projects.length > 0){
        //    const project1PreviewEl = document.getElementById('project-1-preview');
        //    if(project1PreviewEl) project1PreviewEl.textContent = projectsData.projects[0].title;
        // }
    }
    // loadMainPageDynamicContent(); // Uncomment to enable dynamic content loading


    // Show notification function (if needed for any actions on mainpage.js)
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.className = 'notification active'; // Reset classes then add active
            
            let iconClass = 'fas fa-check-circle';
            let notifClass = 'success';

            if (type === 'error') {
                notifClass = 'error';
                iconClass = 'fas fa-exclamation-circle';
            } else if (type === 'info') {
                notifClass = 'info';
                iconClass = 'fas fa-info-circle';
            }
            
            notification.classList.add(notifClass);
            icon.className = iconClass;
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }
});
