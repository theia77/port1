// mainpage.js
import { getProfileData, getSectionPreviewData } from './firebase-init.js'; // Assuming these are in firebase-init or a dedicated module

function initParticlesMainpage() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 60, density: { enable: true, value_area: 800 } },
                color: { value: "#8DA9C4" },
                shape: { type: "circle" },
                opacity: { value: 0.35, random: true },
                size: { value: 3, random: true },
                line_linked: { enable: true, distance: 150, color: "#D6C180", opacity: 0.25, width: 1 },
                move: { enable: true, speed: 1.2, random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
                modes: { grab: { distance: 140, line_opacity: 0.3 }, push: { particles_nb: 3 } }
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

function animateMainPageElements() {
    gsap.from(".header", { duration: 0.8, y: -50, opacity: 0, ease: "power3.out" });
    gsap.from(".admin-brief", { duration: 1, scale: 0.9, opacity: 0, ease: "elastic.out(1, 0.75)", delay: 0.3 });
    gsap.from(".flip-card", { 
        duration: 0.7, 
        y: 30, 
        opacity: 0, 
        stagger: 0.15, 
        ease: "power3.out",
        delay: 0.6 
    });
}

async function loadProfileInfo() {
    try {
        const profile = await getProfileData(); // Fetch from Firebase
        if (profile) {
            document.getElementById('profile-name').textContent = profile.name || "Your Name";
            document.getElementById('profile-tagline').textContent = profile.tagline || "Your Tagline";
            document.getElementById('profile-description-1').textContent = profile.description1 || "Description part 1.";
            document.getElementById('profile-description-2').textContent = profile.description2 || "Description part 2.";
            if (profile.avatarUrl) document.getElementById('profile-avatar').src = profile.avatarUrl;
            if (profile.linkedin) document.getElementById('linkedin-url').href = profile.linkedin;
            if (profile.github) document.getElementById('github-url').href = profile.github;
            if (profile.twitter) document.getElementById('twitter-url').href = profile.twitter;
        }
    } catch (error) {
        console.error("Error loading profile info:", error);
        // Fallback to static content or show error message
    }
}

async function loadSectionPreviews() {
    // Example for projects preview
    try {
        const projectsPreview = await getSectionPreviewData('projects', 2); // Get 2 latest projects
        if (projectsPreview && projectsPreview.length > 0) {
            const p1 = document.getElementById('project-1-preview');
            const p2 = document.getElementById('project-2-preview');
            if(p1 && projectsPreview[0]) p1.textContent = projectsPreview[0].title;
            if(p2 && projectsPreview[1]) p2.textContent = projectsPreview[1].title;
        }
        // Repeat for skills, education, blog, experience previews
        // Skills might be slightly different, e.g., top 2 skills
        const skillsPreview = await getSectionPreviewData('skills', 2); // Top 2 skills
        if (skillsPreview && skillsPreview.length > 0) {
            const s1Name = document.getElementById('skill-1-name-preview');
            const s2Name = document.getElementById('skill-2-name-preview');
            if (s1Name && skillsPreview[0]) {
                s1Name.textContent = skillsPreview[0].name;
                s1Name.parentElement.style.setProperty('--xp', `${skillsPreview[0].level || 0}%`);
            }
            if (s2Name && skillsPreview[1]) {
                s2Name.textContent = skillsPreview[1].name;
                s2Name.parentElement.style.setProperty('--xp', `${skillsPreview[1].level || 0}%`);
            }
        }

    } catch (error) {
        console.error("Error loading section previews:", error);
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initParticlesMainpage();
    updateCurrentYear();
    animateMainPageElements();
    loadProfileInfo();
    loadSectionPreviews();

    // Add active class to current page nav link
    const currentPage = window.location.pathname.split("/").pop() || "mainpage.html";
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
