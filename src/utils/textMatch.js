let wasteTypes = ['recyclable', 'e-waste', 'general-waste']
let results = {
  'plastic': 0
}

let matchTerm = (term) => {
  if (term in results) {
    return wasteTypes[results['term']]
  } else {
    return 'general-waste'
  }
}

export { matchTerm }