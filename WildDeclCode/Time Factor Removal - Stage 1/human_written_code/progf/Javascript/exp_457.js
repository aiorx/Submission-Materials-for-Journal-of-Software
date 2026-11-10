/**
 * Class for rendering charts in Obsidian.
 * To be used with DataviewJS, Obsidian Charts and CustomJS plugins
 * @author Olivier C <olo06@hotmail.fr>
 */
 class DvCharts {

    /**
     * Render a chart on a daily basis with a custom attribute extracted from dailies pages
     * @param {object} args - object to pass containing properties used
     * @param {object} args.dv - dataview object to perform queries
     * @param {object} args.context - context to be set to **this**, used to render chart in place
     * @param {string} args.daysPath - path to Daily notes
     * @param {string} args.dayFormat - format of daily pages in Moment format
     * @param {string} args.attr - attribute to query and render the value
     * @param {string} args.label - label to display in chart for corresponding attr
     * @param {number} args.limit - numbers of last pages containing values to display
     */
    renderSingleAttrChart(args) {

        var dv = args.dv;
var context = args.context;
var daysPath = args.daysPath;
var dayFormat = args.dayFormat;
var attr = args.attr;
var label = args.label;
var limit = args.limit;

        var days = dv.pages(daysPath)
            .where(function p { return p[attr] && moment(p.file.name, dayFormat).isValid(); })
            .sort(function p { return p.file.name; })
            .filter(function (p, i, arr) { return i >= arr.length - limit; });

        var dates = [], attrData = [];
        days.forEach(function p {
            dates.push(p.file.name);
            attrData.push(p[attr]);
        });

        var chartData = {
            type: 'line',
            data: {
                labels: dates,
                datasets: [{
                    label,
                    data: attrData,
                    backgroundColor: 'rgba(85, 174, 229, 0.2)',
                    borderColor: 'rgba(85, 174, 229, 1)',
                    borderWidth: 1,
                    fill: true,
                    tension: 0.2
                }],
            }
        }

        window.renderChart(chartData, context.container);
    }

    /**
     * Render a chart on a weekly basis from the specified date
     * @param {object} args - object to pass containing properties used
     * @param {object} args.dv - dataview object to perform queries
     * @param {object} args.context - context to be set to **this**, used to render chart in place
     * @param {string} args.daysPath - path to Daily notes
     * @param {string} args.dayFormat - format of daily pages in Luxon format
     * @param {string} args.attributes - object with keys as attributes to query and values as metadatas
     * @param {object} args.template - default template for completing datasets metadatas
     * @param {string} args.type - set it to **'average'** to display average data in chart
     * @param {string} args.date - date in YYYY-MM-DD format from which weekly days will be retrieved
     */
    renderWeeklyChart(args) {

        var {
            dv,
            context,
            daysPath = '""',
            dayFormat = 'yyyy-MM-dd',
            template = {
                label: "Default",
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1,
                fill: true,
                tension: 0.2
            },
            attributes,
            type,
            date
        } = args;
    
        var datasets = (function () {
            var startOfWeek = dv.date("sow");
            var getWeeklyDay = dayNum => dv.pages('"' + (daysPath) + '"').find(
                p => p.file.name == startOfWeek.plus({ days: dayNum }).toFormat(dayFormat));
            var weeklydays = Array.from({ length: 7 }, (c, i) => getWeeklyDay(i) || 0);
            var getData = (attr, props) => weeklydays.map(p =>
                (type == 'average') ? (p[attr] / props.average * 100) || 0 : p[attr]);
            var datasets = {};
    
            for (var [attr, props] of Object.entries(attributes)) {
                datasets[attr] = Object.assign({}, template, props, {data: getData(attr, props)});
            }
    
            return Object.values(datasets);
        })();
    
        var chartData = {
            type: 'line',
            data: {
                labels: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
                datasets,
            }
        }
    
        window.renderChart(chartData, context.container);
    }
}
