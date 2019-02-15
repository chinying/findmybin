import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import DeckGL, {ScatterplotLayer, IconLayer} from 'deck.gl';
import ReactMapGL, {FlyToInterpolator, Marker, Popup} from 'react-map-gl';
import { point as turfPoint, distance } from '@turf/turf'

import LocationMarker from './LocationMarker'
import ResultItem from './ResultItem'
import { sidebarStyle, searchBoxStyle, bodyStyle, flexStyle, materialBoxStyle } from '../styles'
// import { layers } from '../mapComponents'
import { pointColours } from '../mapComponents'
import { search } from '../utils/geocode'
import { matchTerm } from '../utils/textMatch'

import Autocomplete from 'react-autocomplete'
import ReactModal from 'react-modal'

import '@/styles/main.css'
import '@/styles/input.css'

/* cannot be destructured as webpack plugin only
* inserts into code where env vars are used
*/
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const PREDICTION_API_URL = process.env.PREDICTION_API_URL;

import {
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE
} from '@/constants/main'
import { UPDATE_DISPOSABLE_POINTS, UPDATE_LAYERS } from '../constants/main';

/**
 * suspicion that map data update doesn't work because its async
 */

const mapStateToProps = state => {
  // console.log("mapstatetoprops", state)
  return {
    viewport: state.mainMap.viewport,
    points: state.mainMap.disposablePoints,
    layers: state.mainMap.layers
  }
}

const mapDispatchToProps = dispatch => ({
  updateViewport: viewport => dispatch({
    type: UPDATE_VIEWPORT,
    payload: viewport
  }),
  updateViewPortSize: ({ height, width }) => dispatch({
    type: UPDATE_VIEWPORT_SIZE,
    payload: {height, width}
  }),
  updateDisposablePoints: points => dispatch({
    type: UPDATE_DISPOSABLE_POINTS,
    payload: points
  }),
  updateMapLayers: () => dispatch({
    type: UPDATE_LAYERS,
  })

});

// Viewport settings
const initViewState = {
  longitude: 103.8198,
  latitude: 1.3521,
  zoom: 12,
  pitch: 0,
  bearing: 0,
  width: 1000,
  height: 1000
};

// DeckGL react component
class Main extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    axios.get('/assets/combined.json')
      .then(resp => {
        // this.setState({gData: resp.data})
        this.props.updateDisposablePoints(resp.data)

      })
      .catch(err => console.error(err))
  }

  render() {
    // dirty hack
    const { innerWidth: width, innerHeight: height } = window
    this.props.viewport.width = width
    this.props.viewport.height = height
    // this.props.updateMapLayers()

    return (
      <div>
        { this.props.viewport.latitude }
        <ReactMapGL
          { ...this.props.viewport }
          mapboxApiAccessToken = { MAPBOX_ACCESS_TOKEN }
          onViewStateChange = { this.props.updateViewport }
          >
          <DeckGL
            initialViewState = {initViewState}
            controller={true}
            layers = {this.props.layers}
            viewState = {this.props.viewport}
            onViewPortChange = { this.props.updateViewport }
          >
          </DeckGL>
        </ReactMapGL>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main, mapStateToProps };

// export default Main;