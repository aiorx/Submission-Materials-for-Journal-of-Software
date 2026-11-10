var _import = require('lib/state');
var deepCompare = require('lib/utils').deepCompare;

module.exports = function BoundsBg() {;
  const selectedNodes = useSelector(function (s) { return s.data.selectedNodes; })
  const selectedGlobs = useSelector(function (s) { return s.data.selectedGlobs; })
  const bounds = useSelector(function (s) { return s.values.selectionBounds; }, deepCompare)

  if (bounds === null) return null
  if (selectedGlobs.length === 0 && selectedNodes.length === 1) return null
  if (selectedGlobs.length === 1 && selectedNodes.length === 0) return null

  var minX = bounds.minX;
var minY = bounds.minY;
var width = bounds.width;
var height = bounds.height;return (
    <rect
      x={minX}
      y={minY}
      width={width}
      height={height}
      onPointerDown={function (e) {
        if (e.buttons !== 1) return
        state.send("POINTED_BOUNDS", {
          shiftKey: e.shiftKey,
          optionKey: e.altKey,
          metaKey: e.metaKey || e.ctrlKey,
          ctrlKey: e.ctrlKey,
          buttons: e.buttons,
        })
      }}
      fill="transparent"
      className="strokewidth-ui stroke-bounds fill-bounds-bg"
    />
  )
}
