// Handle proximity glow for both Menu and Project grid
document.addEventListener('mousemove', (e) => {
    // Query both navigation hexes and project grid hexes
    const wrappers = document.querySelectorAll('.hex-wrapper, .proj-hex-wrapper');
    
    wrappers.forEach(wrapper => {
        const rect = wrapper.getBoundingClientRect();
        const hexX = rect.left + rect.width / 2;
        const hexY = rect.top + rect.height / 2;
        
        const distX = e.clientX - hexX;
        const distY = e.clientY - hexY;
        const distance = Math.sqrt(distX * distX + distY * distY);
        
        // Scaled the glow reach up slightly for the larger grid items
        const maxDistance = 300; 
        let intensity = 0;
        if (distance < maxDistance) {
            intensity = 1 - (distance / maxDistance);
        }
        wrapper.style.setProperty('--glow', intensity);
    });
});

// Handle Single Page Navigation
document.querySelectorAll('.hex-wrapper').forEach(link => {
    link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        if (!targetHref || !targetHref.startsWith('#')) return;
        
        e.preventDefault();
        const targetId = targetHref.substring(1); 
        
        // Swap Content
        document.querySelectorAll('.page-content').forEach(section => section.classList.remove('active'));
        const targetContent = document.getElementById(targetId + '-content');
        if(targetContent) targetContent.classList.add('active');
        
        // Swap Titles
        document.querySelectorAll('.page-title').forEach(title => title.classList.remove('active'));
        const targetTitle = document.getElementById(targetId + '-title');
        if(targetTitle) targetTitle.classList.add('active');
    });
});
