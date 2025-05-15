// education.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateEducationPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Cards will be animated after loading
}

function createEducationCardHTML(edu) {
    const projectsHTML = edu.relatedProjects ? `
        <div class="related-content-section">
            <h3><i class="fas fa-flask"></i> Key Research & Projects</h3>
            <ul class="related-items-list">
                ${edu.relatedProjects.map(proj => `
                    <li>
                        <a href="${proj.link || '#'}" class="related-item-link" ${proj.link ? 'target="_blank" rel="noopener noreferrer"' : ''}>${proj.title}</a>
                        <p class="related-item-description">${proj.description}</p>
                        <div class="related-item-tags">${proj.tags ? proj.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : ''}</div>
                    </li>
                `).join('')}
            </ul>
        </div>` : '';
    
    const courseworkHTML = edu.relevantCoursework ? `
        <div class="related-content-section">
            <h3><i class="fas fa-book-open"></i> Relevant Coursework</h3>
            <ul class="related-items-list">
                ${edu.relevantCoursework.map(course => `
                    <li>
                        <span class="related-item-link-static">${course.title}</span>
                        <p class="related-item-description">${course.description}</p>
                         ${course.tags ? `<div class="related-item-tags">${course.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}</div>` : ''}
                    </li>
                `).join('')}
            </ul>
        </div>` : '';


    return `
        <div class="education-entry-card" data-education-id="${edu.id}">
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
        </div>
    `;
}

async function loadEducationData() {
    const gridContainer = document.getElementById('education-grid-container');
    if (!gridContainer) return;

    try {
        const eduCol = collection(db, 'education'); // 'education' is your Firestore collection name
        const q = query(eduCol, orderBy('year', 'desc')); // Order by year, descending
        const eduSnapshot = await getDocs(q);
        const eduList = eduSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (eduList.length > 0) {
            gridContainer.innerHTML = ''; // Clear static fallback
            eduList.forEach(eduItem => {
                gridContainer.innerHTML += createEducationCardHTML(eduItem);
            });
            gsap.from(".education-entry-card", { 
                duration: 0.6, 
                y: 30, 
                opacity: 0, 
                stagger: 0.2, 
                ease: "power3.out",
                delay: 0.5
            });
        } else {
            // Keep static fallback or show "No education data"
            gsap.from(".education-entry-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.5});
        }
    } catch (error) {
        console.error("Error loading education data: ", error);
        gsap.from(".education-entry-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.5});
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateEducationPage();
    loadEducationData();

    const currentPage = window.location.pathname.split("/").pop() || "education.html";
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
