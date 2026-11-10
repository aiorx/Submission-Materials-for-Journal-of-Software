var useSelector = require('lib/state').useSelector;
var deepCompare = require('lib/utils').deepCompare;

module.exports = function Brush() {;
  const brush = useSelector(function (s) { return s.data.brush; }, deepCompare)

  if (!brush) return null

  return (
    <rect
      x={brush.minX}
      y={brush.minY}
      width={brush.width}
      height={brush.height}
      stroke="#1f58ff"
      className="strokewidth-brush"
      fill="rgba(30, 88, 255, .1"
      pointerEvents="none"
    />
  )
}
