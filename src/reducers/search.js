import {
  SET_LOCATION_PIN,
  SET_SEARCH_TERM,
  SET_SEARCH_RESULTS,
  SET_PIN_VISIBILITY
} from "@/constants/main";

let defaultState = {
  term: "",
  results: [],
  pin: {
    visible: false,
    latitude: 1.3521,
    longitude: 103.8198
  }
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_SEARCH_RESULTS:
      return {
        ...state,
        results: action.payload
      };
    case SET_SEARCH_TERM:
      return {
        ...state,
        term: action.payload
      };
    case SET_LOCATION_PIN:
      let { latitude, longitude } = action.payload;
      let pin = {
        ...state.pin,
        latitude,
        longitude
      };
      return {
        ...state,
        pin
      };
    case SET_PIN_VISIBILITY: {
      let pin = {
        ...state.pin,
        visible: action.payload
      };
      return {
        ...state,
        pin
      };
    }
    default:
      return state;
  }
};
