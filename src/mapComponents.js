import {ScatterplotLayer, IconLayer} from 'deck.gl';
import * as _ from 'lodash'

const gData = require('./data/recyclingBins.json')

const icon = {
  // url: './assets/location-marker-green.png',
  x: 0,
  y: 0,
  width: 128,
  height: 128,
  anchorY: 128,
  mask: true
}

const iconData = [{coordinates: [103.892344729184, 1.31969814632643, 0]}]

const layers = [
  new IconLayer({
    id: 'icon-layer',
    data: iconData,
    pickable: true,
    iconAtlas: 'https://raw.githubusercontent.com/uber/deck.gl/6.3-release/examples/website/icon/data/location-icon-atlas.png',
    iconMapping: {
      marker: {
        x: 0,
        y: 0,
        width: 128,
        height: 128,
        anchorY: 128,
        mask: true
      }
    },
    sizeScale: 15,
    getPosition: d => d.coordinates,
    getIcon: d => 'marker',
    getSize: d => 3,
    getColor: d => [41, 153, 80],
    // onHover: ({object, x, y}) => {
    //   const tooltip = `${object.name}\n${object.address}`;
    //   /* Update tooltip
    //      http://deck.gl/#/documentation/developer-guide/adding-interactivity?section=example-display-a-tooltip-for-hovered-object
    //   */
    // }
  }),

  new ScatterplotLayer({
    id: 'geojson',
    // data: this.state.recyclingBins,
    data: gData,
    radiusScale: 10,
    radiusMinPixels: 0.5,
    getPosition: d => d.geometry.coordinates,
    getColor: [255, 0, 128],
    pickable: true,
    onHover: _.debounce((info) => {
      console.log('hover:', info)
    }, 200),
    onClick: info => console.log('Clicked:', info)
  })
];

export { icon, iconData, layers }