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
        const filterBtns = document.querySelectorAll('#quest-filter-container .filter-btn');
        const questCards = document.querySelectorAll('#quest-grid-container .quest-card');
        
        if (filterBtns.length > 0 && questCards.length > 0) {
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    filterBtns.forEach(b => b.classList.remove('active'));
                    this.classList.add('active');
                    const filter = this.getAttribute('data-filter');
                    
                    questCards.forEach(card => {
                        card.style.display = 'none'; // Hide all first to apply filter correctly
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
            // Ensure default 'all' filter is triggered if present and active
            const activeAllFilter = document.querySelector('#quest-filter-container .filter-btn[data-filter="all"].active');
            if (activeAllFilter) {
                activeAllFilter.click(); // Programmatically click to apply the initial filter
            } else if (filterBtns.length > 0) {
                filterBtns[0].click(); // Or click the first filter if 'all' is not specifically active
            }

        } else if (questCards.length > 0) { // Only cards, no filters (should not happen with default static filters)
             questCards.forEach(card => card.style.display = 'flex'); // Show all cards
        }
    }
    
    const currentYearElement = document.getElementById('current-year-projects');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    function showNotification(message, type = 'success') {
        // ... (showNotification function - ensure it's correctly defined as in previous responses)
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.classList.remove('success', 'error', 'info');
            
            let iconClass = 'fas fa-check-circle';
            let borderColor = 'var(--success)'; // Make sure these CSS variables are defined
            let iconColor = 'var(--success)';
            let notifClass = 'success';

            if (type === 'error') {
                iconClass = 'fas fa-exclamation-circle';
                borderColor = 'var(--danger)';
                iconColor = 'var(--danger)';
                notifClass = 'error';
            } else if (type === 'info') {
                iconClass = 'fas fa-info-circle';
                borderColor = 'var(--primary)';
                iconColor = 'var(--primary)';
                notifClass = 'info';
            }
            
            notification.classList.add(notifClass);
            icon.className = iconClass;
            notification.style.borderColor = borderColor;
            icon.style.color = iconColor;
            
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
            initializeProjectFiltering(); // Fallback for any existing static content
            return;
        }

        let useDynamicData = false;

        if (projectsDataString) {
            try {
                const projectsData = JSON.parse(projectsDataString);

                if (projectsData && projectsData.pageSettings && projectsData.projects) {
                    useDynamicData = true; // Flag that we will use dynamic data

                    // Update Page Title and Description
                    const pageMainTitleEl = document.getElementById('projects-page-main-title');
                    const pageHighlightTitleEl = document.getElementById('projects-page-highlight-title');
                    if (pageMainTitleEl && pageHighlightTitleEl && projectsData.pageSettings.title) {
                        const title = projectsData.pageSettings.title;
                        const lastSpaceIndex = title.lastIndexOf(' ');
                        if (lastSpaceIndex > -1 && lastSpaceIndex < title.length -1) { // Ensure space is not last char
                            pageMainTitleEl.firstChild.nodeValue = title.substring(0, lastSpaceIndex + 1);
                            pageHighlightTitleEl.textContent = title.substring(lastSpaceIndex + 1);
                        } else {
                            pageMainTitleEl.firstChild.nodeValue = title;
                            pageHighlightTitleEl.textContent = ""; // Or a default if title is one word
                        }
                    }
                    const pageDescEl = document.getElementById('projects-page-description');
                    if (pageDescEl && projectsData.pageSettings.description) {
                        pageDescEl.textContent = projectsData.pageSettings.description;
                    }

                    // Populate Filter Buttons
                    if (projectsData.pageSettings.filters && projectsData.pageSettings.filters.length > 0) {
                        questFilterContainer.innerHTML = ''; // Clear static filters for dynamic ones
                        projectsData.pageSettings.filters.forEach((filter) => {
                            const button = document.createElement('button');
                            button.className = 'filter-btn';
                            // Make 'all' filter active by default if it's the first one from dynamic data
                            if (filter.dataFilter === "all" && questFilterContainer.children.length === 0) {
                                button.classList.add('active');
                            }
                            button.dataset.filter = filter.dataFilter;
                            button.textContent = filter.label;
                            questFilterContainer.appendChild(button);
                        });
                    } else {
                        // If no dynamic filters, ensure at least 'All Projects' static filter is there or add it
                        if (!questFilterContainer.querySelector('[data-filter="all"]')) {
                             questFilterContainer.innerHTML = '<button class="filter-btn active" data-filter="all">All Projects</button>';
                        }
                    }

                    // Populate Project Cards if there are projects
                    if (projectsData.projects.length > 0) {
                        questGridContainer.innerHTML = ''; // Clear static projects for dynamic ones
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
                                    <a href="${project.projectUrl || '#'}" class="quest-btn" target="_blank" rel="noopener noreferrer">View Project <i class="fas fa-arrow-right"></i></a>
                                </div>
                            `;
                            questGridContainer.appendChild(card);
                        });
                    } else {
                        // Dynamic data exists but no projects are listed.
                        questGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--light-gray);">No projects have been added yet. The admin can add projects via the admin panel.</p>';
                    }
                } else {
                     // Data found in localStorage but has incorrect structure
                    console.warn("Projects data in localStorage has an unexpected structure.");
                }
            } catch (e) {
                console.error("Error parsing projects data from localStorage:", e);
                // showNotification("Error loading projects data. Displaying defaults.", "error");
                // Fallback: static content will be used as `useDynamicData` remains false.
            }
        }
        
        // If dynamic data was not used (or failed to load properly), the static HTML content remains.
        // Initialize filtering for whatever content is currently in the DOM.
        initializeProjectFiltering();
    }
    
    loadProjectsDisplayData();
});
