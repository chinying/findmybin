import React, { Component } from "react";
import "@/styles/results.css";
import { connect } from "react-redux";

import { ADD_HIGHLIGHT_LAYER } from "@/constants/main";

function truncate(str, len) {
  let text = typeof str !== "string" ? str.toString() : str;
  if (text.length > len) {
    return text.substring(0, len);
  }
  return text;
}

const binType = type => {
  switch(type) {
    case "Recyclable":
      return "recycling"
    case "E-waste":
      return "electronic-waste"
    case "2ndhand":
      return "second-hand"
  }
}

const mapStateToProps = state => {
  return {};
};

const mapDispatchToProps = dispatch => ({
  clickEvent: result => {
    // console.log(result.geometry.coordinates)
    dispatch({
      type: ADD_HIGHLIGHT_LAYER,
      payload: [result]
    });
  }
});

class ResultItem extends Component {
  constructor(props) {
    super(props);
    this.clickEvent = this.clickEvent.bind(this);
  }

  clickEvent(r) {
    console.log("clicked r", r);
  }

  render() {
    let { result } = this.props;
    return (
      <div
        className="result-item"
        onClick={() => this.props.clickEvent(result)}
        // onClick = {this.props.clickEvent(result.properties.postal) }
      >
        <i className={binType(result.waste_type)}></i>
        {result.properties.building !== "<Null>" ? (
          <p className="result-location">{result.properties.building}</p>
        ) : (
          <p className="result-location">{result.properties.road}</p>
        )}
        <span><b>Type:</b> {result.waste_type}</span>
        <br />
        <span>
          {result.properties.blk} {result.properties.road}
          {result.properties.floor !== "<Null>" &&
          result.properties.floor.trim().length > 0 ? (
            <span>Level {result.properties.floor}</span>
          ) : (
            <span />
          )}
        </span>
        <br />
        <span>Singapore {result.properties.postal}</span>
        <br />
        <span>{truncate(result.distance, 5)} km away</span>
      </div>
    );
  }
}

// export default ResultItem

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResultItem);
export { ResultItem, mapStateToProps };
