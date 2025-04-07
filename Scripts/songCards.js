const screenCategories = [
  {name: "extraLarge", min: 1731, max: 2022},
  {name: "large",min: 1440, max: 1731},
  {name: "mediumLarge",min: 1245, max: 1440},
  {name: "medium", min: 1082, max: 1246},
  {name: "small", min:0, max:1082}
];
let globalData = []; // store fetched JSON
let lastScreenCategory = ""; // to avoid unnecessary renders

export async function addSongs() {
  try {
    let response = await fetch("JSON_Data/song_cards.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    globalData = await response.json();
    renderSections(globalData);
    window.addEventListener("resize", () => handleResize(globalData));
  } catch (e) {
    console.log("JSON data not fetched ..", e);
  }
}

function getScreenCategory() {
  const width = window.innerWidth;
  const category = screenCategories.find(cat => width > cat.min && width <= cat.max);
  return category ? category.name : "unknown";
}
function handleResize(data) {
  const currentCategory = getScreenCategory();
  if (currentCategory !== lastScreenCategory) {
    renderSections(data);
  }
}

function renderSections(data) {
  lastScreenCategory = getScreenCategory();
  const container = document.querySelector('.main-right-section');
  container.innerHTML = ''; // clear old content

  data.forEach((row) => {
    createSection(row, container);
  });

  createFooter(container);
}
function filterItems(items) {
  const category = getScreenCategory();

  switch (category) {
    case "extraLarge":
      return items.slice(0, 7);
    case "large":
      return items.slice(0, 6);
    case "mediumLarge":
      return items.slice(0, 5);
    case "medium":
      return items.slice(0, 4);
    default:
      return items;
  }
}

function createSection(item, parent) {
  const section = document.createElement("div");
  section.className = "song-section";
  section.innerHTML = `<h3>${item.title}</h3>`;
  section.innerHTML += createItems(item.items);
  parent.appendChild(section);
}

function createItems(items) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "song-items";
  const filtered = filterItems(items);

  filtered.forEach((item) => {
    const div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = `
      <div class="song-img">
        <img src="${item.imgSrc}" alt="${item.subTitle}" loading="lazy">
      </div>
      <div class="song-title">
        <p>${item.subTitle}</p>
      </div>`;
    mainDiv.appendChild(div);
  });

  return mainDiv.outerHTML;
}

function createFooter(parent) {
  const footer = document.createElement("footer");
  footer.className = "lap-footer";
  footer.innerHTML = `
    <div class="right-footer">
      <div class="footer-links-one right-footer-links">
        <div>
          <p>Company</p>
          <a href="#">About</a>
          <a href="#">Job</a>
          <a href="#">For the Record</a>
        </div>
        <div>
          <p>Communities</p>
          <a href="#">For Artists</a>
          <a href="#">Developers</a>
          <a href="#">Advertising</a>
          <a href="#">Investors</a>
          <a href="#">Vendors</a>
        </div>
        <div>
          <p>Useful links</p>
          <a href="#">Support</a>
          <a href="#">Free Mobile App</a>
        </div>
        <div>
          <p>Spotify Plans</p>
          <a href="#">Premium Individual</a>
          <a href="#">Premium Duo</a>
          <a href="#">Premium Family</a>
          <a href="#">Premium Student</a>
          <a href="#">Spotify Free</a>
        </div>
        <ul class="footer-list">
        <a href="#"><li><img src="./assets/Svg/insta.svg" alt="" /></li></a>
          <a href="#"><li><img src="./assets/Svg/twitter.svg" alt="" /></li></a>
          <a href="#"><li><img src="./assets/Svg/facebook.svg" alt="" /></li></a>
        </ul>
      </div>
    </div>
    <div class="footer-line"></div>
    <div class="footer-links-two">
      <div>
            <a href="#" class="switchable">Legal</a>
            <a href="#" class="switchable">Safety & Privacy Center</a>
            <a href="#" class="switchable">Privacy Policy</a>
            <a href="#" class="switchable">Cookies</a>
            <a href="#" class="switchable">About Ads</a>
            <a href="#" class="switchable">Accessibility</a>
            <a href="#">&#169; 2025 Spotify AB</a>
          </div>
          <button class="lang-btn switchable"">
            <img src="./assets/Svg/web.svg" alt="" />
            <span>English</span>
          </button>
        </div>
  `;
  parent.appendChild(footer);
}