import React, {Component} from 'react';

export default class ResultItem extends Component {
  render() {
    let {result} = this.props
    return (
      <div>
        <p>TYPE: {result.waste_type}</p>
        <p>{result.geometry.coordinates}</p>
        <p>{result.properties.blk} {result.properties.road}, {result.properties.building} </p>
        <p>Singapore {result.properties.postal}</p>
        <p>{result.distance} km away</p>
        <hr/>
      </div>
    )
  }
}
