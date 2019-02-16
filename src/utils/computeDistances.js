import { point as turfPoint, distance } from '@turf/turf'

let closestPoints = (points, location) => {
  // let points = this.propspointsLayer.props.data
  let referencePoint = turfPoint([location.longitude, location.latitude])
  // debugger
  let distances = points.map((p, idx) => {
    let point = turfPoint(p.geometry.coordinates)
    return {dist: distance(point, referencePoint), index: idx}
  })
  .sort((a, b) => {
    return a.dist - b.dist
  })
  // debugger
  let nearestResultIndices = _.take(distances, 20)
  return nearestResultIndices.map(result => {
    return {...points[result.index], distance: result.dist}
  })
  // debugger
  // this.setState({nearestResults})
}

export { closestPoints }