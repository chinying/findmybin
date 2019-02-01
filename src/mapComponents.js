import {ScatterplotLayer} from 'deck.gl';
import * as _ from 'lodash'
import { matchTerm } from './utils/textMatch'

// this line has to be included for the file to be bundled by webpack
const gData = require('./data/combined.json')

let pointColours = (wasteType) => {
  if (wasteType === 'Recyclable') {
    return [55, 168, 74]
  } else if (wasteType === 'E-waste') {
    return [0, 37, 96]
  } else if (wasteType === '2ndhand') {
    return [255, 0, 128]
  } else {
    return [58, 58, 58]
  }
}

export { pointColours, layers }