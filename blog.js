// blog.js
import { db } from './firebase-init.js';
import { collection, getDocs, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-firestore.js";

function initParticles() { /* ... (copy common initParticles function here) ... */ }
function updateCurrentYear() { /* ... (copy common updateCurrentYear function here) ... */ }

function animateBlogPage() {
    gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    // Cards animated after loading
}

function createBlogCardHTML(post) {
    const tagsHTML = post.tags ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    // Assuming a single image URL. If multiple, you'd need a carousel or logic to pick one.
    const imageUrl = post.imageUrl || `placeholder-blog${Math.floor(Math.random() * 2) + 1}.jpg`; // Fallback placeholder

    return `
        <div class="blog-entry-card" data-blog-id="${post.id}">
            <div class="blog-entry-image-container">
                <img src="${imageUrl}" alt="${post.title}" class="blog-entry-image">
            </div>
            <div class="blog-entry-content">
                <div class="blog-entry-header">
                    <h2 class="post-title">${post.title}</h2>
                    <span class="post-date">${post.date ? new Date(post.date.seconds * 1000).toLocaleDateString() : 'Recent Post'}</span>
                </div>
                <p class="post-excerpt">${post.excerpt || 'Read more to find out...'}</p>
                <div class="post-meta">
                    <div class="post-tags">${tagsHTML}</div>
                    <a href="blog-single.html?id=${post.id}" class="read-more-link">Read More <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        </div>
    `;
}

async function loadBlogPosts() {
    const gridContainer = document.getElementById('blog-grid-container');
    if (!gridContainer) return;

    try {
        const postsCol = collection(db, 'blogPosts'); // Your Firestore collection for blog posts
        const q = query(postsCol, orderBy('date', 'desc'), limit(6)); // Get latest 6 posts
        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (postsList.length > 0) {
            gridContainer.innerHTML = ''; // Clear static fallback
            postsList.forEach(post => {
                gridContainer.innerHTML += createBlogCardHTML(post);
            });
            gsap.from(".blog-entry-card", { 
                duration: 0.6, 
                y: 30, 
                opacity: 0, 
                stagger: 0.15, 
                ease: "power3.out",
                delay: 0.5
            });
        } else {
             gsap.from(".blog-entry-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out", delay: 0.5});
        }
    } catch (error) {
        console.error("Error loading blog posts: ", error);
        gsap.from(".blog-entry-card", { duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out", delay: 0.5});
    }
}


document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear();
    animateBlogPage();
    loadBlogPosts();

    const currentPage = window.location.pathname.split("/").pop() || "blog.html";
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
