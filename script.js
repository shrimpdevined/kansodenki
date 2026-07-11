document.addEventListener('mousemove', (e) => {
    const wrappers = document.querySelectorAll('.hex-wrapper, .proj-hex-wrapper');
    
    wrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const hexX = rect.left + rect.width / 2;
        const hexY = rect.top + rect.height / 2;
        
        const distX = e.clientX - hexX;
        const distY = e.clientY - hexY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        const maxDistance = 300; 
        let intensity = 0;
        if (distance < maxDistance) {
            intensity = 1 - (distance / maxDistance);
        }
        wrapper.style.setProperty('--glow', intensity);
    });
});

// Function to handle switching pages based on the URL hash
function navigateToHash() {
    // Get the hash from the URL (remove the '#'), default to 'home' if empty
    let pageId = window.location.hash.substring(1) || 'home';

    // If the user types a random hash that doesn't exist, fallback to home
    if (!document.getElementById(pageId + '-content')) {
        pageId = 'home';
    }
    
    // Hide all pages and titles
    document.querySelectorAll('.page-content').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.page-title').forEach(title => title.classList.remove('active'));

    // Show the target page and title
    const targetContent = document.getElementById(pageId + '-content');
    if(targetContent) targetContent.classList.add('active');
    
    const targetTitle = document.getElementById(pageId + '-title');
    if(targetTitle) targetTitle.classList.add('active');
}

// Listen for URL changes (happens when clicking links or using browser back/forward)
window.addEventListener('hashchange', navigateToHash);

// Run exactly once when the page first loads to read the current URL
window.addEventListener('DOMContentLoaded', navigateToHash);
