import axios from 'axios';
import React from 'react';
import DeckGL, {ScatterplotLayer, IconLayer} from 'deck.gl';
import ReactMapGL, {StaticMap} from 'react-map-gl';

/* cannot be destructured as webpack plugin only 
* inserts into code where env vars are used
*/
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// Viewport settings
const initViewState = {
  longitude: 103.8198,
  latitude: 1.3521,
  zoom: 12,
  pitch: 0,
  bearing: 0,
  zoom: 13
};

const gData = require('../data/recyclingBins.json')

function parseGeoJSON(geoData) {
  return geoData.features
}

// DeckGL react component
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      viewport: initViewState,
      recyclingBins: []
    }

    axios.get('http://localhost:9000/assets/recyclingBins.json')
      .then(resp => {
        this.setState({recyclingBins: resp.data})
      })
      .catch(err => { console.error(err) })
  }

  render() {
    const {controller = true} = this.props 

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
        data: parseGeoJSON(this.state.recyclingBins),
        radiusScale: 10,
        radiusMinPixels: 0.5,
        getPosition: d => d.geometry.coordinates,
        getColor: [255, 0, 128]
      })
    ];

    return (
      <DeckGL 
        initialViewState={initViewState}
        controller={controller}
        layers={layers}
      >
        {/* <StaticMap /> */}
        <ReactMapGL
          onViewportChange={(viewport) => {
            const {width, height, latitude, longitude, zoom} = viewport;
            // call `setState` and use the state to update the map.
          }}
          mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
        />
      </DeckGL>
    );
  }
}

export default Main;