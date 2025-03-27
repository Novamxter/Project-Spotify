export async function addCards() {
  try {
    let response = await fetch("../JSON_Data/search_cards.json");
    let data = await response.json();
    data.forEach((card) => {
      createCard(card);
    });
  } catch (e) {
    console.log("JSON data not fetched ..", e);
  }
}
function createCard(card) {
  let div = document.createElement("div");
  div.className = "search-card";
  div.style.backgroundColor = card.bgColor;
  div.innerHTML = `<p class="sc-title">${card.title}</p>
    <img src="${card.imgSrc}" alt="" class="sc-img">`;
  document.querySelector(".search-card-container").appendChild(div);
}
