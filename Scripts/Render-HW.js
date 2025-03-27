document.getElementById("screen-width").textContent = window.innerWidth;
document.getElementById("screen-height").textContent = window.innerHeight;
window.addEventListener("resize", () => {
  document.getElementById("screen-width").textContent = window.innerWidth;
  document.getElementById("screen-height").textContent = window.innerHeight;
});

const hw = document.querySelector(".hw");
const hwbutton = document.querySelector(".render-hw-button");

hwbutton.addEventListener("click", () => {
  if (hw.style.display === "none" || hw.style.display === "") {
    hw.style.display = "flex";
  } else {
    hw.style.display = "none";
  }
});
