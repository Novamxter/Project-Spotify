const screenCategories = [
  { name: "extraLarge", min: 1731, max: 2022 },
  { name: "large", min: 1440, max: 1731 },
  { name: "mediumLarge", min: 1245, max: 1440 },
  { name: "medium", min: 1082, max: 1246 },
  { name: "small", min: 0, max: 1082 }
];
let globalData = []; // store fetched JSON
let globalPlaylists = [];
let lastScreenCategory = ""; // to avoid unnecessary renders

export async function addSongs(playlists, songCards) {
  globalData = await songCards;
  globalPlaylists = await playlists;
  renderSections(globalData, globalPlaylists);
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(
      () => handleResize(globalData, globalPlaylists),10);
  });
}

function renderSections(data, playlists) {
  lastScreenCategory = getScreenCategory();
  const container = document.querySelector(".main-right-section");
  const mainSongsContainer = document.createElement("section");
  mainSongsContainer.className = "main-songs-container";
  mainSongsContainer.innerHTML = "";
  container.innerHTML = ""; // clear old content

  let clonedData = [...data];
  let last = clonedData.pop();
  console.log(clonedData);
  clonedData.forEach(row => {
    createSection(row, mainSongsContainer);
  });
  createPlaylistSection(playlists, mainSongsContainer);
  createSection(last, mainSongsContainer);
  container.appendChild(mainSongsContainer);
  createListContainer(container);
  createFooter(container);
}

function createSection(item, parent) {
  const section = document.createElement("div");
  section.className = "song-section";
  section.innerHTML = `<h3>${item.title}</h3>`;
  section.innerHTML += createItems(item.items, item.title);
  parent.appendChild(section);
}

function createItems(items, name) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "song-items";
  const filtered = filterItems(items);

  filtered.forEach(item => {
    const div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = `
      <div class="song-img">
        <img src="${item.imgSrc}" alt="${item.subTitle}" class="${
          name === "Popular artists" ? "round" : ""
        } single-song-cover" loading="lazy">
        <div class="play-btn-hover">
          <img src="./assets/Svg/play.svg">
        </div>
      </div>
      <div class="song-title">
        <p>${item.subTitle}</p>
      </div>`;
    mainDiv.appendChild(div);
  });

  return mainDiv.outerHTML;
}

function createPlaylistSection(playlists, parent) {
  const section = document.createElement("section");
  section.className = "song-section";
  section.innerHTML = `<h3>PlayLists</h3>`;
  section.innerHTML += createPlaylists(playlists);
  parent.appendChild(section);
}

function createPlaylists(playlists) {
  console.log(playlists);
  const mainDiv = document.createElement("div");
  mainDiv.className = "song-items";
  if (playlists.length > 1) {
    playlists.forEach(playlist => {
      const div = document.createElement("div");
      div.className = "song-card";
      div.innerHTML = `<div class="song-img">
      ${createCover(playlist)}
      <div class="play-btn-hover">
        <img src="./assets/Svg/play.svg">
      </div>
    </div>
    <div class="song-title">
      <p>${playlist.title}</p>
    </div>`;
      mainDiv.appendChild(div);
    });
  } else {
    const div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = `<div class="song-img">
      <div class="single-song-cover playlist-song-cover">
        ${createCover(playlists[0])}
      </div>
      <div class="play-btn-hover">
        <img src="./assets/Svg/play.svg">
      </div>
    </div>
    <div class="song-title">
      <p>${playlists[0].title}</p>
    </div>`;
    mainDiv.appendChild(div);
  }
  return mainDiv.outerHTML;
}

function createListContainer(parent) {
  const section = document.createElement("section");
  section.className = "song-list-container";
  parent.appendChild(section);
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

function createCover(playlist) {
  // console.log(playlist)
  const covers = playlist.list.slice(0, 4);
  let html = "";
  covers.forEach(cover => {
    html += `<img src="${cover.cover}" alt="${cover.name}" class="playlist-cover" loading="lazy">`;
  });
  return html;
}

function getScreenCategory() {
  const width = window.innerWidth;
  const category = screenCategories.find(
    cat => width > cat.min && width <= cat.max
  );
  return category ? category.name : "unknown";
}
function handleResize(data, playlists) {
  const currentCategory = getScreenCategory();
  if (currentCategory !== lastScreenCategory) {
    renderSections(data, playlists);
  }
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
