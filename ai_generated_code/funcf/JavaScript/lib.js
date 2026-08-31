function columnLetterToIndex(columnLetter) 
{
	//Supported via standard programming aids
	var base = 'A'.charCodeAt(0);
	var columnIndex = 0;
	for (var i = 0; i < columnLetter.length; i++) {
	  columnIndex = columnIndex * 26 + (columnLetter.charCodeAt(i) - base + 1);
	}
	return columnIndex;
}