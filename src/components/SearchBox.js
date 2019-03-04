import axios from "axios";
import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import { pointColours } from "../mapComponents";
import { point as turfPoint, distance } from "@turf/turf";
import { flyInterpolatorFactory, search } from "../utils/geocode";

import Autocomplete from "react-autocomplete";

import { matchTerm } from "@/utils/textMatch";

import { closestPoints } from "@/utils/computeDistances";
import "@/styles/main.css";
import "@/styles/input.css";

/* cannot be destructured as webpack plugin only
 * inserts into code where env vars are used
 */
const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
const PREDICTION_API_URL = process.env.PREDICTION_API_URL;

import {
  UPDATE_FILTER_TERM,
  UPDATE_VIEWPORT,
  SET_LOCATION_PIN,
  SET_MODAL_VISIBILITY,
  SET_NEAREST_RESULTS,
  SET_PIN_VISIBILITY,
  SET_SEARCH_RESULTS,
  SET_SEARCH_TERM,
  UPDATE_GEOJSON_SCATTER
} from "@/constants/main";

const mapStateToProps = state => {
  return {
    searchTerm: state.geolocation.term,
    searchResults: state.geolocation.results,
    viewport: state.mainMap.viewport,
    pointsLayer: _.find(state.mainMap.layers, { id: "geojson" }),
    filterTerm: state.mainMap.filterTerm,
    reloadResultBar: state.mainMap.reloadResult
  };
};

const mapDispatchToProps = dispatch => ({
  updateViewport: viewport =>
    dispatch({
      type: UPDATE_VIEWPORT,
      payload: viewport
    }),
  updateSearchTerm: term =>
    dispatch({
      type: SET_SEARCH_TERM,
      payload: term
    }),
  updateSearchResults: _.debounce(term => {
    search(term).then(resp => {
      dispatch({
        type: SET_SEARCH_RESULTS,
        payload: resp.data.features
      });
    });
  }, 500),
  selectHandler: selectedResult => {
    let latitude = selectedResult.geometry.coordinates[1];
    let longitude = selectedResult.geometry.coordinates[0];
    dispatch({
      type: SET_LOCATION_PIN,
      payload: {
        latitude,
        longitude
      }
    });
    dispatch({
      type: SET_PIN_VISIBILITY,
      payload: true
    });
    dispatch({
      type: UPDATE_VIEWPORT,
      payload: flyInterpolatorFactory({ latitude, longitude })
    });
  },
  updateClosestPoints: points =>
    dispatch({
      type: SET_NEAREST_RESULTS,
      payload: points
    }),

  updateFilterTerm: term =>
    dispatch({
      type: UPDATE_FILTER_TERM,
      payload: term
    }),

  updateGeoJsonScatter: () =>
    dispatch({
      type: UPDATE_GEOJSON_SCATTER
    }),

  setModalVisibility: bool =>
    dispatch({
      type: SET_MODAL_VISIBILITY,
      payload: bool
    }),
  updateReloadResult: bool =>
    dispatch({
      type: UPDATE_RELOAD_RESULT,
      payload: bool
    })
});

class SearchBox extends React.Component {
  constructor(props) {
    super(props);
    this.updateGeoJsonScatter = _.debounce(
      this.updateGeoJsonScatter.bind(this),
      300
    );
    this.filterHandler = this.filterHandler.bind(this)
    this.state = {
      description: ""
    }
  }

  selectHandler(term) {
    let selectedResult = _.find(this.props.searchResults, { text: term });
    this.props.updateSearchTerm(term);
    this.props.selectHandler(selectedResult);
    this.computeDistance(selectedResult);
  }

  computeDistance(location) {
    let propspointsLayer = this.props.pointsLayer.props;
    let points = propspointsLayer.data;

    let latitude = location.geometry.coordinates[1];
    let longitude = location.geometry.coordinates[0];

    let coordinates = { latitude, longitude };

    let closest = closestPoints(points, coordinates, this.props.filterTerm);
    this.props.updateClosestPoints(closest);
  }

  updateGeoJsonScatter() {
    this.props.updateGeoJsonScatter();
    this.filterHandler();    
  }

  filterHandler () {
    let selectedResult = 
      { "id":"country.4869687774116560",
        "type":"Feature",
        "place_type":["country"],
        "relevance":1,
        "properties":
          { "short_code":"sg",
            "wikidata":"Q334"},"text":"Singapore","place_name":"Singapore","bbox":[103.5742042,1.1308576,104.406654,1.4779199],"center":[103.8,1.3],"geometry":{"type":"Point","coordinates":[103.8,1.3]}}
    if (this.props.searchResults.length) {
      selectedResult = _.find(this.props.searchResults, { text: this.props.searchTerm }); 
    }
    this.computeDistance(selectedResult)
  }

  isSelected (binType, filterTerm) {
    if (binType === filterTerm) {
      return 'selected'
    } else {
      return null
    }
  }

  render() {
    if (this.props.reloadResultBar) {
      this.filterHandler()
    }
    return (
      <div className="searchbar-contents">
        <div className="filter">
          <Autocomplete
            inputProps={{ className: "input-box", placeholder: "Enter your location"}}
            wrapperStyle={{ display: 'flex', width: '87.5%' }}
            getItemValue={item => item.text}
            items={this.props.searchResults}
            renderItem={(item, isHighlighted) => (
              <div
                style={{ background: isHighlighted ? "lightgray" : "white" }}
              >
                {item.text}
              </div>
            )}
            value={this.props.searchTerm}
            onChange={e => {
              this.props.updateSearchTerm(e.target.value);
              this.props.updateSearchResults(e.target.value);
            }}
            onSelect={this.selectHandler.bind(this)}
          />
          <i className="btn-search"></i>
        </div>

        <div className="filter">
          <input
            type="text"
            className="input-box"
            placeholder="Describe object or upload photo"
            onChange={(e) => {
              this.setState({description: e.target.value})}
            }
            onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  let matchedMaterial = new Promise((resolve) => {
                    setTimeout(resolve(matchTerm(this.state.description)), 100);
                  })
                  matchedMaterial.then((d) => {
                    this.props.updateFilterTerm(d);
                    this.updateGeoJsonScatter();
                  })
                }
              }
            } 
          />
          <button className="btn-upload tooltip" onClick={() => this.props.setModalVisibility(true)}>
            <span className="tooltip-text">Upload an image to see if it's recyclable!</span>
          </button>
        </div>
        
        <div className="filter">
          <select 
            className="filter-box"
            onChange={e => {
              this.props.updateFilterTerm(e.target.value);
              this.updateGeoJsonScatter();
            }}
          >
            <option selected={this.isSelected('All', this.props.filterTerm)} value="All">All</option>
            <option selected={this.isSelected('Recyclable', this.props.filterTerm)} value="Recyclable">Recyclable</option>
            <option selected={this.isSelected('E-waste', this.props.filterTerm)} value="E-waste">E-waste</option>
            <option selected={this.isSelected('2ndhand', this.props.filterTerm)} value="2ndhand">2nd Hand Goods</option>
          </select>
        </div>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchBox);
export { SearchBox, mapStateToProps };
