import {
  UPDATE_VIEWPORT
} from "@/constants/main"


let defaultState = {
  viewport: {
    longitude: 103.8198,
    latitude: 1.3521,
    zoom: 12,
    pitch: 0,
    bearing: 0,
    width: 1000,
    height: 1000
  }
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case UPDATE_VIEWPORT:
      return {
        ...state,
        viewport: action.viewport
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
      console.log('default', state)
      return state;
  }
};