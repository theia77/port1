// blog.js
document.addEventListener('DOMContentLoaded', function() {
    // Initialize particles.js with "Architect's Study" theme
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            particles: {
                number: { value: 40, density: { enable: true, value_area: 900 } },
                color: { value: "#8DA9C4" }, // Primary: Muted Cadet Blue
                shape: { type: "circle" },
                opacity: { value: 0.3, random: true, anim: { enable: true, speed: 0.6, opacity_min: 0.05, sync: false } },
                size: { value: 2.5, random: true, anim: { enable: false } },
                line_linked: { enable: true, distance: 170, color: "#D6C180", opacity: 0.18, width: 1 }, // Secondary: Muted Gold
                move: { enable: true, speed: 0.9, direction: "none", random: true, straight: false, out_mode: "out" }
            },
            interactivity: {
                detect_on: "canvas",
                events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: false } },
                modes: { grab: { distance: 140, line_opacity: 0.2 } }
            },
            retina_detect: true
        });
    }

    // Initialize 3D bridge model with "Architect's Study" theme
    const bridgeContainer = document.getElementById('bridge-model');
    if (bridgeContainer && typeof THREE !== 'undefined') {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.5, 6); 
        
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        bridgeContainer.appendChild(renderer.domElement);

        const createSimpleAbstract = () => { // Simpler background effect
            const group = new THREE.Group();
            const geometry = new THREE.IcosahedronGeometry(1, 0); // Simpler geometry
            
            const material1 = new THREE.MeshBasicMaterial({ color: 0x8DA9C4, wireframe: true, transparent: true, opacity: 0.3 }); // Primary
            const material2 = new THREE.MeshBasicMaterial({ color: 0xD6C180, wireframe: true, transparent: true, opacity: 0.25 });// Secondary
            const material3 = new THREE.MeshBasicMaterial({ color: 0xCE7B69, wireframe: true, transparent: true, opacity: 0.2 }); // Accent

            for (let i = 0; i < 15; i++) { // Fewer elements
                let material = material1;
                if (i % 3 === 1) material = material2;
                if (i % 3 === 2) material = material3;

                const mesh = new THREE.Mesh(geometry, material);
                mesh.position.set(
                    (Math.random() - 0.5) * 15,
                    (Math.random() - 0.5) * 10,
                    (Math.random() - 0.5) * 10 - 5 // Spread them out
                );
                mesh.scale.setScalar(Math.random() * 0.3 + 0.1); // Smaller scale
                mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
                group.add(mesh);
            }
            scene.add(group);
            return group;
        };
        
        const abstractShapes = createSimpleAbstract();
        
        const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.9); 
        scene.add(ambientLight);

        function animate() { 
            requestAnimationFrame(animate);
            const time = Date.now() * 0.0001;
            if (abstractShapes) {
                abstractShapes.rotation.y = time * 0.5;
                abstractShapes.rotation.x = time * 0.3;
            }
            renderer.render(scene, camera);
        }
        animate();
        window.addEventListener('resize', () => { 
            camera.aspect = window.innerWidth / window.innerHeight; 
            camera.updateProjectionMatrix(); 
            renderer.setSize(window.innerWidth, window.innerHeight);
        });
    }
    
    const currentYearElement = document.getElementById('current-year-blog');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    function showNotification(message, type = 'success') {
        const notification = document.getElementById('notification');
        const notificationMessage = document.getElementById('notification-message');
        const icon = notification.querySelector('i');
        
        if (notification && notificationMessage && icon) {
            notificationMessage.textContent = message;
            notification.className = 'notification active'; 
            
            let iconClass = 'fas fa-check-circle';
            if (type === 'error') {
                notification.classList.add('error');
                iconClass = 'fas fa-exclamation-circle';
            } else if (type === 'info') {
                notification.classList.add('info');
                iconClass = 'fas fa-info-circle';
            } else { 
                notification.classList.add('success');
            }
            icon.className = iconClass;
            
            setTimeout(() => {
                notification.classList.remove('active');
            }, 3500);
        }
    }

    function loadBlogPosts() {
        const blogDataString = localStorage.getItem('blogPageData');
        const blogGridContainer = document.getElementById('blog-grid-container');

        if (!blogGridContainer) {
            console.error("Blog grid container not found.");
            return;
        }

        let useDynamicData = false;

        if (blogDataString) {
            try {
                const blogPageData = JSON.parse(blogDataString);

                if (blogPageData && blogPageData.pageSettings) {
                    const pageMainTitleEl = document.getElementById('blog-page-main-title');
                    const pageHighlightTitleEl = document.getElementById('blog-page-highlight-title');
                    if (blogPageData.pageSettings.title) {
                        const title = blogPageData.pageSettings.title;
                        const lastSpaceIndex = title.lastIndexOf(' ');
                        if (pageMainTitleEl && pageHighlightTitleEl && lastSpaceIndex > -1 && lastSpaceIndex < title.length - 1) {
                            pageMainTitleEl.firstChild.nodeValue = title.substring(0, lastSpaceIndex + 1);
                            pageHighlightTitleEl.textContent = title.substring(lastSpaceIndex + 1);
                        } else if (pageMainTitleEl) {
                            pageMainTitleEl.firstChild.nodeValue = title;
                            if(pageHighlightTitleEl) pageHighlightTitleEl.textContent = ""; // Clear highlight if no space
                        }
                    }
                    const pageDescEl = document.getElementById('blog-page-description');
                    if (pageDescEl && blogPageData.pageSettings.description) {
                        pageDescEl.textContent = blogPageData.pageSettings.description;
                    }
                }

                if (blogPageData && blogPageData.blogPosts && Array.isArray(blogPageData.blogPosts) && blogPageData.blogPosts.length > 0) {
                    useDynamicData = true;
                    blogGridContainer.innerHTML = ''; // Clear static fallback

                    blogPageData.blogPosts.forEach((post, index) => {
                        const card = document.createElement('div');
                        card.className = 'blog-entry-card';
                        card.dataset.blogId = post.id || `post-${index}`;
                        // Apply staggered animation delay
                        card.style.animationDelay = `${index * 0.1}s`;


                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'blog-entry-image-container';
                        const image = document.createElement('img');
                        image.src = post.imageUrl || 'placeholder-blog-image.jpg'; // Fallback image
                        image.alt = post.title || 'Blog post image';
                        image.className = 'blog-entry-image';
                        imageContainer.appendChild(image);

                        const content = document.createElement('div');
                        content.className = 'blog-entry-content';

                        const header = document.createElement('div');
                        header.className = 'blog-entry-header';
                        const titleEl = document.createElement('h2');
                        titleEl.className = 'post-title';
                        titleEl.textContent = post.title || 'Untitled Post';
                        const dateEl = document.createElement('span');
                        dateEl.className = 'post-date';
                        dateEl.textContent = post.date || 'No Date';
                        header.appendChild(titleEl);
                        header.appendChild(dateEl);

                        const excerptEl = document.createElement('p');
                        excerptEl.className = 'post-excerpt';
                        excerptEl.textContent = post.excerpt || 'No summary available.';

                        const meta = document.createElement('div');
                        meta.className = 'post-meta';
                        const tagsContainer = document.createElement('div');
                        tagsContainer.className = 'post-tags';
                        if (post.tags && Array.isArray(post.tags)) {
                            post.tags.forEach(tagText => {
                                const tag = document.createElement('span');
                                tag.className = 'tag';
                                tag.textContent = tagText;
                                tagsContainer.appendChild(tag);
                            });
                        }
                        const readMoreLink = document.createElement('a');
                        readMoreLink.href = post.readMoreUrl || '#';
                        if (post.readMoreUrl && !post.readMoreUrl.startsWith('#') && !post.readMoreUrl.startsWith('javascript:')) {
                           readMoreLink.target = '_blank';
                           readMoreLink.rel = 'noopener noreferrer';
                        }
                        readMoreLink.className = 'read-more-link';
                        readMoreLink.innerHTML = `Read More <i class="fas fa-arrow-right"></i>`;
                        
                        meta.appendChild(tagsContainer);
                        meta.appendChild(readMoreLink);
                        
                        content.appendChild(header);
                        content.appendChild(excerptEl);
                        content.appendChild(meta);
                        
                        card.appendChild(imageContainer);
                        card.appendChild(content);
                        blogGridContainer.appendChild(card);
                    });
                } else if (blogPageData && blogPageData.blogPosts && blogPageData.blogPosts.length === 0) {
                    useDynamicData = true; // Dynamic data source was used, but it's empty
                    blogGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--gray);">No blog posts have been added yet. The admin can add entries via the admin panel.</p>';
                }


            } catch (e) {
                console.error("Error parsing blog data from localStorage:", e);
                // showNotification("Error loading blog posts. Displaying defaults.", "error");
                // Static content remains if parsing fails
            }
        }

        if (!useDynamicData && blogGridContainer.children.length > 0) {
            // If using static and there's content, apply animation delay to it.
             Array.from(blogGridContainer.children).forEach((card, index) => {
                if (card.classList.contains('blog-entry-card')) {
                    card.style.animationDelay = `${index * 0.1}s`;
                }
            });
           // showNotification("Displaying default blog content.", "info");
        } else if (!useDynamicData && blogGridContainer.children.length === 0) {
            blogGridContainer.innerHTML = '<p style="text-align:center; grid-column: 1 / -1; color: var(--gray);">No blog posts available at the moment.</p>';
        }
    }
    
    loadBlogPosts();
});
