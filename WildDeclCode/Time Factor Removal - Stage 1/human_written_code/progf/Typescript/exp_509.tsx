var React = require('react');
var _import = require('./Grid');
var Layer = require('react-konva').Layer;
var Rect = require('react-konva').Rect;
var Text = require('react-konva').Text;
var Group = require('react-konva').Group;

module.exports = {;
  title: "Grid",
  component: Grid,
};

const BaseGrid: React.FC = function () {
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = "" + (rowIndex) + "x" + (columnIndex) + "";
    return (
      <Group>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </Group>
    );
  };
  return (
    <Grid
      columnWidth={(index) => {
        return 100;
      }}
      rowHeight={(index) => {
        return 20;
      }}
    >
      {Cell}
    </Grid>
  );
};

const VariableSizeGrid: React.FC = function () {
  const Cell = ({
    rowIndex,
    columnIndex,
    x,
    y,
    width,
    height,
  }: IChildrenProps) => {
    const text = "" + (rowIndex) + "x" + (columnIndex) + "";
    return (
      <Group>
        <Rect
          x={x}
          y={y}
          height={height}
          width={width}
          fill="white"
          stroke="grey"
        />
        <Text
          x={x}
          y={y}
          height={height}
          width={width}
          text={text}
          verticalAlign="middle"
          align="center"
        />
      </Group>
    );
  };
  return (
    <Grid
      columnWidth={(index) => {
        if (index % 3 === 0) return 200;
        return 100;
      }}
      rowHeight={(index) => {
        if (index % 2 === 0) return 40;
        return 20;
      }}
    >
      {Cell}
    </Grid>
  );
};
