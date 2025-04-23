import {popUtils,navigate} from "./songCards.js";

// Laptop Ham-Menu :
document.querySelector('.second-ham-btn').addEventListener('click',()=>{
  document.querySelector('.second-ham-items').classList.toggle('second-ham-active')
})
// Mobile Ham-Menu :
document.querySelectorAll('.mobile-ham-js').forEach((ham)=>{
  ham.addEventListener('click',toggleMobileHam)
})

// Search Category:
document.querySelectorAll('.search-btn-js').forEach((btn)=>{
  btn.addEventListener('click',()=>{
    if (window.innerWidth < 1050){
      toggleSearch()
    }
  })
})
let lapWrapper = document.querySelector('.search-wrapper-btn')
lapWrapper.addEventListener('click',()=>{
  toggleSearch()
  changeLibIcon(lapWrapper)
})
document.querySelector('.search-back-btn').addEventListener('click',toggleSearch)

// Library :
let mobLibBtn = document.querySelector('.mob-lib-icon-btn')
mobLibBtn.addEventListener('click',()=>{
  toggleLibrary(mobLibBtn)
})
let libIcon = document.querySelector('.lib-icon')
libIcon.addEventListener('click',()=>{
  toggleLibrary(libIcon)
})


function toggleSearch(){
  if (window.innerWidth > 462){
    toggleMain()
  }
  let container = document.querySelector('.search-page')
  if (container.classList.contains('page-active')){
    container.classList.remove('page-active')
    history.back()
  }else{
    container.classList.add('page-active')
    if(history.state.page !== "searchCate"){
      navigate("home","searchCate")
    }
  }
}
function toggleMobileHam(){
  const ham = document.querySelector('.mobile-ham-items')
  if(ham.classList.contains('mobile-ham-active')){
    ham.classList.remove('mobile-ham-active')
    history.back()
  }else{
    ham.classList.add('mobile-ham-active')
    navigate("home","menu")
  }
}
export function toggleLibrary(parent,opened){
  const leftSection = document.querySelector('.left-section-wrapper')
  if (leftSection.classList.contains('library-active')||opened){
    
    leftSection.classList.remove('library-active')
    if (history.state.page === "playlists"){
      history.back()
    }
    popUtils.libOpened = false
  }else{
    let state = document.querySelector('.main-songs-container').dataset.pActive
    leftSection.classList.add('library-active')
    if (history.state.page !== state){
      navigate("library",state)
    }
    popUtils.libOpened = true
  }
  changeLibIcon(parent)
}
function toggleMain(){
  document.querySelector('.main-songs-container').classList.toggle('songs-display')
}

function changeLibIcon(parent){
  parent.classList.toggle('lib-display')
}