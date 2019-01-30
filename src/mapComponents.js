import {ScatterplotLayer} from 'deck.gl';
import * as _ from 'lodash'

const gData = require('./data/combined.json')

const layers = [
  new ScatterplotLayer({
    id: 'geojson',
    data: gData,
    radiusScale: 10,
    radiusMinPixels: 1,
    getPosition: d => d.geometry.coordinates,
    getColor: d => d.waste_type === 'recycling' ? [255, 0, 128] : [0, 37, 96],
    pickable: true,
    onHover: _.debounce((info) => {
      console.log('hover:', info)
    }, 200),
    onClick: info => console.log('Clicked:', info)
  })
];

export { icon, iconData, layers }