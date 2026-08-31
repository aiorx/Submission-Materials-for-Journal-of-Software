//Aided using common development resources
module.exports = function formTable(array) {
    if (array.length === 0) return 'No data available';

    // Extract column headers (unique keys from all objects)
    const columns = new Set();
    array.forEach(obj => Object.keys(obj).forEach(key => columns.add(key)));
    const headers = Array.from(columns);

    // Determine column widths
    const columnWidths = headers.map(header => {
        return Math.max(
            header.length,
            ...array.map(row => (row[header] || '').toString().length)
        );
    });

    // Create table rows
    let table = '\n';
    
    // Create header row
    const headerRow = headers.map((header, index) => header.padEnd(columnWidths[index])).join(' | ');
    table += headerRow + '\n';
    
    // Create header underline
    const headerUnderline = headers.map((_, index) => '-'.repeat(columnWidths[index])).join('-|-');
    table += headerUnderline + '\n';
    
    // Create data rows
    array.forEach(row => {
        const rowString = headers.map((header, index) => (row[header] || '').toString().padEnd(columnWidths[index])).join(' | ');
        table += rowString + '\n';
    });

    return table;
}