// mainpage.js - v1.0.3
import { getProfileData, getSectionPreviewData } from './firebase-init.js'; 

function initParticlesMainpage() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', { 
            particles: {
                number: { value: 45, density: { enable: true, value_area: 900 } }, 
                color: { value: "#8DA9C4" }, 
                shape: { type: "circle" },
                opacity: { value: 0.20, random: true, anim: { enable: true, speed: 0.25, opacity_min: 0.04, sync: false } }, 
                size: { value: 2.2, random: true, anim: { enable: false } }, 
                line_linked: { enable: true, distance: 170, color: "#C0A660", opacity: 0.12, width: 0.7 }, 
                move: { enable: true, speed: 0.9, direction: "none", random: true, straight: false, out_mode: "out" } 
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false, mode: "push" } }, 
                modes: { grab: { distance: 130, line_opacity: 0.2 }, push: { particles_nb: 2 } }
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
    gsap.from("#mainHeader", { duration: 0.9, y: -70, opacity: 0, ease: "power3.out", delay: 0.15 });
    
    gsap.from(".admin-brief", { 
        duration: 1.1, 
        scale: 0.92, 
        opacity: 0, 
        y: 25, 
        ease: "elastic.out(1, 0.65)", // More expressive ease
        delay: 0.45 
    });
    
    gsap.from(".flip-card", { 
        duration: 0.7, 
        y: 35, 
        opacity: 0, 
        stagger: 0.15, 
        ease: "power2.out",
        delay: 0.9 // Delay after admin-brief animation might complete
    });
}

async function loadProfileInfo() {
    try {
        const profile = await getProfileData();
        if (profile) {
            document.getElementById('profile-name').textContent = profile.name || "Sumouli Pramanik";
            document.getElementById('profile-tagline').textContent = profile.tagline || "Civil Engineer | Data Scientist";
            document.getElementById('profile-description-1').textContent = profile.description1 || "Dedicated to bridging physical infrastructure with digital intelligence.";
            document.getElementById('profile-description-2').textContent = profile.description2 || "Explore my journey and projects in engineering and data science.";
            document.getElementById('profile-avatar').src = profile.avatarUrl || 'placeholder-avatar.png';
            if (profile.linkedin) document.getElementById('linkedin-url').href = profile.linkedin; else document.getElementById('linkedin-url').style.display = 'none';
            if (profile.github) document.getElementById('github-url').href = profile.github; else document.getElementById('github-url').style.display = 'none';
            if (profile.twitter) document.getElementById('twitter-url').href = profile.twitter; else document.getElementById('twitter-url').style.display = 'none';
        } else {
            throw new Error("Profile data is null or undefined.");
        }
    } catch (error) {
        console.error("Error loading profile info, using fallbacks:", error);
        document.getElementById('profile-name').textContent = "Sumouli Pramanik";
        document.getElementById('profile-tagline').textContent = "Civil Engineer | Data Scientist | Infrastructure Consultant";
        document.getElementById('profile-description-1').textContent = "Dedicated to bridging physical infrastructure with digital intelligence through innovative data-driven solutions.";
        document.getElementById('profile-description-2').textContent = "Explore my journey and key projects at the intersection of advanced civil engineering and cutting-edge data science.";
        document.getElementById('profile-avatar').src = 'placeholder-avatar.png';
        document.getElementById('linkedin-url').style.display = 'none';
        document.getElementById('github-url').style.display = 'none';
        document.getElementById('twitter-url').style.display = 'none';
    }
}

async function loadSectionPreviews() {
    try {
        // Projects Preview
        const projectsPreviewData = await getSectionPreviewData('projects', 2); 
        const p1Preview = document.getElementById('project-1-preview');
        const p2Preview = document.getElementById('project-2-preview');
        if (p1Preview) p1Preview.textContent = (projectsPreviewData && projectsPreviewData[0]?.title) || "Recent Project A";
        if (p2Preview) p2Preview.textContent = (projectsPreviewData && projectsPreviewData[1]?.title) || "Recent Project B";

        // Skills Preview
        const skillsPreviewData = await getSectionPreviewData('skills', 2);
        const s1NamePreview = document.getElementById('skill-1-name-preview');
        const s2NamePreview = document.getElementById('skill-2-name-preview');
        if (s1NamePreview && s1NamePreview.parentElement) {
            s1NamePreview.textContent = (skillsPreviewData && skillsPreviewData[0]?.name) || "Key Skill Alpha";
            s1NamePreview.parentElement.style.setProperty('--xp', `${(skillsPreviewData && skillsPreviewData[0]?.level) || 80}%`);
        }
        if (s2NamePreview && s2NamePreview.parentElement) {
            s2NamePreview.textContent = (skillsPreviewData && skillsPreviewData[1]?.name) || "Key Skill Beta";
            s2NamePreview.parentElement.style.setProperty('--xp', `${(skillsPreviewData && skillsPreviewData[1]?.level) || 70}%`);
        }
        
        // Placeholder for other previews - extend similarly
        const edu1Preview = document.getElementById('degree-1-preview');
        if (edu1Preview) edu1Preview.textContent = "B.Tech Civil Eng.";
        const cert1Preview = document.getElementById('certification-1-preview');
        if (cert1Preview) cert1Preview.textContent = "Data Science Cert.";
        
        const post1Preview = document.getElementById('post-1-preview');
        if(post1Preview) post1Preview.textContent = "AI in Construction";
        const post2Preview = document.getElementById('post-2-preview');
        if(post2Preview) post2Preview.textContent = "Sustainable Design";
        
        const job1Preview = document.getElementById('job-1-preview');
        if(job1Preview) job1Preview.textContent = "Lead Data Scientist";
        const job2Preview = document.getElementById('job-2-preview');
        if(job2Preview) job2Preview.textContent = "Civil Engineer II";

        const contact1Preview = document.getElementById('contact-method-1-preview');
        if(contact1Preview) contact1Preview.textContent = "Email for Inquiries";
        const contact2Preview = document.getElementById('contact-method-2-preview');
        if(contact2Preview) contact2Preview.textContent = "Schedule a Meeting";


    } catch (error) {
        console.error("Error loading section previews, using fallbacks:", error);
        // Apply fallbacks directly if needed, similar to loadProfileInfo
        document.getElementById('project-1-preview').textContent = "Featured Project 1";
        document.getElementById('project-2-preview').textContent = "Featured Project 2";
        document.getElementById('skill-1-name-preview').textContent = "Primary Skill";
        document.getElementById('skill-1-name-preview').parentElement.style.setProperty('--xp', `85%`);
        document.getElementById('skill-2-name-preview').textContent = "Secondary Skill";
        document.getElementById('skill-2-name-preview').parentElement.style.setProperty('--xp', `75%`);
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
    window.addEventListener('scroll', toggleSticky, { passive: true }); // Passive for performance
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

document.addEventListener('DOMContentLoaded', () => {
    initParticlesMainpage();
    updateCurrentYear();
    animateMainPageElements(); 
    loadProfileInfo();
    loadSectionPreviews();
    handleStickyHeader(); 
    setupMobileMenu();

    const currentPage = window.location.pathname.split("/").pop() || "mainpage.html"; 
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active'); 
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
});
