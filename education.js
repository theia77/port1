// education.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { /* ... particles.js config (same as other pages) ... */ 
            particles: {
                number: { value: 60, density: { enable: true, value_area: 900 } },
                color: { value: "#3b82f6" }, // Example color
                shape: { type: "circle" },
                opacity: { value: 0.5, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#7c3aed", opacity: 0.3, width: 1 },
                move: { enable: true, speed: 1.5, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "repulse" }, onclick: { enable: true, mode: "push" }, resize: true },
                modes: { repulse: { distance: 100, duration: 0.4 }, push: { particles_nb: 4 } }
            },
            retina_detect: true
        });
    }

    // Initialize 3D bridge model (if you want it on this page too)
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        // ... (Same THREE.js bridge model code as other pages) ...
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
            const leftTower = new THREE.Mesh(towerGeometry, towerMaterial); leftTower.position.set(-3, 1.5, 0); scene.add(leftTower);
            const rightTower = new THREE.Mesh(towerGeometry, towerMaterial); rightTower.position.set(3, 1.5, 0); scene.add(rightTower);
            const cableGeometry = new THREE.CylinderGeometry(0.03, 0.03, 7, 8);
            const cableMaterial = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true, transparent: true, opacity: 0.7 });
            const mainCable = new THREE.Mesh(cableGeometry, cableMaterial); mainCable.rotation.z = Math.PI / 2; mainCable.position.y = 3; scene.add(mainCable);
            return { deck, leftTower, rightTower, mainCable };
        };
        const bridge = createBridge();
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); scene.add(ambientLight);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8); directionalLight.position.set(0, 10, 5); scene.add(directionalLight);
        function animate() { 
            requestAnimationFrame(animate);
            bridge.deck.rotation.y += 0.005; bridge.leftTower.rotation.y += 0.007; bridge.rightTower.rotation.y += 0.007; bridge.mainCable.rotation.x += 0.003;
            const time = Date.now() * 0.001; bridge.deck.position.y = Math.sin(time) * 0.1;
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    // Set current year in footer
    const currentYearElement = document.getElementById('current-year-education');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // Show notification function
    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.className = 'notification active'; // Reset classes then add active
            
            let iconClass = 'fas fa-check-circle';
            if (type === 'error') {
                notification.classList.add('error');
                iconClass = 'fas fa-exclamation-circle';
            } else if (type === 'info') {
                notification.classList.add('info');
                iconClass = 'fas fa-info-circle';
            } else { // success
                notification.classList.add('success');
            }
            icon.className = iconClass;
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3000);
        }
    }

    // Function to dynamically load education entries
    function loadEducationDisplayData() {
        const educationDataString = localStorage.getItem('educationPageData');
        const educationGridContainer = document.getElementById('education-grid-container');

        if (!educationGridContainer) {
            console.error("Education grid container not found.");
            return;
        }

        let useDynamicData = false;

        if (educationDataString) {
            try {
                const educationPageData = JSON.parse(educationDataString);

                if (educationPageData && educationPageData.educationEntries && Array.isArray(educationPageData.educationEntries)) {
                    
                    // Update Page Title and Description (if these are part of educationPageData.pageSettings)
                    const pageMainTitleEl = document.getElementById('education-page-main-title');
                    const pageHighlightTitleEl = document.getElementById('education-page-highlight-title');
                    if (educationPageData.pageSettings && educationPageData.pageSettings.title) {
                        const title = educationPageData.pageSettings.title;
                        const lastSpaceIndex = title.lastIndexOf(' ');
                        if (pageMainTitleEl && pageHighlightTitleEl && lastSpaceIndex > -1 && lastSpaceIndex < title.length -1) {
                            pageMainTitleEl.firstChild.nodeValue = title.substring(0, lastSpaceIndex + 1);
                            pageHighlightTitleEl.textContent = title.substring(lastSpaceIndex + 1);
                        } else if (pageMainTitleEl) {
                            pageMainTitleEl.firstChild.nodeValue = title;
                            if(pageHighlightTitleEl) pageHighlightTitleEl.textContent = "";
                        }
                    }
                    const pageDescEl = document.getElementById('education-page-description');
                    if (pageDescEl && educationPageData.pageSettings && educationPageData.pageSettings.description) {
                        pageDescEl.textContent = educationPageData.pageSettings.description;
                    }


                    // Populate Education Entries if there are any
                    if (educationPageData.educationEntries.length > 0) {
                        useDynamicData = true;
                        educationGridContainer.innerHTML = ''; // Clear static fallback

                        educationPageData.educationEntries.forEach(entry => {
                            const card = document.createElement('div');
                            card.className = 'education-entry-card';
                            card.dataset.educationId = entry.id || entry.degree.toLowerCase().replace(/\s+/g, '-');

                            let relatedProjectsHTML = '';
                            if (entry.relatedProjects && entry.relatedProjects.length > 0) {
                                relatedProjectsHTML = `
                                    <div class="related-content-section">
                                        <h3><i class="fas fa-project-diagram"></i> Related Projects</h3>
                                        <ul class="related-items-list">
                                            ${entry.relatedProjects.map(proj => `
                                                <li>
                                                    <a href="${proj.url || '#'}" class="related-item-link" ${proj.url ? 'target="_blank" rel="noopener noreferrer"' : ''}>${proj.title}</a>
                                                    <p class="related-item-description">${proj.description || ''}</p>
                                                    <div class="related-item-tags">
                                                        ${(proj.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                                    </div>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>`;
                            }

                            let relatedBlogsHTML = '';
                            if (entry.relatedBlogs && entry.relatedBlogs.length > 0) {
                                relatedBlogsHTML = `
                                    <div class="related-content-section">
                                        <h3><i class="fas fa-feather-alt"></i> Related Publications/Blogs</h3>
                                        <ul class="related-items-list">
                                            ${entry.relatedBlogs.map(blog => `
                                                <li>
                                                    <a href="${blog.url || '#'}" class="related-item-link" ${blog.url ? 'target="_blank" rel="noopener noreferrer"' : ''}>${blog.title}</a>
                                                    <p class="related-item-description">${blog.description || ''}</p>
                                                    <div class="related-item-tags">
                                                         ${(blog.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                                    </div>
                                                </li>
                                            `).join('')}
                                        </ul>
                                    </div>`;
                            }

                            card.innerHTML = `
                                <div class="education-entry-header">
                                    <i class="fas fa-graduation-cap entry-icon"></i>
                                    <div class="education-title-group">
                                        <h2 class="degree-title">${entry.degree || 'N/A'}</h2>
                                        <p class="university-name">${entry.university || 'N/A'}</p>
                                    </div>
                                    <span class="graduation-year">${entry.year || 'N/A'}</span>
                                </div>
                                <div class="education-details">
                                    <p class="gpa-achievements">${entry.gpaAchievements || ''}</p>
                                    <p class="education-description">${entry.description || ''}</p>
                                </div>
                                ${relatedProjectsHTML}
                                ${relatedBlogsHTML}
                            `;
                            educationGridContainer.appendChild(card);
                        });
                    } else if (educationGridContainer.children.length > 0) {
                        // If using dynamic data source but it has no entries, clear static and show message
                        educationGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--light-gray);">No educational qualifications have been added yet. The admin can add entries via the admin panel.</p>';
                    }
                }
            } catch (e) {
                console.error("Error parsing education data from localStorage:", e);
                // showNotification("Error loading education data. Displaying defaults.", "error");
                // `useDynamicData` remains false, static content will be used.
            }
        }

        // If dynamic data was not successfully used, the static HTML content remains.
        // if (!useDynamicData) {
        //     showNotification("Displaying default education content.", "info");
        // }
    }
    
    loadEducationDisplayData();
});
