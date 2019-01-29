import axios from 'axios';
import * as _ from 'lodash';
import React from 'react';
import DeckGL, {ScatterplotLayer, IconLayer} from 'deck.gl';
import ReactMapGL, {StaticMap, FlyToInterpolator} from 'react-map-gl';

import { sidebarStyle, searchBoxStyle, bodyStyle } from '../styles'
import { icon, iconData, layers } from '../mapComponents'
import { search } from '../utils/geocode'
import { point as turfPoint, distance } from '@turf/turf'

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
      recyclingBins: gData,
      nearestResults: []
    }

    // this.fn = this.fn.bind(this)
    this.inputChangeHandler = this.inputChangeHandler.bind(this)
    this._onViewPortChange = this._onViewPortChange.bind(this)
    this._goToViewport = this._goToViewport.bind(this)
    this._onViewStateChange = this._onViewStateChange.bind(this);
    this.computeDistance = this.computeDistance.bind(this)
    this.debouncedSearch = _.debounce(this.debouncedSearch, 500)
  }

  inputChangeHandler(event) {
    let searchTerm = event.target.value;
    this.setState({searchTerm})

    this.debouncedSearch(searchTerm)
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
      let firstResult = resp.data.features[0]
      let tempState = this.state.viewport

      console.log('ASJKASLDJASKL', tempState, this.state)
      tempState.longitude = firstResult.geometry.coordinates[0]
      tempState.latitude = firstResult.geometry.coordinates[1]

      this._goToViewport(tempState)
      this.computeDistance(tempState)

      console.log(tempState, this.state)
    })
    .catch(err => { console.error('error searching', err) })
  }

  _onViewStateChange({viewState}) {
    this.setState({viewState});
  }

  computeDistance(location) {
    let pointsLayer = _.find(layers, {id: 'geojson'})
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

  render() {
    const {controller = true} = this.props
    let { viewport } = this.state
    const { innerWidth: width, innerHeight: height } = window
    // this._onViewPortChange({width, height})
    viewport.height = height
    viewport.width = width

    return (
      <div style={bodyStyle}>
        <div style={sidebarStyle}>
          results go here
          {this.state.nearestResults.map((result) => (
            <div>
              <p>{result.geometry.coordinates}</p>
              <p>{result.properties.HOUSENUMBER} {result.properties.ADDRESSSTREETNAME}, {result.properties.ADDRESSBUILDINGNAME} </p>
              <p>Singapore {result.properties.ADDRESSPOSTALCODE}</p>
              <p>{result.distance} km away</p>
              <hr/>
            </div>
          ))}
        </div>
        <div>
          <div className="search-box" style={searchBoxStyle}>
            <input type="text" onChange={this.inputChangeHandler} />
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
                layers={layers}

                viewState={viewport}
                onViewStateChange={this._onViewStateChange}
              >
              </DeckGL>
            </ReactMapGL>
        </div>
      </div>
    );
  }
}

export default Main;