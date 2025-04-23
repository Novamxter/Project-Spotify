import { globalUtils } from "./render-songs.js";
import { navigate } from "./songCards.js";
let audio = null;
let index = null;
let currentIndex = null;
//let currentPlaylist = null;
let allSongs = null;
let currentTitle = null;
let songPageRendered = false;
let globalCurrentSong = null;
let listenerAdded = false;
export function getSong(songContainer, songs, title) {
  allSongs = songs;
  currentTitle = title;
  songContainer.addEventListener("click", event => {
    let songHtml = event.target.closest(".song");
    if (songHtml && songContainer.contains(songHtml)) {
      index = songHtml.dataset.index;
      currentIndex = Number(index - 1);
      //console.log(currentIndex);
      let song;
      songs.forEach((song,i) => {
        if (i === currentIndex) {
          play(song);
        }
      });
      autoPlayNext(songs);
    }
  });
}

function play(songData) {
  globalCurrentSong = songData;
  listenerAdded = false;
  if (audio) {
    audio.pause();
    audio.currentTime = 0;
  }
  
  audio = new Audio(songData.song);
  audio.addEventListener("canplaythrough", () => {
    audio.play().catch(err => console.log("Autoplay blocked:", err));
  });
  //audio.play();
  console.log(songData)
  renderPlayBar(songData);
  if (songPageRendered) {
    document.querySelector(".song-page-container-js").innerHTML =
      renderSongPage(songData, currentTitle);
    songPageRendered = true;
  }
  audio.addEventListener("timeupdate", () => {
    const percent = (audio.currentTime / audio.duration) * 100;
    document.documentElement.style.setProperty(
      "--song-progress-percent",
      `${percent}%`
    );
    const curr = document.querySelector(".current-time");
    const dura = document.querySelector(".duration");
    if (curr && dura) {
      curr.innerHTML = formatTime(audio.currentTime) || "0:00";
      dura.innerHTML = formatTime(audio.duration) || "0:00";
    }
  });
}
function playNext(direction, song, songs) {
  let nextSongIndex;
  let prevSongIndex;
  songs.forEach((list, index) => {
    if (list.id === song.id) {
      nextSongIndex = index + 1;
      prevSongIndex = index - 1;
    }
  });
  if (direction === "previous" && prevSongIndex >= 0) {
    currentIndex--
    play(songs[prevSongIndex]);
  } else if (direction === "next" && nextSongIndex < songs.length) {
    currentIndex++
    play(songs[nextSongIndex]);
  }
  autoPlayNext(songs)
}
function autoPlayNext(songs) {
  audio.onended = () => {
    if(currentIndex < songs.length){
      currentIndex ++
      play(songs[currentIndex]);
      autoPlayNext(songs)
    }else {
      console.log("Playlist Ended")
    }
  };
}
function renderPlayBar(songData) {
  const parent = document.querySelector(".song-bar-container-js");
  parent.innerHTML = `<div class="song-bar">
      <img src="${songData.cover}" alt="" class="song-bar-img">
    <div class="song-bar-info">
      <p>${songData.name}</p>
      <span>${songData.by}</span>
    </div>
    <div class="song-bar-icons">
      <div class="song-bar-play">
        <img src="/assets/Svg/play.svg" alt="" class="play">
        <img src="/assets/Svg/pause.svg" alt="" class="pause">
      </div>
    </div>
    <div class="song-bar-progress"></div>
  </div>`;
  document.documentElement.style.setProperty(
    "--song-accent-color",
    songData.bgcolor
  );
  //songBarRendered = true
  managePlayBar();
  let barBtn = document.querySelector(".song-bar-play");

  barBtn.addEventListener("click", () => {
    togglePlay(barBtn);
  });
}

export function managePlayBar() {
  let songPage = document.querySelector(".song-page-container-js");
  let icons = document.querySelector(".song-bar-icons");
  songPage.innerHTML = renderSongPage(globalCurrentSong, currentTitle);
  const bar = document.querySelector(".song-bar");

  let pageBtn = document.querySelector(".song-page-play-btn");
  let downBtn = document.querySelector(".song-page-down");
  let preBtn = document.querySelector(".song-page-previous-btn");

  let nextBtn = document.querySelector(".song-page-next-btn");
  bar.addEventListener("click", event => {
    if (!icons.contains(event.target)) {
      toggleSongPage();
    }
  });
  if (nextBtn && downBtn && !listenerAdded) {
    pageBtn.addEventListener("click", () => {
      togglePlay(pageBtn);
    });
    downBtn.addEventListener("click", () => {
      document
        .querySelector(".song-page-container-js")
        .classList.remove("song-page-active");
    });
    nextBtn.addEventListener("click", () => {
      playNext("next", globalCurrentSong, allSongs);
    });
    preBtn.addEventListener("click", () => {
      playNext("previous", globalCurrentSong, allSongs);
    });
    listenerAdded = true;
    handleSeekbar();
  }
}

function togglePlay(clickedBtn) {
  let isPaused = clickedBtn.classList.contains("song-bar-play-toggle");

  if (isPaused) {
    clickedBtn.classList.remove("song-bar-play-toggle");
    audio.play();
  } else {
    clickedBtn.classList.add("song-bar-play-toggle");
    audio.pause();
  }

  // Sync other play buttons
  let allPlayBtns = document.querySelectorAll(
    ".song-bar-play, .song-page-play-btn"
  );
  allPlayBtns.forEach(btn => {
    if (btn !== clickedBtn) {
      if (isPaused) {
        btn.classList.remove("song-bar-play-toggle");
      } else {
        btn.classList.add("song-bar-play-toggle");
      }
    }
  });
}

function toggleSongPage() {
  const page = document.querySelector(".song-page-container-js");
  if (page.classList.contains("song-page-active")) {
    page.classList.remove("song-page-active");
    if (history.state.page === "songpage") {
      history.back();
    }
  } else {
    page.classList.add("song-page-active");
    if (history.state.page !== "songpage") {
      navigate("home", "songpage");
    }
  }
}

function formatTime(seconds) {
  if (typeof seconds !== "number" || Number.isNaN(seconds)) {
    return "0:00";
  }
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function handleSeekbar() {
  const seekbarBg = document.querySelector(".song-page-seekbar");
  const seekbarFill = document.querySelector(".song-page-seekbar-active");
  const seekTime = document.querySelector(".current-time");
  let isDragging = false;

  if(seekbarBg){
  // Mouse events
  seekbarBg.addEventListener("mousedown", e => {
    isDragging = true;
    updateSeekTime(e.clientX,seekbarBg,seekTime);
  });

  window.addEventListener("mousemove", e => {
    if (isDragging) updateSeekTime(e.clientX,seekbarBg,seekTime);
  });

  window.addEventListener("mouseup", () => {
    isDragging = false;
  });

  // Touch events
  seekbarBg.addEventListener("touchstart", e => {
    isDragging = true;
    updateSeekTime(e.touches[0].clientX,seekbarBg,seekTime);
  });
  window.addEventListener("touchmove", e => {
    if (isDragging) updateSeekTime(e.touches[0].clientX,seekbarBg,seekTime);
  });
  window.addEventListener("touchend", () => {
    isDragging = false;
  });
  }
}

function updateSeekTime(clientX,seekC,timeC) {
  const rect = seekC.getBoundingClientRect();
  let offsetX = clientX - rect.left;
  offsetX = Math.max(0, Math.min(offsetX, rect.width));
  const percent = offsetX / rect.width;
  const currentSeconds = Math.round(percent * audio.duration);
  
  document.documentElement.style.setProperty(
    "--song-progress-percent",
    `${percent * 100}%`
  );
  audio.currentTime = currentSeconds
  return currentSeconds;
}
function renderSongPage(data, title) {
  return `<div class="song-page">
    <div class="song-page-top">
      <button class="song-page-down">
        <img src="/assets/Svg/downArrow.svg" alt="" class="song-page-down-img">
      </button>
      <div class="song-top-content">
        <p>PLAYING FROM PLAYLIST</p>
        <span>${title}</span>
      </div>
      <button class="song-page-dots">
        <img src="/assets/Svg/threeDots.svg" alt="" class="song-page-dots-img">
      </button>
    </div>
    <div class="song-page-main-imgwrap">
      <img src="${data.cover}" alt="" class="song-page-main-img">
    </div>
    <div class="song-page-bottom">
      <div class="song-page-titles">
        <div class="song-page-info">
          <p>${data.name}</p>
          <span>${data.by}</span>
        </div>
      </div>
      <div class="song-page-seekbar-container">
        <div class="song-page-seekbar">
          <div class="song-page-seekbar-active"></div>
        </div>
        <div class="time-container">
          <span class="current-time">0:00</span>
          <span class="duration">0:00</span>
        </div>
      </div>
      <div class="song-page-play-line">
        <div class="song-page-shuffle">
          <img src="/assets/Svg/shuffle.svg" alt="" class="song-page-shuffle-img">
        </div>
        <div class="play-section">
          <button class="song-page-previous-btn">
            <img src="/assets/Svg/previous.svg" alt="" class="previous-img">
          </button>
          <button class="song-page-play-btn song-bar-play">
            <img src="/assets/Svg/play.svg" alt="" class="song-page-play-img play">
            <img src="/assets/Svg/pause.svg" alt="" class="song-page-play-img pause">
          </button>
          <button class="song-page-next-btn">
            <img src="/assets/Svg/next.svg" alt="" class="next-img">
          </button>
        </div>
        <div class="song-page-series">
          <img src="/assets/Svg/series.svg" alt="" class="song-page-series-img">
        </div>
      </div>
      <div class="song-page-footer-line">
        <button class="song-page-share-button">
          <img src="/assets/Svg/share.svg" alt="" class="song-page-share-img">
        </button>
      </div>
    </div>
  </div>`;
}
