const getMode = () => {    
  let mode = 'qa'
  let ratios = document.getElementsByName('mode')
  for (let i = 0; i < ratios.length; i++) {
    if (ratios[i].checked) {
      mode = ratios[i].value
      break
    }
  }

  return mode
}

const getOption = (key) => {
  let v
  let ratios = document.getElementsByName(key)
  for (let i = 0; i < ratios.length; i++) {
    if (ratios[i].checked) {
      v = ratios[i].value
      break
    }
  }

  return v
}

export {
  getOption
}