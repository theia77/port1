// projects.js - Enhanced with animations and advanced features v1.0.3
import { db, storage, auth } from './firebase-init.js';
import { 
    collection, getDocs, getDoc, doc, addDoc, updateDoc, deleteDoc, query, orderBy, limit, where, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { 
    ref, uploadBytes, getDownloadURL, deleteObject 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Global variables
let isAdmin = false;
let projectModal = null;
let allProjects = [];

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    setupDynamicBackground();
    updateCurrentYear();
    animateProjectsPage();
    loadProjectsData();
    setupMobileMenu();
    handleStickyHeader();
    setupProjectModal();
    setupFilterButtons();
    setupCaseStudyLinks();
    checkAdminStatus();

    const currentPage = window.location.pathname.split("/").pop() || "projects.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.2, random: true, anim: { enable: true, speed: 0.25, opacity_min: 0.05, sync: false } },
                size: { value: 2.2, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 170, color: "#D6C180", opacity: 0.12, width: 0.7 },
                move: { enable: true, speed: 0.9, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 130, line_opacity: 0.2 } }
            },
            retina_detect: true
        });
    }
}

function setupDynamicBackground() {
    // The dynamic background is handled by CSS animations
    // This function can be extended for more complex background animations if needed
}

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

function animateProjectsPage() {
    if (typeof gsap !== 'undefined') {
        gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
        gsap.from(".filter-btn", { 
            duration: 0.5, 
            y: 20, 
            opacity: 0, 
            stagger: 0.1, 
            ease: "power2.out",
            delay: 0.4
        });
        
        // Animate case studies section
        gsap.from(".case-studies-section h2", { 
            duration: 0.7, 
            y: 20, 
            opacity: 0, 
            ease: "power2.out",
            scrollTrigger: {
                trigger: ".case-studies-section",
                start: "top 80%"
            }
        });
        
        gsap.from(".section-description", { 
            duration: 0.7, 
            y: 20, 
            opacity: 0, 
            ease: "power2.out",
            delay: 0.2,
            scrollTrigger: {
                trigger: ".case-studies-section",
                start: "top 80%"
            }
        });
    }
}

function handleStickyHeader() {
    const header = document.getElementById('mainHeader');
    if (!header) return;
    
    const stickyOffset = 60; // Pixels from top to trigger sticky

    function toggleSticky() {
        if (window.pageYOffset > stickyOffset) {
            header.classList.add('sticky');
        } else {
            header.classList.remove('sticky');
        }
    }
    
    // Initial check in case page is loaded scrolled down
    toggleSticky();
    window.addEventListener('scroll', toggleSticky, { passive: true });
}

function setupMobileMenu() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (menuBtn && nav) {
        menuBtn.addEventListener('click', () => {
            menuBtn.classList.toggle('active');
            nav.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
        
        // Close menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuBtn.classList.remove('active');
                nav.classList.remove('active');
                document.body.classList.remove('menu-open');
            });
        });
    }
}

function setupFilterButtons() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    if (!filterBtns.length) return;
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter projects
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });
    });
}

function filterProjects(filter) {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        if (filter === 'all') {
            card.style.display = 'flex';
            // Re-animate the card
            card.style.animation = 'none';
            card.offsetHeight; // Trigger reflow
            card.style.animation = 'cardFadeInUp 0.6s ease-out forwards';
        } else {
            const categories = card.getAttribute('data-categories');
            if (categories && categories.includes(filter)) {
                card.style.display = 'flex';
                // Re-animate the card
                card.style.animation = 'none';
                card.offsetHeight; // Trigger reflow
                card.style.animation = 'cardFadeInUp 0.6s ease-out forwards';
            } else {
                card.style.display = 'none';
            }
        }
    });
}

function setupCaseStudyLinks() {
    const caseStudyLinks = document.querySelectorAll('.case-study-link');
    
    caseStudyLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            // For demonstration, we'll show a notification
            // In a real implementation, this would navigate to a detailed case study page
            showNotification('Case study feature coming soon!', 'info');
        });
    });
}

function createProjectCardHTML(project) {
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const imageUrl = project.imageUrl || `placeholder-project${Math.floor(Math.random() * 2) + 1}.jpg`;
    const hasLiveLink = project.liveLink && project.liveLink.trim() !== '';
    const categories = project.categories ? project.categories.join(',') : 'other';

    return `
        <div class="project-card" data-project-id="${project.id}" data-categories="${categories}">
            <div class="project-image-container">
                <img src="${imageUrl}" alt="${project.title}" class="project-image">
                <div class="project-image-overlay">
                    <a href="#" class="overlay-link project-details-link" data-project-id="${project.id}" aria-label="View Project Details">
                        <i class="fas fa-search-plus"></i>
                    </a>
                    ${hasLiveLink ? `<a href="${project.liveLink}" class="overlay-link project-live-link" target="_blank" rel="noopener noreferrer" aria-label="View Live Project"><i class="fas fa-external-link-alt"></i></a>` : ''}
                    ${isAdmin ? `<a href="#" class="overlay-link project-edit-link" data-project-id="${project.id}" aria-label="Edit Project"><i class="fas fa-edit"></i></a>` : ''}
                </div>
            </div>
            <div class="project-content">
                <h3 class="project-title">${project.title}</h3>
                <p class="project-excerpt">${project.excerpt}</p>
                <div class="project-tags">${tagsHTML}</div>
            </div>
        </div>
    `;
}

async function loadProjectsData() {
    const gridContainer = document.getElementById('projects-grid-container');
    if (!gridContainer) return;

    try {
        const projectsCol = collection(db, 'projects');
        const q = query(projectsCol, orderBy('dateCompleted', 'desc'), limit(12));
        const projectsSnapshot = await getDocs(q);
        const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        allProjects = projectsList; // Store all projects for filtering

        if (projectsList.length > 0) {
            gridContainer.innerHTML = ''; // Clear static fallback
            projectsList.forEach(project => {
                gridContainer.innerHTML += createProjectCardHTML(project);
            });
            
            // Add event listeners to the newly created elements
            setupProjectDetailLinks();
            if (isAdmin) {
                setupProjectEditLinks();
            }
        } else {
            // If no projects found in database, keep the static examples
            // But still animate them
            const staticCards = document.querySelectorAll('.project-card');
            if (staticCards.length > 0 && typeof gsap !== 'undefined') {
                gsap.from(staticCards, { 
                    duration: 0.6, 
                    y: 30, 
                    opacity: 0, 
                    stagger: 0.15, 
                    ease: "power3.out", 
                    delay: 0.5
                });
            }
        }
    } catch (error) {
        console.error("Error loading projects data: ", error);
        showNotification("Error loading projects. Please try again later.", "error");
        
        // Animate static fallback cards
        const staticCards = document.querySelectorAll('.project-card');
        if (staticCards.length > 0 && typeof gsap !== 'undefined') {
            gsap.from(staticCards, { 
                duration: 0.6, 
                y: 30, 
                opacity: 0, 
                stagger: 0.15, 
                ease: "power3.out", 
                delay: 0.5
            });
        }
    }
}

function setupProjectModal() {
    projectModal = document.getElementById('project-details-modal');
    if (!projectModal) return;
    
    // Close modal when clicking on X
    const closeBtn = projectModal.querySelector('.close-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            projectModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside of it
    window.addEventListener('click', (e) => {
        if (e.target === projectModal) {
            projectModal.style.display = 'none';
        }
    });
}

function setupProjectDetailLinks() {
    const detailLinks = document.querySelectorAll('.project-details-link');
    detailLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project-id');
            if (projectId) {
                await showProjectDetails(projectId);
            }
        });
    });
}

function setupProjectEditLinks() {
    const editLinks = document.querySelectorAll('.project-edit-link');
    editLinks.forEach(link => {
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project-id');
            if (projectId) {
                await showEditProjectForm(projectId);
            }
        });
    });
}

async function showProjectDetails(projectId) {
    try {
        let project;
        
        // Check if it's a static example
        if (projectId.startsWith('static-')) {
            // Use static data for demo
            if (projectId === 'static-proj-1') {
                project = {
                    id: 'static-proj-1',
                    title: 'Bridge Health AI Monitoring',
                    excerpt: 'Developed an AI platform using computer vision and sensor data fusion to predict structural issues in bridges, improving safety and maintenance efficiency.',
                    description: 'This innovative system combines computer vision algorithms with IoT sensor data to create a comprehensive bridge health monitoring solution. The AI model was trained on thousands of images of bridge defects and can detect cracks, corrosion, and structural anomalies with high accuracy. The system provides real-time alerts and detailed reports to maintenance teams, enabling proactive repairs and reducing maintenance costs.',
                    imageUrl: 'placeholder-project1.jpg',
                    dateCompleted: new Date('2025-03-15'),
                    client: 'Metropolitan Infrastructure Department',
                    duration: '6 months',
                    tags: ['AI', 'Computer Vision', 'Python', 'IoT', 'Structural Health'],
                    liveLink: '#',
                    codeLink: '#',
                    categories: ['ai', 'civil'],
                    metrics: {
                        accuracyRate: '92%',
                        costReduction: '35%',
                        implementationTime: '4 months',
                        maintenanceEfficiency: '68% improvement'
                    },
                    timeline: [
                        { date: 'October 2024', milestone: 'Project initiation and requirements gathering' },
                        { date: 'November 2024', milestone: 'Data collection and sensor installation' },
                        { date: 'January 2025', milestone: 'AI model development and training' },
                        { date: 'February 2025', milestone: 'Integration with existing infrastructure systems' },
                        { date: 'March 2025', milestone: 'Testing, deployment, and handover' }
                    ]
                };
            } else if (projectId === 'static-proj-2') {
                project = {
                    id: 'static-proj-2',
                    title: 'Smart City Traffic Flow Optimization',
                    excerpt: 'Utilized machine learning algorithms to analyze traffic patterns and optimize signal timings, reducing congestion in urban areas.',
                    description: 'This project involved developing a machine learning system that analyzes real-time traffic data from cameras and sensors to dynamically adjust traffic signal timings. The system optimizes traffic flow based on current conditions, reducing congestion and commute times. The solution was implemented in a busy downtown area and has significantly improved traffic efficiency.',
                    imageUrl: 'placeholder-project2.jpg',
                    dateCompleted: new Date('2025-02-20'),
                    client: 'City Transportation Authority',
                    duration: '5 months',
                    tags: ['Machine Learning', 'Smart City', 'Data Analysis', 'Simulation'],
                    categories: ['data-science', 'smart-city'],
                    metrics: {
                        congestionReduction: '28%',
                        commuteTimeReduction: '12 minutes',
                        fuelSavings: '22%',
                        carbonEmissionReduction: '18%'
                    },
                    timeline: [
                        { date: 'September 2024', milestone: 'Project kickoff and data collection' },
                        { date: 'October 2024', milestone: 'Traffic pattern analysis and modeling' },
                        { date: 'December 2024', milestone: 'Algorithm development and simulation' },
                        { date: 'January 2025', milestone: 'Pilot implementation and testing' },
                        { date: 'February 2025', milestone: 'Full deployment and optimization' }
                    ]
                };
            }
        } else {
            // Fetch from Firestore
            const projectDoc = await getDoc(doc(db, 'projects', projectId));
            if (!projectDoc.exists()) {
                throw new Error('Project not found');
            }
            project = { id: projectDoc.id, ...projectDoc.data() };
        }
        
        if (project) {
            // Format date if available
            let dateStr = '';
            if (project.dateCompleted) {
                const date = project.dateCompleted.toDate ? project.dateCompleted.toDate() : new Date(project.dateCompleted);
                dateStr = date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
            }
            
            // Build tags HTML
            const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
            
            // Build links HTML
            let linksHTML = '';
            if (project.liveLink) {
                linksHTML += `<a href="${project.liveLink}" class="project-detail-link" target="_blank" rel="noopener noreferrer">
                    <i class="fas fa-external-link-alt"></i> View Live
                </a>`;
            }
            if (project.codeLink) {
                linksHTML += `<a href="${project.codeLink}" class="project-detail-link" target="_blank" rel="noopener noreferrer">
                    <i class="fab fa-github"></i> View Code
                </a>`;
            }
            
            // Build metrics HTML if available
            let metricsHTML = '';
            if (project.metrics) {
                metricsHTML = `
                    <div class="project-analysis">
                        <h3>Project Impact & Metrics</h3>
                        <div class="analysis-grid">
                            ${Object.entries(project.metrics).map(([key, value]) => `
                                <div class="analysis-item">
                                    <div class="analysis-number">${value}</div>
                                    <div class="analysis-label">${formatMetricLabel(key)}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Build timeline HTML if available
            let timelineHTML = '';
            if (project.timeline && project.timeline.length > 0) {
                timelineHTML = `
                    <div class="project-timeline">
                        <h3>Project Timeline</h3>
                        <div class="timeline-container">
                            ${project.timeline.map(item => `
                                <div class="timeline-item">
                                    <div class="timeline-date">${item.date}</div>
                                    <div class="timeline-content">${item.milestone}</div>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `;
            }
            
            // Build modal content
            const modalContent = document.getElementById('project-modal-content');
            if (modalContent) {
                modalContent.innerHTML = `
                    <div class="project-detail-header">
                        <img src="${project.imageUrl || 'placeholder-project1.jpg'}" alt="${project.title}">
                        <div class="project-detail-header-overlay">
                            <h2 class="project-detail-title">${project.title}</h2>
                        </div>
                    </div>
                    <div class="project-detail-content">
                        <div class="project-detail-meta">
                            ${dateStr ? `<span><i class="far fa-calendar-alt"></i> ${dateStr}</span>` : ''}
                            ${project.client ? `<span><i class="far fa-building"></i> ${project.client}</span>` : ''}
                            ${project.duration ? `<span><i class="far fa-clock"></i> ${project.duration}</span>` : ''}
                        </div>
                        <div class="project-detail-description">
                            ${project.description || project.excerpt}
                        </div>
                        <div class="project-detail-tags">
                            ${tagsHTML}
                        </div>
                        <div class="project-detail-links">
                            ${linksHTML}
                        </div>
                        ${metricsHTML}
                        ${timelineHTML}
                    </div>
                `;
                
                // Show the modal
                projectModal.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error fetching project details:", error);
        showNotification("Error loading project details.", "error");
    }
}

function formatMetricLabel(key) {
    // Convert camelCase to Title Case with spaces
    return key
        .replace(/([A-Z])/g, ' $1') // Insert a space before all capital letters
        .replace(/^./, str => str.toUpperCase()) // Capitalize the first letter
        .trim();
}

function checkAdminStatus() {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Check if user has admin role (you might have a different way to check this)
            isAdmin = true; // This should be determined by your authentication logic
            
            // If admin, add admin UI elements
            if (isAdmin) {
                addAdminUI();
            }
        } else {
            isAdmin = false;
        }
    });
}

function addAdminUI() {
    // Add "Add Project" button to the page
    const projectsMain = document.querySelector('.projects-main');
    if (projectsMain) {
        const pageHeader = projectsMain.querySelector('.page-header');
        if (pageHeader) {
            const adminControls = document.createElement('div');
            adminControls.className = 'admin-controls';
            adminControls.innerHTML = `
                <button id="add-project-btn" class="admin-btn">
                    <i class="fas fa-plus"></i> Add New Project
                </button>
            `;
            pageHeader.appendChild(adminControls);
            
            // Add event listener to the button
            const addProjectBtn = document.getElementById('add-project-btn');
            if (addProjectBtn) {
                addProjectBtn.addEventListener('click', showAddProjectForm);
            }
        }
    }
}

async function showAddProjectForm() {
    // Create a modal for adding a new project
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.id = 'add-project-modal';
    
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <h2>Add New Project</h2>
                <form id="add-project-form">
                    <div class="form-group">
                        <label for="project-title">Title</label>
                        <input type="text" id="project-title" name="title" required>
                    </div>
                    <div class="form-group">
                        <label for="project-excerpt">Short Description</label>
                        <textarea id="project-excerpt" name="excerpt" rows="2" required></textarea>
                    </div>
                    <div class="form-group">
                        <label for="project-description">Full Description</label>
                        <textarea id="project-description" name="description" rows="5"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="project-tags">Tags (comma separated)</label>
                        <input type="text" id="project-tags" name="tags">
                    </div>
                    <div class="form-group">
                        <label for="project-categories">Categories (comma separated)</label>
                        <input type="text" id="project-categories" name="categories" placeholder="e.g., ai,civil,data-science,smart-city">
                    </div>
                    <div class="form-group">
                        <label for="project-image">Project Image</label>
                        <input type="file" id="project-image" name="image" accept="image/*">
                    </div>
                    <div class="form-group">
                        <label for="project-live-link">Live Project URL (optional)</label>
                        <input type="url" id="project-live-link" name="liveLink">
                    </div>
                    <div class="form-group">
                        <label for="project-code-link">Code Repository URL (optional)</label>
                        <input type="url" id="project-code-link" name="codeLink">
                    </div>
                    <div class="form-group">
                        <label for="project-client">Client (optional)</label>
                        <input type="text" id="project-client" name="client">
                    </div>
                    <div class="form-group">
                        <label for="project-duration">Duration (optional)</label>
                        <input type="text" id="project-duration" name="duration">
                    </div>
                    <div class="form-group">
                        <label for="project-date">Completion Date</label>
                        <input type="date" id="project-date" name="dateCompleted">
                    </div>
                    <div class="form-actions">
                        <button type="submit" class="submit-btn">Add Project</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Close modal functionality
    const closeBtn = modal.querySelector('.close-modal');
    const cancelBtn = modal.querySelector('.cancel-btn');
    
    closeBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    cancelBtn.addEventListener('click', () => {
        document.body.removeChild(modal);
    });
    
    // Close when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
    
    // Form submission
    const form = document.getElementById('add-project-form');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loading state
        const submitBtn = form.querySelector('.submit-btn');
        const originalBtnText = submitBtn.textContent;
        submitBtn.textContent = 'Adding...';
        submitBtn.disabled = true;
        
        try {
            // Get form data
            const formData = new FormData(form);
            const projectData = {
                title: formData.get('title'),
                excerpt: formData.get('excerpt'),
                description: formData.get('description'),
                tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                categories: formData.get('categories').split(',').map(cat => cat.trim()).filter(cat => cat),
                liveLink: formData.get('liveLink'),
                codeLink: formData.get('codeLink'),
                client: formData.get('client'),
                duration: formData.get('duration'),
                dateCompleted: formData.get('dateCompleted') ? new Date(formData.get('dateCompleted')) : new Date(),
                createdAt: serverTimestamp()
            };
            
            // Handle image upload
            const imageFile = formData.get('image');
            if (imageFile && imageFile.name) {
                const storageRef = ref(storage, `project-images/${Date.now()}_${imageFile.name}`);
                await uploadBytes(storageRef, imageFile);
                const imageUrl = await getDownloadURL(storageRef);
                projectData.imageUrl = imageUrl;
            }
            
            // Add to Firestore
            await addDoc(collection(db, 'projects'), projectData);
            
            // Success notification and reload projects
            showNotification('Project added successfully!', 'success');
            document.body.removeChild(modal);
            loadProjectsData(); // Reload projects to show the new one
            
        } catch (error) {
            console.error('Error adding project:', error);
            showNotification('Error adding project. Please try again.', 'error');
            submitBtn.textContent = originalBtnText;
            submitBtn.disabled = false;
        }
    });
}

async function showEditProjectForm(projectId) {
    try {
        // Fetch project data
        const projectDoc = await getDoc(doc(db, 'projects', projectId));
        if (!projectDoc.exists()) {
            showNotification('Project not found.', 'error');
            return;
        }
        
        const project = { id: projectDoc.id, ...projectDoc.data() };
        
        // Format date for input field
        let dateValue = '';
        if (project.dateCompleted) {
            const date = project.dateCompleted.toDate ? project.dateCompleted.toDate() : new Date(project.dateCompleted);
            dateValue = date.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        }
        
        // Create modal
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.id = 'edit-project-modal';
        
        modal.innerHTML = `
            <div class="modal-content">
                <span class="close-modal">&times;</span>
                <div class="modal-body">
                    <h2>Edit Project</h2>
                    <form id="edit-project-form">
                        <div class="form-group">
                            <label for="edit-project-title">Title</label>
                            <input type="text" id="edit-project-title" name="title" value="${project.title || ''}" required>
                        </div>
                        <div class="form-group">
                            <label for="edit-project-excerpt">Short Description</label>
                            <textarea id="edit-project-excerpt" name="excerpt" rows="2" required>${project.excerpt || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-project-description">Full Description</label>
                            <textarea id="edit-project-description" name="description" rows="5">${project.description || ''}</textarea>
                        </div>
                        <div class="form-group">
                            <label for="edit-project-tags">Tags (comma separated)</label>
                            <input type="text" id="edit-project-tags" name="tags" value="${project.tags ? project.tags.join(', ') : ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-categories">Categories (comma separated)</label>
                            <input type="text" id="edit-project-categories" name="categories" value="${project.categories ? project.categories.join(', ') : ''}">
                        </div>
                        <div class="form-group">
                            <label>Current Image</label>
                            ${project.imageUrl ? `<img src="${project.imageUrl}" alt="Current project image" class="preview-image">` : '<p>No image uploaded</p>'}
                        </div>
                        <div class="form-group">
                            <label for="edit-project-image">Change Project Image</label>
                            <input type="file" id="edit-project-image" name="image" accept="image/*">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-live-link">Live Project URL (optional)</label>
                            <input type="url" id="edit-project-live-link" name="liveLink" value="${project.liveLink || ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-code-link">Code Repository URL (optional)</label>
                            <input type="url" id="edit-project-code-link" name="codeLink" value="${project.codeLink || ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-client">Client (optional)</label>
                            <input type="text" id="edit-project-client" name="client" value="${project.client || ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-duration">Duration (optional)</label>
                            <input type="text" id="edit-project-duration" name="duration" value="${project.duration || ''}">
                        </div>
                        <div class="form-group">
                            <label for="edit-project-date">Completion Date</label>
                            <input type="date" id="edit-project-date" name="dateCompleted" value="${dateValue}">
                        </div>
                        <div class="form-actions">
                            <button type="submit" class="submit-btn">Update Project</button>
                            <button type="button" class="delete-btn">Delete Project</button>
                            <button type="button" class="cancel-btn">Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        modal.style.display = 'block';
        
        // Close modal functionality
        const closeBtn = modal.querySelector('.close-modal');
        const cancelBtn = modal.querySelector('.cancel-btn');
        
        closeBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        cancelBtn.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        
        // Close when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
        
        // Delete functionality
        const deleteBtn = modal.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', async () => {
            if (confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
                try {
                    // Delete the project image from storage if it exists
                    if (project.imageUrl) {
                        try {
                            const imageRef = ref(storage, project.imageUrl);
                            await deleteObject(imageRef);
                        } catch (storageError) {
                            console.error('Error deleting image:', storageError);
                            // Continue with project deletion even if image deletion fails
                        }
                    }
                    
                    // Delete the project document
                    await deleteDoc(doc(db, 'projects', projectId));
                    
                    showNotification('Project deleted successfully!', 'success');
                    document.body.removeChild(modal);
                    loadProjectsData(); // Reload projects to reflect deletion
                } catch (error) {
                    console.error('Error deleting project:', error);
                    showNotification('Error deleting project. Please try again.', 'error');
                }
            }
        });
        
        // Form submission for updates
        const form = document.getElementById('edit-project-form');
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Show loading state
            const submitBtn = form.querySelector('.submit-btn');
            const originalBtnText = submitBtn.textContent;
            submitBtn.textContent = 'Updating...';
            submitBtn.disabled = true;
            
            try {
                // Get form data
                const formData = new FormData(form);
                const projectData = {
                    title: formData.get('title'),
                    excerpt: formData.get('excerpt'),
                    description: formData.get('description'),
                    tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag),
                    categories: formData.get('categories').split(',').map(cat => cat.trim()).filter(cat => cat),
                    liveLink: formData.get('liveLink'),
                    codeLink: formData.get('codeLink'),
                    client: formData.get('client'),
                    duration: formData.get('duration'),
                    updatedAt: serverTimestamp()
                };
                
                // Handle date
                if (formData.get('dateCompleted')) {
                    projectData.dateCompleted = new Date(formData.get('dateCompleted'));
                }
                
                // Handle image upload if a new image is selected
                const imageFile = formData.get('image');
                if (imageFile && imageFile.name) {
                    // Delete old image if it exists
                    if (project.imageUrl) {
                        try {
                            const oldImageRef = ref(storage, project.imageUrl);
                            await deleteObject(oldImageRef);
                        } catch (storageError) {
                            console.error('Error deleting old image:', storageError);
                            // Continue with update even if old image deletion fails
                        }
                    }
                    
                    // Upload new image
                    const storageRef = ref(storage, `project-images/${Date.now()}_${imageFile.name}`);
                    await uploadBytes(storageRef, imageFile);
                    const imageUrl = await getDownloadURL(storageRef);
                    projectData.imageUrl = imageUrl;
                }
                
                // Update Firestore
                await updateDoc(doc(db, 'projects', projectId), projectData);
                
                // Success notification and reload projects
                showNotification('Project updated successfully!', 'success');
                document.body.removeChild(modal);
                loadProjectsData(); // Reload projects to show updates
                
            } catch (error) {
                console.error('Error updating project:', error);
                showNotification('Error updating project. Please try again.', 'error');
                submitBtn.textContent = originalBtnText;
                submitBtn.disabled = false;
            }
        });
        
    } catch (error) {
        console.error('Error loading project for editing:', error);
        showNotification('Error loading project data. Please try again.', 'error');
    }
}

function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    if (!notification) return;
    
    const notificationMessage = document.getElementById('notification-message');
    if (notificationMessage) {
        notificationMessage.textContent = message;
    }
    
    // Remove existing classes and add the appropriate one
    notification.classList.remove('success', 'error', 'info');
    notification.classList.add(type);
    notification.classList.add('active');
    
    // Update icon based on type
    const icon = notification.querySelector('i');
    if (icon) {
        icon.className = ''; // Clear existing classes
        if (type === 'success') {
            icon.className = 'fas fa-check-circle';
        } else if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
        } else {
            icon.className = 'fas fa-info-circle';
        }
    }
    
    // Hide notification after 5 seconds
    setTimeout(() => {
        notification.classList.remove('active');
    }, 5000);
}
