// blog.js (Public Blog Listing Page)
import { db, collection, getDocs, query, orderBy, limit, doc, getDoc } from './firebase-init.js';

// --- Utility Functions ---
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: { number: { value: 40, density: { enable: true, value_area: 800 } }, color: { value: "#8DA9C4" }, shape: { type: "circle" }, opacity: { value: 0.3, random: true }, size: { value: 2.5, random: true }, line_linked: { enable: true, distance: 180, color: "#D6C180", opacity: 0.2, width: 1 }, move: { enable: true, speed: 1, direction: "none", random: true, straight: false, out_mode: "out" }},
            interactivity: { detect_on: "canvas", events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } }, modes: { grab: { distance: 120, line_opacity: 0.3 } }},
            retina_detect: true
        });
    }
}

function updateCurrentYear() {
    document.querySelectorAll('.current-year').forEach(span => {
        if (span) span.textContent = new Date().getFullYear();
    });
}

function animatePageHeader() {
    if (typeof gsap !== 'undefined') {
        gsap.from(".page-header", { duration: 0.8, y: 30, opacity: 0, ease: "power3.out", delay: 0.2 });
    }
}

function showPageNotification(message, type = 'info') { /* Your notification logic */ }

// --- Dynamic Content Rendering ---
function createBlogCardHTML(post) {
    const tagsHTML = post.tags && post.tags.length > 0 ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('') : '';
    // Use featuredImageURL from admin, with a fallback
    const imageUrl = post.featuredImageURL || 'assets/placeholder-blog-image.jpg'; // Ensure this placeholder path is correct

    let postDate = 'Date unavailable';
    if (post.publishDate) {
        const dateObj = post.publishDate.seconds ? new Date(post.publishDate.seconds * 1000) : (post.publishDate instanceof Date ? post.publishDate : null);
        if (dateObj) {
            postDate = dateObj.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
        }
    }

    return `
        <div class="blog-entry-card" data-blog-id="${post.id}">
            <div class="blog-entry-image-container">
                <img src="${imageUrl}" alt="${post.title || 'Blog post image'}" class="blog-entry-image">
            </div>
            <div class="blog-entry-content">
                <div class="blog-entry-header">
                    <h2 class="post-title">${post.title || 'Untitled Post'}</h2>
                    <span class="post-date">${postDate}</span>
                </div>
                <p class="post-excerpt">${post.excerpt || 'Click to read more...'}</p>
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
    if (!gridContainer) {
        console.error("Blog grid container not found!");
        return;
    }
    gridContainer.innerHTML = '<p class="loading-message">Loading latest insights...</p>';

    try {
        // **IMPORTANT:** Ensure this collection name 'blogs' matches what you use in admin-dashboard.js
        const postsColRef = collection(db, 'blogs');
        const q = query(postsColRef, orderBy('publishDate', 'desc'), limit(9)); // Display up to 9 posts

        const postsSnapshot = await getDocs(q);
        const postsList = postsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

        if (postsList.length > 0) {
            gridContainer.innerHTML = ''; // Clear loading/fallback
            postsList.forEach(post => {
                gridContainer.innerHTML += createBlogCardHTML(post);
            });
            if (typeof gsap !== 'undefined') {
                gsap.from(".blog-entry-card", {
                    duration: 0.6, y: 30, opacity: 0, stagger: 0.15, ease: "power3.out", delay: 0.4
                });
            }
        } else {
            gridContainer.innerHTML = '<p>No blog posts available yet. Check back soon!</p>';
        }
    } catch (error) {
        console.error("Error loading blog posts: ", error);
        gridContainer.innerHTML = '<p class="error-text">Could not load blog posts. Please try again later.</p>';
        showPageNotification("Failed to load blog posts.", "error");
    }
}

async function loadPageSettings() {
    try {
        const settingsDocRef = doc(db, "settings", "generalSite"); // Matches admin-dashboard.js
        const docSnap = await getDoc(settingsDocRef);
        if (docSnap.exists()) {
            const s = docSnap.data();

            // Update Browser Tab Title
            document.title = `${s.blogPageTitle || 'Blog'} | ${s.siteMainTitle || 'SumoVerse'}`;

            // Update Meta Description
            const metaDescTag = document.querySelector('meta[name="description"]');
            if (metaDescTag && s.blogPageDescription) metaDescTag.content = s.blogPageDescription;


            // Update Page Header
            const mainTitleEl = document.getElementById('blog-page-main-title');
            if (mainTitleEl && s.blogPageTitle) {
                mainTitleEl.innerHTML = `${s.blogPageTitle} <span class="highlight" id="blog-page-highlight-title">${s.blogPageHighlight || 'Insights'}</span>`;
            }
            const descEl = document.getElementById('blog-page-description');
            if (descEl && s.blogPageDescription) descEl.textContent = s.blogPageDescription;

            // Update Site Logo in Header and Footer
            const logoContent = `${s.siteMainTitle || 'Sumo'}<span>${s.siteHighlightTitle || 'Verse'}</span>`;
            document.querySelectorAll('#site-logo, #footer-site-logo').forEach(el => {
                if(el && s.siteMainTitle) el.innerHTML = logoContent;
            });

            // Update Footer Copyright
            const footerTextEl = document.getElementById('footer-copyright-text');
            const copyrightNameDisplay = document.getElementById('copyright-name-display'); // Specific span for name
            if (footerTextEl && s.footerCopyrightName) {
                 if(copyrightNameDisplay) copyrightNameDisplay.textContent = s.footerCopyrightName;
                 else footerTextEl.innerHTML = `&copy; <span class="current-year">${new Date().getFullYear()}</span> ${s.footerCopyrightName}. All rights reserved.`;
            } else if (footerTextEl) { // Fallback if footerCopyrightName isn't set
                 const currentYearSpan = footerTextEl.querySelector('.current-year');
                 if (currentYearSpan) currentYearSpan.textContent = new Date().getFullYear();
            }


        } else {
             // Fallback if settings are not found (static content in HTML will be used or defaults here)
             document.title = "Blog Insights | SumoVerse";
        }
    } catch (error) {
        console.warn("Could not load page settings for blog list:", error);
    }
}

// --- Initialize Page ---
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    updateCurrentYear(); // Call it after loadPageSettings potentially updates footer structure
    animatePageHeader();
    loadPageSettings().then(() => {
        updateCurrentYear(); // Call again to ensure year is set if footer was dynamically created
    });
    loadBlogPosts();

    // Set active navigation link
    document.querySelectorAll('.nav-link.active').forEach(l => l.classList.remove('active'));
    const activeNavLink = document.querySelector('.nav-link[href="blog.html"]');
    if (activeNavLink) activeNavLink.classList.add('active');
});
