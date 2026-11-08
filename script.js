// --- URL Resolver: Ensures paths resolve across custom domains, subpaths, and live hosts ---
function getComponentUrl(relativePath) {
    return new URL(relativePath, window.location.href).href;
}

// --- Component Loader with Visual Diagnostic Fallback ---
async function loadComponent(targetSelector, relativePath) {
    const el = document.querySelector(targetSelector);
    if (!el) {
        console.error(`Target selector "${targetSelector}" not found in DOM.`);
        return false;
    }

    const fullUrl = getComponentUrl(relativePath);

    try {
        const res = await fetch(fullUrl, { cache: 'no-cache' });
        if (!res.ok) {
            throw new Error(`HTTP ${res.status} (${res.statusText || 'Not Found'})`);
        }
        const html = await res.responseText();
        el.innerHTML = html;
        return true;
    } catch (err) {
        console.error(`[Component Error] Failed to load "${relativePath}":`, err);

        // Visual on-screen diagnostic box
        el.innerHTML = `
            <div style="border: 1px solid #ff0055; background: rgba(255,0,85,0.15); color: #ff0055; padding: 16px; margin: 10px 0; font-family: monospace; font-size: 13px; line-height: 1.5; border-radius: 4px;">
                <strong style="color: #00ffff;">[KANSO_LOAD_ERROR]</strong> Failed to load component: <code>${relativePath}</code><br>
                <strong>Requested URL:</strong> <code>${fullUrl}</code><br>
                <strong>Error:</strong> ${err.message}<br>
                ${window.location.protocol === 'file:' ? '<br><span style="color:#ffff00;">⚠️ Local file detection: Modern browsers block fetch() over <code>file:///</code>. Run a local web server (e.g., VS Code Live Server) or view on your GitHub Pages URL.</span>' : ''}
            </div>
        `;
        return false;
    }
}

// --- Dynamic URL Hash Routing ---
function navigateToHash() {
    let rawHash = window.location.hash.replace(/^#/, '').trim();
    let pageId = rawHash || 'home';

    if (!document.getElementById(pageId + '-content')) {
        pageId = 'home';
    }

    document.querySelectorAll('.page-content').forEach(section => {
        section.classList.remove('active');
    });
    const targetContent = document.getElementById(pageId + '-content');
    if (targetContent) {
        targetContent.classList.add('active');
    }

    document.querySelectorAll('.page-title').forEach(title => {
        title.classList.remove('active');
    });
    const targetTitle = document.getElementById(pageId + '-title');
    if (targetTitle) {
        targetTitle.classList.add('active');
    }
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
    const tabs = document.querySelectorAll('.comp-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
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
        mainMenuBtn.addEventListener('click', (e) => {
            if (window.innerWidth <= 900) {
                e.preventDefault();
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
    if (e.touches && e.touches.length > 0) {
        updateGlowPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
}, { passive: true });

// --- Orchestrated Bootstrap ---
async function bootstrap() {
    // 1. Load persistent navigation and header
    await Promise.all([
        loadComponent('#slot-nav', 'components/nav.html'),
        loadComponent('#slot-header', 'components/header.html')
    ]);

    // 2. Load all content sections
    const pageSlots = Array.from(document.querySelectorAll('.page-content[data-component]'));
    await Promise.all(pageSlots.map(slot => {
        const file = slot.getAttribute('data-component');
        return loadComponent(`#${slot.id}`, file);
    }));

    // 3. Initialize dynamic listeners and route
    initMobileMenu();
    initTelemetryWidget();
    navigateToHash();
}

// Prevent DOMContentLoaded race condition
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootstrap);
} else {
    bootstrap();
}
