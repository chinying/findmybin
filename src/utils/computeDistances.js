import { point as turfPoint, distance } from "@turf/turf";
import { matchTerm } from "./textMatch";

let closestPoints = (points, location, filterTerm) => {
  let referencePoint = turfPoint([location.longitude, location.latitude]);
  let filteredPoints = filterPoints(points, filterTerm)
  let distances = filteredPoints
    .map((p, idx) => {
      let point = turfPoint(p.geometry.coordinates);
      return { dist: distance(point, referencePoint), index: idx };
    })
    .sort((a, b) => {
      return a.dist - b.dist;
    });

  let nearestResultIndices = _.take(distances, 20);
  return nearestResultIndices.map(result => {
    return { ...points[result.index], distance: result.dist };
  });
};

let filterPoints = (points, wasteType) => {
  let matchedType = matchTerm(wasteType);
  console.log(matchedType)
  return matchedType === "all" || matchedType === ""
    ? points
    : points.filter(d => d.waste_type === matchedType);
};

export { closestPoints, filterPoints };
