// ==========================================
// Mouad.Dev - Main Application JS
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
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
