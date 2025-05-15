// experience.js
import { db } from './firebase-init.js'; // Assuming db is exported from firebase-init.js
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateExperiencePage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Animate timeline items after they are loaded
}

function createTimelineItemHTML(item) {
    const tagsHTML = item.tags ? item.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    const responsibilitiesHTML = item.responsibilities ? `
        <ul class="timeline-responsibilities">
            ${item.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
        </ul>` : '';

    return `
        <div class="timeline-item" data-experience-id="${item.id}">
            <div class="timeline-icon">
                <i class="fas ${item.icon || 'fa-briefcase'}"></i>
            </div>
            <div class="timeline-content">
                <span class="timeline-date">${item.dateRange || 'Date Range'}</span>
                <h3 class="timeline-title">${item.title || 'Job Title'}</h3>
                <h4 class="timeline-company">${item.company || 'Company Name'}</h4>
                <p class="timeline-description">${item.description || 'Description of role.'}</p>
                ${responsibilitiesHTML}
                <div class="timeline-tags">${tagsHTML}</div>
            </div>
        </div>
    `;
}

async function loadExperienceData() {
    const timelineContainer = document.getElementById('experience-timeline-container');
    if (!timelineContainer) return;

    try {
        const experienceCol = collection(db, 'experience');
        const q = query(experienceCol, orderBy('startDate', 'desc')); // Assuming you have a startDate field for ordering
        const experienceSnapshot = await getDocs(q);
        const experienceList = experienceSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (experienceList.length > 0) {
            timelineContainer.innerHTML = ''; // Clear static fallback
            experienceList.forEach(item => {
                timelineContainer.innerHTML += createTimelineItemHTML(item);
            });
            // Animate newly added timeline items
            gsap.from(".timeline-item", { 
                duration: 0.6, 
                x: -50, 
                opacity: 0, 
                stagger: 0.2, 
                ease: "power3.out",
                delay: 0.5 // Delay after header
            });
        } else {
            // Keep static fallback or show "No experience data found."
            gsap.from(".timeline-item", { duration: 0.6, x: -50, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.5});
        }
    } catch (error) {
        console.error("Error loading experience data: ", error);
        // Optionally, keep static fallback on error
         gsap.from(".timeline-item", { duration: 0.6, x: -50, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.5});
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateExperiencePage(); // Animates header
    loadExperienceData();    // Loads and animates timeline items

    const currentPage = window.location.pathname.split("/").pop() || "experience.html";
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
