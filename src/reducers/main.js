import {
  UPDATE_DISPOSABLE_POINTS,
  UPDATE_LAYERS,
  UPDATE_VIEWPORT,
  UPDATE_VIEWPORT_SIZE,
} from "@/constants/main"

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
  layers: [],
  loading: false
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_VIEWPORT:
      // console.log(action)
      return {
        ...state,
        viewport: action.payload.viewState
      };
    case UPDATE_VIEWPORT_SIZE:
      let viewport = {
        ...state.viewport,
        height: action.payload.height,
        width: action.payload.width
      }
      // console.log(action)
      return {
        ...state,
        viewport
      };
    case UPDATE_LAYERS:
      return {
        ...state,
        layers: new ScatterplotLayer({
          id: 'geojson',
          data: state.disposablePoints,
          radiusScale: 10,
          radiusMinPixels: 1,
          getPosition: d => d.geometry.coordinates,
          getColor: d => pointColours(d.waste_type),
          pickable: true,
        })
      };
    case UPDATE_DISPOSABLE_POINTS:
      return {
        ...state,
        disposablePoints: action.payload.points
      };
    // case ARTICLE_PAGE_LOADED:
    //   return {
    //     ...state,
    //     article: action.payload[0].article,
    //     comments: action.payload[1].comments
    //   };
    // case ARTICLE_PAGE_UNLOADED:
    //   return {};
    // case ADD_COMMENT:
    //   return {
    //     ...state,
    //     commentErrors: action.error ? action.payload.errors : null,
    //     comments: action.error ?
    //       null :
    //       (state.comments || []).concat([action.payload.comment])
    //   };
    // case DELETE_COMMENT:
    //   const commentId = action.commentId
    //   return {
    //     ...state,
    //     comments: state.comments.filter(comment => comment.id !== commentId)
    //   };
    default:
      return state;
  }
};