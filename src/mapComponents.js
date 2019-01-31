import {ScatterplotLayer} from 'deck.gl';
import * as _ from 'lodash'

const gData = require('./data/combined.json')

let pointColours = (wasteType) => {
  if (wasteType === 'recycling') {
    return [55, 168, 74]
  } else if (wasteType === 'ewaste') {
    return [0, 37, 96]
  } else if (wasteType === '2ndhand') {
    return [255, 0, 128]
  } else {
    return [58, 58, 58]
  }
}
const layers = [
  new ScatterplotLayer({
    id: 'geojson',
    data: gData,
    radiusScale: 10,
    radiusMinPixels: 1,
    getPosition: d => d.geometry.coordinates,
    getColor: d => pointColours(d.waste_type),
    pickable: true,
    onHover: _.debounce((info) => {
      console.log('hover:', info)
    }, 200),
    onClick: info => console.log('Clicked:', info)
  })
];

export { layers }