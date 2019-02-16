import axios from 'axios'
import * as _ from 'lodash';
import React from 'react';
import { connect } from 'react-redux';

import DeckGL, {ScatterplotLayer, IconLayer} from 'deck.gl';
import ReactMapGL, {Marker, Popup} from 'react-map-gl';
import { point as turfPoint, distance } from '@turf/turf'

import LocationMarker from './LocationMarker'
import ResultItem from './ResultItem'

import '@/styles/main.css'
import '@/styles/input.css'

import {
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE
} from '@/constants/main'
import { UPDATE_DISPOSABLE_POINTS, UPDATE_LAYERS } from '../constants/main';

const mapStateToProps = state => {
  // console.log("mapstatetoprops", state)
  return {
    results: state.results.results
  }
}

const mapDispatchToProps = dispatch => ({
  // updateViewport: viewport => dispatch({
  //   type: UPDATE_VIEWPORT,
  //   payload: viewport.viewState
  // }),
  // updateViewPortSize: ({ height, width }) => dispatch({
  //   type: UPDATE_VIEWPORT_SIZE,
  //   payload: {height, width}
  // }),
  // updateDisposablePoints: points => dispatch({
  //   type: UPDATE_DISPOSABLE_POINTS,
  //   payload: points
  // }),
  // updateMapLayers: () => dispatch({
  //   type: UPDATE_LAYERS,
  // })
});

class Results extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    // this.props.updateMapLayers()
    return (
      <div>
        {this.props.results.map((result, key) => (
          <ResultItem
            index={`result--${key}`}
            result={result}
            // clickEvent={this.hoverEvent}
            />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
export { Results, mapStateToProps };

// export default Main;