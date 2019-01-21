import React from 'react';
import DeckGL, {ScatterplotLayer} from 'deck.gl';
import ReactMapGL, {StaticMap} from 'react-map-gl';

/* cannot be destructured as webpack plugin only 
* inserts into code where env vars are used
*/
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;

// Viewport settings
const initViewState = {
  longitude: 103.8198,
  latitude: 1.3521,
  zoom: 13,
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
      viewport: initViewState
    }
  }

  render() {
    const {controller = true} = this.props 

    const layers = [
      new ScatterplotLayer({
        id: 'geojson',
        data: parseGeoJSON(gData),
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