var CANVAS_WIDTH = require('../../helpers/constants').CANVAS_WIDTH;
var CANVAS_HEIGHT = require('../../helpers/constants').CANVAS_HEIGHT;
var Coordinates = require('../../helpers/types').Coordinates;

function getConversions() {
    return {
        x: CANVAS_WIDTH / 500,
        y: CANVAS_HEIGHT / 500
    }
}

//Below functions Aided using common development resources
function generatePointsOnBezierCurve(points: Coordinates[], numOfPoints: number): Coordinates[] {
    const bezierPoints: Coordinates[] = [];
  
    for (let i = 0; i <= numOfPoints; i++) {
      const t = i / numOfPoints;
      const point = getBezierPoint(t, points);
      bezierPoints.push(point);
    }
  
    return bezierPoints;
}
  
  function getBezierPoint(t: number, points: Coordinates[]): Coordinates {
    if (points.length === 1) {
      return points[0];
    }
  
    const nextPoints: Coordinates[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      const x = (1 - t) * points[i].x + t * points[i + 1].x;
      const y = (1 - t) * points[i].y + t * points[i + 1].y;
      nextPoints.push({ x, y });
    }
  
    return getBezierPoint(t, nextPoints);
  }
  