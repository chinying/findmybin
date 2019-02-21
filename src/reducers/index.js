import mainMap from "./main";
import geolocation from "./search";
import resultsReducer from "./results";
import { combineReducers } from "redux";
// import { routerReducer } from 'react-router-redux';

export default combineReducers({
  mainMap,
  geolocation,
  results: resultsReducer
  // router: routerReducer
});
