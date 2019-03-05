/**
 * Very crappy matching system that I'm hoping to replace with a lightweight enough classifier
 */

let wasteTypes = ["Recyclable", "E-waste", "2ndhand", "Unknown"];
let results = {
  recyclable: 0,
  "e-waste": 1,
  "2ndhand": 2,
  others: 3,
  plastic: 0,
  paper: 0,
  glass: 0,
  metal: 0,
  straw: 3,
  receipt: 0,
  calendar: 0,
  book: 0,
  envelope: 0,
  "paper bag": 0,
  tissue: 3,
  "plastic bottle": 0,
  "glass bottle": 0,
  "light bulb": 1,
  food: 3,
  medicine: 3,
  diaper: 3,
  battery: 1,
  newspaper: 0,
  clothes: 2,
  household: 2
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
