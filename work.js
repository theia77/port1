// experience.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with "Architect's Study" theme
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" }, // Primary: Muted Cadet Blue
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.05, sync: false } },
                size: { value: 2.5, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 170, color: "#D6C180", opacity: 0.18, width: 1 }, // Secondary: Muted Gold
                move: { enable: true, speed: 0.9, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 140, line_opacity: 0.2 } }
            },
            retina_detect: true
        });
    }

    // Initialize 3D abstract model (same as blog.js for consistency)
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 6); 
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createSimpleAbstract = () => { 
            const group = new THREE.Group();
            const geometry = new THREE.IcosahedronGeometry(1, 0);
            const material1 = new THREE.MeshBasicMaterial({ color: 0x8DA9C4, wireframe: true, transparent: true, opacity: 0.3 });
            const material2 = new THREE.MeshBasicMaterial({ color: 0xD6C180, wireframe: true, transparent: true, opacity: 0.25 });
            const material3 = new THREE.MeshBasicMaterial({ color: 0xCE7B69, wireframe: true, transparent: true, opacity: 0.2 });

            for (let i = 0; i < 15; i++) {
                let material = material1;
                if (i % 3 === 1) material = material2;
                if (i % 3 === 2) material = material3;
                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10 - 5);
                mesh.scale.setScalar(Math.random() * 0.3 + 0.1);
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                group.add(mesh);
            }
            scene.add(group);
            return group;
        };
        const abstractShapes = createSimpleAbstract();
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9); 
        scene.add(ambientLight);
        function animate() { 
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0001;
            if (abstractShapes) { abstractShapes.rotation.y = time * 0.5; abstractShapes.rotation.x = time * 0.3; }
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => { 
            camera.aspect = window.innerWidth / window.innerHeight; 
            camera.updateProjectionMatrix(); 
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    const currentYearElement = document.getElementById('current-year-experience');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.className = 'notification active'; 
            let iconClass = 'fas fa-check-circle';
            if (type === 'error') { notification.classList.add('error'); iconClass = 'fas fa-exclamation-circle';}
            else if (type === 'info') { notification.classList.add('info'); iconClass = 'fas fa-info-circle';}
            else { notification.classList.add('success'); }
            icon.className = iconClass;
            setTimeout(() => { notification.classList.remove('active'); }, 3500);
        }
    }

    function loadExperienceEntries() {
        const experienceDataString = localStorage.getItem('experiencePageData');
        const experienceGridContainer = document.getElementById('experience-grid-container');

        if (!experienceGridContainer) {
            console.error("Experience grid container not found.");
            return;
        }
        let useDynamicData = false;

        if (experienceDataString) {
            try {
                const experiencePageData = JSON.parse(experienceDataString);

                if (experiencePageData && experiencePageData.pageSettings) {
                    const pageMainTitleEl = document.getElementById('experience-page-main-title');
                    const pageHighlightTitleEl = document.getElementById('experience-page-highlight-title');
                    if (experiencePageData.pageSettings.title) {
                        const title = experiencePageData.pageSettings.title;
                        const lastSpaceIndex = title.lastIndexOf(' ');
                        if (pageMainTitleEl && pageHighlightTitleEl && lastSpaceIndex > -1 && lastSpaceIndex < title.length - 1) {
                            pageMainTitleEl.firstChild.nodeValue = title.substring(0, lastSpaceIndex + 1);
                            pageHighlightTitleEl.textContent = title.substring(lastSpaceIndex + 1);
                        } else if (pageMainTitleEl) {
                            pageMainTitleEl.firstChild.nodeValue = title;
                             if(pageHighlightTitleEl) pageHighlightTitleEl.textContent = "";
                        }
                    }
                    const pageDescEl = document.getElementById('experience-page-description');
                    if (pageDescEl && experiencePageData.pageSettings.description) {
                        pageDescEl.textContent = experiencePageData.pageSettings.description;
                    }
                }

                if (experiencePageData && experiencePageData.experienceEntries && Array.isArray(experiencePageData.experienceEntries) && experiencePageData.experienceEntries.length > 0) {
                    useDynamicData = true;
                    experienceGridContainer.innerHTML = ''; // Clear static fallback

                    experiencePageData.experienceEntries.forEach((entry, index) => {
                        const card = document.createElement('div');
                        card.className = 'experience-entry-card';
                        card.dataset.experienceId = entry.id || `exp-${index}`;
                        card.style.animationDelay = `${index * 0.1}s`;

                        let skillsHTML = '';
                        if (entry.skillsUsed && entry.skillsUsed.length > 0) {
                            skillsHTML = `
                                <div class="related-content-section">
                                    <h3><i class="fas fa-cogs"></i> Skills & Technologies Used</h3>
                                    <div class="skills-tags">
                                        ${entry.skillsUsed.map(skill => `<span class="tag">${skill}</span>`).join('')}
                                    </div>
                                </div>`;
                        }

                        let projectsHTML = '';
                        if (entry.relatedProjects && entry.relatedProjects.length > 0) {
                            projectsHTML = `
                                <div class="related-content-section">
                                    <h3><i class="fas fa-project-diagram"></i> Key Projects Involved</h3>
                                    <ul class="related-items-list">
                                        ${entry.relatedProjects.map(proj => `
                                            <li>
                                                <a href="${proj.url || '#'}" class="related-item-link" ${proj.url && !proj.url.startsWith('#') ? 'target="_blank" rel="noopener noreferrer"' : ''}>${proj.title}</a>
                                                <p class="related-item-description">${proj.description || ''}</p>
                                                <div class="related-item-tags">
                                                    ${(proj.tags || []).map(tag => `<span class="tag">${tag}</span>`).join('')}
                                                </div>
                                            </li>
                                        `).join('')}
                                    </ul>
                                </div>`;
                        }
                        
                        let responsibilitiesHTML = '';
                        if (entry.keyResponsibilities && entry.keyResponsibilities.length > 0) {
                            responsibilitiesHTML = `
                            <div class="key-responsibilities">
                                <h3>Key Achievements & Responsibilities:</h3>
                                <ul>
                                    ${entry.keyResponsibilities.map(resp => `<li>${resp}</li>`).join('')}
                                </ul>
                            </div>`;
                        }


                        card.innerHTML = `
                            <div class="experience-entry-header">
                                <i class="fas fa-briefcase entry-icon"></i>
                                <div class="experience-title-group">
                                    <h2 class="job-title">${entry.jobTitle || 'N/A'}</h2>
                                    <p class="company-name">${entry.companyName || 'N/A'}</p>
                                </div>
                                <span class="employment-dates">${entry.employmentDates || 'N/A'}</span>
                            </div>
                            <div class="experience-details">
                                <p class="job-description">${entry.jobDescription || ''}</p>
                                ${responsibilitiesHTML}
                            </div>
                            ${skillsHTML}
                            ${projectsHTML}
                        `;
                        experienceGridContainer.appendChild(card);
                    });
                } else if (experiencePageData && experiencePageData.experienceEntries && experiencePageData.experienceEntries.length === 0) {
                    useDynamicData = true;
                    experienceGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--gray);">No work experience has been added yet. The admin can add entries via the admin panel.</p>';
                }
            } catch (e) {
                console.error("Error parsing experience data from localStorage:", e);
                // showNotification("Error loading experience data. Displaying defaults.", "error");
            }
        }
        
        if (!useDynamicData && experienceGridContainer.children.length > 0) {
             Array.from(experienceGridContainer.children).forEach((card, index) => {
                if (card.classList.contains('experience-entry-card')) {
                    card.style.animationDelay = `${index * 0.1}s`;
                }
            });
            // showNotification("Displaying default experience content.", "info");
        } else if (!useDynamicData && experienceGridContainer.children.length === 0) {
            experienceGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--gray);">No work experience available at the moment.</p>';
        }
    }
    
    loadExperienceEntries();
});
