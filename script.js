// --- URL Hash Routing (Allows refreshing and back/forward buttons) ---
function navigateToHash() {
    let pageId = window.location.hash.substring(1) || 'home';

    if (!document.getElementById(pageId + '-content')) {
        pageId = 'home';
    }
    
    document.querySelectorAll('.page-content').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.page-title').forEach(title => title.classList.remove('active'));

    const targetContent = document.getElementById(pageId + '-content');
    if(targetContent) targetContent.classList.add('active');
    
    const targetTitle = document.getElementById(pageId + '-title');
    if(targetTitle) targetTitle.classList.add('active');
}

window.addEventListener('hashchange', navigateToHash);
window.addEventListener('DOMContentLoaded', navigateToHash);


// --- Performance Optimized Mouse Glow Engine ---
let isGlowRunning = false;

document.addEventListener('mousemove', (e) => {
    // If the browser is currently drawing a frame, skip the math to prevent lag
    if (isGlowRunning) return;
    isGlowRunning = true;
    
    // Wait for the browser to be ready for the next visual update
    window.requestAnimationFrame(() => {
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
        
        isGlowRunning = false; // Reset lock
    });
});


// --- C.L.A.M. Core Telemetry Interactive Matrix ---
const telemetryData = {
    pico1: { 
        cpuW: '13%', cpuV: '133 MHz', 
        ramW: '2%', ramV: '264 KB', 
        effW: '100%', effV: 'EXTREME', 
        arch: 'Cortex-M0+ (Microcontroller)' 
    },
    pico2: { 
        cpuW: '15%', cpuV: '150 MHz', 
        ramW: '5%', ramV: '520 KB', 
        effW: '95%', effV: 'HIGH', 
        arch: 'Cortex-M33 / RISC-V (Microcontroller)' 
    },
    zero1: { 
        cpuW: '50%', cpuV: '1.0 GHz', 
        ramW: '50%', ramV: '512 MB', 
        effW: '60%', effV: 'MODERATE', 
        arch: 'ARM1176JZF-S (32-bit Linux)' 
    },
    zero2: { 
        cpuW: '100%', cpuV: '1.0 GHz (Quad)', 
        ramW: '50%', ramV: '512 MB', 
        effW: '30%', effV: 'HEAVY', 
        arch: 'ARM Cortex-A53 (64-bit Linux)' 
    }
};

document.querySelectorAll('.comp-tab').forEach(tab => {
    tab.addEventListener('click', (e) => {
        // Remove active class from all tabs
        document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
        // Add active class to clicked tab
        e.target.classList.add('active');

        // Fetch the corresponding data
        const board = e.target.getAttribute('data-board');
        const data = telemetryData[board];

        // Animate the DOM elements
        document.getElementById('bar-cpu').style.width = data.cpuW;
        document.getElementById('val-cpu').innerText = data.cpuV;

        document.getElementById('bar-ram').style.width = data.ramW;
        document.getElementById('val-ram').innerText = data.ramV;

        document.getElementById('bar-eff').style.width = data.effW;
        document.getElementById('val-eff').innerText = data.effV;

        document.getElementById('val-arch').innerText = data.arch;
    });
});
