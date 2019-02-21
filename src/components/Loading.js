import * as _ from "lodash";
import React from "react";
import { connect } from "react-redux";

import "@/styles/loading.css";

class Loading extends React.Component {
  constructor() {
    super();
  }

  render() {
    return (
      <div className="div-body">
        <div className="loader" />
        {this.props.text}
      </div>
    );
  }
}

export default Loading;
