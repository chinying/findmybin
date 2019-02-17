import {
  ADD_HIGHLIGHT_LAYER,
  SET_INITIAL_SCATTER_POINTS,
  UPDATE_DISPOSABLE_POINTS,
  UPDATE_LAYERS,
  UPDATE_GEOJSON_SCATTER,
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE,
} from "@/constants/main"

import * as _ from 'lodash'

import { pointColours } from '@/mapComponents'
import { layerReplacementFactory } from '@/utils/geocode'
import { ScatterplotLayer } from 'deck.gl'

let geoJsonLayerName = 'geojson'
let highlightLayerName = 'highlighted-point'

let defaultState = {
  originalScatterPlot: [],
  scatterPlotDownloaded: false,
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
      id: geoJsonLayerName,
      data: []
    }),
    new ScatterplotLayer({
      id: highlightLayerName,
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
    case SET_INITIAL_SCATTER_POINTS:
      return {
        ...state,
        originalScatterPlot: action.payload
      }
    case UPDATE_GEOJSON_SCATTER:
      console.log('points', state.disposablePoints)

      let binsLayer = new ScatterplotLayer({
        id: geoJsonLayerName,
        data: state.disposablePoints,
        radiusScale: 10,
        radiusMinPixels: 1,
        getPosition: d => d.geometry.coordinates,
        getColor: d => pointColours(d.waste_type),
        pickable: true,
      })
      return {
        ...state,
        layers: layerReplacementFactory(state.layers, geoJsonLayerName, binsLayer)
      };
    case UPDATE_DISPOSABLE_POINTS:
      return {
        ...state,
        disposablePoints: action.payload
      };
    case ADD_HIGHLIGHT_LAYER:
      let newHighlightedLayer = new ScatterplotLayer({
        id: highlightLayerName,
        data: action.payload,
        radiusScale: 15,
        getPosition: d => d.geometry.coordinates,
        getColor: [189, 85, 50],
        pickable: false
      })
      return {
        ...state,
        layers: layerReplacementFactory(state.layers, highlightLayerName, newHighlightedLayer)
      };
    default:
      return state;
  }
};