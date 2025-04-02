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
    createFooter()
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

function createFooter(){
  let html =
   `<footer class="lap-footer">
      <div class="right-footer">
        <div class="footer-links-one">
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
        </div>
        <ul class="footer-list">
          <a href="#"
            ><li><img src="./assets/Svg/insta.svg" alt="" /></li
          ></a>
          <a href="#"
            ><li><img src="./assets/Svg/twitter.svg" alt="" /></li
          ></a>
          <a href="#"
            ><li><img src="./assets/Svg/facebook.svg" alt="" /></li
          ></a>
        </ul>
      </div>
      <div class="footer-line"></div>
      <a href="#">&#169; 2025 Spotify AB</a>
    </footer>`
  document.querySelector('.main-right-section').innerHTML += html
}