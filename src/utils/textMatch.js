let wasteTypes = ['recycling', 'e-waste', 'general-waste']
let results = {
  'plastic': 0,
  'paper': 0,
  'glass': 0,
  'metal': 0,
  'others': 2
}

let matchTerm = (term) => {
  if (term in results) {
    return wasteTypes[results[term]]
  } else {
    return 'all'
  }
}

export { matchTerm }