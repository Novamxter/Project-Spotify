export async function addSongs() {
  try {
    let response = await fetch("JSON_Data/song_cards.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    let data = await response.json();
    data.forEach((row) => {
      createSection(row)
    });
  } catch (e) {
    console.log("JSON data not fetched ..",e);
  }
}
function createSection(item){
  let html = 
  `<div class="song-section">
    <h3>${item.title}</h3>
    ${createItems(item.items)}
  </div>`
  document.querySelector('.main-right-section').innerHTML += html
}

function createItems(items){
  let mainDiv = document.createElement("div")
  mainDiv.className = "song-items"
  items.forEach((item)=>{
    let div = document.createElement("div");
    div.className = "song-card";
    div.innerHTML = 
    `<div class="song-img">
      <img src="${item.imgSrc}" alt="${item.subTitle}" loading="lazy">
    </div>
    <div class="song-title">
      <p>${item.subTitle}</p>
    </div>`
    mainDiv.appendChild(div)
  })
  return mainDiv.outerHTML
}