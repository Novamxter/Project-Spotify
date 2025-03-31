document.querySelector('.second-ham-btn').addEventListener('click',()=>{
  document.querySelector('.second-ham-items').classList.toggle('second-ham-active')
})
document.querySelector('.ham-container').addEventListener('click',()=>{
  toggleMobileHam()
})
document.querySelector('.mobile-ham-close').addEventListener('click',()=>{
  toggleMobileHam()
})
document.querySelector('.search-icon-container').addEventListener('click',()=>{
  toggleSearch()
})
document.querySelector('.search-wrapper-btn').addEventListener('click',()=>{
  toggleSearch()
})
document.querySelector('.search-back-btn').addEventListener('click',()=>{
  toggleSearch()
})
function toggleSearch(){
  document.querySelector('.search-page').classList.toggle('page-active')
}
function toggleMobileHam(){
  document.querySelector('.mobile-ham-items').classList.toggle('mobile-ham-active')
}