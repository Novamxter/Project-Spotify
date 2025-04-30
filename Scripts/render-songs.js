import { createCover, addSongs, popUtils, navigate } from "./songCards.js";
import { toggleLibrary } from "./handleHams.js";
import {getSong,togglePlay,audioUtils} from './play-songs.js'
export let globalUtils = {
  globalData: null,
  globalPlaylists: null,
  globalLikedSongs: null,
  globalLocalSongs: null,
  globalAddSongs: null,
  lastPlaylistId: null
};
let havePlaylist = false;

export async function renderSongList(playlists, songCards, status, addSongs) {
  let resolvedStatus = await status;
  globalUtils.globalPlaylists = await playlists;
  globalUtils.globalData = await songCards;
  globalUtils.globalAddSongs = await addSongs;

  if (globalUtils.globalPlaylists.length >= 1) {
    havePlaylist = true;
  }
  createLibrarySongs(havePlaylist, globalUtils.globalPlaylists, songCards);
  createHomeSongs(
    globalUtils.globalPlaylists,
    resolvedStatus,
    globalUtils.globalAddSongs,
    songCards
  );

  document.addEventListener("DOMContentLoaded", () => {
    handleScroll(havePlaylist);
  });
  handlePopState();
}

async function createLibrarySongs(
  havePlaylist,
  playlists,
  data,
  pushHistory = true
) {
  let html = "";
  let isAdded = false;
  if (havePlaylist) {
    html = `<div class="lib-Playlists-wrapper">
    ${
      createLikedSongs(playlists) +
      (await createLocalSongs(playlists, data)) +
      createPlaylists(playlists)
    }
    </div>`;
    isAdded = true;
  } else {
    html = `<div class="library-card-container">
      <div class="library-card">
        <h4>Create your first playlist</h4>
        <p>It's easy, we'll help you</p>
        <button class="library-btn">Create Playlist</button>
      </div>
      <div class="library-card">
        <h4>Let's find some podcasts to follow</h4>
        <p>We'll keep you updated on new episodes</p>
        <button class="library-btn">Browse podcasts</button>
      </div>
    </div>`;
  }
  let container = document.querySelector(".lib-body-top");
  container.innerHTML = html;
  document.querySelector('.main-songs-container').dataset.pActive = "playlists";
  if (isAdded) {
    //navigate("home","playlists")
    container.addEventListener("click", event => {
      const playlist = event.target.closest(".playlist");
      if (playlist && container.contains(playlist)) {
        let index = playlist.dataset.index;
        let playableSongs ;
        let playlistTitle = null;
        let id ;
        if (index === "1") {
          playlistTitle = "Liked Songs"
          playableSongs = globalUtils.globalLikedSongs
        } else if (index === "2") {
          playlistTitle = "Local Tracks"
          playableSongs = globalUtils.globalLocalSongs
        } else {
          playlists.forEach(list => {
            if (list.id === `${Number(index) - 2}`) {
              id = list.id
              playableSongs = list.list
              playlistTitle = list.title
            }
          });
        }
        container.innerHTML = createLibNav(playlistTitle) + createSongList(playableSongs)
        if(history.state.page !== "librarySongs"){
            navigate("library", "librarySongs");
          }
        getSong(container,playableSongs,playlistTitle,id)
        document.querySelector('.main-songs-container').dataset.pActive = "librarySongs";
        document
          .querySelector(".lib-song-back-js")
          .addEventListener("click", () => {
            createLibrarySongs(
              havePlaylist,
              globalUtils.globalPlaylists,
              globalUtils.globalData
            );
            history.back();
          });
      }
    });
  }
  return isAdded;
}

function createPlaylists(playlists) {
  let html = "";
  playlists.map((playlist, index) => {
    html += `<div class="playlist js-playlist-${index + 1}" data-index="${
      index + 3
    }">
      <div class="list-img">
        ${createCover(playlist)}
      </div>
      <div class="list-content">
        <p>${playlist.title}</p>
        <div class="list-second-row">
          <span>Playlist &#8226;</span>
          <span>${playlist.by}</span>
        </div>
      </div>
    </div>`;
  });
  return html;
}

function createLikedSongs(playlists) {
  // let cloned = [...playlists];
  // let [likedSongs] = cloned.map(obj => {
  //   return obj.list.filter(song => song.liked === "true" );
  // });
  let likedSongs = playlists.flatMap(obj =>
    obj.list.filter(song => song.liked === "true")
  );
  likedSongs = removeDuplicates(likedSongs)
  globalUtils.globalLikedSongs = likedSongs;
  return `<div class="playlist liked-folder-js" data-index="1">
      <div class="list-img">
        <img src="assets/Images/Global/liked-folder.jpg" alt="" loading="lazy" class="liked-folder-img">
      </div>
      <div class="list-content">
        <p>Liked Songs</p>
        <div class="list-second-row">
          <span>Playlist &#8226;</span>
          <span>${likedSongs.length} Songs</span>
        </div>
      </div>
    </div>`;
}
async function createLocalSongs(playlists, dataPromise) {
  const data = await dataPromise;
  const clonedData = [...data];
  const downloads = clonedData.pop();
  const downloadIds = new Set(downloads.items.map(song => song.id));
  let localSongs = [];

  playlists.forEach(obj => {
    obj.list.forEach(song => {
      if (downloadIds.has(song.id)) {
        localSongs.push(song);
      }
    });
  });
  localSongs = removeDuplicates(localSongs)
  globalUtils.globalLocalSongs = localSongs;

  return `<div class="playlist local-folder-js" data-index="2">
      <div class="list-img">
        <img src="assets/Images/Global/local-folder.jpg" alt="" loading="lazy" class="liked-folder-img">
      </div>
      <div class="list-content">
        <p>Local Files</p>
        <div class="list-second-row">
          <span>Playlist &#8226;</span>
          <span>${localSongs.length} Tracks</span>
        </div>
      </div>
    </div>`;
}

function removeDuplicates(arr) {
  const seen = new Set();
  return arr.filter(obj => {
    if (seen.has(obj.id)) return false;
    seen.add(obj.id);
    return true;
  });
}
function createLibNav(title) {
  return `<div class="lib-nav">
    <p>${title}</p>
    <button class="song-list-back-btn lib-song-back-js">
     <img src="assets/Svg/backArrow.svg" alt="" />
    </button>
  </div>`;
}
async function createHomeSongs(playlists, status, addSongs, songCards) {
  let container = document.querySelector(".main-songs-container");
  if (status) {
    const playListSection = document.querySelector(".home-playlist-section");
    if (
      !document
        .querySelector(".left-section-wrapper")
        .classList.contains("library-top")
    ) {
      navigate("home", "home");
    }
    playListSection.addEventListener("click", async event => {
      const playlist = event.target.closest(".home-playlist");
      if (playlist && container.contains(playlist)) {
        let index = playlist.dataset.index;
        let songs;
        let coverPlaylist;
        playlists.forEach(list => {
          if (list.id === index) {
            songs = list.list;
            coverPlaylist = list;
          }
        });
        globalUtils.lastPlaylistId = index
        container.innerHTML = `<div class="home-songs-wrapper">
          <button class="song-list-back-btn song-list-back-js">
            <img src="assets/Svg/backArrow.svg" alt="" />
          </button>
          <div class="song-list-nav">
            <p>${coverPlaylist.title}</p>
            <button class="song-list-back-btn song-list-back-js">
              <img src="assets/Svg/backArrow.svg" alt="" />
            </button>
          </div>
          <div class="songs-top">
            <div class="song-list-img-wrapper">
              <div class="song-list-img">${createCover(coverPlaylist)}</div>
            </div>
            <div class="song-list-info">
              <p class="js-playlist-heading">${coverPlaylist.title}</p>
              <div class="song-list-by">
                <img src="assets/Images/Global/profile-pic.jpg" alt="" class="song-list-profile-pic">
                <span>${coverPlaylist.by}</span>
             </div>
             <div class="song-list-duration">
              <img src="assets/Svg/web.svg" alt="" class="duration-img">
              <span>${await getPlaylistDuration(coverPlaylist)}</span>
            </div>
            <div class="song-list-bottom">
              <div class="song-list-left">
                <div class="song-list-front">
                  <img src="${
                    songs[songs.length - 1].cover
                  }" alt="" class="song-list-front-img">
                </div>
                <button class="song-list-download-btn">
                   <img src="assets/Svg/download.svg" alt="" class="song-list-download">
                </button>
                <button class="song-list-user-btn">
                   <img src="assets/Svg/artist.svg" alt="" class="song-list-user">
                </button>
                <button class="song-list-dots-btn">
                  <img src="assets/Svg/threeDots.svg" alt="" class="song-list-dots">
                </button>
              </div>
              <div class="song-list-right">
                <img src="./assets/Svg/smart-shuffle.svg" class="song-list-shuffle-pic" style="--shuffle-color:rgb(30, 215, 96)">
                <button class="play-btn-hover song-play-btn playlist-whole-play-btn js-playlist-btn-${index}" data-index="${index}">
                  <img src="./assets/Svg/play.svg" class="play">
                  <img src="./assets/Svg/pause.svg" alt="" class="pause">
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="song-list-wrapper">
          ${createSongList(songs)}
        </div>
        </div>`;
        let songContainer = document.querySelector(".song-list-wrapper");
        
        getSong(songContainer,songs,coverPlaylist.title,index)
        const nav = document.querySelector(".navbar-one");
        const img = document.querySelector(".song-list-img");
        const back = document.querySelectorAll(".song-list-back-js");
        if (nav) {
          document.documentElement.style.setProperty(
            "--nav-background-color",
            "rgb(217, 60, 45)"
          );
          document.documentElement.style.setProperty(
            "--nav-circle-color",
            "rgb(217, 60, 45)"
          );
        }
        if(img){
          handleImageSize();
          //ScrollTrigger.refresh();
        }
        
        back.forEach(btn => {
          if (btn) {
            btn.addEventListener("click", () => {
              renderHome();
              history.back();
            });
          }
        });
        // console.log(audio)
        // 
        
        window.scrollTo({ top: 0 });
        document.querySelector(".main-right-section ").scrollTo({ top: 0 });
        handleSongNav();
        if(history.state.page!=="homeSongs"){
          navigate("home", "homeSongs");
        }
      }
    });
  } else {
    console.log("not rendered");
  }
}
function createSongList(songs) {
  if (!songs) return;
  const div = document.createElement("div");
  div.className = "song-list-wrapper";
  let html = "";
  songs.map((song,i) => {
    html += `<div class="song" data-index="${i+1}">
      <div class="song-img-wrapper">
        <img src="${song.cover}" alt="" loading="lazy" class="song-img">
      </div>
      <div class="song-content">
        <p>${song.name}</p>
        <span>
          ${song.explicit === "true"?'<div class="explicit-wrap">E</div>':""}
          ${song.by}
        </span>
      </div>
    </div>`;
  });
  div.innerHTML = html;
  return div.outerHTML;
}
function getPlaylistDuration(playlist) {
  return new Promise(resolve => {
    let totalDuration = 0;
    let loadedCount = 0;

    playlist.list.forEach(song => {
      const audio = new Audio(song.song);
      audio.addEventListener("loadedmetadata", () => {
        totalDuration += audio.duration;
        loadedCount++;

        if (loadedCount === playlist.list.length) {
          const hrs = Math.floor(totalDuration / 3600);
          const mins = Math.floor((totalDuration % 3600) / 60);

          const durationStr =
            hrs > 0
              ? `${hrs}h ${mins.toString().padStart(2, "0")}min`
              : `${mins}min`;

          resolve(durationStr); // return the value here
        }
      });
    });
  });
}
function handleScroll(havePlaylist) {
  const topDiv = document.querySelector(".library-top");
  let scrollContainer;
  if (havePlaylist) {
    scrollContainer = document.querySelector(".lib-Playlists-wrapper");
  } else {
    scrollContainer = document.querySelector(".library-card-container");
  }
  if (scrollContainer) {
    scrollContainer.addEventListener("scroll", () => {
      if (scrollContainer.scrollTop > 10) {
        topDiv.style.setProperty(
          "--library-gradient",
          "linear-gradient(to bottom, rgb(0,0,0,0.6) 3%,transparent 60%)"
        );
      } else {
        topDiv.style.setProperty("--library-gradient", "transparent");
      }
    });
  }
}

function handlePopState() {
  window.addEventListener("popstate", event => {
    if (!event.state || !event.state.page) return;
    if (event.state.page === popUtils.getCurrentPage()) return;
    popUtils.setCurrentPage(event.state.page);
    const container = document.querySelector(".lib-body-top");
    const leftSection = document.querySelector(".left-section-wrapper");
    const searchCate = document.querySelector('.search-page')
    const mobHam = document.querySelector('.mobile-ham-items')
    const songPage = document.querySelector(".song-page-container-js")
    if (event.state.view === "home") {
      switch (event.state.page) {
        case "homeSongs":
          if(songPage && songPage.classList.contains("song-page-active")){
            songPage.classList.remove("song-page-active")
            break
          }
          if (leftSection && leftSection.classList.contains("library-active")) {
            leftSection.classList.remove("library-active");
            changeLibIcon("mobile");
            popUtils.libOpened = false;
            break;
          }
        case "home":
          if(songPage && songPage.classList.contains("song-page-active")){
            songPage.classList.remove("song-page-active")
            break
          }
          if(mobHam && mobHam.classList.contains("mobile-ham-active")){
            mobHam.classList.remove("mobile-ham-active")
            break
          }
          if(searchCate.classList.contains("page-active")){
            searchCate.classList.remove("page-active")
            if (window.innerWidth > 462){
              document.querySelector('.main-songs-container').classList.toggle('songs-display')
            }
            changeLibIcon("laptop")
            break
          }
          if (leftSection && leftSection.classList.contains("library-active")) {
            leftSection.classList.remove("library-active");
            changeLibIcon("mobile");
            popUtils.libOpened = false;
            break;
          }
          if (!popUtils.libOpened) {
            // Re-render home songs
            renderHome();
          }
          break;
      }
    } else if (event.state.view === "library") {
      switch (event.state.page) {
        case "playlists":
          if(mobHam && mobHam.classList.contains("mobile-ham-active")){
            mobHam.classList.remove("mobile-ham-active")
            break
          }
          if(searchCate.classList.contains("page-active")){
            searchCate.classList.remove("page-active")
            if (window.innerWidth > 462){
              document.querySelector('.main-songs-container').classList.toggle('songs-display')
            }
            changeLibIcon("laptop")
            break
          }
          if (leftSection && leftSection.classList.contains("library-active")) {
            createLibrarySongs(
              havePlaylist,
              globalUtils.globalPlaylists,
              globalUtils.globalData,
              false
            ); // reset playlists view
            break;
          }
        case "librarySongs":
          if(mobHam && mobHam.classList.contains("mobile-ham-active")){
            mobHam.classList.remove("mobile-ham-active")
            break
          }
          if(songPage && songPage.classList.contains("song-page-active")){
            songPage.classList.remove("song-page-active")
            break
          }
        default:
          break;
      }
    }
  });
}

async function renderHome() {
  let status = await globalUtils.globalAddSongs(
    globalUtils.globalPlaylists,
    globalUtils.globalData
  );
  renderSongList(
    globalUtils.globalPlaylists,
    globalUtils.globalData,
    status,
    globalUtils.globalAddSongs
  );
  const nav = document.querySelector(".navbar-one");
  if (nav) {
    document.documentElement.style.setProperty(
      "--nav-background-color",
      "black"
    );
    document.documentElement.style.setProperty(
      "--nav-circle-color",
      "rgb(70,70,70)"
    );
  }
}
function handleImageSize() {
  let target = document.querySelector(".song-list-img");
  const isDesktop = window.innerWidth > 640
  const scroller = isDesktop ? ".main-right-section" : undefined
  if (!target) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.to(target, {
    scale: 0.6,
    transformOrigin: "top center",
    ease: "none",
    scrollTrigger: {
      trigger: ".song-list-img-wrapper",
      start: `top top`,
      end: "+=100",
      scrub: true,
      scroller: scroller,//for laptop custom scroll
      onUpdate: self => {
        const minScale = 0.6;
        const maxScale = 1;

        const scale = gsap.getProperty(target, "scale");

        // Handle opacity
        if (scale < 0.8) {
          const opacity = gsap.utils.mapRange(0.6, 0.8, 0.3, 1, scale);
          target.style.opacity = opacity;
        } else {
          target.style.opacity = "1";
        }
      }
    }
  });
  ScrollTrigger.refresh()
}
function handleSongNav() {
  gsap.registerPlugin(ScrollTrigger);
  const nav = document.querySelector(".song-list-nav");
  const scroller = window.innerWidth > 640 ? ".main-right-section" : undefined
  gsap.to(nav, {
    opacity: 1,
    ease: "none",
    scrollTrigger: {
      trigger: ".js-playlist-heading",
      start: "top 100px", // when heading is 100px from top
      end: "top 68px", // when heading is 50px from top
      scrub: true, // smooth fade based on scroll
      scroller: scroller,
      onUpdate: function () {
        if (parseFloat(getComputedStyle(nav).opacity) === 1) {
          nav.style.pointerEvents = "auto";
        } else {
          nav.style.pointerEvents = "none";
        }
      }
    }
  });
}
function changeLibIcon(view) {
  let mobLibBtn = document.querySelector(".mob-lib-icon-btn");
  let libIcon = document.querySelectorAll(".lib-icon");
  const lapWrapper = document.querySelector('.search-wrapper-btn')
  if (mobLibBtn && view === "mobile") {
    mobLibBtn.classList.toggle("lib-display");
  }
  libIcon.forEach((icon)=>{
    if (icon && view === "mobile") {
      icon.classList.toggle("lib-display");
    }
  })
  if (lapWrapper && view === "laptop"){
    lapWrapper.classList.toggle("lib-display");
  }
}
