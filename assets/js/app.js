// ==========================================
// Mouad.Dev - Main Application JS
// ==========================================

// ------------------------------------------
// Feature 1: Loading Screen
// ------------------------------------------
window.addEventListener('load', () => {
    setTimeout(() => {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(() => loader.remove(), 600);
        }
    }, 1200);
});

// ------------------------------------------
// Feature 2: Dark / Light Mode Init
// ------------------------------------------
function updateThemeIcon(theme) {
    const themeToggle = document.getElementById('theme-toggle');
    const icon = themeToggle?.querySelector('i');
    if (icon) {
        icon.className = theme === 'dark' ? 'fas fa-moon' : 'fas fa-sun';
    }
}

function initTheme() {
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle?.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme') || 'dark';
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });
}

// ------------------------------------------
// Feature 3: AR/EN Language Switcher Init
// ------------------------------------------
let currentLang = localStorage.getItem('lang') || 'en';

async function applyLanguage(lang) {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    const label = document.getElementById('lang-label');
    if (label) {
        label.textContent = lang === 'ar' ? 'EN' : 'AR';
    }
    try {
        const res = await fetch(`assets/i18n/${lang}.json`);
        if (!res.ok) return;
        const t = await res.json();
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
    } catch (e) {
        console.error('Error loading language file:', e);
    }
}

function initLanguage() {
    applyLanguage(currentLang);

    document.getElementById('lang-toggle')?.addEventListener('click', () => {
        currentLang = currentLang === 'en' ? 'ar' : 'en';
        localStorage.setItem('lang', currentLang);
        applyLanguage(currentLang);
    });
}

// ------------------------------------------
// DOM Content Loaded Handler
// ------------------------------------------
document.addEventListener("DOMContentLoaded", () => {
    // Initialize Theme & Language
    initTheme();
    initLanguage();

    // ----------------------------------------
    // Mobile Navigation (Burger Menu)
    // ----------------------------------------
    const menuBtn = document.querySelector(".menu-btn");
    const navLinks = document.querySelector(".nav-links");
    const menuIcon = menuBtn ? menuBtn.querySelector("i") : null;

    if (menuBtn && navLinks) {
        menuBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const isOpen = navLinks.classList.toggle("active");
            if (menuIcon) {
                if (isOpen) {
                    menuIcon.classList.remove("fa-bars");
                    menuIcon.classList.add("fa-xmark");
                } else {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            }
        });

        // Close menu when clicking on any link
        navLinks.querySelectorAll("a").forEach(link => {
            link.addEventListener("click", () => {
                navLinks.classList.remove("active");
                if (menuIcon) {
                    menuIcon.classList.remove("fa-xmark");
                    menuIcon.classList.add("fa-bars");
                }
            });
        });

        // Close menu when clicking anywhere outside
        document.addEventListener("click", (e) => {
            if (!navLinks.contains(e.target) && !menuBtn.contains(e.target)) {
                if (navLinks.classList.contains("active")) {
                    navLinks.classList.remove("active");
                    if (menuIcon) {
                        menuIcon.classList.remove("fa-xmark");
                        menuIcon.classList.add("fa-bars");
                    }
                }
            }
        });
    }

    // ----------------------------------------
    // Typed.js Animation
    // ----------------------------------------
    const typingElement = document.getElementById("typing");
    if (typingElement && typeof Typed !== "undefined") {
        new Typed("#typing", {
            strings: [
                "Full Stack Developer",
                "Mobile App Developer",
                "AI Developer",
                "Creative Designer"
            ],
            typeSpeed: 60,
            backSpeed: 35,
            backDelay: 1800,
            loop: true
        });
    }

    // ----------------------------------------
    // AOS Initialization
    // ----------------------------------------
    if (typeof AOS !== "undefined") {
        AOS.init({
            duration: 800,
            once: true,
            offset: 50
        });
    }
});
