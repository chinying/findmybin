import axios from "axios";
import * as _ from "lodash";
import { FlyToInterpolator } from "react-map-gl";

let search = function(searchTerm) {
  let token = process.env.MAPBOX_ACCESS_TOKEN;
  let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchTerm}.json?access_token=${token}&bbox=103.6182, 1.1158, 104.4085, 1.4706`;
  return axios.get(url);
};

let flyInterpolatorFactory = location => {
  let { longitude, latitude } = location;
  return {
    longitude,
    latitude,
    zoom: 15,
    transitionInterpolator: new FlyToInterpolator(),
    transitionDuration: 1000
  };
};

let layerReplacementFactory = (layers, layerName, newLayer) => {
  let removeIndex = _.findIndex(layers, { id: layerName });
  layers.splice(removeIndex, 1); // note that this statement *returns* the spliced item
  return [...layers, newLayer];
};

export { flyInterpolatorFactory, layerReplacementFactory, search };
