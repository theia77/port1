// projects.js (formerly quest-script.js)
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { /* ... particles.js config from original script ... */ 
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
    if (bridgeContainer && typeof THREE !== 'undefined') { // Check for THREE definition
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createBridge = () => { /* ... createBridge function from original script ... */ 
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

        function animate() { /* ... animate function from original script ... */ 
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

        window.addEventListener('resize', () => { /* ... resize handler from original script ... */
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    // Project Filtering (kept from original script)
    function initializeProjectFiltering() {
        const filterBtns = document.querySelectorAll('.quest-filter .filter-btn');
        const questCards = document.querySelectorAll('.quest-grid .quest-card');
        
        if (filterBtns.length > 0 && questCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    
                    questCards.forEach(card => {
                        if (filter === 'all') {
                            card.style.display = 'flex'; // Or 'block' depending on your CSS for cards
                        } else {
                            const categories = (card.getAttribute('data-category') || '').split(' ');
                            if (categories.includes(filter)) {
                                card.style.display = 'flex';
                            } else {
                                card.style.display = 'none';
                            }
                        }
                    });
                });
            });
        }
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year-projects');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    } else { // Fallback if the ID isn't specific
        const genericCurrentYear = document.querySelector('.footer-copyright .current-year');
        if(genericCurrentYear) genericCurrentYear.textContent = new Date().getFullYear();
    }


    // --- Admin Panel related JavaScript REMOVED from here ---
    // All functionality for login, tabs, editing/adding projects, and page settings
    // that was previously in this file (targeting a local admin panel on projects.html)
    // is removed. This functionality should now reside in auth.html and its JS.

    // Show notification function (kept for potential dynamic loading feedback)
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.classList.remove('success', 'error', 'info');
            
            if (type === 'error') {
                notification.classList.add('error');
                icon.className = 'fas fa-exclamation-circle';
                notification.style.borderColor = 'var(--danger)';
                icon.style.color = 'var(--danger)';
            } else if (type === 'info') {
                notification.classList.add('info');
                icon.className = 'fas fa-info-circle';
                notification.style.borderColor = 'var(--primary)';
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

    // Function to dynamically load projects and filters (example structure)
    function loadProjectsDisplayData() {
        const projectsData = JSON.parse(localStorage.getItem('projectsPageData'));
        if (projectsData) {
            const questGridContainer = document.getElementById('quest-grid-container');
            const questFilterContainer = document.getElementById('quest-filter-container');

            // Update Page Title and Description
            const pageTitleEl = document.getElementById('projects-page-title');
            if (pageTitleEl && projectsData.pageSettings && projectsData.pageSettings.title) {
                 // Ensure the <span> within h1 is targeted if 'Board' should be highlighted
                const highlightSpan = pageTitleEl.querySelector('.highlight');
                if (highlightSpan) {
                    pageTitleEl.innerHTML = `${projectsData.pageSettings.title.replace('Board', '')}<span class="highlight">Board</span>`;
                } else {
                    pageTitleEl.textContent = projectsData.pageSettings.title;
                }
            }
            const pageDescEl = document.getElementById('projects-page-description');
            if (pageDescEl && projectsData.pageSettings && projectsData.pageSettings.description) {
                pageDescEl.textContent = projectsData.pageSettings.description;
            }

            // Populate Filter Buttons
            if (questFilterContainer && projectsData.pageSettings && projectsData.pageSettings.filters) {
                questFilterContainer.innerHTML = ''; // Clear existing static filters
                projectsData.pageSettings.filters.forEach((filter, index) => {
                    const button = document.createElement('button');
                    button.className = 'filter-btn';
                    if (index === 0 && filter.dataFilter === "all") button.classList.add('active'); // Make 'all' active by default
                    button.dataset.filter = filter.dataFilter;
                    button.textContent = filter.label;
                    questFilterContainer.appendChild(button);
                });
            }

            // Populate Project Cards
            if (questGridContainer && projectsData.projects) {
                questGridContainer.innerHTML = ''; // Clear existing static projects
                projectsData.projects.forEach(project => {
                    const card = document.createElement('div');
                    card.className = 'quest-card';
                    card.dataset.category = project.categories.join(' '); // Assuming categories is an array
                    card.dataset.projectId = project.id || project.title.toLowerCase().replace(/\s+/g, '-'); // Unique ID

                    card.innerHTML = `
                        <div class="quest-card-header">
                            <span class="quest-difficulty">${project.difficulty || 'N/A'}</span>
                            <span class="quest-reward"><i class="fas ${project.rewardIcon || 'fa-award'}"></i> ${project.rewardText || 'Info'}</span>
                        </div>
                        <div class="quest-card-image">
                            <img src="${project.imageUrl || 'placeholder-project.jpg'}" alt="${project.title}">
                        </div>
                        <div class="quest-card-content">
                            <h2 class="quest-title">${project.title}</h2>
                            <p class="quest-description">${project.description}</p>
                            <div class="quest-tags">
                                ${(project.tags || []).map(tag => `<span class="quest-tag">${tag}</span>`).join('')}
                            </div>
                            <div class="quest-stats">
                                <div class="quest-stat">
                                    <i class="fas fa-calendar-alt"></i>
                                    <span>${project.year || 'N/A'}</span>
                                </div>
                                <div class="quest-stat">
                                    <i class="fas ${project.statsIcon || 'fa-info-circle'}"></i>
                                    <span>${project.statsText || 'N/A'}</span>
                                </div>
                            </div>
                            <a href="${project.projectUrl || '#'}" class="quest-btn">View Project <i class="fas fa-arrow-right"></i></a>
                        </div>
                    `;
                    questGridContainer.appendChild(card);
                });
            }
            // Re-initialize filtering after dynamic content is loaded
            initializeProjectFiltering(); 
            // showNotification("Projects data loaded dynamically.", "info");
        } else {
            // If no data in localStorage, the static HTML content will be shown.
            // Initialize filtering for static content.
            initializeProjectFiltering();
            // showNotification("Displaying static projects content.", "info");
        }
    }
    
    // Call it to load data dynamically if you implement it:
    loadProjectsDisplayData();
});
