import React, {Component} from 'react';
import '@/styles/results.css'

function truncate(str, len) {
  let text = (typeof str !== 'string') ? str.toString() : str
  if (text.length > len) {
    return text.substring(0, len)
  }
  return text
}

export default class ResultItem extends Component {
  render() {
    let {result} = this.props
    return (
      <div className="result-item">
        {result.properties.building !== '<Null>'
          ? <h4>{result.properties.building}</h4>
          : <h4>{result.properties.road}</h4>
        }
        <p>TYPE: {result.waste_type}</p>
        <p>
          {result.properties.blk} {result.properties.road}
          {result.properties.floor !== '<Null>' && result.properties.floor.trim().length > 0
            ? <span>Level {result.properties.floor}</span>
            : <span></span>
          }
        </p>
        <p>Singapore {result.properties.postal}</p>
        <p>{truncate(result.distance, 5)} km away</p>

      </div>
    )
  }
}
