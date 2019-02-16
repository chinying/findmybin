import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import DeckGL, {ScatterplotLayer, IconLayer} from 'deck.gl';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { point as turfPoint, distance } from '@turf/turf'

import LocationMarker from './LocationMarker'
import ResultItem from './ResultItem'
import Results from './Results'
import { sidebarStyle, searchBoxStyle, bodyStyle, flexStyle, materialBoxStyle } from '../styles'
import SearchBox from '@/components/SearchBox'
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

const mapStateToProps = state => {
  // console.log("mapstatetoprops", state)
  return {
    viewport: state.mainMap.viewport,
    points: state.mainMap.disposablePoints,
    layers: state.mainMap.layers,
    pin: state.geolocation.pin
  }
}

const mapDispatchToProps = dispatch => ({
  updateViewport: viewport => dispatch({
    type: UPDATE_VIEWPORT,
    payload: viewport.viewState
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

  renderLocationPin() {
    if (this.props.pin.visible) {
      return (
        <Marker
          key={`marker`}
          longitude={this.props.pin.longitude}
          latitude={this.props.pin.latitude} >
          <LocationMarker size={20} />
        </Marker>
      );
    }
  }

  componentDidMount() {
    axios.get('/assets/combined.json')
      .then(resp => {
        // this.setState({gData: resp.data})
        this.props.updateDisposablePoints(resp.data)
        this.props.updateMapLayers()
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
        <div className="sidebar-container">
          <div className="results-list-container">
            sidebar here
            <Results />
          </div>
        </div>
        <div className="map-div-container">
          <div className="topbar">
            <SearchBox />
          </div>
          <div className="map-body">
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
                { this.renderLocationPin.bind(this) }
              </DeckGL>
            </ReactMapGL>
          </div>
        </div>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main, mapStateToProps };

// export default Main;