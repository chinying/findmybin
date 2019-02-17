// https://github.com/uber/deck.gl/blob/6.3-release/examples/website/icon/app.js

import { Provider } from "react-redux";
import { store } from "./store";
import React from "react";
import ReactDOM from "react-dom";
import Main from "./components/Main.jsx";

import "mapbox-gl/dist/mapbox-gl.css";

const Index = () => {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
};

ReactDOM.render(<Index />, document.getElementById("index"));
