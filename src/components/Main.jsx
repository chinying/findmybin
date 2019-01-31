import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
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
  width: 1000,
  height: 1000
};

// DeckGL react component
class Main extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      gData: [],
      viewport: initViewState,
      hideLocationPin: true,
      locationPin: {
        longitude: 103.8198,
        latitude: 1.3521
      },
      searchValue: '',
      searchResults: [],
      selectedSearchResult: {name: '', coordinates: [103.8198, 1.3521, 0]},
      nearestResults: [],
      filterType: '',
      hamburgerOpen: false
    }

    // this.fn = this.fn.bind(this)
    this.layers = this.layers.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this._onViewPortChange = this._onViewPortChange.bind(this)
    this._goToViewport = this._goToViewport.bind(this)
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this.computeDistance = this.computeDistance.bind(this)
    this._renderLocationPin = this._renderLocationPin.bind(this)
    this.updateLocationPin = this.updateLocationPin.bind(this)
    this.debouncedSearch = _.debounce(this.debouncedSearch, 500)
  }

  componentDidMount() {
    axios.get('/assets/combined.json')
      .then(resp => {
        this.setState({gData: resp.data})
      })
      .catch(err => console.error(err))
  }

  // TODO: allow multiple
  layers(wasteType = '') {
    // FIXME: this will produce blank results if waste_type doesn't match
    let gData = this.state.gData
    let matchedType = matchTerm(wasteType)
    let filteredPoints = (matchedType === 'all' || matchedType === '') ? gData : gData.filter(d => d.waste_type === matchedType)
    return [
      new ScatterplotLayer({
        id: 'geojson',
        data: filteredPoints,
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
    ]
  }

  _renderLocationPin() {
    if (!this.state.hideLocationPin) {
      return (
        <Marker
          key={`marker`}
          longitude={this.state.locationPin.longitude}
          latitude={this.state.locationPin.latitude} >
          <LocationMarker size={20} />
        </Marker>
      );
    }
  }

  updateLocationPin(location) {
    let { latitude, longitude } = location
    this.setState({locationPin: {latitude, longitude}})
  }

  inputChangeHandler(event) {
    let searchTerm = event.target.value;
    this.setState({searchTerm})
    this.debouncedSearch(searchTerm)
  }

  filterTypeInputHandler(event) {
    let filterType = event.target.value
    this.setState({filterType})
  }

  _onViewPortChange(viewport) {
    // console.log("_viewstate", viewport)
    this.setState({viewport: {...this.state.viewport, ...viewport}})
  }

  _goToViewport(location) {
    console.log('GOTO VIEWPORT', location)
    let {longitude, latitude} = location
    this._onViewPortChange({
      longitude,
      latitude,
      zoom: 15,
      transitionInterpolator: new FlyToInterpolator(),
      transitionDuration: 1000
    });
  };

  debouncedSearch(term) {
    search(term)
      .then(resp => {
        console.log(resp.data)
        // use _.get
        let results = resp.data.features
        this.setState({searchResults: results})
      })
      .catch(err => { console.error('error searching', err) })
  }

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  computeDistance(location) {
    let pointsLayer = _.find(this.layers(this.state.filterType), {id: 'geojson'})
    let points = pointsLayer.props.data
    let referencePoint = turfPoint([location.longitude, location.latitude])
    // debugger
    let distances = points.map((p, idx) => {
      let point = turfPoint(p.geometry.coordinates)
      return {dist: distance(point, referencePoint), index: idx}
    })
    .sort((a, b) => {
      return a.dist - b.dist
    })
    // debugger
    let nearestResultIndices = _.take(distances, 20)
    let nearestResults = nearestResultIndices.map(result => {
      return {...points[result.index], distance: result.dist}
    })
    // debugger
    this.setState({nearestResults})
  }

  _autocompleteSelectHandler(term) {
    let selectedResult = _.find(this.state.searchResults, {text: term})
    let tempState = this.state.viewport

    tempState.longitude = selectedResult.geometry.coordinates[0]
    tempState.latitude = selectedResult.geometry.coordinates[1]

    this.updateLocationPin(tempState)
    this.setState({hideLocationPin: false})
    this._goToViewport(tempState)
    this.computeDistance(tempState)
  }

  burgerMenuClick() {
    this.setState({
      hamburgerOpen: !this.state.hamburgerOpen
    });
  }

  render() {
    const {controller = true} = this.props
    let { filterType, searchValue, selectedSearchResult, searchResults, viewport } = this.state
    const { innerWidth: width, innerHeight: height } = window
    // this._onViewPortChange({width, height})
    viewport.height = height
    viewport.width = width

    return (
      <div style={bodyStyle}>
        <div style={sidebarStyle}>
          results go here
          {this.state.nearestResults.map((result) => (
            <ResultItem result={result} />
          ))}
        </div>
        <div>
          <div className="search-box" style={searchBoxStyle}>
            <Autocomplete
              getItemValue={(item) => item.text}
              items={searchResults}
              renderItem={(item, isHighlighted) =>
                <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                  {item.text}
                </div>
              }
              value={searchValue}
              onChange={(e) =>
                {
                  this.setState({searchValue: e.target.value})
                  this.debouncedSearch(e.target.value)
                }
              }
              onSelect={this._autocompleteSelectHandler.bind(this)}
            />
          </div>
          <div>
            <input
              type="text" id="material" style={materialBoxStyle} placeholder="i want to recycle"
              onChange={this.filterTypeInputHandler.bind(this)}
            />
          </div>
            <ReactMapGL
              {...viewport}
              // onViewportChange={(viewport) => {
              //   const {width, height, latitude, longitude, zoom} = viewport;
              //   // call `setState` and use the state to update the map.
              // }}
              onViewportChange={this._onViewPortChange}
              mapboxApiAccessToken={MAPBOX_ACCESS_TOKEN}
            >
              <DeckGL
                initialViewState={initViewState}
                controller={controller}
                layers={this.layers(filterType)}
                viewState={viewport}
                onViewStateChange={this._onViewStateChange}
              >
                {this._renderLocationPin()}
              </DeckGL>
            </ReactMapGL>
        </div>

      </div>
    );
  }
}

export default Main;