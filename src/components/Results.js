import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import ResultItem from "./ResultItem";

import "@/styles/main.scss";
import "@/styles/input.css";

const mapStateToProps = state => {
  return {
    results: state.results.results
  };
};

const mapDispatchToProps = dispatch => ({});

class Results extends React.Component {
  constructor() {
    super();
    this.hoverEvent = this.hoverEvent.bind(this);
  }

  // TODO
  hoverEvent(r) {
    console.log("asddsasdsa", r);
  }

  render() {
    return (
      <div>
        {this.props.results.map((result, key) => (
          <ResultItem index={`result--${key}`} result={result} />
        ))}
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Results);
export { Results, mapStateToProps };
