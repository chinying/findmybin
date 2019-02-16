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
  clickHandler: (e) => {
    console.log('clickhandler asdkjsad', e)
  }
});


class Results extends React.Component {
  constructor() {
    super()
    // this.clickHandler = this.clickHandler.bind(this)
    this.hoverEvent = this.hoverEvent.bind(this)
  }

  clickEvent () {
    console.log('called')
    return function(e) {
      console.log(e)
    }
  }

  hoverEvent (r) {
    console.log('asddsasdsa', r)
  }

  render() {
    return (
      <div>
        {this.props.results.map((result, key) => (
          <ResultItem
            index={`result--${key}`}
            result={result}
            // clickEvent={() => this.hoverEvent(cb)}
            // onClick = { this.props.clickHandler }
            />
        ))}
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Results);
export { Results, mapStateToProps };
