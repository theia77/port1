// skills.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateSkillsPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Sections and skill bars animated after loading
}

function createSkillItemHTML(skill) {
    return `
        <div class="skill-item" data-skill-id="${skill.id}">
            <span>${skill.name}</span>
            <div class="skill-bar">
                <div class="skill-level" style="width: ${skill.level || 0}%;"></div>
            </div>
        </div>
    `;
}

function createSkillsCategoryHTML(category) {
    const skillsHTML = category.skills.map(skill => createSkillItemHTML(skill)).join('');
    return `
        <section class="skills-category-section">
            <h2 class="category-title"><i class="fas ${category.icon || 'fa-star'}"></i> ${category.name}</h2>
            <div class="skills-grid">
                ${skillsHTML}
            </div>
        </section>
    `;
}

async function loadSkillsData() {
    const layoutContainer = document.getElementById('skills-layout-container');
    if (!layoutContainer) return;

    try {
        // Assuming skills are grouped by category in Firestore or fetched as a flat list and then grouped.
        // For this example, let's assume a 'skillCategories' collection, where each doc has a 'name' and a subcollection 'skills'.
        // Or, one 'skillsData' document that holds an array of categories, each with an array of skills.
        // Simpler: one 'skills' collection with a 'category' field and 'level' field.

        const skillsCol = collection(db, 'skills'); // Flat list of skills, each with a category field
        const q = query(skillsCol, orderBy('category'), orderBy('name')); // Order by category, then name
        const skillsSnapshot = await getDocs(q);
        
        const skillsByCategory = {};
        skillsSnapshot.docs.forEach(doc => {
            const skill = { id: doc.id, ...doc.data() };
            if (!skillsByCategory[skill.category]) {
                skillsByCategory[skill.category] = {
                    name: skill.category, // You might want a display name for category
                    icon: skill.categoryIcon || 'fa-tools', // Define icons based on category
                    skills: []
                };
            }
            skillsByCategory[skill.category].skills.push(skill);
        });

        const categoriesList = Object.values(skillsByCategory);

        if (categoriesList.length > 0) {
            layoutContainer.innerHTML = ''; // Clear static fallback
            categoriesList.forEach(category => {
                layoutContainer.innerHTML += createSkillsCategoryHTML(category);
            });
            gsap.from(".skills-category-section", { 
                duration: 0.7, 
                y: 25, 
                opacity: 0, 
                stagger: 0.2, 
                ease: "power3.out",
                delay: 0.4 
            });
            // Animate skill bars when they become visible (Intersection Observer is good for this)
            // Simple immediate animation for now:
            document.querySelectorAll('.skill-level').forEach(bar => {
                // The width is already set by inline style from createSkillItemHTML
                // If you want to animate from 0:
                const targetWidth = bar.style.width;
                bar.style.width = '0%'; // Reset for animation
                gsap.to(bar, { duration: 1, width: targetWidth, ease: 'power2.out', delay: 0.8 });
            });

        } else {
             gsap.from(".skills-category-section", { duration: 0.7, y: 25, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.4 });
             // Animate static skill bars if any
            document.querySelectorAll('.skill-item .skill-level').forEach(bar => {
                const targetWidth = bar.style.width; // Get current width (from HTML)
                bar.style.width = '0%';
                gsap.to(bar, {duration: 1, width: targetWidth, ease: 'power2.out', delay: 0.8});
            });
        }
    } catch (error) {
        console.error("Error loading skills data: ", error);
        // Animate static fallback on error
        gsap.from(".skills-category-section", { duration: 0.7, y: 25, opacity: 0, stagger: 0.2, ease: "power3.out", delay: 0.4 });
        document.querySelectorAll('.skill-item .skill-level').forEach(bar => {
            const targetWidth = bar.style.width;
            bar.style.width = '0%';
            gsap.to(bar, {duration: 1, width: targetWidth, ease: 'power2.out', delay: 0.8});
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateSkillsPage();
    loadSkillsData();

    const currentPage = window.location.pathname.split("/").pop() || "skills.html";
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
