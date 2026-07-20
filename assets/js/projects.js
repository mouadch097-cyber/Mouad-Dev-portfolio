// ======================================
// Projects Page
// Mouad.Dev
// ======================================

// AOS
AOS.init({
    duration: 900,
    once: true
});

// =============================
// Search
// =============================

const searchInput = document.getElementById("searchProject");

if (searchInput) {

    searchInput.addEventListener("keyup", function () {

        const value = this.value.toLowerCase();

        const cards = document.querySelectorAll(".project-card");

        cards.forEach(card => {

            const title = card.querySelector("h3").textContent.toLowerCase();

            const description = card.querySelector("p").textContent.toLowerCase();

            if (
                title.includes(value) ||
                description.includes(value)
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

}

// =============================
// Filter
// =============================

const filterButtons = document.querySelectorAll(".filter-btn");

const cards = document.querySelectorAll(".project-card");

filterButtons.forEach(button => {

    button.addEventListener("click", () => {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        button.classList.add("active");

        const filter = button.dataset.filter;

        cards.forEach(card => {

            if (
                filter === "all" ||
                card.classList.contains(filter)
            ) {

                card.style.display = "block";

            } else {

                card.style.display = "none";

            }

        });

    });

});

// =============================
// Back To Top
// =============================

const backTop = document.getElementById("backTop");

window.addEventListener("scroll", () => {

    if (window.scrollY > 400) {

        backTop.style.opacity = "1";
        backTop.style.pointerEvents = "auto";

    } else {

        backTop.style.opacity = "0";
        backTop.style.pointerEvents = "none";

    }

});

backTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});

// =============================
// Card Animation
// =============================

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.transform = "translateY(-12px) scale(1.02)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.transform = "";

    });

});