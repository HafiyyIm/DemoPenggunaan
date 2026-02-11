function toggleMenu() {
    const menu = document.getElementById("menu");
    menu.style.display =
        menu.style.display === "flex" ? "none" : "flex";
}

/* SLIDESHOW AUTO */
let slides = document.querySelectorAll(".slide");
let current = 0;

setInterval(() => {
    slides[current].classList.remove("active");
    current = (current + 1) % slides.length;
    slides[current].classList.add("active");
}, 4000);

/* SMOOTH SCROLL DENGAN OFFSET TEPAT */
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();

        const target = document.querySelector(this.getAttribute('href'));
        const offset = 180; // tinggi header + tajuk

        window.scrollTo({
            top: target.offsetTop - offset,
            behavior: "smooth"
        });
    });
});
