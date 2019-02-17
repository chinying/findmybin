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
  recyclable: 0
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
