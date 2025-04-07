// Laptop Ham-Menu :
document.querySelector('.second-ham-btn').addEventListener('click',()=>{
  document.querySelector('.second-ham-items').classList.toggle('second-ham-active')
})
// Mobile Ham-Menu :
document.querySelector('.ham-container').addEventListener('click',toggleMobileHam)
document.querySelector('.mobile-ham-close').addEventListener('click',toggleMobileHam)

// Search Category:
document.querySelector('.search-icon-container').addEventListener('click',toggleSearch)
document.querySelector('.search-wrapper-btn').addEventListener('click',toggleSearch)
document.querySelector('.search-back-btn').addEventListener('click',toggleSearch)

// Library :
document.querySelector('.mob-lib-icon-btn').addEventListener('click',toggleLibrary)


function toggleSearch(){
  document.querySelector('.search-page').classList.toggle('page-active')
}
function toggleMobileHam(){
  document.querySelector('.mobile-ham-items').classList.toggle('mobile-ham-active')
}
function toggleLibrary(){
  document.querySelector('.left-section-wrapper').classList.toggle('library-active')
}