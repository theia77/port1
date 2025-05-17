// admin-dashboard.js
import { auth, db, storage } from './firebase-init.js'; // Ensure storage is exported from firebase-init.js
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.7.1/firebase-auth.js";
import {
    collection, doc, addDoc, getDocs, getDoc, updateDoc, deleteDoc, serverTimestamp, query, orderBy,
    setDoc // for settings that have a fixed ID
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-firestore.js";
import {
    ref, uploadBytesResumable, getDownloadURL, deleteObject
} from "https://www.gstatic.com/firebasejs/11.7.1/firebase-storage.js";

// DOM Elements
const adminUserEmailDisplay = document.getElementById('admin-user-email');
const logoutButton = document.getElementById('logout-button');
const sidebarNavItems = document.querySelectorAll('.sidebar-nav .nav-item');
const contentSections = document.querySelectorAll('.content-section');
const sectionTitleDisplay = document.getElementById('section-title');
const addNewItemButton = document.getElementById('add-new-item-button');

// Modal Elements
const itemModal = document.getElementById('item-modal');
const modalTitle = document.getElementById('modal-title');
const itemForm = document.getElementById('item-form');
const dynamicFormFieldsContainer = document.getElementById('dynamic-form-fields');
const itemIdInput = document.getElementById('item-id');
const saveItemButton = document.getElementById('save-item-button');
const cancelModalButton = document.getElementById('cancel-modal-button');
const closeModalButton = document.querySelector('.close-modal-button');
const fileUploadGroup = document.querySelector('.file-upload-group');
const itemAttachmentInput = document.getElementById('item-attachment');
const attachmentPreview = document.getElementById('attachment-preview');
const currentAttachmentInfo = document.getElementById('current-attachment-info');


// Notification Elements
const adminNotification = document.getElementById('admin-notification');
const adminNotificationMessage = document.getElementById('admin-notification-message');

let currentSection = 'overview'; // To keep track of the active section
let currentEditingItem = null; // To store item data when editing
let currentFileUpload = null; // To store file to be uploaded

// --- Authentication Check ---
onAuthStateChanged(auth, (user) => {
    if (user) {
        adminUserEmailDisplay.textContent = user.email;
        // User is signed in, load initial data for overview or default section
        loadSectionData(currentSection);
        updateOverviewStats(); // Load overview stats
    } else {
        // No user is signed in, redirect to login page
        window.location.href = 'auth.html';
    }
});

// --- Logout ---
logoutButton.addEventListener('click', () => {
    signOut(auth).catch((error) => {
        console.error("Logout Error:", error);
        showAdminNotification("Logout failed: " + error.message, true);
    });
});

// --- Navigation ---
sidebarNavItems.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const section = item.dataset.section;

        sidebarNavItems.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        contentSections.forEach(content => content.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        sectionTitleDisplay.textContent = item.textContent.trim().replace(item.querySelector('i').outerHTML, '').trim(); // Get text content without icon
        currentSection = section;
        addNewItemButton.style.display = ['education', 'experience', 'projects', 'skills', 'blogs'].includes(section) ? 'inline-flex' : 'none';

        loadSectionData(currentSection);
    });
});

// --- Load Data for Current Section ---
async function loadSectionData(section) {
    console.log(`Loading data for section: ${section}`);
    const containerId = `${section}-items-container`;
    const container = document.getElementById(containerId);

    if (['education', 'experience', 'projects', 'skills', 'blogs'].includes(section)) {
        if (!container) {
            console.error(`Container not found for section ${section}`);
            return;
        }
        container.innerHTML = '<p>Loading items...</p>'; // Loading indicator
        try {
            const q = query(collection(db, section), orderBy('timestamp', 'desc')); // Assuming a timestamp field for ordering
            const querySnapshot = await getDocs(q);
            const items = [];
            querySnapshot.forEach((doc) => {
                items.push({ id: doc.id, ...doc.data() });
            });
            renderItemList(items, section, container);
        } catch (error) {
            console.error(`Error loading ${section}: `, error);
            container.innerHTML = `<p class="error-text">Error loading ${section}.</p>`;
            showAdminNotification(`Error loading ${section}: ${error.message}`, true);
        }
    } else if (section === 'contact-details') {
        loadContactDetails();
    } else if (section === 'site-settings') {
        loadSiteSettings();
    }
}

// --- Render Item List ---
function renderItemList(items, section, container) {
    container.innerHTML = ''; // Clear previous items or loading indicator
    if (items.length === 0) {
        container.innerHTML = `<p>No ${section} items found. Click "Add New" to create one.</p>`;
        return;
    }
    items.forEach(item => {
        const card = document.createElement('div');
        card.className = 'item-card';
        card.innerHTML = getItemCardHTML(item, section); // Helper function to generate card HTML

        const editButton = card.querySelector('.edit-button');
        const deleteButton = card.querySelector('.delete-button');

        if (editButton) {
            editButton.addEventListener('click', () => openItemModal(section, item));
        }
        if (deleteButton) {
            deleteButton.addEventListener('click', () => deleteItem(section, item.id, item.imageURL || item.attachmentURL)); // Pass URL if image/attachment needs deletion from storage
        }
        container.appendChild(card);
    });
}

// --- Generate HTML for different item cards ---
function getItemCardHTML(item, section) {
    let details = '';
    switch (section) {
        case 'education':
            details = `
                <h3>${item.degree}</h3>
                <p><strong>Institution:</strong> ${item.institution}</p>
                <p><strong>Year:</strong> ${item.year}</p>
                <p>${item.description || ''}</p>
            `;
            break;
        case 'experience':
            details = `
                <h3>${item.title}</h3>
                <p><strong>Company:</strong> ${item.company}</p>
                <p><strong>Dates:</strong> ${item.dates}</p>
                <p>${item.description || ''}</p>
            `;
            break;
        case 'projects':
            details = `
                <h3>${item.title}</h3>
                ${item.imageURL ? `<img src="${item.imageURL}" alt="${item.title}" class="item-image-preview">` : ''}
                <p>${item.description || ''}</p>
                <p><strong>Tech Stack:</strong> ${item.techStack ? item.techStack.join(', ') : 'N/A'}</p>
                ${item.liveLink ? `<p><a href="${item.liveLink}" target="_blank">Live Demo</a></p>` : ''}
                ${item.repoLink ? `<p><a href="${item.repoLink}" target="_blank">Repository</a></p>` : ''}
                ${item.attachmentURL ? `<p><a href="${item.attachmentURL}" target="_blank">View Attachment: ${item.attachmentName || 'File'}</a></p>` : ''}
            `;
            break;
        case 'skills':
            details = `
                <h3>${item.name}</h3>
                <p><strong>Category:</strong> ${item.category}</p>
                <p><strong>Proficiency:</strong> ${item.proficiency || 'N/A'}</p>
            `;
            break;
        case 'blogs':
            details = `
                <h3>${item.title}</h3>
                 ${item.featuredImageURL ? `<img src="${item.featuredImageURL}" alt="${item.title}" class="item-image-preview">` : ''}
                <p><strong>Published:</strong> ${item.publishDate ? new Date(item.publishDate.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
                <p class="tags">${item.tags ? item.tags.map(tag => `<span>${tag}</span>`).join('') : ''}</p>
            `;
            break;
        default:
            details = `<p>Item ID: ${item.id}</p>`;
    }
    return `
        ${details}
        <div class="item-actions">
            <button class="action-button edit-button"><i class="fas fa-edit"></i> Edit</button>
            <button class="action-button delete-button"><i class="fas fa-trash"></i> Delete</button>
        </div>
    `;
}

// --- Modal Management ---
addNewItemButton.addEventListener('click', () => {
    openItemModal(currentSection, null); // null for new item
});

if(closeModalButton) closeModalButton.addEventListener('click', closeItemModal);
if(cancelModalButton) cancelModalButton.addEventListener('click', closeItemModal);
itemModal.addEventListener('click', (e) => { // Close on overlay click
    if (e.target === itemModal) {
        closeItemModal();
    }
});

function openItemModal(section, itemToEdit = null) {
    currentEditingItem = itemToEdit;
    itemForm.reset();
    itemIdInput.value = itemToEdit ? itemToEdit.id : '';
    modalTitle.textContent = itemToEdit ? `Edit ${section.slice(0, -1)}` : `Add New ${section.slice(0, -1)}`; // Singularize section name

    dynamicFormFieldsContainer.innerHTML = ''; // Clear previous fields
    const fields = getFieldsForSection(section, itemToEdit);
    fields.forEach(field => {
        dynamicFormFieldsContainer.appendChild(createFormField(field));
    });

    // Handle file uploads visibility
    if (['projects', 'blogs'].includes(section)) { // Sections that support attachments
        fileUploadGroup.style.display = 'block';
        attachmentPreview.style.display = 'none';
        currentAttachmentInfo.textContent = '';
        if (itemToEdit && (itemToEdit.imageURL || itemToEdit.attachmentURL || itemToEdit.featuredImageURL)) {
            const url = itemToEdit.imageURL || itemToEdit.attachmentURL || itemToEdit.featuredImageURL;
            if (url.match(/\.(jpeg|jpg|gif|png)$/) != null) { // Check if it's an image URL
                 attachmentPreview.src = url;
                 attachmentPreview.style.display = 'block';
            }
            currentAttachmentInfo.textContent = `Current: ${itemToEdit.attachmentName || 'File attached'}`;
        }
    } else {
        fileUploadGroup.style.display = 'none';
    }

    itemModal.classList.add('active');
    itemModal.style.display = 'flex'; // Ensure it's flex for centering
}

function closeItemModal() {
    itemModal.classList.remove('active');
    setTimeout(() => { // Wait for animation
        itemModal.style.display = 'none';
    }, 300);
    currentEditingItem = null;
    currentFileUpload = null;
    itemAttachmentInput.value = ''; // Clear file input
    attachmentPreview.style.display = 'none';
    attachmentPreview.src = '#';
    currentAttachmentInfo.textContent = '';

}

// --- Dynamic Form Field Creation ---
function getFieldsForSection(section, itemData = {}) {
    // Define fields for each section. 'type' can be text, textarea, number, date, file, tags (comma-separated)
    switch (section) {
        case 'education':
            return [
                { name: 'degree', label: 'Degree', type: 'text', value: itemData.degree, required: true },
                { name: 'institution', label: 'Institution', type: 'text', value: itemData.institution, required: true },
                { name: 'year', label: 'Year', type: 'text', value: itemData.year, required: true }, // Could be number
                { name: 'description', label: 'Description', type: 'textarea', value: itemData.description }
            ];
        case 'experience':
            return [
                { name: 'title', label: 'Job Title', type: 'text', value: itemData.title, required: true },
                { name: 'company', label: 'Company', type: 'text', value: itemData.company, required: true },
                { name: 'dates', label: 'Dates (e.g., Jan 2020 - Present)', type: 'text', value: itemData.dates, required: true },
                { name: 'description', label: 'Description', type: 'textarea', value: itemData.description }
            ];
        case 'projects':
            return [
                { name: 'title', label: 'Project Title', type: 'text', value: itemData.title, required: true },
                { name: 'description', label: 'Description', type: 'textarea', value: itemData.description, required: true },
                { name: 'techStack', label: 'Tech Stack (comma-separated)', type: 'tags', value: itemData.techStack ? itemData.techStack.join(', ') : '' },
                { name: 'liveLink', label: 'Live Demo URL', type: 'url', value: itemData.liveLink },
                { name: 'repoLink', label: 'Repository URL', type: 'url', value: itemData.repoLink }
                // File input is handled separately by itemAttachmentInput
            ];
        case 'skills':
            return [
                { name: 'name', label: 'Skill Name', type: 'text', value: itemData.name, required: true },
                { name: 'category', label: 'Category (e.g., Frontend, Backend)', type: 'text', value: itemData.category },
                { name: 'proficiency', label: 'Proficiency (e.g., 80% or Advanced)', type: 'text', value: itemData.proficiency }
            ];
        case 'blogs':
             return [
                { name: 'title', label: 'Blog Title', type: 'text', value: itemData.title, required: true },
                { name: 'content', label: 'Content (Markdown or HTML)', type: 'textarea', value: itemData.content, required: true, rows: 10 },
                { name: 'publishDate', label: 'Publish Date', type: 'date', value: itemData.publishDate ? new Date(itemData.publishDate.seconds * 1000).toISOString().split('T')[0] : '' },
                { name: 'tags', label: 'Tags (comma-separated)', type: 'tags', value: itemData.tags ? itemData.tags.join(', ') : '' }
                // Featured image is handled by itemAttachmentInput
            ];
        default:
            return [];
    }
}

function createFormField({ name, label, type, value = '', required = false, rows = 3 }) {
    const group = document.createElement('div');
    group.className = 'form-group';
    const labelEl = document.createElement('label');
    labelEl.htmlFor = `field-${name}`;
    labelEl.textContent = label + (required ? ' *' : '');
    group.appendChild(labelEl);

    let inputEl;
    if (type === 'textarea') {
        inputEl = document.createElement('textarea');
        inputEl.rows = rows;
    } else {
        inputEl = document.createElement('input');
        inputEl.type = type === 'tags' || type === 'url' ? 'text' : type; // Handle 'tags' as text input
    }
    inputEl.id = `field-${name}`;
    inputEl.name = name;
    inputEl.value = value;
    if (required) inputEl.required = true;

    group.appendChild(inputEl);
    return group;
}

// --- Handle File Input Change ---
itemAttachmentInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        currentFileUpload = file;
        attachmentPreview.src = URL.createObjectURL(file);
        attachmentPreview.style.display = 'block';
        currentAttachmentInfo.textContent = `New: ${file.name}`;
    }
});

// --- Form Submission (Add/Edit Item) ---
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    saveItemButton.disabled = true;
    saveItemButton.textContent = 'Saving...';

    const formData = new FormData(itemForm);
    const data = { timestamp: serverTimestamp() }; // Add timestamp for ordering

    // Collect data from dynamically generated fields
    dynamicFormFieldsContainer.querySelectorAll('input, textarea').forEach(input => {
        if (input.name) {
            if (input.type === 'tags' && input.value.trim()) {
                data[input.name] = input.value.split(',').map(tag => tag.trim());
            } else if (input.type === 'date' && input.value) {
                 data[input.name] = new Date(input.value); // Store as Firebase Timestamp via serverTimestamp or JS Date
            }
            else {
                data[input.name] = input.value;
            }
        }
    });

    try {
        // Handle file upload if a new file is selected
        let fileURL = currentEditingItem ? (currentEditingItem.imageURL || currentEditingItem.attachmentURL || currentEditingItem.featuredImageURL) : null;
        let fileName = currentEditingItem ? currentEditingItem.attachmentName : null;

        if (currentFileUpload) {
            // If there was an old file, delete it first (optional, or keep versions)
            if (fileURL && (currentSection === 'projects' || currentSection === 'blogs')) {
                 try {
                    const oldFileRef = ref(storage, fileURL); // Assumes fileURL is the full gs:// path or https download URL
                    await deleteObject(oldFileRef);
                    console.log("Old file deleted");
                 } catch (delError) {
                    if (delError.code !== 'storage/object-not-found') { // Don't worry if old file not found
                        console.warn("Could not delete old file:", delError);
                    }
                 }
            }

            const filePath = `${currentSection}/${Date.now()}_${currentFileUpload.name}`;
            const storageRef = ref(storage, filePath);
            const uploadTask = uploadBytesResumable(storageRef, currentFileUpload);

            await new Promise((resolve, reject) => {
                uploadTask.on('state_changed',
                    (snapshot) => { /* Progress handling can be added here */ },
                    (error) => {
                        console.error("Upload failed:", error);
                        reject(error);
                    },
                    async () => {
                        fileURL = await getDownloadURL(uploadTask.snapshot.ref);
                        fileName = currentFileUpload.name;
                        resolve();
                    }
                );
            });
        }

        if (fileURL) {
            if (currentSection === 'projects') {
                 data.imageURL = fileURL; // For project images
                 data.attachmentURL = fileURL; // Or specific field for general attachment
                 data.attachmentName = fileName;
            } else if (currentSection === 'blogs') {
                data.featuredImageURL = fileURL;
            }
        }


        if (itemIdInput.value) { // Editing existing item
            const itemRef = doc(db, currentSection, itemIdInput.value);
            await updateDoc(itemRef, data);
            showAdminNotification(`${currentSection.slice(0, -1)} updated successfully!`);
        } else { // Adding new item
            await addDoc(collection(db, currentSection), data);
            showAdminNotification(`${currentSection.slice(0, -1)} added successfully!`);
        }
        closeItemModal();
        loadSectionData(currentSection); // Reload data for the section
        updateOverviewStats(); // Update stats
    } catch (error) {
        console.error(`Error saving ${currentSection.slice(0, -1)}: `, error);
        showAdminNotification(`Error: ${error.message}`, true);
    } finally {
        saveItemButton.disabled = false;
        saveItemButton.textContent = 'Save';
        currentFileUpload = null; // Reset after upload attempt
    }
});

// --- Delete Item ---
async function deleteItem(section, itemId, fileStorageURL = null) {
    if (!confirm(`Are you sure you want to delete this ${section.slice(0,-1)}?`)) return;

    try {
        // If there's a file associated, delete it from Storage first
        if (fileStorageURL) {
            try {
                 const fileRef = ref(storage, fileStorageURL); // Assumes URL is a gs:// or https download URL
                 await deleteObject(fileRef);
                 console.log("Associated file deleted from Storage.");
            } catch (storageError) {
                 if (storageError.code !== 'storage/object-not-found') {
                    console.warn("Could not delete file from Storage:", storageError);
                    // Decide if you want to proceed with Firestore deletion even if storage deletion fails
                 }
            }
        }

        await deleteDoc(doc(db, section, itemId));
        showAdminNotification(`${section.slice(0, -1)} deleted successfully!`);
        loadSectionData(section); // Reload data
        updateOverviewStats();
    } catch (error) {
        console.error(`Error deleting ${section.slice(0, -1)}: `, error);
        showAdminNotification(`Error deleting: ${error.message}`, true);
    }
}


// --- Contact Details Form ---
const contactDetailsForm = document.getElementById('contact-details-form');
async function loadContactDetails() {
    try {
        const docRef = doc(db, "settings", "contactInfo");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            contactDetailsForm.email.value = data.email || '';
            contactDetailsForm.phone.value = data.phone || '';
            contactDetailsForm.linkedin.value = data.linkedin || '';
            contactDetailsForm.github.value = data.github || '';
            contactDetailsForm.twitter.value = data.twitter || '';
            contactDetailsForm.calendly.value = data.calendly || '';
        } else {
            console.log("No contact details found in settings.");
        }
    } catch (error) {
        console.error("Error loading contact details:", error);
        showAdminNotification("Error loading contact details.", true);
    }
}
contactDetailsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        email: contactDetailsForm.email.value,
        phone: contactDetailsForm.phone.value,
        linkedin: contactDetailsForm.linkedin.value,
        github: contactDetailsForm.github.value,
        twitter: contactDetailsForm.twitter.value,
        calendly: contactDetailsForm.calendly.value,
        lastUpdated: serverTimestamp()
    };
    try {
        await setDoc(doc(db, "settings", "contactInfo"), data, { merge: true });
        showAdminNotification("Contact details updated successfully!");
    } catch (error) {
        console.error("Error updating contact details:", error);
        showAdminNotification("Error updating contact details.", true);
    }
});

// --- Site Settings Form ---
const siteSettingsForm = document.getElementById('site-settings-form');
async function loadSiteSettings() {
    try {
        const docRef = doc(db, "settings", "general");
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            siteSettingsForm.siteTitle.value = data.siteTitle || 'SumoVerse';
            siteSettingsForm.footerCopyright.value = data.footerCopyright || `© ${new Date().getFullYear()} SumoVerse. All rights reserved.`;
        } else {
            console.log("No general site settings found.");
        }
    } catch (error) {
        console.error("Error loading site settings:", error);
        showAdminNotification("Error loading site settings.", true);
    }
}
siteSettingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = {
        siteTitle: siteSettingsForm.siteTitle.value,
        footerCopyright: siteSettingsForm.footerCopyright.value,
        lastUpdated: serverTimestamp()
    };
    try {
        await setDoc(doc(db, "settings", "general"), data, { merge: true });
        showAdminNotification("Site settings updated successfully!");
    } catch (error) {
        console.error("Error updating site settings:", error);
        showAdminNotification("Error updating site settings.", true);
    }
});


// --- Overview Stats ---
async function updateOverviewStats() {
    try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        document.getElementById('stat-projects').textContent = projectsSnapshot.size;

        const blogsSnapshot = await getDocs(collection(db, "blogs"));
        document.getElementById('stat-blogs').textContent = blogsSnapshot.size;

        const skillsSnapshot = await getDocs(collection(db, "skills"));
        document.getElementById('stat-skills').textContent = skillsSnapshot.size;
    } catch (error) {
        console.error("Error updating overview stats:", error);
    }
}


// --- Admin Notification Utility ---
function showAdminNotification(message, isError = false) {
    adminNotificationMessage.textContent = message;
    adminNotification.className = 'notification'; // Reset classes
    if (isError) {
        adminNotification.classList.add('error');
    }
    adminNotification.classList.add('show');
    adminNotification.style.display = 'block';


    setTimeout(() => {
        adminNotification.classList.remove('show');
        setTimeout(() => { // Wait for fade out animation
             adminNotification.style.display = 'none';
        }, 300);
    }, 3000);
}

// Initial load for overview
document.addEventListener('DOMContentLoaded', () => {
    // The onAuthStateChanged will trigger the first load,
    // but if it's already fired, we can initiate here.
    // For now, relying on onAuthStateChanged is cleaner.
});
