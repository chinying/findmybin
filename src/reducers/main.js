import {
  ADD_HIGHLIGHT_LAYER,
  UPDATE_DISPOSABLE_POINTS,
  UPDATE_LAYERS,
  UPDATE_GEOJSON_SCATTER,
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE,
} from "@/constants/main"

import * as _ from 'lodash'

import { pointColours } from '@/mapComponents'
import { ScatterplotLayer } from 'deck.gl'

let defaultState = {
  viewport: {
    longitude: 103.8198,
    latitude: 1.3521,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    width: 1000,
    height: 1000
  },
  disposablePoints: [],
  layers: [
    new ScatterplotLayer({
      id: 'highlighted-point',
      data: [],
      getPosition: d => d.geometry.coordinates
    })
  ],
  loading: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_VIEWPORT:
      return {
        ...state,
        viewport: action.payload
      };
    case UPDATE_VIEWPORT_SIZE:
      let viewport = {
        ...state.viewport,
        height: action.payload.height,
        width: action.payload.width
      }
      return {
        ...state,
        viewport
      };
    case UPDATE_GEOJSON_SCATTER:
      console.log('points', state.disposablePoints)
      return {
        ...state,
        layers: [
          new ScatterplotLayer({
            id: 'geojson',
            data: state.disposablePoints,
            radiusScale: 10,
            radiusMinPixels: 1,
            getPosition: d => d.geometry.coordinates,
            getColor: d => pointColours(d.waste_type),
            pickable: true,
          }),
          new ScatterplotLayer({
            id: 'highlighted-point',
            data: [],
            getPosition: d => d.geometry.coordinates
          })
        ]
      };
    case UPDATE_DISPOSABLE_POINTS:
      return {
        ...state,
        disposablePoints: action.payload
      };
    case ADD_HIGHLIGHT_LAYER:
      let layers = state.layers
      let layerName = 'highlighted-point'
      let highlightedLayer = _.find(layers, {id: layerName})
      let highlightedLayerIndex = _.findIndex(layers, {id: layerName})

      let newHighlightedLayer = new ScatterplotLayer({
        ...highlightedLayer.props,
        id: layerName,
        data: action.payload,
        radiusScale: 15,
        getPosition: d => d.geometry.coordinates,
        getColor: [189, 85, 50],
        pickable: false
      })
      layers.splice(highlightedLayerIndex, 1) // note that this statement *returns* the spliced item
      return {
        ...state,
        layers: [...layers, newHighlightedLayer]
        // layers
      };
    default:
      return state;
  }
};