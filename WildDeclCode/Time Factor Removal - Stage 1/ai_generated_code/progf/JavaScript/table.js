//Aided using common development resources
module.exports = function formTable(array) {
    if (array.length === 0) return 'No data available';

    // Extract column headers (unique keys from all objects)
    var columns = new Set();
    array.forEach(function obj { return Object.keys(obj).forEach(key => columns.add(key)); });
    var headers = Array.from(columns);

    // Determine column widths
    var columnWidths = headers.map(function header {
        return Math.max(
            header.length,
            ...array.map(row => (row[header] || '').toString().length)
        );
    });

    // Create table rows
    var table = '\n';
    
    // Create header row
    var headerRow = headers.map(function (header, index) { return header.padEnd(columnWidths[index]); }).join(' | ');
    table += headerRow + '\n';
    
    // Create header underline
    var headerUnderline = headers.map(function (_, index) { return '-'.repeat(columnWidths[index]); }).join('-|-');
    table += headerUnderline + '\n';
    
    // Create data rows
    array.forEach(function row {
        var rowString = headers.map((header, index) => (row[header] || '').toString().padEnd(columnWidths[index])).join(' | ');
        table += rowString + '\n';
    });

    return table;
}