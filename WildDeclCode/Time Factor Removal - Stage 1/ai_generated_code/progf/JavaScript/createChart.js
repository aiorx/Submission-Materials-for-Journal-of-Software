/**
 * @function graphXlsx
 * @description
 * Fetches one or more XLSX files, caches their parsed workbooks, extracts data for multiple series,
 * and renders an ECharts chart. Multiple series can reference different `src` URLs, and each unique
 * file is loaded only once and then cached. After the chart is rendered, workbook objects are cleared
 * from memory.
 *
 * **Key Features:**
 * - Supports multiple data sources: each series can specify its own `src` to override the top-level `src`.
 * - Caches each loaded workbook keyed by `src`, so if multiple series share the same file, it isn't re-fetched.
 * - Automatically detects if the X-axis should be a category or value axis.
 * - Allows per-series chart types, line/point display configurations, and styling.
 * - Fetches titles and labels from cell references where needed.
 * - Adjusts axis bounds and ticks for clean numeric axes.
 *
 * All of this code was Crafted with standard coding tools, for more context on the creation of this code see the associated conversation thread:
 *   https://chatgpt.com/share/67543029-5f10-8004-bdf2-8ad084fa357d
 *
 * @param {Object} options - Configuration object
 * @param {string} options.src - URL of the primary XLSX, or CSV file to fetch. Series may override this with their own src.
 * @param {HTMLElement} options.target - The DOM element that will contain the generated chart.
 * @param {string} [options.theme='light'] - ECharts theme.
 *
 * @param {Object} [options.tooltip] - Tooltip configuration.
 * @param {boolean} [options.tooltip.show=true] - Whether tooltips are shown.
 * @param {string} [options.tooltip.formatter='{b}: {c}'] - Tooltip format string.
 *
 * @param {string} [options.title] - Chart title (can be cell reference).
 * @param {string} [options.worksheet] - Default worksheet name if cell references don't specify one.
 * @param {boolean} [options.showLegend=true] - Whether to show the legend.
 *
 * @param {Object} [options.xAxis] - X-axis configuration.
 * @param {string} [options.xAxis.title] - X-axis title (cell reference allowed).
 * @param {number} [options.xAxis.min] - Minimum X value (value axis only).
 * @param {number} [options.xAxis.max] - Maximum X value (value axis only).
 * @param {number} [options.xAxis.ticks] - Tick interval. For value axes: numeric spacing; for category axes: label skipping.
 *
 * @param {Object} [options.yAxisLeft] - Left Y-axis configuration.
 * @param {string} [options.yAxisLeft.title] - Title (cell reference allowed).
 * @param {number} [options.yAxisLeft.min] - Min Y for the left axis.
 * @param {number} [options.yAxisLeft.max] - Max Y for the left axis.
 * @param {number} [options.yAxisLeft.ticks] - Tick interval for the left Y-axis.
 *
 * @param {Object} [options.yAxisRight] - Right Y-axis configuration.
 * @param {string} [options.yAxisRight.title] - Title (cell reference allowed).
 * @param {number} [options.yAxisRight.min] - Min Y for the right axis.
 * @param {number} [options.yAxisRight.max] - Max Y for the right axis.
 * @param {number} [options.yAxisRight.ticks] - Tick interval for the right Y-axis.
 *
 * @param {Array} options.series - Array of data series configurations.
 * @param {string} [options.series[].src] - Optional URL of an XLSX, or CSV file for this series. If not provided, uses top-level src.
 * @param {string} [options.series[].type='line'] - Chart type for this series ('line', 'scatter', 'bar', etc.).
 * @param {string} [options.series[].title] - Series title (cell reference allowed).
 * @param {boolean} [options.series[].smooth=false] - If true, renders lines smoothly (for line charts).
 * @param {Object} [options.series[].style] - Style config for line and points.
 * @param {Object} [options.series[].style.line] - Line style (e.g., {width:2, color:'#ff0000'}).
 * @param {Object} [options.series[].style.point] - Point style (e.g., {size:2, color:'#00ff00'}).
 * @param {string} [options.series[].worksheet] - Worksheet for this series' data (overrides top-level if given).
 * @param {string} [options.series[].dataOrientation='column'] - Data orientation ('row' or 'column').
 * @param {Object} options.series[].xData - X data configuration (start cell reference).
 * @param {string} options.series[].xData.location - Starting cell for X data.
 * @param {string} [options.series[].xData.title] - X-axis title for this series (cell reference allowed).
 * @param {Object} options.series[].yData - Y data configuration.
 * @param {string} options.series[].yData.location - Starting cell for Y data.
 * @param {string} [options.series[].yData.title] - Y-axis title (cell reference allowed).
 * @param {string} [options.series[].yData.which='left'] - Which Y-axis ('left' or 'right').
 * @param {string} [options.series[].color] - Hex color for the series.
 * @param {boolean|string} [options.series[].points=true] - Points display (false=none, true=circle, string=symbol).
 * @param {boolean|Object} [options.series[].line=true] - Line display:
 *                                                       false = no line (scatter)
 *                                                       true = default line
 *                                                       object = custom line style.
 *
 * @param {function} [options.onError] - Error callback, defaults to console.error.
 * @param {function} [options.onLoaded] - Callback before loading starts, useful for showing a spinner or message.
 *
 * @example
 * graphXlsx({
 *   src: 'data1.xlsx',
 *   target: document.getElementById('chartContainer'),
 *   theme: 'light',
 *   title: '=Sheet1!A1',
 *   showLegend: true,
 *   xAxis: { title: '=Sheet1!B2', ticks: 10 },
 *   yAxisLeft: { title: '=Sheet1!C2', ticks: 5 },
 *   series: [
 *     {
 *       type: 'scatter',
 *       title: '=Sheet1!A10',
 *       worksheet: 'Sheet1',
 *       dataOrientation: 'column',
 *       xData: { location: 'A5' },
 *       yData: { location: 'B5', which: 'left' },
 *       points: false,
 *       line: true, // turns scatter into line+points
 *       smooth: true,
 *       style: { line: { width: 2, color: '#ff0000' } }
 *     },
 *     {
 *       type: 'bar',
 *       title: '=OtherSheet!A1',
 *       src: 'data2.xlsx',
 *       xData: { location: 'C5' },
 *       yData: { location: 'D5', which: 'right' },
 *       points: 'diamond',
 *       line: false
 *     }
 *   ],
 *   onError: function(err) {
 *     console.error('Error loading chart:', err);
 *   },
 *   onLoaded: function() {
 *     console.log('Loading XLSX data...');
 *   }
 * });
 */

// A global cache for storing workbook objects keyed by their file src.
// This allows us to avoid re-downloading or re-parsing the same file multiple times.
var globalWorkbookCache = {};

function graphXlsx(options) {
    var {
        src,
        target,
        theme = 'light',
        tooltip = { show: true, formatter: '{b}: {c}' },
        title: chartTitle,
        worksheet: defaultWorksheet,
        showLegend = true,
        xAxis = {},
        yAxisLeft = {},
        yAxisRight = {},
        series = [],
        onError = function(error) { console.error(error); },
        onLoaded = function() {}
    } = options;

    function parseCellRef(cellRef) {
        var match = cellRef.match(/^([A-Za-z]+)(\d+)$/);
        if (!match) return null;
        var colLetters = match[1].toUpperCase();
        var rowNumber = parseInt(match[2], 10);
        var colNumber = 0;
        for (var i = 0; i < colLetters.length; i++) {
            colNumber = colNumber * 26 + (colLetters.charCodeAt(i) - 64);
        }
        return { c: colNumber - 1, r: rowNumber - 1 };
    }

    function getWorksheetName(wsNameOverride, workbook) {
        if (wsNameOverride && workbook.Sheets[wsNameOverride]) {
            return wsNameOverride;
        }
        if (defaultWorksheet && workbook.Sheets[defaultWorksheet]) {
            return defaultWorksheet;
        }
        var sheetNames = workbook.SheetNames;
        return sheetNames[0];
    }

    function resolveValueFromCell(value, workbook, wsName) {
        if (typeof value !== 'string') return value;
        var trimmed = value.trim();
        if (trimmed.startsWith('=')) {
            var eqVal = trimmed.substring(1);
            var sheetRef = wsName;
            var cellRef = eqVal;
            if (eqVal.includes('!')) {
                var parts = eqVal.split('!');
                sheetRef = parts[0];
                cellRef = parts[1];
            }

            var wsn = getWorksheetName(sheetRef, workbook);
            var ws = workbook.Sheets[wsn];
            if (!ws) return null;

            return (ws[cellRef] && ws[cellRef].v != null) ? ws[cellRef].v : null;
        } else {
            return value;
        }
    }

    function extractDataSeries(workbook, wsName, startCellRef, orientation = 'column') {
        var wsn = getWorksheetName(wsName, workbook);
        var ws = workbook.Sheets[wsn];
        var start = parseCellRef(startCellRef);
        if (!start) return [];

        var data = [];
        if (orientation === 'column') {
            var row = start.r;
            while (true) {
                var cellAddress = XLSX.utils.encode_cell({ r: row, c: start.c });
                var cell = ws[cellAddress];
                if (!cell || cell.v == null || cell.v === '') break;
                data.push(cell.v);
                row++;
            }
        } else if (orientation === 'row') {
            var col = start.c;
            while (true) {
                var cellAddress = XLSX.utils.encode_cell({ r: start.r, c: col });
                var cell = ws[cellAddress];
                if (!cell || cell.v == null || cell.v === '') break;
                data.push(cell.v);
                col++;
            }
        }
        return data;
    }

    function createChart(sourceToWorkbookMap) {
        var mainWorkbook = sourceToWorkbookMap[src];

        var resolvedTitle = resolveValueFromCell(chartTitle, mainWorkbook, defaultWorksheet);
        var resolvedXAxisTitle = resolveValueFromCell(xAxis.title, mainWorkbook, defaultWorksheet);
        var resolvedYAxisLeftTitle = resolveValueFromCell(yAxisLeft.title, mainWorkbook, defaultWorksheet);
        var resolvedYAxisRightTitle = resolveValueFromCell(yAxisRight.title, mainWorkbook, defaultWorksheet);

        var chartOption = {
            title: {
                text: resolvedTitle || '',
                show: !!resolvedTitle,
                top: 0
            },
            tooltip: {
                show: tooltip.show,
                formatter: tooltip.formatter || '{b}: {c}',
                trigger: 'axis'
            },
            legend: {
                show: showLegend,
                type: 'scroll',
                top: 40,
                left: 'left'
            },
            xAxis: {
                name: resolvedXAxisTitle || '',
                nameLocation: 'middle',
                nameGap: 30,
                min: xAxis.min !== undefined ? xAxis.min : null,
                max: xAxis.max !== undefined ? xAxis.max : null
            },
            yAxis: [
                {
                    type: 'value',
                    name: resolvedYAxisLeftTitle || '',
                    min: yAxisLeft.min !== undefined ? yAxisLeft.min : null,
                    max: yAxisLeft.max !== undefined ? yAxisLeft.max : null,
                    interval: (yAxisLeft.ticks !== undefined && yAxisLeft.ticks !== 0) ? yAxisLeft.ticks : null,
                    position: 'left'
                },
                {
                    type: 'value',
                    name: resolvedYAxisRightTitle || '',
                    min: yAxisRight.min !== undefined ? yAxisRight.min : null,
                    max: yAxisRight.max !== undefined ? yAxisRight.max : null,
                    interval: (yAxisRight.ticks !== undefined && yAxisRight.ticks !== 0) ? yAxisRight.ticks : null,
                    position: 'right'
                }
            ],
            grid: {
                top: 100,
                right: 20,
                bottom: resolvedXAxisTitle ? 45 : 30,
                left: 50
            },
            series: []
        };

        var longestX = 0;
        var chosenXData = null;
        var allSeriesData = [];

        // Gather data for each series
        series.forEach(function (s) {
            var seriesSrc = s.src || src;
            var workbookForSeries = sourceToWorkbookMap[seriesSrc];
            var resolvedSeriesTitle = resolveValueFromCell(s.title, workbookForSeries, s.worksheet);

            var xDataStartRef = s.xData && s.xData.location;
            var xDataOrientation = s.dataOrientation || 'column';
            var xValues = xDataStartRef ? extractDataSeries(workbookForSeries, s.worksheet, xDataStartRef, xDataOrientation) : [];

            var yDataStartRef = s.yData && s.yData.location;
            var yDataOrientation = s.dataOrientation || 'column';
            var yValues = yDataStartRef ? extractDataSeries(workbookForSeries, s.worksheet, yDataStartRef, yDataOrientation) : [];

            allSeriesData.push({
                seriesOpts: s,
                title: resolvedSeriesTitle,
                xValues,
                yValues
            });

            if (xValues && xValues.length > longestX) {
                longestX = xValues.length;
                chosenXData = xValues;
            }
        });

        // Determine axis type
        var xAxisType = 'category';
        if (chosenXData && chosenXData.length > 0) {
            var allNumeric = chosenXData.every(function val { return typeof val === 'number' && !isNaN(val); });
            xAxisType = allNumeric ? 'value' : 'category';
        } else {
            // no xData from chosen series
            var maxLength = 0;
            allSeriesData.forEach(function d {
                if (d.yValues && d.yValues.length > maxLength) {
                    maxLength = d.yValues.length;
                }
            });
            xAxisType = 'category';
            chartOption.xAxis.data = Array.from({ length: maxLength }, function (_, i) { return i + 1; });
        }
        chartOption.xAxis.type = xAxisType;

        // If value axis, set min/max & interval
        if (xAxisType === 'value') {
            var allXNumeric = [];
            allSeriesData.forEach(function d {
                if (d.xValues && d.xValues.length > 0) {
                    var numericVals = d.xValues.filter(v => typeof v === 'number' && !isNaN(v));
                    allXNumeric = allXNumeric.concat(numericVals);
                }
            });

            if (allXNumeric.length > 0) {
                var dataMin = Math.min(...allXNumeric);
                var dataMax = Math.max(...allXNumeric);
                var range = dataMax - dataMin;
                var hasTicks = (xAxis.ticks !== undefined && xAxis.ticks > 0);

                if (range > 20 && hasTicks) {
                    dataMin = Math.floor(dataMin / xAxis.ticks) * xAxis.ticks;
                    dataMax = Math.ceil(dataMax / xAxis.ticks) * xAxis.ticks;
                }
                if (xAxis.min === undefined) chartOption.xAxis.min = dataMin;
                if (xAxis.max === undefined) chartOption.xAxis.max = dataMax;
            }

            if (xAxis.ticks !== undefined && xAxis.ticks !== 0) {
                chartOption.xAxis.interval = xAxis.ticks;
            }
        } else if (xAxisType === 'category' && chosenXData && chosenXData.length > 0) {
            chartOption.xAxis.data = chosenXData;
            if (xAxis.ticks !== undefined && xAxis.ticks !== 0) {
                chartOption.xAxis.axisLabel = chartOption.xAxis.axisLabel || {};
                chartOption.xAxis.axisLabel.interval = xAxis.ticks;
            }
        }

        // Build ECharts series
        allSeriesData.forEach(function (d) {
            var s = d.seriesOpts;
            var yAxisIndex = (s.yData && s.yData.which === 'right') ? 1 : 0;

            var lineStyle = (s.style && s.style.line) || {};
            var itemStyle = (s.style && s.style.point) || {};
            var seriesColor = s.color || lineStyle.color || itemStyle.color || undefined;

            var finalSeriesData = d.yValues;
            if (xAxisType === 'value') {
                var length = Math.min(d.xValues.length, d.yValues.length);
                finalSeriesData = [];
                for (var i = 0; i < length; i++) {
                    finalSeriesData.push([d.xValues[i], d.yValues[i]]);
                }
            }

            var showSymbol = s.points === false ? false : true;
            var symbol = s.points === false ? 'none' : (typeof s.points === 'string' ? s.points : 'circle');

            var seriesType = s.type || 'line';
            if (seriesType === 'scatter' || seriesType === 'line') {
                if (s.line === false) {
                    seriesType = 'scatter';
                } else if (s.line === true || (typeof s.line === 'object')) {
                    seriesType = 'line';
                    if (typeof s.line === 'object') {
                        Object.assign(lineStyle, s.line);
                    }
                }
            }

            chartOption.series.push({
                name: d.title,
                type: seriesType,
                smooth: s.smooth === true,
                data: finalSeriesData,
                yAxisIndex: yAxisIndex,
                showSymbol: showSymbol,
                symbol: symbol,
                lineStyle: {
                    width: lineStyle.width !== undefined ? lineStyle.width : 2,
                    color: seriesColor
                },
                itemStyle: {
                    color: seriesColor
                }
            });
        });

        // Render the chart
        var chart = echarts.init(target, theme);
        chart.setOption(chartOption);

        // *** We no longer delete from sourceToWorkbookMap here to keep data cached globally. ***
    }

    onLoaded();

    // Collect all unique src URLs
    var srcSet = new Set([src]);
    series.forEach(function s {
        if (s.src) {
            srcSet.add(s.src);
        }
    });

    var sourceToWorkbookMap = {};
    var promises = [];

    // We'll create an instance of CSVReader here
    var csvReader = new CSVReader();

    srcSet.forEach(function fileSrc {
        // If already in global cache, use it directly
        if (globalWorkbookCache[fileSrc]) {
            sourceToWorkbookMap[fileSrc] = globalWorkbookCache[fileSrc];
        } else {
            // Otherwise, fetch and parse
            promises.push(
                fetch(fileSrc)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Failed to load: " + (fileSrc) + "");
                        }
                        return response.blob().then(blob => {
                            var contentType = blob.type.toLowerCase();
                            return blob.arrayBuffer().then(buffer => {
                                var workbook;
                                if (contentType.includes('text/csv')) {
                                    // Use CSVReader
                                    workbook = csvReader.read(buffer, {});
                                } else {
                                    // Assume XLSX
                                    workbook = XLSX.read(new Uint8Array(buffer), { type: 'array' });
                                }
                                // Store in both local and global caches
                                sourceToWorkbookMap[fileSrc] = workbook;
                                globalWorkbookCache[fileSrc] = workbook;
                            });
                        });
                    })
            );
        }
    });

    Promise.all(promises)
        .then(function () { return createChart(sourceToWorkbookMap); })
        .catch(function err { return onError(err); });
}
