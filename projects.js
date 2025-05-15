// projects.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateProjectsPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Cards animated after loading
}

function createProjectCardHTML(project) {
    const tagsHTML = project.tags ? project.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const imageUrl = project.imageUrl || `placeholder-project${Math.floor(Math.random() * 2) + 1}.jpg`;

    return `
        <div class="project-card" data-project-id="${project.id}">
            <div class="project-image-container">
                <img src="${imageUrl}" alt="${project.title}" class="project-image">
                <div class="project-image-overlay">
                    <a href="${project.detailsLink || '#'}" class="overlay-link project-details-link" aria-label="View Project Details"><i class="fas fa-search-plus"></i></a>
                    ${project.liveLink ? `<a href="${project.liveLink}" class="overlay-link project-live-link" target="_blank" rel="noopener noreferrer" aria-label="View Live Project"><i class="fas fa-external-link-alt"></i></a>` : ''}
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
        const projectsCol = collection(db, 'projects'); // Your Firestore collection for projects
        const q = query(projectsCol, orderBy('dateCompleted', 'desc'), limit(6)); // Example: order by date, limit to 6
        const projectsSnapshot = await getDocs(q);
        const projectsList = projectsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (projectsList.length > 0) {
            gridContainer.innerHTML = ''; // Clear static fallback
            projectsList.forEach(project => {
                gridContainer.innerHTML += createProjectCardHTML(project);
            });
            gsap.from(".project-card", { 
                duration: 0.6, 
                y: 30, 
                opacity: 0, 
                stagger: 0.15, 
                ease: "power3.out",
                delay: 0.5
            });
        } else {
             gsap.from(".project-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out", delay: 0.5});
        }
    } catch (error) {
        console.error("Error loading projects data: ", error);
        gsap.from(".project-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out", delay: 0.5});
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateProjectsPage();
    loadProjectsData();

    const currentPage = window.location.pathname.split("/").pop() || "projects.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});

// Paste initParticles and updateCurrentYear functions here
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

function updateCurrentYear() {
    const yearSpan = document.querySelector('.current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
}
