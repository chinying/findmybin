/**
 * Very crappy matching system that I'm hoping to replace with a lightweight enough classifier
 */

let wasteTypes = ["Recyclable", "E-waste", "Unknown"];
let results = {
  plastic: 0,
  paper: 0,
  glass: 0,
  metal: 0,
  others: 2,
  "e-waste": 1,
  recyclable: 0,
  straw: 2,
  receipt: 0,
  calendar: 0,
  book: 0,
  envelope: 0,
  "paper bag": 0,
  tissue: 2,
  "plastic bottle": 0,
  "glass bottle": 0,
  "light bulb": 1,
  food: 2,
  medicine: 2,
  diaper: 2,
  battery: 1,
  newspaper: 0
};

let matchTerm = (term = "") => {
  term = term.toLowerCase();
  if (term in results) {
    return wasteTypes[results[term]];
  } else {
    return "all";
  }
};

export { matchTerm };
