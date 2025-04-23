import {managePlayBar} from './play-songs.js'
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

export let popUtils = {
  currentPage : null,
  libOpened : false,
  setCurrentPage(val) {
    this.currentPage = val;
  },
  getCurrentPage() {
    return this.currentPage;
  }
}
export async function addSongs(playlists, songCards) {
  globalData = await songCards;
  globalPlaylists = await playlists;
  const container = document.querySelector(".main-right-js");
  let status = renderSections(globalData, globalPlaylists,container);
  createFooter(container);
  window.addEventListener("resize", () => {
    //handleResize(globalData, globalPlaylists,container);
  });
  return status;
}

function renderSections(data, playlists,container) {
  //lastScreenCategory = getScreenCategory();
  //for re-rendring in song.js
  container.innerHTML = "";
  const mainSongsContainer = document.createElement("section");
  const homePageWrapper = document.createElement("div");
  homePageWrapper.className = "home-page";
  mainSongsContainer.className = "main-songs-container";
  mainSongsContainer.dataset.pActive = "home"
  //mainSongsContainer.innerHTML = "";
  // clear old content
  let clonedData = [...data];
  let last = clonedData.pop();
  clonedData.forEach(row => {
    createSection(row, mainSongsContainer);
  });
  createPlaylistSection(playlists, mainSongsContainer);
  createSection(last, mainSongsContainer);
  homePageWrapper.appendChild(mainSongsContainer);
  container.appendChild(homePageWrapper);
  navigate("home","home")
  handleMainMargin()
  return true;
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
  //console.log(items.slice(0,4))
  const filtered = filterItems(items);
  //console.log(filtered)
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
  const div = document.createElement("div");
  div.className = "song-section home-playlist-section";
  div.innerHTML = `<h3>PlayLists</h3>`;
  div.innerHTML += createPlaylists(playlists);
  parent.appendChild(div);
}

function createPlaylists(playlists) {
  const mainDiv = document.createElement("div");
  mainDiv.className = "song-items";
  playlists.forEach((playlist, index) => {
    const div = document.createElement("div");
    div.className = "song-card home-playlist";
    div.dataset.index = `${index + 1}`;
    div.innerHTML = `<div class="song-img">
      <div class="playlist-song-cover">
      ${createCover(playlist)}
      </div>
      <div class="play-btn-hover">
        <img src="./assets/Svg/play.svg">
      </div>
    </div>
    <div class="song-title">
      <p>${playlist.title}</p>
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
      <button class="lang-btn switchable">
        <img src="./assets/Svg/web.svg" alt="" />
        <span>English</span>
      </button>
    </div>
  `;
  parent.appendChild(footer);
}

export function createCover(playlist) {
  return playlist.list
    .slice(0, 4)
    .map(
      cover =>
        `<img src="${cover.cover}" alt="${cover.name}" class="playlist-cover" loading="lazy">`
    )
    .join("");
}

function getScreenCategory() {
  const width = window.innerWidth;
  //const width = 1100
  const category = screenCategories.find(
    cat => width > cat.min && width <= cat.max
  );
  //console.log(category)
  return category ? category.name : "unknown";
}
function handleResize(data, playlists,container) {
  const currentCategory = getScreenCategory();
  if (currentCategory !== lastScreenCategory) {
    document.querySelector(".main-right-js").innerHTML = "";
    renderSections(data, playlists, container);
  }
}
function handleMainMargin(){
  const navOne = document.querySelector('.navbar-one')
  const navTwo = document.querySelector('.navbar-two')
  let navHeight
  if (navOne && window.innerWidth<636){
    navHeight = navOne.offsetHeight
  }
  if(navTwo && window.innerWidth>636){
    navHeight = navTwo.offsetHeight
  }
  document.querySelector('main').style.marginTop = navHeight+'px'
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

//For popstate handling:
export function navigate(view,page){
  if(page === "home"){
    history.replaceState({view:view,page:page},page)
  }else{
    history.pushState({view:view,page:page},page)
  }
  popUtils.setCurrentPage(page)
}
