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
document.querySelector('.search-wrapper-btn').addEventListener('click',toggleLibrary)
document.querySelector('.lib-icon').addEventListener('click',toggleLibrary)

function toggleSearch(){
  if (window.innerWidth > 462){
    toggleMain()
  }
  document.querySelector('.search-page').classList.toggle('page-active')
}
function toggleMobileHam(){
  document.querySelector('.mobile-ham-items').classList.toggle('mobile-ham-active')
}
function toggleLibrary(){
  console.log("yes")
  const leftSection = document.querySelector('.left-section-wrapper')
  const libActive = document.querySelector('.lib-icon-active')
  const libDefault = document.querySelector('.lib-icon-default')
  if (libActive.style.display === "none" && libDefault.style.display ==="block"){
    libActive.style.display = "block"
    libDefault.style.display = "none"
    leftSection.classList.add('library-active')
  }else{
    libActive.style.display = "none"
    libDefault.style.display = "block"
    leftSection.classList.remove('library-active')
  }
}
function toggleMain(){
  document.querySelector('.main-songs-container').classList.toggle('songs-display')
}