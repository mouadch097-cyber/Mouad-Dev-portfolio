// ==========================================
// Mouad.Dev - Animated Stats Counters
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
    const statsBar = document.querySelector(".stats-counter-bar");
    if (!statsBar) return;

    let hasAnimated = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                animateCounters();
            }
        });
    }, { threshold: 0.2 });

    observer.observe(statsBar);

    function animateCounters() {
        const counters = statsBar.querySelectorAll(".stat-number");
        counters.forEach(counter => {
            const text = counter.textContent.trim();
            // Handle cases like "3+", "25+", "100%", "24/7"
            if (text.includes('/')) return; // keep 24/7 static

            const target = parseInt(text.replace(/[^0-9]/g, '')) || 0;
            const suffix = text.replace(/[0-9]/g, '');

            let current = 0;
            const duration = 1200;
            const stepTime = 25;
            const totalSteps = duration / stepTime;
            const increment = target / totalSteps;

            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    counter.textContent = target + suffix;
                    clearInterval(timer);
                } else {
                    counter.textContent = Math.floor(current) + suffix;
                }
            }, stepTime);
        });
    }
});
