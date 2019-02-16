import {
  SET_NEAREST_RESULTS
} from "@/constants/main"

let defaultState = {
  results: []
}

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_NEAREST_RESULTS:
      return {
        ...state,
        results: action.payload
      }
    default:
      return state;
  }
};