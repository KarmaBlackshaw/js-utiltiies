const getElement = async selector => {
  while (!document.querySelector(selector)) {
    await new Promise(resolve => requestAnimationFrame(resolve))
  }

  return document.querySelector(selector)
}