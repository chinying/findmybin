import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import { pointColours } from '../mapComponents'
import { point as turfPoint, distance } from '@turf/turf'
import { flyInterpolatorFactory, search } from '../utils/geocode'

import Autocomplete from 'react-autocomplete'

import { closestPoints } from '@/utils/computeDistances'
import '@/styles/main.css'
import '@/styles/input.css'

/* cannot be destructured as webpack plugin only
* inserts into code where env vars are used
*/
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const PREDICTION_API_URL = process.env.PREDICTION_API_URL;

import {
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE,
  UPDATE_DISPOSABLE_POINTS,
  SET_LOCATION_PIN,
  SET_NEAREST_RESULTS,
  SET_PIN_VISIBILITY,
  SET_SEARCH_TERM,
  SET_SEARCH_RESULTS,
} from '@/constants/main'

const mapStateToProps = state => {
  return {
    searchTerm: state.geolocation.term,
    searchResults: state.geolocation.results,
    viewport: state.mainMap.viewport,
    pointsLayer: _.find(state.mainMap.layers, {id: 'geojson'}),
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateViewport: viewport => dispatch({
    type: UPDATE_VIEWPORT,
    payload: viewport
  }),
  updateSearchTerm: term => dispatch({
    type: SET_SEARCH_TERM,
    payload: term
  }),
  updateSearchResults: _.debounce((term) => {
    search(term)
      .then(resp => {
        dispatch({
          type: SET_SEARCH_RESULTS,
          payload: resp.data.features
        })
      })
  }, 500),
  selectHandler: (selectedResult) => {
    let latitude = selectedResult.geometry.coordinates[1]
    let longitude = selectedResult.geometry.coordinates[0]
    // let nearestResults = computeDistance
    dispatch({
      type: SET_LOCATION_PIN,
      payload: {
        latitude,
        longitude
      }
    })
    dispatch({
      type: SET_PIN_VISIBILITY,
      payload: true
    })
    dispatch({
      type: UPDATE_VIEWPORT,
      payload: flyInterpolatorFactory({latitude, longitude})
    })
    // dispatch({
    // })
  },
  updateClosestPoints: (points) => dispatch({
    type: SET_NEAREST_RESULTS,
    payload: points
  })
});

// DeckGL react component
class SearchBox extends React.Component {
  constructor(props) {
    super(props)
  }

  selectHandler(term) {
    let selectedResult = _.find(this.props.searchResults, { text: term })
    this.props.selectHandler(selectedResult)
    this.computeDistance(selectedResult)
  }

  computeDistance(location) {
    let propspointsLayer = this.props.pointsLayer.props
    let points = propspointsLayer.data

    let latitude = location.geometry.coordinates[1]
    let longitude = location.geometry.coordinates[0]

    let coordinates = {latitude, longitude}

    let closest = closestPoints(points, coordinates)
    this.props.updateClosestPoints(closest)
  }

  render() {
    return (
      <div>
        <Autocomplete
          inputProps={{className: 'input-box'}}
          getItemValue={(item) => item.text}
          items={this.props.searchResults}
          renderItem={(item, isHighlighted) =>
            <div style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
              {item.text}
            </div>
          }
          value={this.props.searchTerm}
          onChange={(e) => {
              this.props.updateSearchTerm(e.target.value)
              this.props.updateSearchResults(e.target.value)
            }
          }
          onSelect = {
            this.selectHandler.bind(this)
          }
        />
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchBox);
export { SearchBox, mapStateToProps };
