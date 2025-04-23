import './handleHams.js'
import {addCards} from './searchCard.js'
import {addSongs} from './songCards.js'
import {renderSongList} from './render-songs.js'

let playlists = fetchPlaylist()
let songCards = fetchSongCards()

render()

async function render(){
  document.addEventListener('DOMContentLoaded',async ()=>{
  addCards()
  let status = await addSongs(playlists,songCards)
  renderSongList(playlists,songCards,status,addSongs)
  //window.onpopstate = (e) => console.log("STATE:", history.state.page);
})
}

async function fetchPlaylist() {
  try {
    let playlistResponse = await fetch("JSON_Data/playlist.json");
    if (!playlistResponse.ok) {
      throw new Error(`HTTP error in PlayList! Status: ${playlistResponse.status}`);
    }
    playlists = await playlistResponse.json();
    return playlists
  } catch (e) {
    console.log("Playlists not fetched ..", e);
  }
}

async function fetchSongCards(){
  try {
    let dataResponse = await fetch("JSON_Data/song_cards.json");
    if (!dataResponse.ok) {
      throw new Error(`HTTP error! Status: ${dataResponse.status}`);
    }
    let data = await dataResponse.json();
    return data
  } catch (e) {
    console.log("Song Cards not fetched ..", e);
  }
}