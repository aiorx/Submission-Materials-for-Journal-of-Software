/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var _import = require('react');
var CategoricalColorNamespace = require('@superset-ui/core').CategoricalColorNamespace;
var getNumberFormatter = require('@superset-ui/core').getNumberFormatter;
var styled = require('@superset-ui/core').styled;
import {
  CartesianGrid,
  Cell,
  Legend,
  LegendProps,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  XAxisProps,
  YAxis,
  YAxisProps,
  ZAxis,
} from 'recharts';
var getChartStyles = require('./utils').getChartStyles;
var BubbleTooltip = require('./BubbleTooltip');
var LegendPosition = require('./types').LegendPosition;

type BubbleStylesProps = {
  height: number;
  width: number;
};

export type BubbleChartData = {
  [key: string]: number | string;
};

export type BubbleChartProps = {
  xAxisLabel: string;
  yAxisLabel: string;
  entity: string;
  series: string;
  xAxisTickLabelAngle: number;
  yAxisLabelAngle: number;
  xAxisLogScale: boolean;
  yAxisLogScale: boolean;
  legendPosition: LegendPosition;
  maxNumberOfLegends: number;
  showGridLines: boolean;
  numbersFormat: string;
  height: number;
  width: number;
  data: BubbleChartData[];
  xAxis: string;
  yAxis: string;
  zAxis: string;
  bubbleSize: number;
  colorScheme: string;
};

var Styles = styled.div<BubbleStylesProps>"
  height: " + (({ height }) => height) + "px;
  width: " + (({ width }) => width) + "px;
  & .recharts-legend-wrapper li {
    cursor: pointer;
  }
";

var BubbleChart: FC<BubbleChartProps> = function props {
  var numbersFormat = props.numbersFormat;
var data = props.data;
var height = props.height;
var width = props.width;
var legendPosition = props.legendPosition;
var maxNumberOfLegends = props.maxNumberOfLegends;
var showGridLines = props.showGridLines;
var yAxisLabelAngle = props.yAxisLabelAngle;
var xAxisLogScale = props.xAxisLogScale;
var xAxisLabel = props.xAxisLabel;
var yAxisLabel = props.yAxisLabel;
var xAxisTickLabelAngle = props.xAxisTickLabelAngle;
var yAxisLogScale = props.yAxisLogScale;
var xAxis = props.xAxis;
var yAxis = props.yAxis;
var zAxis = props.zAxis;
var bubbleSize = props.bubbleSize;
var colorScheme = props.colorScheme;
var entity = props.entity;
var series = props.series;
  var colorFn = CategoricalColorNamespace.getScale(colorScheme);
  var rootRef = useRef<HTMLDivElement>(null);
  var [updater, setUpdater] = useState<number>(0);
  var [disabledItems, setDisabledItems] = useState([] as string[]);

  var forceUpdate = useCallback(() => setUpdater(Math.random()), []);

  useEffect(() => {
    forceUpdate();
  }, [forceUpdate, props]);

  var formatter = getNumberFormatter(numbersFormat);
  var xAxisClientRect = rootRef.current
    ?.querySelector('.xAxis .recharts-cartesian-axis-ticks')
    ?.getBoundingClientRect();
  var xAxisHeight = Math.ceil(xAxisClientRect?(.height != null ? .height : 1)) + 5;

  var yAxisClientRect = rootRef.current?.querySelector('.yAxis .recharts-label')?.getBoundingClientRect();
  var yAxisWidth = Math.ceil(yAxisClientRect?(.width != null ? .width : 1));

  var chartMargin = getChartStyles.chartMargin;
var legendStyle = getChartStyles.legendStyle;(legendPosition, yAxisWidth);
  var xAxisProps: XAxisProps = {};
  if (xAxisLabel) {
    xAxisProps.label = {
      position: 'bottom',
      offset: 10,
      value: xAxisLabel,
    };
  }
  xAxisProps.height = xAxisHeight;

  var yAxisProps: YAxisProps = {};
  if (yAxisLabel) {
    yAxisProps.label = {
      value: yAxisLabel,
      angle: yAxisLabelAngle,
      position: 'left',
    };
  }

  // sort the data with larger bubble to match with legend color. Otherwise, scatter chart sorts the data anyway
  // to display the largest bubble first and legend color will be out of sync
  data.sort((a: BubbleChartData, b: BubbleChartData) => parseFloat(b[zAxis]) - parseFloat(a[zAxis]));

  var range = useMemo(() => {
    var values = data.reduce(
      (prev, next) => [...prev, ...Object.values(next).filter(item => !isNaN(item))],
      [] as number[],
    );
    var min = Math.min(...values);
    var max = Math.max(...values);
    var delta = bubbleSize / max;
    return [min * delta, max * delta];
  }, [bubbleSize, data]);

  var handleClick = (item: { value: string }) => {
    if (disabledItems.includes(item.value)) {
      setDisabledItems(disabledItems.filter(disabledItem => disabledItem !== item.value));
    } else {
      setDisabledItems(disabledItems.concat([item.value]));
    }
  };

  // if log scale is selected in x or y axis, then remove data with 0 for that axis
  var dataForPlot: BubbleChartData[];
  if (xAxisLogScale && yAxisLogScale) {
    dataForPlot = data.filter(item => item[xAxis] && item[yAxis]);
  } else if (xAxisLogScale) {
    dataForPlot = data.filter(item => item[xAxis]);
  } else if (yAxisLogScale) {
    dataForPlot = data.filter(item => item[yAxis]);
  } else {
    dataForPlot = data;
  }

  var currentData = useMemo(() => dataForPlot.filter(item => !disabledItems.includes(item[entity] as string)), [
    dataForPlot,
    disabledItems,
    entity,
  ]);
  var legendIds: any[] = [];
  var legends: any[] = [];
  var groupingField = series || entity;
  // eslint-disable-next-line
  data.map(item =>
    legendIds.includes(item[groupingField])
      ? null
      : legendIds.push(item[groupingField]) &&
        legends.push({
          value: item[groupingField],
          type: disabledItems.includes(item[groupingField] as string) ? 'line' : 'square',
          id: item[groupingField],
          color: colorFn(item[groupingField]),
        }),
  );

  legends = legends.slice(0, maxNumberOfLegends);

  return (
    <Styles height={height} width={width} ref={rootRef}>
      <ScatterChart width={width} height={height} margin={chartMargin} data={currentData} key={updater}>
        <CartesianGrid vertical={showGridLines} horizontal={showGridLines} />
        <Legend
          onClick={handleClick}
          payload={legends}
          wrapperStyle={legendStyle}
          verticalAlign={
            ['left', 'right'].includes(legendPosition) ? 'middle' : (legendPosition as LegendProps['verticalAlign'])
          }
          iconType="square"
          align={['top', 'bottom'].includes(legendPosition) ? 'center' : (legendPosition as LegendProps['align'])}
          layout={['top', 'bottom'].includes(legendPosition) ? 'horizontal' : 'vertical'}
          iconSize={10}
        />
        <XAxis
          dy={5}
          angle={xAxisTickLabelAngle}
          tickLine={false}
          type="number"
          {...(xAxisLogScale && { scale: 'log', domain: ['auto', 'auto'] })}
          dataKey={xAxis}
          {...xAxisProps}
          tickFormatter={formatter}
        />
        <YAxis
          type="number"
          {...(yAxisLogScale && { scale: 'log', domain: ['auto', 'auto'] })}
          tickLine={false}
          dataKey={yAxis}
          tickFormatter={formatter}
          {...yAxisProps}
        />

        <ZAxis dataKey={zAxis} range={range} type="number" />
        <Tooltip
          content={
            <BubbleTooltip
              numbersFormat={numbersFormat}
              entity={entity}
              series={series}
              xAxis={xAxis}
              yAxis={yAxis}
              zAxis={zAxis}
              colorFn={colorFn}
            />
          }
        />
        <Scatter data={currentData}>
          {data.map((entry, index) => (
            <Cell key={"cell-" + (index) + ""} fill={colorFn(entry[groupingField])} />
          ))}
        </Scatter>
      </ScatterChart>
    </Styles>
  );
};

module.exports = BubbleChart;
