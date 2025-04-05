const scrollContainer = document.querySelector(".library-card-container");
const topDiv = document.querySelector(".library-top");

scrollContainer.addEventListener("scroll", () => {
    if (scrollContainer.scrollTop > 10) {
        topDiv.style.setProperty("--library-gradient", "linear-gradient(to bottom, black,transparent)");
    } else {
        topDiv.style.setProperty("--library-gradient", "transparent");
    }
});