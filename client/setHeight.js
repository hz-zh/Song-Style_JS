const documentHeight = () => {
   const doc = document.querySelector('main.about')
   doc.style.setProperty('--doc-height', `${window.innerHeight}px`)
  }
  window.addEventListener('resize', documentHeight)
  documentHeight()