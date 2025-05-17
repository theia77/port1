// education.js - Enhanced with admin functionality
import { db, auth } from './firebase-init.js';
import { 
    collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc, query, orderBy, 
    onSnapshot, serverTimestamp 
} from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";

// Global variables
let isAdmin = false;
let pageContentRef = null;
let unsubscribeEducation = null;
let unsubscribePageContent = null;

// Initialize the page
function initPage() {
    initParticles();
    initBackgroundAnimation();
    updateCurrentYear();
    animateEducationPage();
    setupEventListeners();
    checkAuthState();
    
    // Set active navigation link
    const currentPage = window.location.pathname.split("/").pop() || "education.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialize particles background
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 800 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true },
                size: { value: 2.5, random: true },
                line_linked: { enable: true, distance: 180, color: "#D6C180", opacity: 0.2, width: 1 },
                move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 120, line_opacity: 0.3 } }
            },
            retina_detect: true
        });
    }
}

// Initialize animated background
function initBackgroundAnimation() {
    // Create 3D bridge model background using Three.js
    if (typeof THREE !== 'undefined') {
        const container = document.getElementById('bridge-model-bg');
        if (!container) return;
        
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);
        container.appendChild(renderer.domElement);
        
        // Create a simple architectural structure
        const geometry = new THREE.BoxGeometry(1, 0.05, 3);
        const material = new THREE.MeshBasicMaterial({ 
            color: 0x8DA9C4,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const bridge = new THREE.Mesh(geometry, material);
        scene.add(bridge);
        
        // Add columns
        for (let i = -1; i <= 1; i += 2) {
            const columnGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.5, 8);
            const column = new THREE.Mesh(columnGeo, material);
            column.position.set(i * 0.4, -0.25, 0);
            bridge.add(column);
        }
        
        // Add some random architectural elements
        for (let i = 0; i < 10; i++) {
            const elementGeo = new THREE.BoxGeometry(0.1, 0.1, 0.1);
            const element = new THREE.Mesh(elementGeo, material);
            element.position.set(
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2,
                (Math.random() - 0.5) * 2
            );
            scene.add(element);
        }
        
        camera.position.z = 5;
        
        // Animation
        function animate() {
            requestAnimationFrame(animate);
            
            bridge.rotation.x += 0.001;
            bridge.rotation.y += 0.002;
            
            renderer.render(scene, camera);
        }
        
        animate();
        
        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
}

// Update copyright year
function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}

// Animate education page elements
function animateEducationPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Cards will be animated after loading
}

// Set up event listeners
function setupEventListeners() {
    // Admin controls
    document.getElementById('add-education-btn')?.addEventListener('click', openAddEducationModal);
    document.getElementById('edit-page-content-btn')?.addEventListener('click', openEditPageContentModal);
    
    // Modal close buttons
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    document.querySelectorAll('.cancel-btn').forEach(btn => {
        btn.addEventListener('click', closeAllModals);
    });
    
    // Form submissions
    document.getElementById('education-form')?.addEventListener('submit', handleEducationFormSubmit);
    document.getElementById('page-content-form')?.addEventListener('submit', handlePageContentFormSubmit);
    
    // Add project/course buttons
    document.getElementById('add-project-btn')?.addEventListener('click', addProjectField);
    document.getElementById('add-course-btn')?.addEventListener('click', addCourseField);
}

// Check authentication state
function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        isAdmin = !!user;
        if (isAdmin) {
            showAdminControls();
            loadRealTimeData();
        } else {
            hideAdminControls();
            loadStaticData();
        }
    });
}

// Show admin controls
function showAdminControls() {
    const adminControls = document.getElementById('admin-controls');
    if (adminControls) {
        adminControls.classList.add('visible');
    }
    
    document.querySelectorAll('.admin-buttons').forEach(btn => {
        btn.classList.add('visible');
    });
}

// Hide admin controls
function hideAdminControls() {
    const adminControls = document.getElementById('admin-controls');
    if (adminControls) {
        adminControls.classList.remove('visible');
    }
    
    document.querySelectorAll('.admin-buttons').forEach(btn => {
        btn.classList.remove('visible');
    });
}

// Load real-time data with Firestore listeners
function loadRealTimeData() {
    // Unsubscribe from previous listeners if they exist
    if (unsubscribeEducation) unsubscribeEducation();
    if (unsubscribePageContent) unsubscribePageContent();
    
    // Listen for education collection changes
    const eduCol = collection(db, 'education');
    const q = query(eduCol, orderBy('year', 'desc'));
    unsubscribeEducation = onSnapshot(q, (snapshot) => {
        const eduList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderEducationEntries(eduList);
    }, (error) => {
        console.error("Error loading education data: ", error);
        showNotification('Error loading education data', 'error');
    });
    
    // Listen for page content changes
    pageContentRef = doc(db, 'pageContent', 'education');
    unsubscribePageContent = onSnapshot(pageContentRef, (docSnap) => {
        if (docSnap.exists()) {
            updatePageContent(docSnap.data());
        } else {
            // Create default page content if it doesn't exist
            createDefaultPageContent();
        }
    }, (error) => {
        console.error("Error loading page content: ", error);
    });
}

// Load static data once
async function loadStaticData() {
    try {
        // Get education data
        const eduCol = collection(db, 'education');
        const q = query(eduCol, orderBy('year', 'desc'));
        const eduSnapshot = await getDocs(q);
        const eduList = eduSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderEducationEntries(eduList);
        
        // Get page content
        pageContentRef = doc(db, 'pageContent', 'education');
        const pageContentSnap = await getDoc(pageContentRef);
        if (pageContentSnap.exists()) {
            updatePageContent(pageContentSnap.data());
        }
    } catch (error) {
        console.error("Error loading static data: ", error);
        showNotification('Error loading data', 'error');
    }
}

// Create default page content if it doesn't exist
async function createDefaultPageContent() {
    try {
        const defaultContent = {
            mainTitle: 'Academic',
            highlightTitle: 'Journey',
            description: 'An overview of my educational qualifications, key research, and academic contributions.',
            lastUpdated: serverTimestamp()
        };
        
        await updateDoc(pageContentRef, defaultContent);
    } catch (error) {
        console.error("Error creating default page content: ", error);
    }
}

// Update page content in the DOM
function updatePageContent(content) {
    if (!content) return;
    
    const mainTitleEl = document.getElementById('education-page-main-title');
    const highlightTitleEl = document.getElementById('education-page-highlight-title');
    const descriptionEl = document.getElementById('education-page-description');
    
    if (mainTitleEl && content.mainTitle) {
        mainTitleEl.innerHTML = `${content.mainTitle} <span class="highlight" id="education-page-highlight-title">${content.highlightTitle || 'Journey'}</span>`;
    }
    
    if (highlightTitleEl && content.highlightTitle) {
        highlightTitleEl.textContent = content.highlightTitle;
    }
    
    if (descriptionEl && content.description) {
        descriptionEl.textContent = content.description;
    }
}

// Render education entries in the DOM
function renderEducationEntries(eduList) {
    const gridContainer = document.getElementById('education-grid-container');
    if (!gridContainer) return;
    
    if (eduList.length > 0) {
        gridContainer.innerHTML = ''; // Clear container
        
        eduList.forEach((eduItem, index) => {
            const educationCard = document.createElement('div');
            educationCard.className = 'education-entry-card';
            educationCard.dataset.educationId = eduItem.id;
            educationCard.innerHTML = createEducationCardHTML(eduItem);
            
            // Add animation delay based on index
            educationCard.style.animationDelay = `${0.1 + (index * 0.1)}s`;
            
            gridContainer.appendChild(educationCard);
            
            // Add event listeners to admin buttons if admin is logged in
            if (isAdmin) {
                const editBtn = educationCard.querySelector('.edit-btn');
                const deleteBtn = educationCard.querySelector('.delete-btn');
                
                if (editBtn) {
                    editBtn.addEventListener('click', () => openEditEducationModal(eduItem.id));
                }
                
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => confirmDeleteEducation(eduItem.id));
                }
            }
        });
    } else {
        // Show a message or fallback content
        gridContainer.innerHTML = `
            <div class="education-entry-card" style="text-align: center;">
                <p>No education entries found. Add your first education entry!</p>
                ${isAdmin ? '<button id="add-first-entry-btn" class="admin-btn" style="margin: 1rem auto;"><i class="fas fa-plus"></i> Add Education</button>' : ''}
            </div>
        `;
        
        // Add event listener to the "Add First Entry" button
        const addFirstEntryBtn = document.getElementById('add-first-entry-btn');
        if (addFirstEntryBtn) {
            addFirstEntryBtn.addEventListener('click', openAddEducationModal);
        }
    }
}

// Create HTML for an education card
function createEducationCardHTML(edu) {
    const projectsHTML = edu.relatedProjects && edu.relatedProjects.length > 0 ? `
        <div class="related-content-section">
            <h3><i class="fas fa-flask"></i> Key Research & Projects</h3>
            <ul class="related-items-list">
                ${edu.relatedProjects.map(proj => `
                    <li>
                        <a href="${proj.link || '#'}" class="related-item-link" ${proj.link ? 'target="_blank" rel="noopener noreferrer"' : ''}>${proj.title}</a>
                        <p class="related-item-description">${proj.description || ''}</p>
                        <div class="related-item-tags">${proj.tags ? proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}</div>
                    </li>
                `).join('')}
            </ul>
        </div>` : '';
    
    const courseworkHTML = edu.relevantCoursework && edu.relevantCoursework.length > 0 ? `
        <div class="related-content-section">
            <h3><i class="fas fa-book-open"></i> Relevant Coursework</h3>
            <ul class="related-items-list">
                ${edu.relevantCoursework.map(course => `
                    <li>
                        <span class="related-item-link-static">${course.title}</span>
                        <p class="related-item-description">${course.description || ''}</p>
                         ${course.tags ? `<div class="related-item-tags">${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>` : '';

    const adminButtonsHTML = isAdmin ? `
        <div class="admin-buttons visible">
            <button class="edit-btn"><i class="fas fa-edit"></i> Edit</button>
            <button class="delete-btn"><i class="fas fa-trash"></i> Delete</button>
        </div>
    ` : '';

    return `
        <div class="education-entry-header">
            <i class="fas ${edu.icon || 'fa-university'} entry-icon"></i>
            <div class="education-title-group">
                <h2 class="degree-title">${edu.degree}</h2>
                <p class="university-name">${edu.institution}</p>
            </div>
            <span class="graduation-year">${edu.year}</span>
        </div>
        <div class="education-details">
            <p class="gpa-achievements">${edu.achievements || ''}</p>
            <p class="education-description">${edu.description || ''}</p>
        </div>
        ${projectsHTML}
        ${courseworkHTML}
        ${adminButtonsHTML}
    `;
}

// Open modal to add a new education entry
function openAddEducationModal() {
    const modal = document.getElementById('education-modal');
    const modalTitle = document.getElementById('modal-title');
    const form = document.getElementById('education-form');
    
    if (modal && form) {
        // Reset form
        form.reset();
        document.getElementById('education-id').value = '';
        document.getElementById('projects-container').innerHTML = '';
        document.getElementById('coursework-container').innerHTML = '';
        
        // Add empty project and course fields
        addProjectField();
        addCourseField();
        
        // Set modal title
        if (modalTitle) modalTitle.textContent = 'Add Education';
        
        // Show modal
        modal.style.display = 'block';
    }
}

// Open modal to edit an existing education entry
async function openEditEducationModal(educationId) {
    try {
        const educationRef = doc(db, 'education', educationId);
        const educationSnap = await getDoc(educationRef);
        
        if (educationSnap.exists()) {
            const educationData = educationSnap.data();
            
            const modal = document.getElementById('education-modal');
            const modalTitle = document.getElementById('modal-title');
            const form = document.getElementById('education-form');
            
            if (modal && form) {
                // Reset form
                form.reset();
                
                // Set form values
                document.getElementById('education-id').value = educationId;
                document.getElementById('degree').value = educationData.degree || '';
                document.getElementById('institution').value = educationData.institution || '';
                document.getElementById('year').value = educationData.year || '';
                document.getElementById('icon').value = educationData.icon || 'fa-university';
                document.getElementById('achievements').value = educationData.achievements || '';
                document.getElementById('description').value = educationData.description || '';
                
                // Clear containers
                document.getElementById('projects-container').innerHTML = '';
                document.getElementById('coursework-container').innerHTML = '';
                
                // Add project fields
                if (educationData.relatedProjects && educationData.relatedProjects.length > 0) {
                    educationData.relatedProjects.forEach(project => {
                        addProjectField(project);
                    });
                } else {
                    addProjectField();
                }
                
                // Add course fields
                if (educationData.relevantCoursework && educationData.relevantCoursework.length > 0) {
                    educationData.relevantCoursework.forEach(course => {
                        addCourseField(course);
                    });
                } else {
                    addCourseField();
                }
                
                // Set modal title
                if (modalTitle) modalTitle.textContent = 'Edit Education';
                
                // Show modal
                modal.style.display = 'block';
            }
        } else {
            showNotification('Education entry not found', 'error');
        }
    } catch (error) {
        console.error("Error opening edit modal: ", error);
        showNotification('Error loading education data', 'error');
    }
}

// Add a project field to the form
function addProjectField(projectData = null) {
    const container = document.getElementById('projects-container');
    if (!container) return;
    
    const projectIndex = container.children.length;
    const projectItem = document.createElement('div');
    projectItem.className = 'project-item';
    
    projectItem.innerHTML = `
        <button type="button" class="remove-item"><i class="fas fa-times"></i></button>
        <div class="form-group">
            <label for="project-title-${projectIndex}">Project Title</label>
            <input type="text" id="project-title-${projectIndex}" name="project-title-${projectIndex}" value="${projectData?.title || ''}">
        </div>
        <div class="form-group">
            <label for="project-description-${projectIndex}">Description</label>
            <textarea id="project-description-${projectIndex}" name="project-description-${projectIndex}" rows="2">${projectData?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="project-link-${projectIndex}">Link (optional)</label>
            <input type="text" id="project-link-${projectIndex}" name="project-link-${projectIndex}" value="${projectData?.link || ''}">
        </div>
        <div class="form-group">
            <label for="project-tags-${projectIndex}">Tags (comma separated)</label>
            <input type="text" id="project-tags-${projectIndex}" name="project-tags-${projectIndex}" value="${projectData?.tags ? projectData.tags.join(', ') : ''}">
        </div>
    `;
    
    container.appendChild(projectItem);
    
    // Add event listener to remove button
    const removeBtn = projectItem.querySelector('.remove-item');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            container.removeChild(projectItem);
        });
    }
}

// Add a course field to the form
function addCourseField(courseData = null) {
    const container = document.getElementById('coursework-container');
    if (!container) return;
    
    const courseIndex = container.children.length;
    const courseItem = document.createElement('div');
    courseItem.className = 'course-item';
    
    courseItem.innerHTML = `
        <button type="button" class="remove-item"><i class="fas fa-times"></i></button>
        <div class="form-group">
            <label for="course-title-${courseIndex}">Course Title</label>
            <input type="text" id="course-title-${courseIndex}" name="course-title-${courseIndex}" value="${courseData?.title || ''}">
        </div>
        <div class="form-group">
            <label for="course-description-${courseIndex}">Description</label>
            <textarea id="course-description-${courseIndex}" name="course-description-${courseIndex}" rows="2">${courseData?.description || ''}</textarea>
        </div>
        <div class="form-group">
            <label for="course-tags-${courseIndex}">Tags (comma separated)</label>
            <input type="text" id="course-tags-${courseIndex}" name="course-tags-${courseIndex}" value="${courseData?.tags ? courseData.tags.join(', ') : ''}">
        </div>
    `;
    
    container.appendChild(courseItem);
    
    // Add event listener to remove button
    const removeBtn = courseItem.querySelector('.remove-item');
    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            container.removeChild(courseItem);
        });
    }
}

// Handle education form submission
async function handleEducationFormSubmit(event) {
    event.preventDefault();
    
    if (!isAdmin) {
        showNotification('You must be logged in as admin to perform this action', 'error');
        return;
    }
    
    try {
        const form = event.target;
        const educationId = document.getElementById('education-id').value;
        
        // Get form values
        const educationData = {
            degree: document.getElementById('degree').value,
            institution: document.getElementById('institution').value,
            year: document.getElementById('year').value,
            icon: document.getElementById('icon').value || 'fa-university',
            achievements: document.getElementById('achievements').value,
            description: document.getElementById('description').value,
            lastUpdated: serverTimestamp()
        };
        
        // Get projects
        const projectsContainer = document.getElementById('projects-container');
        const projectItems = projectsContainer.querySelectorAll('.project-item');
        const projects = [];
        
        projectItems.forEach((item, index) => {
            const title = document.getElementById(`project-title-${index}`)?.value;
            if (title) {
                const description = document.getElementById(`project-description-${index}`)?.value || '';
                const link = document.getElementById(`project-link-${index}`)?.value || '';
                const tagsInput = document.getElementById(`project-tags-${index}`)?.value || '';
                const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
                
                projects.push({ title, description, link, tags });
            }
        });
        
        if (projects.length > 0) {
            educationData.relatedProjects = projects;
        }
        
        // Get coursework
        const courseworkContainer = document.getElementById('coursework-container');
        const courseItems = courseworkContainer.querySelectorAll('.course-item');
        const courses = [];
        
        courseItems.forEach((item, index) => {
            const title = document.getElementById(`course-title-${index}`)?.value;
            if (title) {
                const description = document.getElementById(`course-description-${index}`)?.value || '';
                const tagsInput = document.getElementById(`course-tags-${index}`)?.value || '';
                const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim()) : [];
                
                courses.push({ title, description, tags });
            }
        });
        
        if (courses.length > 0) {
            educationData.relevantCoursework = courses;
        }
        
        // Save to Firestore
        if (educationId) {
            // Update existing education
            const educationRef = doc(db, 'education', educationId);
            await updateDoc(educationRef, educationData);
            showNotification('Education updated successfully', 'success');
        } else {
            // Add new education
            await addDoc(collection(db, 'education'), educationData);
            showNotification('Education added successfully', 'success');
        }
        
        // Close modal
        closeAllModals();
    } catch (error) {
        console.error("Error saving education: ", error);
        showNotification('Error saving education data', 'error');
    }
}

// Handle page content form submission
async function handlePageContentFormSubmit(event) {
    event.preventDefault();
    
    if (!isAdmin) {
        showNotification('You must be logged in as admin to perform this action', 'error');
        return;
    }
    
    try {
        const mainTitle = document.getElementById('page-title').value;
        const highlightTitle = document.getElementById('highlight-title').value;
        const description = document.getElementById('page-description').value;
        
        await updateDoc(pageContentRef, {
            mainTitle,
            highlightTitle,
            description,
            lastUpdated: serverTimestamp()
        });
        
        showNotification('Page content updated successfully', 'success');
        closeAllModals();
    } catch (error) {
        console.error("Error updating page content: ", error);
        showNotification('Error updating page content', 'error');
    }
}

// Open modal to edit page content
function openEditPageContentModal() {
    const modal = document.getElementById('page-content-modal');
    
    if (modal) {
        // Get current page content
        const mainTitle = document.getElementById('education-page-main-title').textContent.replace(document.getElementById('education-page-highlight-title').textContent, '').trim();
        const highlightTitle = document.getElementById('education-page-highlight-title').textContent;
        const description = document.getElementById('education-page-description').textContent;
        
        // Set form values
        document.getElementById('page-title').value = mainTitle;
        document.getElementById('highlight-title').value = highlightTitle;
        document.getElementById('page-description').value = description;
        
        // Show modal
        modal.style.display = 'block';
    }
}

// Confirm delete education
function confirmDeleteEducation(educationId) {
    if (confirm('Are you sure you want to delete this education entry? This action cannot be undone.')) {
        deleteEducation(educationId);
    }
}

// Delete education
async function deleteEducation(educationId) {
    if (!isAdmin) {
        showNotification('You must be logged in as admin to perform this action', 'error');
        return;
    }
    
    try {
        const educationRef = doc(db, 'education', educationId);
        await deleteDoc(educationRef);
        showNotification('Education deleted successfully', 'success');
    } catch (error) {
        console.error("Error deleting education: ", error);
        showNotification('Error deleting education', 'error');
    }
}

// Close all modals
function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.getElementById('notification');
    const notificationMessage = document.getElementById('notification-message');
    
    if (notification && notificationMessage) {
        // Set message
        notificationMessage.textContent = message;
        
        // Set icon based on type
        const icon = notification.querySelector('i');
        if (icon) {
            icon.className = type === 'success' ? 'fas fa-check-circle' : 
                            type === 'error' ? 'fas fa-exclamation-circle' : 
                            'fas fa-info-circle';
        }
        
        // Set notification type
        notification.className = 'notification';
        notification.classList.add(type);
        
        // Show notification
        notification.classList.add('active');
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
}

// Initialize the page when DOM is loaded
document.addEventListener('DOMContentLoaded', initPage);

// Export functions for testing
export {
    initPage,
    loadStaticData,
    renderEducationEntries,
    createEducationCardHTML
};
