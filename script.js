// --- URL Hash Routing (Allows refreshing and back/forward buttons) ---
function navigateToHash() {
    let pageId = window.location.hash.substring(1) || 'home';

    if (!document.getElementById(pageId + '-content')) {
        pageId = 'home';
    }
    
    document.querySelectorAll('.page-content').forEach(section => section.classList.remove('active'));
    document.querySelectorAll('.page-title').forEach(title => title.classList.remove('active'));

    const targetContent = document.getElementById(pageId + '-content');
    if (targetContent) targetContent.classList.add('active');
    
    const targetTitle = document.getElementById(pageId + '-title');
    if (targetTitle) targetTitle.classList.add('active');
}

window.addEventListener('hashchange', navigateToHash);
window.addEventListener('DOMContentLoaded', navigateToHash);


// --- Performance-Optimized Mouse & Touch Glow Engine ---
let isGlowRunning = false;

function updateGlowPosition(clientX, clientY) {
    if (isGlowRunning) return;
    isGlowRunning = true;
    
    window.requestAnimationFrame(() => {
        const wrappers = document.querySelectorAll('.hex-wrapper, .proj-hex-wrapper');
        
        wrappers.forEach(wrapper => {
            const rect = wrapper.getBoundingClientRect();
            const hexX = rect.left + rect.width / 2;
            const hexY = rect.top + rect.height / 2;
            
            const distX = clientX - hexX;
            const distY = clientY - hexY;
            const distance = Math.hypot(distX, distY);
            
            const maxDistance = 300; 
            let intensity = 0;
            if (distance < maxDistance) {
                intensity = 1 - (distance / maxDistance);
            }
            wrapper.style.setProperty('--glow', intensity);
        });
        
        isGlowRunning = false;
    });
}

document.addEventListener('mousemove', (e) => {
    updateGlowPosition(e.clientX, e.clientY);
});

// Touch device handling for dynamic glow
document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        updateGlowPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });


// --- Mobile Navigation Toggle (Ensures submenus open on iOS/Android tap) ---
const navWrapper = document.querySelector('.nav-wrapper');
const mainMenuBtn = document.querySelector('.main-wrapper');

if (mainMenuBtn && navWrapper) {
    mainMenuBtn.addEventListener('click', (e) => {
        // Toggle mobile sub-menu on click/tap
        if (window.innerWidth <= 900) {
            navWrapper.classList.toggle('menu-open');
        }
    });

    document.querySelectorAll('.sub-wrapper').forEach(subLink => {
        subLink.addEventListener('click', () => {
            if (window.innerWidth <= 900) {
                navWrapper.classList.remove('menu-open');
            }
        });
    });
}


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
        document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
        e.currentTarget.classList.add('active');

        const board = e.currentTarget.getAttribute('data-board');
        const data = telemetryData[board];
        if (!data) return;

        document.getElementById('bar-cpu').style.width = data.cpuW;
        document.getElementById('val-cpu').innerText = data.cpuV;

        document.getElementById('bar-ram').style.width = data.ramW;
        document.getElementById('val-ram').innerText = data.ramV;

        document.getElementById('bar-eff').style.width = data.effW;
        document.getElementById('val-eff').innerText = data.effV;

        document.getElementById('val-arch').innerText = data.arch;
    });
});
