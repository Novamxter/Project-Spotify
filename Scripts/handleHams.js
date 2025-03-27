document.querySelector('.second-ham-btn').addEventListener('click',()=>{
  document.querySelector('.second-ham-items').classList.toggle('second-ham-active')
})
document.querySelector('.search-icon-container').addEventListener('click',()=>{
  toggleSearch()
})
document.querySelector('.search-wrapper-btn').addEventListener('click',()=>{
  toggleSearch()
})
function toggleSearch(){
  document.querySelector('.search-page').classList.toggle('page-active')
}