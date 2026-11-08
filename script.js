// --- Component Loader ---
async function loadComponent(targetSelector, fileUrl) {
    const el = document.querySelector(targetSelector);
    if (!el) return false;
    try {
        const res = await fetch(fileUrl);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        el.innerHTML = await res.responseText();
        return true;
    } catch (err) {
        console.error(`Failed to load component ${fileUrl}:`, err);
        return false;
    }
}

// --- Dynamic URL Hash Routing ---
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

// --- Telemetry Data & Switcher Logic ---
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

function initTelemetryWidget() {
    document.querySelectorAll('.comp-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.comp-tab').forEach(t => t.classList.remove('active'));
            e.currentTarget.classList.add('active');

            const board = e.currentTarget.getAttribute('data-board');
            const data = telemetryData[board];
            if (!data) return;

            const cpuBar = document.getElementById('bar-cpu');
            const cpuVal = document.getElementById('val-cpu');
            const ramBar = document.getElementById('bar-ram');
            const ramVal = document.getElementById('val-ram');
            const effBar = document.getElementById('bar-eff');
            const effVal = document.getElementById('val-eff');
            const archVal = document.getElementById('val-arch');

            if (cpuBar) cpuBar.style.width = data.cpuW;
            if (cpuVal) cpuVal.innerText = data.cpuV;
            if (ramBar) ramBar.style.width = data.ramW;
            if (ramVal) ramVal.innerText = data.ramV;
            if (effBar) effBar.style.width = data.effW;
            if (effVal) effVal.innerText = data.effV;
            if (archVal) archVal.innerText = data.arch;
        });
    });
}

// --- Mobile Navigation Click/Tap Toggle ---
function initMobileMenu() {
    const navWrapper = document.querySelector('.nav-wrapper');
    const mainMenuBtn = document.querySelector('.main-wrapper');

    if (mainMenuBtn && navWrapper) {
        mainMenuBtn.addEventListener('click', () => {
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
}

// --- Mouse & Touch Glow Engine ---
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

document.addEventListener('touchmove', (e) => {
    if (e.touches.length > 0) {
        updateGlowPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// --- Bootstrapping ---
document.addEventListener('DOMContentLoaded', async () => {
    await Promise.all([
        loadComponent('#slot-nav', './components/nav.html'),
        loadComponent('#slot-header', './components/header.html')
    ]);

    const pageSlots = Array.from(document.querySelectorAll('.page-content[data-component]'));
    await Promise.all(pageSlots.map(slot => {
        const file = slot.getAttribute('data-component');
        return loadComponent(`#${slot.id}`, file);
    }));

    initMobileMenu();
    initTelemetryWidget();
    navigateToHash();
});
