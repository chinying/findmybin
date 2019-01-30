// https://github.com/uber/deck.gl/blob/6.3-release/examples/website/icon/app.js

import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main.jsx"

import 'mapbox-gl/dist/mapbox-gl.css';

const Index = () => {
  return (
    <Main />
  );
};

ReactDOM.render(<Index />, document.getElementById("index"));