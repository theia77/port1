// projects.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { /* ... particles.js config ... */ 
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
        const createBridge = () => { /* ... createBridge function ... */ 
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
        function animate() { /* ... animate function ... */ 
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
        window.addEventListener('resize', () => { /* ... resize handler ... */
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }

    function initializeProjectFiltering() {
        const filterBtns = document.querySelectorAll('#quest-filter-container .filter-btn'); // Target specific container
        const questCards = document.querySelectorAll('#quest-grid-container .quest-card'); // Target specific container
        
        if (filterBtns.length > 0 && questCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    
                    questCards.forEach(card => {
                        card.style.display = 'none'; // Hide all first
                        if (filter === 'all') {
                            card.style.display = 'flex'; 
                        } else {
                            const categories = (card.getAttribute('data-category') || '').split(' ');
                            if (categories.includes(filter)) {
                                card.style.display = 'flex';
                            }
                        }
                    });
                });
            });
            // Trigger click on 'all' filter initially if present
            const allFilterBtn = document.querySelector('#quest-filter-container .filter-btn[data-filter="all"].active');
            if(allFilterBtn) allFilterBtn.click();

        } else if (questCards.length > 0) { // If only cards exist (e.g. static content without dynamic filters)
             questCards.forEach(card => card.style.display = 'flex'); // Show all cards
        }
    }
    
    const currentYearElement = document.getElementById('current-year-projects');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    function showNotification(message, type = 'success') {
        // ... (showNotification function from previous interaction, ensure it's present)
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.classList.remove('success', 'error', 'info');
            
            if (type === 'error') {
                notification.classList.add('error');
                icon.className = 'fas fa-exclamation-circle';
                notification.style.borderColor = 'var(--danger)'; // Ensure --danger is defined in CSS
                icon.style.color = 'var(--danger)';
            } else if (type === 'info') {
                notification.classList.add('info'); // Ensure .notification.info CSS is defined
                icon.className = 'fas fa-info-circle';
                notification.style.borderColor = 'var(--primary)'; // Example, ensure --primary is defined
                icon.style.color = 'var(--primary)';
            } else { // Default to success
                notification.classList.add('success');
                icon.className = 'fas fa-check-circle';
                notification.style.borderColor = 'var(--success)'; // Ensure --success is defined
                icon.style.color = 'var(--success)';
            }
            
            notification.classList.add('active');
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }

    function loadProjectsDisplayData() {
        const projectsDataString = localStorage.getItem('projectsPageData');
        const questGridContainer = document.getElementById('quest-grid-container');
        const questFilterContainer = document.getElementById('quest-filter-container');

        if (!questGridContainer || !questFilterContainer) {
            console.error("Required containers for projects or filters not found.");
            initializeProjectFiltering(); // Still try to init for any static content
            return;
        }

        if (projectsDataString) {
            try {
                const projectsData = JSON.parse(projectsDataString);

                // Update Page Title and Description
                const pageMainTitleEl = document.getElementById('projects-page-main-title'); // Target the H1
                const pageHighlightTitleEl = document.getElementById('projects-page-highlight-title'); // Target the span
                if (pageMainTitleEl && projectsData.pageSettings && projectsData.pageSettings.title) {
                    const titleParts = projectsData.pageSettings.title.split(' ');
                    if (titleParts.length > 1) {
                        pageHighlightTitleEl.textContent = titleParts.pop(); // Last word for highlight
                        pageMainTitleEl.firstChild.nodeValue = titleParts.join(' ') + ' '; // The rest before span
                    } else {
                        pageMainTitleEl.firstChild.nodeValue = projectsData.pageSettings.title;
                        pageHighlightTitleEl.textContent = ""; // Or some default if title is one word
                    }
                }
                const pageDescEl = document.getElementById('projects-page-description');
                if (pageDescEl && projectsData.pageSettings && projectsData.pageSettings.description) {
                    pageDescEl.textContent = projectsData.pageSettings.description;
                }

                // Populate Filter Buttons
                if (projectsData.pageSettings && projectsData.pageSettings.filters && projectsData.pageSettings.filters.length > 0) {
                    questFilterContainer.innerHTML = ''; // Clear existing static filters
                    projectsData.pageSettings.filters.forEach((filter, index) => {
                        const button = document.createElement('button');
                        button.className = 'filter-btn';
                        if (index === 0 && filter.dataFilter === "all") button.classList.add('active');
                        button.dataset.filter = filter.dataFilter;
                        button.textContent = filter.label;
                        questFilterContainer.appendChild(button);
                    });
                } else {
                     // If no filters in localStorage, keep static ones or default to 'All Projects'
                    if (!questFilterContainer.querySelector('[data-filter="all"]')) {
                        questFilterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All Projects</button>';
                    }
                }

                // Populate Project Cards
                if (projectsData.projects && projectsData.projects.length > 0) {
                    questGridContainer.innerHTML = ''; // Clear existing static projects
                    projectsData.projects.forEach(project => {
                        const card = document.createElement('div');
                        card.className = 'quest-card';
                        card.dataset.category = (project.categories || []).join(' ');
                        card.dataset.projectId = project.id || project.title.toLowerCase().replace(/\s+/g, '-');

                        card.innerHTML = `
                            <div class="quest-card-header">
                                <span class="quest-difficulty">${project.difficulty || 'N/A'}</span>
                                <span class="quest-reward"><i class="fas ${project.rewardIcon || 'fa-award'}"></i> ${project.rewardText || 'Info'}</span>
                            </div>
                            <div class="quest-card-image">
                                <img src="${project.imageUrl || 'placeholder-project.jpg'}" alt="${project.title || 'Project Image'}">
                            </div>
                            <div class="quest-card-content">
                                <h2 class="quest-title">${project.title || 'Untitled Project'}</h2>
                                <p class="quest-description">${project.description || 'No description available.'}</p>
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
                    // showNotification("Projects loaded from saved data.", "success");
                } else {
                    // No projects in localStorage, static HTML (if any) will be displayed.
                    // If questGridContainer was cleared and no projects in localStorage, it will be empty.
                    // You might want to show a message if it's empty.
                    if(questGridContainer.children.length === 0){
                        questGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1;">No projects to display at the moment.</p>';
                    }
                    // showNotification("No projects found in saved data. Displaying static content or empty.", "info");
                }
            } catch (e) {
                console.error("Error parsing projects data from localStorage:", e);
                showNotification("Error loading projects data. Displaying defaults.", "error");
                // Fallback to static content if parsing fails
            }
        } else {
            // No data in localStorage, static HTML content in projects.html will be used.
            // showNotification("Displaying default projects content.", "info");
        }
        // Initialize filtering for whatever content is now present (static or dynamic)
        initializeProjectFiltering();
    }
    
    loadProjectsDisplayData();
});
