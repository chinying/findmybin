import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import DeckGL from 'deck.gl';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';

import { matchTerm } from '@/utils/textMatch'

import LocationMarker from './LocationMarker'
import Results from './Results'
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
  SET_MODAL_VISIBILITY,
  UPDATE_DISPOSABLE_POINTS,
  UPDATE_FILTER_TERM,
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE,
  UPDATE_GEOJSON_SCATTER
} from '@/constants/main'

const mapStateToProps = state => {
  // console.log("mapstatetoprops", state)
  return {
    viewport: state.mainMap.viewport,
    points: state.mainMap.disposablePoints,
    layers: state.mainMap.layers,
    pin: state.geolocation.pin,
    filterTypes: state.geolocation.filterTerm,
    showModal: state.mainMap.showModal,
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
    type: UPDATE_GEOJSON_SCATTER,
  }),
  setModalVisibility: (bool) => dispatch({
    type: SET_MODAL_VISIBILITY,
    payload: bool
  }),
  updateFilterTerm: term => dispatch({
    type: UPDATE_FILTER_TERM,
    payload: term
  }),
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
    this.state = {
      imageFile: null
    }
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


  fileFieldHandler(e) {
    let files = e.target.files
    let selectedFile = files[0]
    this.setState({imageFile: selectedFile})
  }

  callImageRecognition() {
    let formData = new FormData()
    console.log(this.state ,this.state.imageFile)
    formData.append('file', this.state.imageFile)
    // debugger
    axios({
      method: 'post',
      url: `${PREDICTION_API_URL}/predict`,
      data: formData,
      config: { headers: {'Content-Type': 'multipart/form-data' }}
    })
    .then((resp) => {
      let data = resp.data
      let recyclable = data.material
      let matchedMaterial = matchTerm(recyclable)
      this.props.updateFilterTerm(matchedMaterial)
      this.props.updateMapLayers()
      // this.setState({filterType: matchedMaterial})
    })
    .finally(() => {
      this.props.setModalVisibility(false)
    })
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
            Nearest disposable drop-off locations:
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

        <ReactModal
          isOpen={ this.props.showModal }
          contentLabel="Minimal Modal Example"
          className="upload--modal"
          // overlayClassName="modal--overlay"
        >
          <input className="modal-element" type="file" onChange={this.fileFieldHandler.bind(this)} />
          <button className="modal-button modal-element" onClick={this.callImageRecognition.bind(this)}>Upload</button>
          <br/>
          <div style={{marginBottom: "auto"}}>
            <button onClick={() => this.props.setModalVisibility(false)}>Close Modal</button>
          </div>
        </ReactModal>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Main);
export { Main, mapStateToProps };

// export default Main;