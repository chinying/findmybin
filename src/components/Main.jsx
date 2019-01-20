import React from 'react';
import DeckGL, {LineLayer} from 'deck.gl';
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

// Data to be used by the LineLayer
const data = [{sourcePosition: [-122.41669, 37.7853], targetPosition: [-122.41669, 37.781]}];

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
      new LineLayer({id: 'line-layer', data})
    ];

    return (
      <DeckGL 
        initialViewState={initViewState}
        controller={controller}
        // layers={layers}
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