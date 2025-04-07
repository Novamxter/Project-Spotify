const scrollContainer = document.querySelector(".library-card-container");
const topDiv = document.querySelector(".library-top");

scrollContainer.addEventListener("scroll", () => {
    if (scrollContainer.scrollTop > 10) {
        topDiv.style.setProperty("--library-gradient", "linear-gradient(to bottom, rgb(0,0,0,0.6) 3%,transparent 60%)");
    } else {
        topDiv.style.setProperty("--library-gradient", "transparent");
    }
});