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
        {result.properties.building !== "<Null>" ? (
          <h4>{result.properties.building}</h4>
        ) : (
          <h4>{result.properties.road}</h4>
        )}
        <span>Type: {result.waste_type}</span>
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
